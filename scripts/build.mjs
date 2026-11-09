#!/usr/bin/env node
// Builds the static site into dist/. Zero dependencies.
//
//   npm run build          preview build: noindex on every page, [TODO] markers allowed
//   npm run build:launch   launch build (or SITE_LAUNCH=1): removes noindex, FAILS while any [TODO] remains,
//                          the domain is a placeholder or the booking link is unconfirmed
//
// Cache busting: CSS/JS are linked as style.css?v=<content hash>, so returning
// visitors never get new HTML with an old stylesheet. (`npm run bust` = build.)
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import cfg from '../site.config.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')
// Launch mode: `--launch` flag, or SITE_LAUNCH=1 (set it only on the Cloudflare Pages *Production* environment).
const launch = process.argv.includes('--launch') || process.env.SITE_LAUNCH === '1'

if (launch) cfg.noindex = false
// Preview deployments: SITE_URL (e.g. https://<project>.pages.dev) makes canonical, OG image and
// sitemap URLs absolute to the preview host, so shared links show a proper preview card.
if (process.env.SITE_URL) cfg.siteUrl = process.env.SITE_URL.replace(/\/+$/, '')
// Audit-only build (Lighthouse): indexable pages on a local origin, no launch gate. Never deploy it.
const audit = process.argv.includes('--audit')
if (audit) {
  cfg.noindex = false
  cfg.siteUrl = process.env.AUDIT_URL || 'http://localhost:8080'
}

// Date the privacy policy text last changed (update when you edit it).
const PRIVACY_UPDATED = { iso: '2026-11-09', el: '9 Νοεμβρίου 2026', en: '9 November 2026' }

const { routes, fileFor } = await import('../src/i18n.mjs')
const { renderHome, renderService, renderPrivacy, render404, content } = await import('../src/pages.mjs')

// ── 1. Clean + copy static files ────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })
cpSync(join(SRC, 'static'), DIST, { recursive: true })

// Light CSS minification (comments + whitespace); the source stays readable in src/.
{
  const f = join(DIST, 'css/style.css')
  const min = readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
  writeFileSync(f, min)
}

// ── 2. Cache-busting hashes ─────────────────────────────────────────────────
const hash = (file) => createHash('sha256').update(readFileSync(join(DIST, file))).digest('hex').slice(0, 10)
const assets = {
  css: `/css/style.css?v=${hash('css/style.css')}`,
  js: `/js/main.js?v=${hash('js/main.js')}`,
}

// ── 3. Pages ────────────────────────────────────────────────────────────────
const out = []
const write = (file, html) => {
  const path = join(DIST, file)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, html)
  out.push(file)
}

for (const lang of ['el', 'en']) {
  write(fileFor(routes.home[lang]), renderHome(lang, assets))
  for (const svc of content[lang].services) write(fileFor(routes[svc.id][lang]), renderService(lang, svc, assets))
  write(fileFor(routes.privacy[lang]), renderPrivacy(lang, assets, PRIVACY_UPDATED))
}
// Cloudflare Pages serves the nearest 404.html; without it, every unknown URL would return the home page.
write('404.html', render404('el', assets))
write('en/404.html', render404('en', assets))

// ── 4. sitemap.xml + robots.txt ─────────────────────────────────────────────
function lastmod(files) {
  try {
    const d = execSync(`git log -1 --format=%cs -- ${files.join(' ')}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    if (d) return d
  } catch {}
  return new Date().toISOString().slice(0, 10)
}
const sourcesFor = (id) => {
  const common = ['site.config.mjs', 'src/layout.mjs', 'src/i18n.mjs']
  if (id === 'home') return [...common, 'src/pages.mjs', 'src/content/el.mjs', 'src/content/en.mjs']
  if (id === 'privacy') return [...common, 'src/content/el.mjs', 'src/content/en.mjs']
  return [...common, 'src/content/el-services.mjs', 'src/content/en-services.mjs']
}
const urls = Object.entries(routes).flatMap(([id, r]) =>
  ['el', 'en'].map(
    (lang) => `  <url>
    <loc>${cfg.siteUrl}${r[lang]}</loc>
    <lastmod>${lastmod(sourcesFor(id))}</lastmod>
    <xhtml:link rel="alternate" hreflang="el" href="${cfg.siteUrl}${r.el}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${cfg.siteUrl}${r.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}${r.el}"/>
  </url>`,
  ),
)
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
)
// Crawling stays allowed during the preview: crawlers must be able to see the noindex tag.
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`)

// ── 5. Report / launch gate ─────────────────────────────────────────────────
const todos = []
for (const f of out) {
  const html = readFileSync(join(DIST, f), 'utf8')
  for (const m of html.matchAll(/\[TODO: ([^\]]+)\]/g)) todos.push(`${f}: ${m[1]}`)
}
const unique = [...new Set(todos.map((x) => x.split(': ').slice(1).join(': ')))]
const problems = []
if (todos.length) problems.push(`${todos.length} visible [TODO] markers (${unique.length} distinct)`)
if (/example|todo|pages\.dev/i.test(cfg.siteUrl)) problems.push(`siteUrl is not the final domain (${cfg.siteUrl})`)
if (!cfg.booking.confirmed) problems.push('booking URL not confirmed (site.config.mjs → booking.confirmed)')
if (!cfg.legalName) problems.push('legalName missing (privacy policy)')

const size = (dir) =>
  readdirSync(dir).reduce((n, f) => {
    const p = join(dir, f)
    return n + (statSync(p).isDirectory() ? size(p) : statSync(p).size)
  }, 0)

console.log(`Built ${out.length} pages into ${relative(ROOT, DIST)}/ (${Math.round(size(DIST) / 1024)} KB) — ${launch ? 'LAUNCH' : audit ? 'AUDIT ONLY (indexable, local origin, do not deploy)' : 'preview (noindex)'}`)
console.log(`CSS ${assets.css}  JS ${assets.js}`)
if (problems.length) {
  console.log(`\nOpen items before launch:\n  - ${problems.join('\n  - ')}`)
  if (unique.length) console.log(`\nTODO markers:\n  - ${unique.join('\n  - ')}`)
  if (launch) {
    console.error('\nLaunch build refused. Resolve the items above first.')
    rmSync(DIST, { recursive: true, force: true })
    process.exit(1)
  }
}
if (!existsSync(join(DIST, 'img/og-el.jpg'))) console.warn('\nWarning: OG images missing — run `npm run og`.')
