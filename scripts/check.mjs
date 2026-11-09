#!/usr/bin/env node
// Static checks on dist/ (run after `npm run build`). Zero dependencies.
//  - SEO: unique <title> ≤ 60, meta description ≤ 155, one <h1>, lang, canonical,
//         reciprocal hreflang, noindex while cfg.noindex, sitemap/robots/404/_headers present
//  - JSON-LD parses and contains no aggregateRating
//  - internal links and images resolve; <img> has alt/width/height; target=_blank has rel=noopener
//  - Greek final-ν rule for δεν/μην/την/στην/έναν (Τριανταφυλλίδης)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import cfg from '../site.config.mjs'

// Same override as the build (preview deployments).
if (process.env.SITE_URL) cfg.siteUrl = process.env.SITE_URL.replace(/\/+$/, '')

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const errors = []
const warn = []
const err = (f, m) => errors.push(`${f}: ${m}`)

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const files = walk(DIST)
const htmlFiles = files.filter((f) => f.endsWith('.html'))

for (const need of ['sitemap.xml', 'robots.txt', '404.html', 'en/404.html', '_headers', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'img/og-el.jpg', 'img/og-en.jpg'])
  if (!existsSync(join(DIST, need))) err('dist', `missing ${need}`)

const resolveHref = (href) => {
  const p = href.split('#')[0].split('?')[0]
  if (!p) return true
  const base = join(DIST, p)
  if (p.endsWith('/')) return existsSync(join(base, 'index.html'))
  return (existsSync(base) && statSync(base).isFile()) || existsSync(base + '.html')
}

const titles = new Map()
const strip = (h) => h.replace(/<[^>]+>/g, '')
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')

for (const file of htmlFiles) {
  const f = relative(DIST, file)
  const html = readFileSync(file, 'utf8')
  const is404 = f.endsWith('404.html')

  const lang = html.match(/<html lang="([^"]+)"/)?.[1]
  if (!lang) err(f, 'missing <html lang>')
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  if (!title) err(f, 'missing <title>')
  if ([...title].length > 60) err(f, `title ${[...title].length} chars > 60: ${title}`)
  if (!is404) {
    if (titles.has(title)) err(f, `duplicate title with ${titles.get(title)}`)
    titles.set(title, f)
  }
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  if (!desc) err(f, 'missing meta description')
  if ([...desc].length > 155) err(f, `description ${[...desc].length} chars > 155`)

  const h1s = html.match(/<h1[\s>]/g) || []
  if (h1s.length !== 1) err(f, `${h1s.length} <h1> elements`)

  const noindex = /<meta name="robots" content="noindex/.test(html)
  if ((cfg.noindex || is404) && !noindex) err(f, 'expected noindex')
  if (!cfg.noindex && !is404 && noindex) err(f, 'unexpected noindex')

  if (!is404) {
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    if (!canon) err(f, 'missing canonical')
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }))
    if (alts.length !== 3) err(f, `expected 3 hreflang links, got ${alts.length}`)
    if (canon && !alts.some((a) => a.href === canon && a.lang === lang)) err(f, 'hreflang self-reference missing')
    for (const a of alts) {
      const target = a.href.replace(cfg.siteUrl, '')
      if (!resolveHref(target)) err(f, `hreflang target missing: ${target}`)
      else {
        const tf = target.endsWith('/') ? join(DIST, target, 'index.html') : join(DIST, target + '.html')
        if (!readFileSync(tf, 'utf8').includes(`href="${canon}"`)) err(f, `hreflang not reciprocal with ${target}`)
      }
    }
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const json = JSON.parse(m[1])
      if (JSON.stringify(json).includes('aggregateRating')) err(f, 'aggregateRating must not be used')
    } catch (e) {
      err(f, `invalid JSON-LD: ${e.message}`)
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0]
    if (!/\salt="[^"]+"/.test(tag)) err(f, `img without alt: ${tag.slice(0, 80)}`)
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) err(f, `img without width/height: ${tag.slice(0, 80)}`)
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1]
    if (src && !existsSync(join(DIST, src))) err(f, `missing image ${src}`)
    for (const s of tag.match(/srcset="([^"]+)"/)?.[1].split(',') ?? []) {
      const u = s.trim().split(' ')[0]
      if (!existsSync(join(DIST, u))) err(f, `missing srcset image ${u}`)
    }
  }
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
    const [tag, href] = m
    if (href.startsWith('/') && !resolveHref(href)) err(f, `broken internal link ${href}`)
    if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) err(f, `target=_blank without rel=noopener: ${href}`)
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) err(f, `missing anchor #${m[1]}`)
  for (const m of html.matchAll(/href="\/(en\/)?#([^"]+)"/g)) {
    const home = readFileSync(join(DIST, m[1] ? 'en/index.html' : 'index.html'), 'utf8')
    if (!home.includes(`id="${m[2]}"`)) err(f, `missing home anchor #${m[2]}`)
  }

  // Greek final-ν: keep ν before vowels and κ π τ ξ ψ μπ ντ γκ τσ τζ.
  if (lang === 'el') {
    const text = decode(strip(html.split('<body')[1].replace(/<script[\s\S]*?<\/script>/g, ' ')))
    const keep = /^([αεηιουωάέήίόύώϊϋΐΰκπτξψ]|μπ|ντ|γκ|τσ|τζ)/i
    const allow = ['μη επεμβατική']
    for (const m of text.matchAll(/(^|[\s«(])(δεν|μην|την|στην|έναν|δε|μη|τη|στη|ένα)\s+([α-ωά-ώϊϋΐΰ]+)/gi)) {
      const [, , w, next] = m
      if (allow.some((a) => `${w} ${next}`.toLowerCase().startsWith(a))) continue
      const lw = w.toLowerCase()
      const withN = ['δεν', 'μην', 'την', 'στην', 'έναν'].includes(lw)
      if (lw === 'ένα') continue // neuter ένα is always without ν
      if (withN && !keep.test(next)) err(f, `final-ν: «${w} ${next}» → «${w.slice(0, -1)} ${next}»`)
      if (!withN && keep.test(next) && lw !== 'τη' && lw !== 'στη') err(f, `final-ν: «${w} ${next}» → «${w}ν ${next}»`)
      if ((lw === 'τη' || lw === 'στη') && keep.test(next)) err(f, `final-ν: «${w} ${next}» → «${w}ν ${next}»`)
    }
    if (/\bOnline\b/.test(text)) warn.push(`${f}: anglicism "Online" in Greek text`)
  }
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(cfg.siteUrl, ''))
for (const l of locs) if (!resolveHref(l)) err('sitemap.xml', `URL without page: ${l}`)
if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap)) err('sitemap.xml', 'missing lastmod')
if (!readFileSync(join(DIST, 'robots.txt'), 'utf8').includes(`Sitemap: ${cfg.siteUrl}/sitemap.xml`)) err('robots.txt', 'missing Sitemap line')
const headers = readFileSync(join(DIST, '_headers'), 'utf8')
if (!headers.includes('https://:project.pages.dev/*') || !headers.includes('X-Robots-Tag: noindex')) err('_headers', 'pages.dev noindex missing')

console.log(`Checked ${htmlFiles.length} HTML files, ${locs.length} sitemap URLs.`)
if (warn.length) console.log(`Warnings:\n  ${warn.join('\n  ')}`)
if (errors.length) {
  console.error(`Errors:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log('All checks passed.')
