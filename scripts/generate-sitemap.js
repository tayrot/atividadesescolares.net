const fs = require('fs');
const glob = require('glob');

const base = 'https://atividadesescolares.net';

const htmlFiles = glob.sync('**/*.html', {
  ignore: ['node_modules/**', '.github/**']
});

let urls = [];

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');

  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(x => x[1]);

  const pageUrl = `${base}/${file.replace(/\\/g, '/')}`;

  let imageTags = images.map(img => {
    const clean = img.replace(/^\.\.\//g, '');
    return `
      <image:image>
        <image:loc>${base}/${clean}</image:loc>
      </image:loc>`;
  }).join('');

  urls.push(`
  <url>
    <loc>${pageUrl}</loc>
    ${imageTags}
  </url>`);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);

console.log('✅ Sitemap gerado com imagens associadas!');

