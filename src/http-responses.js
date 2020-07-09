// for CORS and compression
const defaultHeaders = {
    'Access-Control-Allow-Origin': "*",
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip'
}

const pageHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Youtube-dl CORS</title></head><body><div class="github-repo-card" data-repo="ytdl-cfworker" data-user="awesome-arjun11"></div> <script>!function(t,e,r){"use strict";var a=function(t,e){return t.getAttribute("data-".concat(e))};t.onload=function(){var t;(t=e.createElement("style")).type="text/css",t.innerText='.repocard{display:grid;grid-template-columns:250px;grid-template-rows:200px 60px;grid-template-areas:"text" "stats";font-family:roboto;border-radius:18px;background-color:#1c1e1f;box-shadow:5px 5px 15px rgba(0,0,0,.9);text-align:center;transition:.5s ease;cursor:pointer;color:#00c483}.repocard-text{grid-area:text;margin:1em}.repocard-text .lang{color:#fff;font-size:.6em}.repocard-text h2{margin-top:0;margin-bottom:0;font-size:1.8em}.repocard-text h4{margin-top:0;margin-bottom:0;font-size:1em}.repocard a{text-decoration:none!important;color:inherit}.repocard a:hover{color:#fff}.repocard-text p{color:#888;font-size:.95em;font-weight:400}.repocard-stats{grid-area:stats;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr;border-bottom-left-radius:15px;border-bottom-right-radius:15px;background-color:#00c483}.repocard-stats .stat{display:flex;align-items:center;justify-content:center;flex-direction:column;padding:.2em;color:#1c1e1f}.repocard-stats .value{font-size:1.3em;font-weight:500}.repocard-stats .type{font-size:1em;font-weight:400px;text-transform:uppercase}.repocard-stats .border{border-left:1px solid #1c1e1f;border-right:1px solid #1c1e1f}.repocard:hover{transform:scale(1.2);box-shadow:5px 5px 15px rgba(0,0,0,.6)}.repocard-text .avatar{width:48px;height:48px;border-radius:4px}',e.head.appendChild(t),e.querySelectorAll(".github-repo-card").forEach(function(t){t.style="display: flex;align-items: center;justify-content: center;",async function(t){return await(await fetch(t)).json()}("".concat("https://api.github.com","/repos/").concat(a(t,"user"),"/").concat(a(t,"repo"))).then(function(e){return r=e,void(t.innerHTML='<div class="repocard"> <div class="repocard-text"> <a href="'.concat((a=r).owner.html_url,'"> <img class="avatar" src="').concat(a.owner.avatar_url,'"> </a> <h2><a href="').concat(a.html_url,'">').concat(a.name,'<sup class="lang">').concat(a.language,'</sup></a></h2> <h4>By: <a href="').concat(a.owner.html_url,'">').concat(a.owner.login,"</a></h4> <p> ").concat(a.description,'</p></div><div class="repocard-stats"> <div class="stat"> <div class="value">').concat(a.stargazers_count,'</div><div class="type"> <svg height="16" class="octicon octicon-star v-align-text-bottom" vertical_align="text_bottom" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg> stars </div></div><div class="stat border"> <div class="value">').concat(a.forks_count,'</div><div class="type"> <svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg> Forks </div></div><div class="stat"> <div class="value">').concat(a.subscribers_count,'</div><div class="type"> <svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg> Watch</div></div></div></div>'));var r,a}).catch(function(t){return console.log(t)})})}}(window,document);</script> </body></html>`;

export async function theResponse(status, statustext, headers, body = null) {
    return new Response(body, {
        status: status,
        statusText: statustext,
        headers: Object.assign({}, defaultHeaders, headers)
    });
}

export function serverErrorResponse(text = 'Internal Server Error') {
    return theResponse(500, 'Internal Server Error', {}, text);
}
export function badRequestResponse(text = 'Bad Request') {
    console.log(`In Bad req: ${text}`);
    return theResponse(400, 'Bad Request', {}, text);
}

export function forbiddenResponse(text = 'Forbidden') {
    return theResponse(403, 'Forbidden', {}, text);
}
 
export function defaultHTMLResponse() {
    return theResponse(200, 'OK', { "Content-Type": "text/html" }, pageHTML);
}


