// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the practice's facts.
// Every value marked [TODO] is an open question for the doctor / client.
// `npm run build:launch` refuses to build while any visible [TODO] remains,
// while the domain is the placeholder, or while the booking link is unconfirmed.
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // [TODO: domain] Final domain, registered in the doctor's name.
  // Ideas to check: sarafopoulos.gr, dermatologos-ilion.gr
  siteUrl: 'https://todo-domain.example',

  // Kept true until the doctor approves all texts. `npm run build:launch` forces false.
  noindex: true,

  name: {
    el: 'Ανδρέας Σαραφόπουλος',
    en: 'Andreas Sarafopoulos',
    credentials: 'MD, MSc',
  },

  phone: { display: '210 577 4392', international: '+30 210 577 4392', e164: '+302105774392' },

  // Shown in contact, footer, privacy policy and JSON-LD. (Provided by the client.)
  email: 'christos.sandravelis@gmail.com',

  // Data controller named in the privacy policy. A sole-practitioner practice:
  // the controller is the doctor himself. Change if the practice is a company.
  legalName: {
    el: 'Ανδρέας Σαραφόπουλος, ιατρός δερματολόγος – αφροδισιολόγος',
    en: 'Andreas Sarafopoulos, dermatologist–venereologist',
  },

  // Practicalities confirmed by the client.
  eopyy: true, // contracted with ΕΟΠΥΥ
  languages: ['el', 'en'], // the doctor speaks Greek and English
  elevator: true, // step-free: ramp at the entrance + lift

  // Online booking (profile URL confirmed by the client).
  booking: {
    el: 'https://www.doctoranytime.gr/d/Dermatologos/sarafopoulos-andreas',
    en: 'https://www.doctoranytime.gr/en/d/dermatologist-venereologist/sarafopoulos-andreas',
    confirmed: true,
  },

  address: {
    street: { el: 'Μενελάου 74 & Κάλχου', en: 'Menelaou 74 & Kalchou' },
    landmark: { el: 'έναντι Δημαρχείου', en: 'opposite the Town Hall' },
    locality: { el: 'Ίλιον', en: 'Ilion' },
    postalCode: '131 22',
    region: { el: 'Αττική', en: 'Attica' },
    country: 'GR',
    plusCode: '8GC52PH4+VX',
  },
  geo: { lat: 38.02969, lng: 23.70744 },

  maps: {
    // Opens Google Maps directions to the plus code (exact entrance location).
    directions: 'https://www.google.com/maps/dir/?api=1&destination=8GC52PH4%2BVX',
    // Loaded into an iframe ONLY after the visitor clicks «Εμφάνιση χάρτη».
    embed: 'https://maps.google.com/maps?q=38.02969,23.70744&z=17&hl=el&output=embed',
    embedEn: 'https://maps.google.com/maps?q=38.02969,23.70744&z=17&hl=en&output=embed',
    // [TODO: optional] Google Business Profile share link (maps.app.goo.gl/…) for JSON-LD sameAs.
    profile: null,
    // Used for the "reviews on Google" link until the profile link is known.
    search: 'https://www.google.com/maps/search/?api=1&query=%CE%A3%CE%B1%CF%81%CE%B1%CF%86%CF%8C%CF%80%CE%BF%CF%85%CE%BB%CE%BF%CF%82+%CE%B4%CE%B5%CF%81%CE%BC%CE%B1%CF%84%CE%BF%CE%BB%CF%8C%CE%B3%CE%BF%CF%82+%CE%8A%CE%BB%CE%B9%CE%BF%CE%BD',
  },

  // Opening hours, from the Google Business Profile (November 2026). One entry per time block.
  hours: [
    { days: ['Mo', 'Tu', 'We', 'Th'], opens: '10:00', closes: '13:30' },
    { days: ['Fr'], opens: '10:00', closes: '13:00' },
    { days: ['Mo', 'Tu', 'We', 'Fr'], opens: '16:00', closes: '20:00' },
  ],

  // Medical licence number, shown in the footer.
  licence: { number: '16896', show: true },

  // Reviews section: 'score' (rating cards), 'link' (links only) or 'none'.
  // Update the numbers from time to time and change `asOf` with them.
  // Never copy individual patient reviews onto the site, and never add aggregateRating markup.
  ratings: {
    mode: 'score',
    asOf: { el: 'Νοεμβρίου 2026', en: 'November 2026' },
    platforms: [
      { id: 'doctoranytime', name: 'doctoranytime', score: 9.9, scale: 10, count: 524 },
      { id: 'google', name: 'Google', score: 4.5, scale: 5, count: 66 },
    ],
  },

  areasServed: {
    el: ['Ίλιον (Νέα Λιόσια)', 'Περιστέρι', 'Πετρούπολη', 'Καματερό', 'Άγιοι Ανάργυροι'],
    en: ['Ilion (Nea Liosia)', 'Peristeri', 'Petroupoli', 'Kamatero', 'Agioi Anargyroi'],
  },

  studio: { name: 'Istoselidakias', url: 'https://istoselidakias.gr' },
}
