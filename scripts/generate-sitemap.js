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

  // pasta da página (ex: 1-ano/portugues)
  const dir = path.dirname(file).replace(/\\/g, '/');

  // pega todas imagens do HTML
  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(x => x[1]);

  const pageUrl = `${base}/${file.replace(/\\/g, '/')}`;

  let imageTags = '';

  images.forEach(img => {

    // se já for http, mantém
    if (img.startsWith('http')) {
      imageTags += `
      <image:image>
        <image:loc>${img}</image:loc>
      </image:image>`;
      return;
    }

    // junta pasta da página + caminho relativo
    const finalPath = `${dir}/${img}`.replace(/\/+/g, '/');

    imageTags += `
      <image:image>
        <image:loc>${base}/${finalPath}</image:loc>
      </image:image>`;
  });

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

console.log('✅ Sitemap gerado com caminhos locais corretos!');
