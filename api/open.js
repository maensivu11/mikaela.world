// 1x1 transparent GIF that logs an "email_open" event to PostHog.
// Used as a tracking pixel in Mikaela's email signature:
//   https://mikaela.world/api/open?c=<campaign>
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default async function handler(req, res) {
  const c = typeof req.query.c === 'string' ? req.query.c.slice(0, 100) : 'signature';
  let log = 'unsent';
  try {
    const r = await fetch('https://us.i.posthog.com/capture/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: 'phc_RD708O5C9TIgchLZeWTMJlSSad55zFuaKPPBqb5aGMF',
        event: 'email_open',
        distinct_id: 'email-pixel',
        properties: {
          campaign: c,
          $host: 'mikaela.world',
          user_agent: req.headers['user-agent'] || '',
          referer: req.headers['referer'] || '',
        },
      }),
    });
    log = String(r.status);
  } catch (e) {
    // the pixel must always render, even if logging fails
    log = 'err:' + (e && e.message ? e.message.slice(0, 80) : 'unknown');
  }
  res.setHeader('X-Log', log);
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Content-Length', GIF.length);
  res.status(200).send(GIF);
}
