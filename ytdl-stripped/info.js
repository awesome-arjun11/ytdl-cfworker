import { fget, playError, cutAfterJSON, between, stripHTML, addFormatMeta, YTDLError, sortFormats } from './utility';
import { parse as qsParse } from 'querystring';
import { decipherFormats } from './sig';
import { XmlDocument } from 'xmldoc';


const VIDEO_URL = 'https://www.youtube.com/watch?v=';
const EMBED_URL = 'https://www.youtube.com/embed/';
const VIDEO_EURL = 'https://youtube.googleapis.com/v/';
const INFO_HOST = 'www.youtube.com';
const INFO_PATH = '/get_video_info';

const defaultOptions = {
  lang: 'en',
  requestOptions: {
    method: 'GET',
    redirect: 'follow',
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },

  }
}

/**
 * Gets info from a video without getting additional formats.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getBasicInfo = async (id, infOptions) => {
    const options = Object.assign({}, defaultOptions, infOptions);
    // Try getting config from the video page first.
    const params = `hl=${options.lang || 'en'}`;
    let url = `${VIDEO_URL + id}&${params}&bpctr=${Math.ceil(Date.now() / 1000)}&pbj=1`;
  
    // Remove header from watch page request.
    // Otherwise, it'll use a different framework for rendering content.
    const reqOptions = Object.assign({}, options.requestOptions);
    reqOptions.headers = Object.assign({}, reqOptions.headers, {
      'x-youtube-client-name': '1',
      'x-youtube-client-version': '2.20191008.04.01',
    });
  
    let body = await fget(url, reqOptions);
    let info;
    //console.log(body);
    try {
      info = JSON.parse(body).reduce((part, curr) => Object.assign(curr, part), {});
    } catch (err) {
      throw YTDLError(`Error parsing info: ${err.message}`);
    }
  
    let playErr = playError(info, 'ERROR');
    if (playErr) {
      throw playErr;
    }
  
    if (!info.player) {
      // If the video page doesn't work, maybe because it has mature content.
      // and requires an account logged in to view, try the embed page.
      let embedUrl = `${EMBED_URL + id}?${params}`;
      body = await fget(embedUrl, options.requestOptions);
      let jsonStr = between(body, 't.setConfig({\'PLAYER_CONFIG\': ', '</script>');
      let config;
      if (!jsonStr) {
        throw YTDLError('Could not find player config');
      }
      try {
        config = JSON.parse(cutAfterJSON(jsonStr));
      } catch (err) {
        throw YTDLError(`Error parsing config: ${err.message}`);
      }
      playErr = playError(info, 'LOGIN_REQUIRED');
      if (!config.args.player_response && !config.args.embedded_player_response && playErr) {
        throw playErr;
      }
      info.player = config;
    }
    return gotConfig(id, options, info, body);
  }
  


/**
 * @param {Object} info
 * @returns {Array.<Object>}
 */
const parseFormats = info => {
    let formats = [];
    if (info.player_response.streamingData) {
      if (info.player_response.streamingData.formats) {
        formats = formats.concat(info.player_response.streamingData.formats);
      }
      if (info.player_response.streamingData.adaptiveFormats) {
        formats = formats.concat(info.player_response.streamingData.adaptiveFormats);
      }
    }
    return formats;
  };

  /**
 * @param {Object} id
 * @param {Object} options
 * @param {Object} info
 * @param {string} body
 * @returns {Promise<Object>}
 */
const gotConfig = async(id, options, info, body) => {
    const url = new URL(`https://${INFO_HOST}/`);

    url.pathname += INFO_PATH
    url.searchParams.append('video_id', id);
    url.searchParams.append('eurl', VIDEO_EURL + id);
    url.searchParams.append('video_id', id);
    url.searchParams.append('ps', 'default');
    url.searchParams.append('gl', 'US');
    url.searchParams.append('hl', options.lang || 'en');
    if (info.sts) url.searchParams.append('sts', info.sts);

    const reqOptions = Object.assign({}, options.requestOptions);
    let morebody = await fget(url.href, reqOptions);
    let moreinfo = qsParse(morebody);
    const player_response =
      (info.player && info.player.args && info.player.args.player_response) ||
      moreinfo.player_response ||
      info.playerResponse;
  
    if (moreinfo.status === 'fail') {
      throw YTDLError(`Code ${moreinfo.errorcode}: ${stripHTML(moreinfo.reason)}`);
    } else if (typeof player_response === 'object') {
      info.player_response = player_response;
    } else {
      try {
        info.player_response = JSON.parse(player_response);
      } catch (err) {
        throw YTDLError(`Error parsing \`player_response\`: ${err.message}`);
      }
    }
  
    info.formats = parseFormats(info);
  
    let videoDetails = info.player_response.videoDetails;
    Object.assign(info, {
      // Get the author/uploader.
      author: {
          id: videoDetails.channelId,
          name: videoDetails.author,
          channel_url: `https://www.youtube.com/channel/${videoDetails.channelId}`,
      },
  
      // Get the day the vid was published.
      published: Date.parse(
        info.player_response.microformat.playerMicroformatRenderer.publishDate),
  
      // Get description.
      description: videoDetails.shortDescription,
  
      video_id: videoDetails.videoId,
  
      // Give the standard link to the video.
      video_url: VIDEO_URL + videoDetails.videoId,
  
      title: videoDetails.title,
      length_seconds: videoDetails.lengthSeconds,
  
      age_restricted: !!(info.player.args && info.player.args.is_embed),
      html5player: info.player && info.player.assets && info.player.assets.js,
    });
  
    return info;
  };


  /**
 * Gets info from a video additional formats and deciphered URLs.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getFullInfo = async(id, infOptions) => {
   const options = Object.assign({}, defaultOptions, infOptions);
    let info = await getBasicInfo(id, options);
    const hasManifest =
      info.player_response && info.player_response.streamingData && (
        info.player_response.streamingData.dashManifestUrl ||
        info.player_response.streamingData.hlsManifestUrl
      );
    let funcs = [];
    if (info.formats.length) {
      const html5player = new URL(info.html5player, VIDEO_URL);
      funcs.push(decipherFormats(info.formats, html5player.href, options));
    }
    if (hasManifest && info.player_response.streamingData.dashManifestUrl) {
      let url = info.player_response.streamingData.dashManifestUrl;
      funcs.push(getDashManifest(url, options));
    }
    if (hasManifest && info.player_response.streamingData.hlsManifestUrl) {
      let url = info.player_response.streamingData.hlsManifestUrl;
      funcs.push(getM3U8(url, options));
    }
  
    let results = await Promise.all(funcs);
    info.formats = Object.values(Object.assign({}, ...results));
    info.formats = info.formats.map(addFormatMeta);
    info.formats.sort(sortFormats);
    info.full = true;
    return info;
  };
  

  
/**
 * Gets additional DASH formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
const getDashManifest = async (url, options) => {
  let formats = {};
  let body = await fget(url, options.requestOptions);
  let document = new XmlDocument(body);
  for(const repnode of document.childrenNamed('Representation')){
    const itag = parseInt(repnode.attr.ID);
    const baseurl = repnode.childNamed('BaseURL').val || url;
    formats[itag] = { itag: itag, url: baseurl };
  }
  return formats; //[ formats, body ]; 
};


/**
 * Gets additional formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
const getM3U8 = async(url, options) => {
  url = new URL(url, VIDEO_URL);
  let body = await fget(url, options.requestOptions)
  let formats = {};
  body
    .split('\n')
    .filter(line => /https?:\/\//.test(line))
    .forEach(line => {
      const itag = parseInt(line.match(/\/itag\/(\d+)\//)[1]);
      formats[itag] = { itag: itag, url: line };
    });
  return formats; // [ formats, body ];
};