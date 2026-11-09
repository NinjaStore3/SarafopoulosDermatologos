// Page shell: <head>, header, footer and the sticky mobile call bar.
import { cfg, esc, icon, extLink, telHref, todo } from './lib.mjs'
import { ui, routes, anchors } from './i18n.mjs'
import { readFileSync } from 'node:fs'

const mark = readFileSync(new URL('./data/logo-mark.svg', import.meta.url), 'utf8').trim()

const abs = (path) => cfg.siteUrl + path

/** Logo: monogram mark + typographic wordmark (name + specialty). */
export function wordmark(lang, { href = routes.home[lang], cls = 'brand' } = {}) {
  const t = ui[lang]
  return `<a class="${cls}" href="${href}">
      <svg class="brand-mark" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">${mark}</svg>
      <span class="brand-text"><span class="brand-name">${cfg.name[lang]}</span><span class="brand-role">${t.specialty}</span></span>
    </a>`
}

function head({ lang, title, description, path, alt, ogImage, jsonld, assets, noindex }) {
  const t = ui[lang]
  const other = lang === 'el' ? 'en' : 'el'
  const robots = noindex ? '\n  <meta name="robots" content="noindex, nofollow">' : ''
  const hreflang = alt
    ? `
  <link rel="alternate" hreflang="${lang}" href="${abs(path)}">
  <link rel="alternate" hreflang="${other}" href="${abs(alt)}">
  <link rel="alternate" hreflang="x-default" href="${abs(lang === 'el' ? path : alt)}">`
    : ''
  const ld = (jsonld || [])
    .map((obj) => `\n  <script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`)
    .join('')
  const og = ogImage || `/img/og-${lang}.jpg`
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">${robots}${path ? `\n  <link rel="canonical" href="${abs(path)}">` : ''}${hreflang}
  <link rel="preload" href="/fonts/commissioner-greek-wght.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/commissioner-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assets.css}">
  <script src="${assets.js}" defer></script>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#0E5C63">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(cfg.name[lang])} · ${esc(t.specialty)}">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${ui[other].locale}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
${path ? `  <meta property="og:url" content="${abs(path)}">\n` : ''}  <meta property="og:image" content="${abs(og)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(cfg.name[lang] + ', ' + t.specialty)}">
  <meta name="twitter:card" content="summary_large_image">${ld}
</head>`
}

function header(lang, { alt }) {
  const t = ui[lang]
  const a = anchors[lang]
  const home = routes.home[lang]
  const links = ['doctor', 'services', 'practice', 'hours', 'faq', 'contact']
    .map((k) => `<li><a href="${home}#${a[k]}">${t.nav[k]}</a></li>`)
    .join('\n          ')
  const sw = t.switchTo
  const switchHref = alt || routes.home[sw.lang]
  return `<a class="skip-link" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="container header-inner">
    ${wordmark(lang)}
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-label-open="${t.menu}" data-label-close="${t.menuClose}">
      <span class="nav-toggle-open">${icon.menu}</span><span class="nav-toggle-close">${icon.close}</span><span class="nav-toggle-text">${t.menu}</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="${t.navLabel}">
      <ul class="nav-list">
          ${links}
      </ul>
      <div class="nav-actions">
        <a class="lang-switch" href="${switchHref}" hreflang="${sw.lang}" lang="${sw.lang}">${sw.short}<span class="visually-hidden"> – ${sw.label}</span></a>
        ${extLink(cfg.booking[lang], t.book, t, 'btn btn-primary btn-sm')}
      </div>
    </nav>
  </div>
</header>`
}

export function hoursList(lang) {
  const t = ui[lang]
  if (!cfg.hours) return `<p>${todo(t.hoursTodo)}</p><p class="small">${t.byAppointment}</p>`
  const order = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const rows = order
    .map((d) => {
      const slots = cfg.hours.filter((h) => h.days.includes(d)).map((h) => `${h.opens}–${h.closes}`)
      return `<tr><th scope="row">${t.days[d]}</th><td>${slots.length ? slots.join(', ') : t.closed}</td></tr>`
    })
    .join('')
  return `<table class="hours-table"><caption class="visually-hidden">${t.hours}</caption><tbody>${rows}</tbody></table><p class="small">${t.byAppointment}</p>`
}

export function addressLines(lang) {
  const ad = cfg.address
  return `${ad.street[lang]} <span class="nowrap">(${ad.landmark[lang]})</span><br>${ad.locality[lang]} ${ad.postalCode}, ${ad.region[lang]}`
}

function footer(lang, { alt }) {
  const t = ui[lang]
  const a = anchors[lang]
  const home = routes.home[lang]
  const year = new Date().getFullYear()
  const svc = ['acne', 'hpv', 'moles', 'aesthetic', 'surgery']
  const svcNames = {
    el: { acne: 'Θεραπεία ακμής', hpv: 'Κονδυλώματα HPV', moles: 'Έλεγχος σπίλων', aesthetic: 'Αισθητική δερματολογία', surgery: 'Δερματοχειρουργική' },
    en: { acne: 'Acne treatment', hpv: 'Genital warts (HPV)', moles: 'Mole check', aesthetic: 'Aesthetic dermatology', surgery: 'Dermatosurgery' },
  }[lang]
  const licence = cfg.licence.show ? `<p class="small">${t.licence(cfg.licence.number)}</p>` : ''
  const email = cfg.email ? `<li><a href="mailto:${cfg.email}">${cfg.email}</a></li>` : ''
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      ${wordmark(lang, { cls: 'brand brand-inverse' })}
      <p class="footer-disclaimer">${t.disclaimer}</p>
      ${licence}
    </div>
    <div>
      <h2 class="footer-title">${t.nav.contact}</h2>
      <ul class="footer-list">
        <li><a href="${telHref}">${t.phoneShown(cfg.phone)}</a></li>
        ${email}
        <li>${extLink(cfg.booking[lang], `${t.bookingOnline} ${t.bookingVia}`, t)}</li>
        <li><address>${addressLines(lang)}</address></li>
        <li><a href="${home}#${a.hours}">${t.hours}</a></li>
      </ul>
    </div>
    <nav aria-label="${t.footerNav}">
      <h2 class="footer-title">${t.services}</h2>
      <ul class="footer-list">
        ${svc.map((k) => `<li><a href="${routes[k][lang]}">${svcNames[k]}</a></li>`).join('\n        ')}
      </ul>
    </nav>
  </div>
  <div class="container"><div class="footer-bottom">
    <p>© ${year} ${cfg.name[lang]}. ${t.rights}</p>
    <p><a href="${routes.privacy[lang]}">${t.privacy}</a> · <a href="${alt || routes.home[t.switchTo.lang]}" hreflang="${t.switchTo.lang}" lang="${t.switchTo.lang}">${t.switchTo.label}</a></p>
    <p>${t.credit}: <a href="${cfg.studio.url}" rel="noopener">${cfg.studio.name}</a></p>
  </div></div>
</footer>
<div class="call-bar" role="region" aria-label="${t.call} / ${t.bookShort}">
  <a class="call-bar-btn call-bar-call" href="${telHref}">${icon.phone}<span>${t.call}</span></a>
  <a class="call-bar-btn call-bar-book" href="${esc(cfg.booking[lang])}" target="_blank" rel="noopener">${icon.calendar}<span>${t.bookShort}</span><span class="visually-hidden"> ${t.newTab}</span></a>
</div>`
}

/** Full HTML page. */
export function page(opts) {
  const { lang, body, bodyClass = '' } = opts
  return `${head(opts)}
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(lang, opts)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(lang, opts)}
</body>
</html>
`
}
