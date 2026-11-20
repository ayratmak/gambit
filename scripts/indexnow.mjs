// Pings IndexNow (Bing and others) with every URL in the live sitemap. Run after a deploy: node scripts/indexnow.mjs
const HOST = 'gambitschool.com', KEY = 'a308caa95b5a8b455b72611e49f43079';
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }) });
console.log(`IndexNow: ${urlList.length} URLs, HTTP ${res.status}`);
