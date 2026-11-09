#!/usr/bin/env node
// Renders Open Graph images (1200×630 JPEG, el + en) and icons with Playwright,
// using the site's own fonts and photo. Output goes to src/static/ (committed).
// Run after changing the portrait or the logo: npm run og
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const S = join(ROOT, 'src/static')
const b64 = (p) => readFileSync(join(S, p)).toString('base64')
const mark = readFileSync(join(ROOT, 'src/data/logo-mark.svg'), 'utf8')
const fonts = `
@font-face{font-family:C;font-weight:100 900;src:url(data:font/woff2;base64,${b64('fonts/commissioner-greek-wght.woff2')}) format('woff2');unicode-range:U+0370-03FF}
@font-face{font-family:C;font-weight:100 900;src:url(data:font/woff2;base64,${b64('fonts/commissioner-latin-wght.woff2')}) format('woff2')}`
const photo = `data:image/webp;base64,${b64('img/giatros-portreto-500.webp')}`

const text = {
  el: { name: 'Ανδρέας Σαραφόπουλος', cred: 'MD, MSc', role: 'Δερματολόγος – Αφροδισιολόγος', place: 'Μενελάου 74, Ίλιον · απέναντι από το Δημαρχείο', phone: '210 577 4392' },
  en: { name: 'Dr Andreas Sarafopoulos', cred: 'MD, MSc', role: 'Dermatologist – Venereologist', place: 'Menelaou 74, Ilion, Athens · opposite the Town Hall', phone: '+30 210 577 4392' },
}

const og = (t) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:C,sans-serif;background:#fff;color:#0c2a30;display:grid;grid-template-columns:1fr 430px;overflow:hidden}
.l{padding:72px 0 64px 80px;display:flex;flex-direction:column;position:relative}
.mark{width:64px;height:64px}
.bar{width:56px;height:5px;border-radius:5px;background:#e9a68a;margin:44px 0 26px}
h1{font-size:64px;font-weight:660;letter-spacing:-1.6px;line-height:1.05}
.cred{font-size:28px;font-weight:550;color:#4c6066;margin-top:14px}
.role{font-size:36px;font-weight:520;color:#0e5c63;margin-top:18px}
.foot{margin-top:auto;font-size:24px;color:#22353a;display:flex;gap:28px;align-items:center}
.foot b{font-weight:640;color:#0e5c63}
.r{position:relative;background:#e5f0ec}
.r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:30% 20%}
.ring{position:absolute;left:-40px;bottom:70px;width:120px;height:120px;border:3px solid #e9a68a;border-radius:50%}
</style></head><body>
<div class="l"><svg class="mark" viewBox="0 0 40 40">${mark}</svg><div class="bar"></div>
<h1>${t.name}</h1><div class="cred">${t.cred}</div><div class="role">${t.role}</div>
<div class="foot"><span>${t.place}</span></div><div class="foot" style="margin-top:12px"><b>${t.phone}</b></div></div>
<div class="r"><img src="${photo}"><div class="ring"></div></div></body></html>`

const icon = (size) => `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:#0e5c63}svg{display:block}</style></head>
<body><svg width="${size}" height="${size}" viewBox="0 0 40 40">${mark.replace('rx="11"', `rx="${size >= 180 ? 0 : 11}"`)}</svg></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
for (const lang of ['el', 'en']) {
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.setContent(og(text[lang]))
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(S, `img/og-${lang}.jpg`), type: 'jpeg', quality: 86 })
}
// apple-touch-icon: full square (iOS applies its own rounding)
await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(icon(180))
await page.screenshot({ path: join(S, 'apple-touch-icon.png'), omitBackground: false })
await page.setViewportSize({ width: 48, height: 48 })
await page.setContent(icon(48).replace('background:#0e5c63', 'background:transparent'))
const tmp = join(ROOT, 'dist-icon-48.png')
await page.screenshot({ path: tmp, omitBackground: true })
await browser.close()
// favicon.ico (16/32/48) via Pillow
execFileSync('python3', ['-I', '-c', `from PIL import Image;im=Image.open(${JSON.stringify(tmp)});im.save(${JSON.stringify(join(S, 'favicon.ico'))},sizes=[(16,16),(32,32),(48,48)])`])
execFileSync('rm', [tmp])
console.log('OG images and icons written')
