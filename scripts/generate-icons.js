import sharp from 'sharp';

async function generateIcon(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#12121d"/>
    <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="${size * 0.12}" fill="#0d0d18" stroke="#2a2a3a" stroke-width="${size * 0.04}"/>
    <text x="${size / 2}" y="${size * 0.55}" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-weight="bold" font-size="${size * 0.22}" fill="#ff2d95" letter-spacing="${size * 0.03}">MP3</text>
    <line x1="${size * 0.15}" y1="${size * 0.7}" x2="${size * 0.85}" y2="${size * 0.7}" stroke="#ff2d95" stroke-width="${size * 0.03}" opacity="0.5"/>
    <line x1="${size * 0.15}" y1="${size * 0.78}" x2="${size * 0.7}" y2="${size * 0.78}" stroke="#ff2d95" stroke-width="${size * 0.025}" opacity="0.3"/>
    <line x1="${size * 0.15}" y1="${size * 0.84}" x2="${size * 0.55}" y2="${size * 0.84}" stroke="#ff2d95" stroke-width="${size * 0.02}" opacity="0.2"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`public/icon-${size}.png`);

  console.log(`Created icon-${size}.png`);
}

await generateIcon(192);
await generateIcon(512);
console.log('PWA icons generated');
