# ytdl-cfworker

Cloudflare ytdl worker to be used as Video Info API from frontend js. YTDL-CFWorker responses has CORS headers for it to be usable from front end.

----
## Deploying
Install [wrangler](https://github.com/cloudflare/wrangler)
> update wrangler.toml with your Cloudflare Account ID and run
```$ wrangler config```

```console
$ npm i
$ npm run publish
```

----
## Endpoints

1.  _**/basicinfo/<youtube-video-id>**_

    **Response:** JSON with video info and formats. Similar to _ytdl-core's_ `ytdl.getBasicInfo()`

2.  _**/info/<youtube-video-id>**_

    **Response:** JSON with video info and parsed formats (including Dash MPD & HLS m3u links). Similar to _ytdl-core's_ `ytdl.getInfo()`    


* _**Example:**_ [https://ytdl-cfworker.arjun11.workers.dev/info/ghxQA3vvhsk](https://ytdl-cfworker.arjun11.workers.dev/info/ghxQA3vvhsk)

## ToDO

1. Clean responses
2. More Enpoints