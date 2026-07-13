/**
 * Regenera assets de sharing:
 * - public/og-default.png  (1200×630, logo centrado en safe-zone)
 * - public/favicon.ico
 * - public/favicon-32.png / favicon-16.png
 * - public/apple-touch-icon.png (con padding para crops circulares)
 *
 * Ejecutar: node scripts/generate-og-assets.mjs [ruta-fondo]
 * Por defecto usa /tmp/og-default-backup.png si existe, si no public/og-default.png.
 */
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const OG_W = 1200;
const OG_H = 630;
const CORAL = "#E84B3B";
const CREAM = "#F6F1E8";

function resolveBg() {
  const arg = process.argv[2];
  if (arg && existsSync(arg)) return arg;
  const clean = join(publicDir, "assets/og-bg.png");
  if (existsSync(clean)) return clean;
  return join(publicDir, "assets/gallery/repartidor-rappi.webp");
}

async function buildOg() {
  const bgPath = resolveBg();
  console.log(`Fondo: ${bgPath}`);

  // Foto delivery a 1200×630. Priorizamos posición izquierda (repartidor).
  const photo = await sharp(bgPath)
    .resize(OG_W, OG_H, { fit: "cover", position: "left" })
    .modulate({ brightness: 0.55, saturation: 0.85 })
    .toBuffer();

  // Overlay casi opaco en el centro: oculta cualquier texto previo del
  // Figma y garantiza contraste del wordmark en todos los crops.
  const veil = Buffer.from(`
    <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="core" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stop-color="#0A0A0A" stop-opacity="0.78"/>
          <stop offset="55%" stop-color="#0A0A0A" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0A0A0A" stop-opacity="0.35"/>
        </radialGradient>
        <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0A0A0A" stop-opacity="0.45"/>
          <stop offset="40%" stop-color="#0A0A0A" stop-opacity="0"/>
          <stop offset="70%" stop-color="#0A0A0A" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0A0A0A" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#core)"/>
      <rect width="100%" height="100%" fill="url(#edge)"/>
    </svg>
  `);

  // Wordmark centrado dentro del safe-zone cuadrado (x≈285–915).
  const logo = await sharp(
    join(publicDir, "assets/logos/principal/logo-coral.webp"),
  )
    .resize({ width: 500 })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const logoW = logoMeta.width ?? 500;
  const logoH = logoMeta.height ?? 125;
  const logoLeft = Math.round((OG_W - logoW) / 2);
  const logoTop = Math.round(OG_H * 0.33);

  const subtitleEs = Buffer.from(`
    <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="${logoTop + logoH + 44}"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="26"
        font-weight="700"
        letter-spacing="7"
        fill="${CORAL}"
      >GROWTH PARTNER</text>
      <text
        x="50%"
        y="${logoTop + logoH + 88}"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="20"
        font-weight="400"
        fill="${CREAM}"
        fill-opacity="0.9"
      >Potenciamos tu delivery y canales digitales</text>
    </svg>
  `);

  const subtitleEn = Buffer.from(`
    <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="${logoTop + logoH + 44}"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="26"
        font-weight="700"
        letter-spacing="7"
        fill="${CORAL}"
      >GROWTH PARTNER</text>
      <text
        x="50%"
        y="${logoTop + logoH + 88}"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="20"
        font-weight="400"
        fill="${CREAM}"
        fill-opacity="0.9"
      >We grow your delivery and digital channels</text>
    </svg>
  `);

  const compose = (subtitle, outName) =>
    sharp(photo)
      .composite([
        { input: veil, top: 0, left: 0 },
        { input: logo, top: logoTop, left: logoLeft },
        { input: subtitle, top: 0, left: 0 },
      ])
      .png({ quality: 92, compressionLevel: 8 })
      .toFile(join(publicDir, outName));

  await compose(subtitleEs, "og-default.png");
  console.log("✓ og-default.png (ES)");
  await compose(subtitleEn, "og-en.png");
  console.log("✓ og-en.png (EN)");
}

/**
 * Isologo oficial (círculo coral con pimentón recortado) sobre negro,
 * con padding para que crops circulares no corten el borde.
 */
async function buildMarkPng(size, paddingRatio = 0.14) {
  const markSize = Math.round(size * (1 - paddingRatio * 2));
  const mark = await sharp(join(publicDir, "assets/favicon.svg"))
    .resize(markSize, markSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    },
  })
    .composite([
      {
        input: mark,
        top: Math.round((size - markSize) / 2),
        left: Math.round((size - markSize) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function buildIcons() {
  const icon180 = await buildMarkPng(180, 0.14);
  await sharp(icon180).toFile(join(publicDir, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png (180×180, con padding)");

  const icon32 = await buildMarkPng(32, 0.12);
  const icon16 = await buildMarkPng(16, 0.1);
  await sharp(icon32).toFile(join(publicDir, "favicon-32.png"));
  await sharp(icon16).toFile(join(publicDir, "favicon-16.png"));
  console.log("✓ favicon-32.png / favicon-16.png");

  const ico = encodeIco([
    { size: 16, png: icon16 },
    { size: 32, png: icon32 },
    { size: 48, png: await buildMarkPng(48, 0.12) },
  ]);
  writeFileSync(join(publicDir, "favicon.ico"), ico);
  writeFileSync(join(root, "app/favicon.ico"), ico);
  console.log("✓ favicon.ico (public/ + app/)");

  // Metadata file convention de Next (app/icon.png, app/apple-icon.png)
  const icon192 = await buildMarkPng(192, 0.14);
  await sharp(icon192).toFile(join(root, "app/icon.png"));
  await sharp(icon180).toFile(join(root, "app/apple-icon.png"));
  console.log("✓ app/icon.png + app/apple-icon.png");
}

function encodeIco(entries) {
  const count = entries.length;
  const headerSize = 6 + count * 16;
  const pngs = entries.map((e) => e.png);
  const offsets = [];
  let offset = headerSize;
  for (const png of pngs) {
    offsets.push(offset);
    offset += png.length;
  }

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);

  for (let i = 0; i < count; i++) {
    const { size } = entries[i];
    const entryOffset = 6 + i * 16;
    buf.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    buf.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    buf.writeUInt8(0, entryOffset + 2);
    buf.writeUInt8(0, entryOffset + 3);
    buf.writeUInt16LE(1, entryOffset + 4);
    buf.writeUInt16LE(32, entryOffset + 6);
    buf.writeUInt32LE(pngs[i].length, entryOffset + 8);
    buf.writeUInt32LE(offsets[i], entryOffset + 12);
    pngs[i].copy(buf, offsets[i]);
  }
  return buf;
}

await buildOg();
await buildIcons();
console.log("Listo.");
