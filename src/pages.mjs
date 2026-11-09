// Page templates (shared by both languages). Content lives in src/content/.
import { cfg, esc, icon, img, extLink, telHref } from './lib.mjs'
import { ui, routes, anchors } from './i18n.mjs'
import { page, hoursList, addressLines } from './layout.mjs'
import * as ld from './jsonld.mjs'
import * as elContent from './content/el.mjs'
import * as enContent from './content/en.mjs'
import { services as elServices } from './content/el-services.mjs'
import { services as enServices } from './content/en-services.mjs'

export const content = {
  el: { ...elContent, services: elServices },
  en: { ...enContent, services: enServices },
}
const other = (lang) => (lang === 'el' ? 'en' : 'el')

// Order of the service cards / footer links.
const SERVICE_ORDER = ['acne', 'hpv', 'moles', 'surgery', 'aesthetic']
const svcById = (lang, id) => content[lang].services.find((s) => s.id === id)

function ctaButtons(lang, { size = '' } = {}) {
  const t = ui[lang]
  return `<div class="cta-row">
      ${extLink(cfg.booking[lang], t.book, t, `btn btn-primary ${size}`)}
      <a class="btn btn-secondary ${size}" href="${telHref}">${icon.phone}<span>${t.callNumber(cfg.phone)}</span></a>
    </div>`
}

// ─── Home ───────────────────────────────────────────────────────────────────

/** Services list with durations (no prices) + conditions treated. */
function catalogue(lang, c) {
  const items = c.items
    .map((it) => {
      const name = it.link ? `<a href="${routes[it.link][lang]}">${it.name}</a>` : it.name
      const note = it.note ? `<span class="pl-note">${it.note}</span>` : ''
      return `<li><span class="pl-name">${name}${note}</span><span class="pl-dots" aria-hidden="true"></span><span class="pl-time">${it.time.replace(/^(\d+)\s/, '$1&nbsp;')}</span></li>`
    })
    .join('\n          ')
  return `<div class="catalogue">
      <div class="catalogue-list">
        <h3>${c.title}</h3>
        <p class="small">${c.intro}</p>
        <ul class="price-list">
          ${items}
        </ul>
        ${cfg.eopyy ? `<p class="eopyy">${icon.shield}<span>${c.eopyy}</span></p>` : ''}
      </div>
      <div class="catalogue-side">
        <h3>${c.conditionsTitle}</h3>
        <ul class="chips chips-strong">${c.conditions.map((x) => `<li>${x}</li>`).join('')}</ul>
        <p class="small conditions-note">${c.conditionsNote}</p>
      </div>
    </div>`
}

/** Star row with partial fill (SVG clip, no inline styles: the CSP forbids them). */
function stars(id, ratio) {
  const star = 'M11 1.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L11 16.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z'
  const row = (fill) => [0, 1, 2, 3, 4].map((i) => `<path d="${star}" transform="translate(${i * 24.5} 0)" fill="${fill}"/>`).join('')
  const n = ratio * 5
  const width = Math.min(120, Math.floor(n) * 24.5 + (n % 1) * 22)
  return `<svg class="stars" viewBox="0 0 120 22" width="120" height="22" aria-hidden="true" focusable="false"><defs><clipPath id="stars-${id}"><rect width="${width.toFixed(1)}" height="22"/></clipPath></defs>${row('#d9e2df')}<g clip-path="url(#stars-${id})">${row('#e0956f')}</g></svg>`
}

function reviewsSection(lang, r, anchor) {
  const t = ui[lang]
  const rv = cfg.ratings
  if (rv.mode === 'none') return ''
  const num = (x) => (lang === 'el' ? String(x).replace('.', ',') : String(x))
  const url = (id) => (id === 'google' ? cfg.maps.profile || cfg.maps.search : cfg.booking[lang])
  const cards =
    rv.mode === 'score'
      ? `<ul class="rating-grid">
      ${rv.platforms
        .map(
          (pf) => `<li class="rating-card">
        <p class="rating-platform">${pf.name}</p>
        <p class="rating-score"><span class="rating-value">${num(pf.score)}</span><span class="rating-scale" aria-hidden="true">/${pf.scale}</span><span class="visually-hidden"> ${r.outOf(pf.scale)}</span></p>
        ${stars(pf.id, pf.score / pf.scale)}
        <p class="rating-count">${r.count(pf.count, pf.id)}</p>
        <p class="rating-link">${extLink(url(pf.id), r.read, t, 'link-strong')}<span class="visually-hidden"> (${pf.name})</span></p>
      </li>`,
        )
        .join('\n      ')}
    </ul>`
      : `<div class="reviews-links">${rv.platforms.map((pf) => extLink(url(pf.id), `${r.read} · ${pf.name}`, t, 'btn btn-secondary')).join('')}</div>`
  return `
<section class="section section-tint" id="${anchor}" aria-labelledby="reviews-title">
  <div class="container reviews">
    <div class="reviews-intro">
      <h2 id="reviews-title">${r.h2}</h2>
      <p>${r.text}</p>
      ${rv.mode === 'score' ? `<p class="small">${r.note(rv.asOf[lang])}</p>` : ''}
    </div>
    ${cards}
  </div>
</section>`
}

function homeBody(lang) {
  const t = ui[lang]
  const c = content[lang]
  const h = c.home
  const a = anchors[lang]

  const hero = `
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-text">
      <p class="eyebrow">${h.hero.eyebrow}</p>
      <h1 id="hero-title"><span class="h1-name">${h.hero.name}</span> <span class="h1-role">${h.hero.role}</span></h1>
      <p class="lead">${h.hero.lead}</p>
      ${ctaButtons(lang)}
      <ul class="trust" aria-label="${lang === 'el' ? 'Σπουδές και πρόσβαση' : 'Training and access'}">
        ${h.hero.trust.map((x) => `<li>${x}</li>`).join('\n        ')}
      </ul>
    </div>
    <div class="hero-media">
      <div class="hero-frame">
        ${img('giatros-portreto', { alt: h.hero.imgAlt, sizes: '(min-width: 960px) 440px, (min-width: 600px) 60vw, 88vw', eager: true })}
      </div>
    </div>
  </div>
</section>`

  const d = h.doctor
  const doctor = `
<section class="section" id="${a.doctor}" aria-labelledby="doctor-title">
  <div class="container split">
    <div>
      <h2 id="doctor-title">${d.h2}</h2>
      <p class="kicker">${d.kicker}</p>
      ${d.paras.map((p) => `<p>${p}</p>`).join('\n      ')}
    </div>
    <div class="card timeline-card">
      <h3>${d.timelineTitle}</h3>
      <ol class="timeline">
        ${d.timeline.map((it) => `<li><span class="timeline-title">${it.title}</span><span class="timeline-place">${it.place}</span></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`

  const s = h.services
  const serviceCard = (svc) => {
    const meta = [svc.card.meta, svc.card.special ? s.specialInterest : ''].filter(Boolean)
    return `<li class="service-card">
          <span class="service-icon">${icon[svc.icon]}</span>
          <h3><a class="stretched" href="${routes[svc.id][lang]}">${svc.card.title}</a></h3>
          <p>${svc.card.text}</p>
          ${meta.length ? `<p class="service-meta">${meta.map((m) => `<span>${m}</span>`).join('')}</p>` : ''}
          <span class="service-more" aria-hidden="true">${t.moreInfo}${icon.arrow}</span>
        </li>`
  }
  const infoCard = (x, ic) => `<li class="service-card service-card-plain">
          <span class="service-icon">${icon[ic]}</span>
          <h3>${x.title}</h3>
          <p>${x.text}</p>
          <p class="service-meta"><span>${x.meta}</span></p>
        </li>`
  const services = `
<section class="section section-alt" id="${a.services}" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head">
      <h2 id="services-title">${s.h2}</h2>
      <p>${s.intro}</p>
    </div>
    <ul class="service-grid">
        ${SERVICE_ORDER.map((id) => serviceCard(svcById(lang, id))).join('\n        ')}
        ${infoCard(s.general, 'stethoscope')}
    </ul>
    ${catalogue(lang, s.catalogue)}
  </div>
</section>`

  const p = h.practice
  const practice = `
<section class="section" id="${a.practice}" aria-labelledby="practice-title">
  <div class="container">
    <div class="section-head">
      <h2 id="practice-title">${p.h2}</h2>
      <p>${p.intro}</p>
    </div>
    <div class="gallery">
      ${p.gallery
        .map(
          (g, i) => `<figure class="gallery-item${i === 0 ? ' gallery-main' : ''}">
        ${img(g.img, { alt: g.alt, sizes: i === 0 ? '(min-width: 960px) 760px, 92vw' : '(min-width: 960px) 380px, 92vw' })}
        <figcaption>${g.caption}</figcaption>
      </figure>`,
        )
        .join('\n      ')}
    </div>
    <div class="access-card">
      <div class="access-media">${img('eisodos-rampa', { alt: p.access.imgAlt, sizes: '(min-width: 760px) 220px, 92vw' })}</div>
      <div class="access-text">
        <span class="service-icon">${icon.access}</span>
        <h3>${p.access.title}</h3>
        <p>${p.access.text}</p>
      </div>
    </div>
  </div>
</section>`

  const reviews = reviewsSection(lang, h.reviews, a.reviews)

  const ho = h.hours
  const mapEmbed = lang === 'el' ? cfg.maps.embed : cfg.maps.embedEn
  const hours = `
<section class="section" id="${a.hours}" aria-labelledby="hours-title">
  <div class="container split split-wide">
    <div class="hours-info">
      <h2 id="hours-title">${ho.h2}</h2>
      <div class="info-block">
        <h3>${icon.pin}<span>${t.address}</span></h3>
        <address>${addressLines(lang)}</address>
      </div>
      <div class="info-block">
        <h3>${icon.clock}<span>${t.hours}</span></h3>
        ${hoursList(lang)}
      </div>
      <div class="info-block">
        <h3>${icon.map}<span>${ho.gettingHere}</span></h3>
        <p>${ho.gettingHereText}</p>
      </div>
      <div class="info-block">
        <h3>${ho.areasTitle}</h3>
        <p>${ho.areasText}</p>
        <ul class="chips">${cfg.areasServed[lang].map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="map-card">
      <div class="map-frame" data-map-src="${esc(mapEmbed)}" data-map-title="${esc(t.mapTitle)}">
        ${img('ktirio', { alt: ho.buildingAlt, sizes: '(min-width: 960px) 520px, 92vw', cls: 'map-preview' })}
        <button class="btn btn-primary map-load" type="button">${icon.map}<span>${t.mapShow}</span></button>
      </div>
      <p class="small map-note">${t.mapNote}</p>
      <p>${extLink(cfg.maps.directions, t.directions, t, 'link-strong')}</p>
    </div>
  </div>
</section>`

  const f = h.faq
  const faq = `
<section class="section section-alt" id="${a.faq}" aria-labelledby="faq-title">
  <div class="container narrow">
    <div class="section-head">
      <h2 id="faq-title">${f.h2}</h2>
      <p>${f.intro}</p>
    </div>
    <div class="faq">
      ${c.faqs
        .map(
          (q) => `<details>
        <summary><h3>${q.q}</h3></summary>
        <div class="faq-answer"><p>${q.a}</p></div>
      </details>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>`

  const co = h.contact
  const emailCard = cfg.email
    ? `<li class="contact-card"><span class="service-icon">${icon.mail}</span><h3>${t.email}</h3><p><a href="mailto:${cfg.email}">${cfg.email}</a></p><p class="small">${co.emailNote}</p></li>`
    : ''
  const contact = `
<section class="section" id="${a.contact}" aria-labelledby="contact-title">
  <div class="container">
    <div class="section-head">
      <h2 id="contact-title">${co.h2}</h2>
      <p>${co.intro}</p>
    </div>
    <ul class="contact-grid">
      <li class="contact-card"><span class="service-icon">${icon.phone}</span><h3>${t.phone}</h3><p><a class="link-strong big" href="${telHref}">${t.phoneShown(cfg.phone)}</a></p></li>
      <li class="contact-card"><span class="service-icon">${icon.calendar}</span><h3>${t.bookingOnline}</h3><p>${extLink(cfg.booking[lang], `doctoranytime`, t, 'link-strong big')}</p></li>
      <li class="contact-card"><span class="service-icon">${icon.pin}</span><h3>${t.address}</h3><address>${addressLines(lang)}</address><p>${extLink(cfg.maps.directions, t.directions, t)}</p></li>
      <li class="contact-card"><span class="service-icon">${icon.clock}</span><h3>${t.hours}</h3>${hoursList(lang)}</li>
      ${emailCard}
    </ul>
  </div>
</section>`

  return [hero, doctor, services, practice, reviews, hours, faq, contact].join('\n')
}

export function renderHome(lang, assets) {
  const c = content[lang]
  const svcList = SERVICE_ORDER.map((id) => {
    const s = svcById(lang, id)
    return { type: s.jsonType, name: s.h1, url: routes[id][lang] }
  })
  const jsonld = [
    ld.graph(
      ld.physician(lang, { description: c.home.description, services: svcList }),
      ld.website(lang),
      ld.faqPage(lang, c.faqs),
    ),
  ]
  return page({
    lang,
    title: c.home.title,
    description: c.home.description,
    path: routes.home[lang],
    alt: routes.home[other(lang)],
    jsonld,
    assets,
    noindex: cfg.noindex,
    body: homeBody(lang),
    bodyClass: 'page-home',
  })
}

// ─── Service pages ──────────────────────────────────────────────────────────

function breadcrumbNav(lang, items) {
  const t = ui[lang]
  return `<nav class="breadcrumb" aria-label="${t.breadcrumb}"><ol>${items
    .map((it, i) => (i === items.length - 1 ? `<li><span aria-current="page">${it.name}</span></li>` : `<li><a href="${it.url}">${it.name}</a></li>`))
    .join('')}</ol></nav>`
}

export function renderService(lang, svc, assets) {
  const t = ui[lang]
  const a = anchors[lang]
  const path = routes[svc.id][lang]
  const crumbs = [
    { name: t.home, url: routes.home[lang] },
    { name: t.services, url: `${routes.home[lang]}#${a.services}` },
    { name: svc.h1, url: path },
  ]
  const others = SERVICE_ORDER.filter((id) => id !== svc.id).map((id) => svcById(lang, id))
  const figure = svc.figure
    ? `<figure class="article-figure">${img(svc.figure.img, { alt: svc.figure.alt, sizes: '(min-width: 480px) 420px, 92vw' })}<figcaption>${svc.figure.caption}</figcaption></figure>`
    : ''
  const body = `
<div class="page-head">
  <div class="container">
    ${breadcrumbNav(lang, crumbs)}
    <div class="page-head-grid">
      <div>
        <p class="eyebrow">${t.services}</p>
        <h1>${svc.h1}</h1>
        <p class="lead">${svc.lead}</p>
        ${ctaButtons(lang)}
      </div>
      <dl class="facts">
        ${svc.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n        ')}
        <div><dt>${t.where}</dt><dd>${cfg.address.street[lang]}, ${cfg.address.locality[lang]}</dd></div>
      </dl>
    </div>
  </div>
</div>
<div class="container article-grid">
  <article class="prose">
    ${figure}
    ${svc.body}
    <p class="disclaimer">${t.disclaimer}</p>
  </article>
  <aside class="article-aside">
    <div class="card cta-card">
      <h2>${t.ctaTitle}</h2>
      <p>${t.ctaText}</p>
      ${extLink(cfg.booking[lang], t.book, t, 'btn btn-primary btn-block')}
      <a class="btn btn-secondary btn-block" href="${telHref}">${icon.phone}<span>${t.phoneShown(cfg.phone)}</span></a>
      <address class="small">${addressLines(lang)}</address>
    </div>
    <nav class="card other-services" aria-label="${t.otherServices}">
      <h2>${t.otherServices}</h2>
      <ul>
        ${others.map((o) => `<li><a href="${routes[o.id][lang]}">${icon[o.icon]}<span>${o.card.title}</span></a></li>`).join('\n        ')}
      </ul>
    </nav>
  </aside>
</div>`
  return page({
    lang,
    title: svc.title,
    description: svc.description,
    path,
    alt: routes[svc.id][other(lang)],
    jsonld: [
      ld.breadcrumbs(crumbs),
      ld.medicalWebPage(lang, { url: path, name: svc.h1, description: svc.description, about: svc.about }),
    ],
    assets,
    noindex: cfg.noindex,
    body,
    bodyClass: 'page-service',
  })
}

// ─── Privacy & 404 ──────────────────────────────────────────────────────────

export function renderPrivacy(lang, assets, updated) {
  const t = ui[lang]
  const pr = content[lang].privacy
  const path = routes.privacy[lang]
  const crumbs = [
    { name: t.home, url: routes.home[lang] },
    { name: pr.h1, url: path },
  ]
  const body = `
<div class="page-head page-head-simple">
  <div class="container narrow">
    ${breadcrumbNav(lang, crumbs)}
    <h1>${pr.h1}</h1>
  </div>
</div>
<div class="container narrow">
  <article class="prose prose-solo">
    ${pr.body()}
    <p class="small">${pr.updated}: <time datetime="${updated.iso}">${updated[lang]}</time></p>
  </article>
</div>`
  return page({
    lang,
    title: pr.title,
    description: pr.description,
    path,
    alt: routes.privacy[other(lang)],
    jsonld: [ld.breadcrumbs(crumbs)],
    assets,
    noindex: cfg.noindex,
    body,
    bodyClass: 'page-privacy',
  })
}

export function render404(lang, assets) {
  const nf = content[lang].notFound
  const body = `
<div class="page-head page-head-simple not-found">
  <div class="container narrow">
    <p class="eyebrow">404</p>
    <h1>${nf.h1}</h1>
    <p class="lead">${nf.text}</p>
    <p><a class="btn btn-primary" href="${routes.home[lang]}">${nf.back}</a></p>
  </div>
</div>`
  return page({
    lang,
    title: nf.title,
    description: nf.description,
    path: null,
    alt: null,
    assets,
    noindex: true, // always: a 404 must never be indexed
    body,
    bodyClass: 'page-404',
  })
}
