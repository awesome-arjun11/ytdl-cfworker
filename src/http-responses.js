
const defaultHeaders = {
    'Access-Control-Allow-Origin': "*",
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip'

}
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
    return theResponse(200, 'OK', { "Content-Type": "text/html" }, "<h1>DEFAULT RESPONSE</h1>" );
}


