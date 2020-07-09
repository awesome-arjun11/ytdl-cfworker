import {FORMATS} from './formats';

export const fget = async (url, options, maxRetries = 2) => {
    const resp = await fetch_retry(url, options, maxRetries);
    return await resp.text();
}

// fetch with retry
const fetch_retry = (url, options, maxRetries) => fetch(url, options).catch( error => {
    if (maxRetries === 1) throw error;
    return fetch_retry(url, options, maxRetries - 1);
});

/**
 * Returns true if given id satifies YouTube's id format.
 *
 * @param {string} id
 * @return {boolean}
 */
const idRegex = /^[a-zA-Z0-9-_]{11}$/;
export const validateID = id =>  idRegex.test(id); 

/**
 * Extract string inbetween another.
 *
 * @param {string} haystack
 * @param {string} left
 * @param {string} right
 * @returns {string}
 */
export const between = (haystack, left, right) => {
    let pos = haystack.indexOf(left);
    if (pos === -1) { return ''; }
    haystack = haystack.slice(pos + left.length);
    pos = haystack.indexOf(right);
    if (pos === -1) { return ''; }
    haystack = haystack.slice(0, pos);
    return haystack;
  };
  


/**
 * Checks if there is a playability error.
 *
 * @param {Object} info
 * @param {string} status
 * @returns {!Error}
 */
export const playError = (info, status) => {
    let playability = info.playerResponse.playabilityStatus;
    if (playability && playability.status === status) {
      return Error(playability.reason || (playability.messages && playability.messages[0]));
    }
    return null;
  };
  

 /**
 * Match begin and end braces of input JSON, return only json
 *
 * @param {string} mixedJson
 * @returns {string}
*/
export const cutAfterJSON = mixedJson => {
    let open, close;
    if (mixedJson[0] === '[') {
      open = '[';
      close = ']';
    } else if (mixedJson[0] === '{') {
      open = '{';
      close = '}';
    }
  
    if (!open) {
      throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
    }
  
    // States if the loop is currently in a string
    let isString = false;
  
    // Current open brackets to be closed
    let counter = 0;
  
    let i;
    for (i = 0; i < mixedJson.length; i++) {
      // Toggle the isString boolean when leaving/entering string
      if (mixedJson[i] === '"' && mixedJson[i - 1] !== '\\') {
        isString = !isString;
        continue;
      }
      if (isString) continue;
  
      if (mixedJson[i] === open) {
        counter++;
      } else if (mixedJson[i] === close) {
        counter--;
      }
  
      // All brackets have been closed, thus end of JSON is reached
      if (counter === 0) {
        // Return the cut JSON
        return mixedJson.substr(0, i + 1);
      }
    }
  
    // We ran through the whole string and ended up with an unclosed bracket
    throw Error("Can't cut unsupported JSON (no matching closing bracket found)");
  }; 


/**
 * Get only the string from an HTML string.
 *
 * @param {string} html
 * @returns {string}
 */
export const stripHTML = html => html
.replace(/[\n\r]/g, ' ')
.replace(/\s*<\s*br\s*\/?\s*>\s*/gi, '\n')
.replace(/<\s*\/\s*p\s*>\s*<\s*p[^>]*>/gi, '\n')
.replace(/<a\s+(?:[^>]*?\s+)?href=(?:["'])\/redirect.*?q=(.*?)(?:[&'"]).*?<\/a>/gi,
  (_, p1) => decodeURIComponent(p1))
.replace(/<a\s+(?:[^>]*?\s+)?href=(?:["'])((?:https?|\/).*?)(?:['"]).*?<\/a>/gi,
  (_, p1) => url.resolve('https://youtube.com/', p1))
.replace(/<.*?>/gi, '')
.trim();



/**
 * @param {Object} format
 * @returns {Object}
 */
export const addFormatMeta = format => {
  format = Object.assign({}, FORMATS[format.itag], format);
  format.container = format.mimeType ?
    format.mimeType.split(';')[0].split('/')[1] : null;
  format.codecs = format.mimeType ?
    between(format.mimeType, 'codecs="', '"') : null;
  format.live = /\/source\/yt_live_broadcast\//.test(format.url);
  format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
  format.isDashMPD = /\/manifest\/dash\//.test(format.url);
  return format;
};
