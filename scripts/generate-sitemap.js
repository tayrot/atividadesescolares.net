const fs = require('fs');
const path = require('path');
const glob = require('glob');

const base = 'https://atividadesescolares.net';

const htmlFiles = glob.sync('**/*.html', {
  ignore: ['node_modules/**', '.github/**']
});

let urls = [];

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');

  const pageDir = path.dirname(file);

  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(x => x[1]);

  const pageUrl = `${base}/${file.replace(/\\/g, '/')}`;

  const imageTags = images.map(img => {
    // resolve caminho relativo corretamente
    const resolved = path.join(pageDir, img)
      .replace(/\\/g, '/')
      .replace(/^\.\//, '');

    return `
      <image:image>
        <image:loc>${base}/${resolved}</image:loc>
      </image:image>`;
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

console.log('✅ Sitemap gerado com caminhos corretos!');
