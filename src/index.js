
import { router } from './ytdl-routes';
import { defaultHTMLResponse } from './http-responses';

addEventListener('fetch', event => {
  const request = event.request;
  const { pathname } = new URL(request.url);

  const match = router.match(request.method, pathname);
  if (match) {
    event.respondWith(match.handler(request, match.params));
  }else{
    event.respondWith(defaultHTMLResponse());
  }
})
