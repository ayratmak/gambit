// Runs on every request. One canonical host (apex, https), and preview hosts stay out of search.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'www.gambitschool.com') {
    url.hostname = 'gambitschool.com';
    return Response.redirect(url.toString(), 301);
  }
  const res = await next();
  if (url.hostname.endsWith('.pages.dev')) {
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  }
  return res;
}
