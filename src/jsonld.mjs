// Structured data. Deliberately NO aggregateRating: self-served review markup
// is not eligible for rich results and is risky under Google's guidelines.
import { cfg, imgUrl } from './lib.mjs'
import { routes } from './i18n.mjs'

const abs = (p) => cfg.siteUrl + p
const PHYSICIAN_ID = () => `${cfg.siteUrl}/#physician`
const WEBSITE_ID = () => `${cfg.siteUrl}/#website`
const stripTags = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const dayMap = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' }

export function physician(lang, { description, services }) {
  const ad = cfg.address
  const node = {
    '@type': 'Physician',
    '@id': PHYSICIAN_ID(),
    name: cfg.name.el,
    alternateName: `${cfg.name.en}, ${cfg.name.credentials}`,
    description,
    medicalSpecialty: 'https://schema.org/Dermatology',
    url: abs(routes.home[lang]),
    image: abs(imgUrl('giatros-portreto')),
    logo: abs('/apple-touch-icon.png'),
    telephone: cfg.phone.international,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ad.street[lang],
      addressLocality: ad.locality[lang],
      postalCode: ad.postalCode.replace(' ', ''),
      addressRegion: ad.region[lang],
      addressCountry: ad.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: cfg.geo.lat, longitude: cfg.geo.lng },
    hasMap: cfg.maps.directions,
    isAcceptingNewPatients: true,
    areaServed: cfg.areasServed[lang].map((name) => ({ '@type': 'Place', name })),
    availableService: services.map((s) => ({ '@type': s.type, name: s.name, url: abs(s.url) })),
    sameAs: [cfg.booking.el, cfg.maps.profile].filter(Boolean),
  }
  if (cfg.email) node.email = cfg.email
  if (cfg.languages) node.knowsLanguage = cfg.languages
  if (cfg.hours) {
    node.openingHoursSpecification = cfg.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${dayMap[d]}`),
      opens: h.opens,
      closes: h.closes,
    }))
  }
  return node
}

export function website(lang) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID(),
    url: abs('/'),
    name: `${cfg.name.el} · Δερματολόγος – Αφροδισιολόγος`,
    inLanguage: ['el', 'en'],
    publisher: { '@id': PHYSICIAN_ID() },
  }
}

export function faqPage(lang, faqs) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(routes.home[lang])}#faq`,
    inLanguage: lang,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
    })),
  }
}

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  }
}

export function medicalWebPage(lang, { url, name, description, about }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': abs(url),
    url: abs(url),
    name,
    description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID() },
    about: { '@type': about.type, name: about.name },
    audience: { '@type': 'Patient' },
    provider: { '@id': PHYSICIAN_ID() },
  }
}

export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes })
