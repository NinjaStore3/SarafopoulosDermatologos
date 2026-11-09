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

  // [TODO: email] Optional. Shown in contact + privacy policy when set.
  email: null,

  // [TODO: legal name] Controller named in the privacy policy.
  legalName: null,

  // Online booking. Slug found in public search results; doctoranytime was not
  // reachable from the build sandbox, so set `confirmed: true` after the client
  // confirms the exact profile URL.
  booking: {
    el: 'https://www.doctoranytime.gr/d/Dermatologos/sarafopoulos-andreas',
    en: 'https://www.doctoranytime.gr/en/d/dermatologist-venereologist/sarafopoulos-andreas',
    confirmed: false,
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

  // [TODO: hours] Google only shows «κλείνει 8 μ.μ.». Fill in, e.g.:
  // hours: [
  //   { days: ['Mo', 'We', 'Fr'], opens: '09:00', closes: '14:00' },
  //   { days: ['Mo', 'Tu', 'Th'], opens: '17:00', closes: '20:00' },
  // ],
  hours: null,

  // [TODO: decision] Show the medical licence number in the footer?
  licence: { number: '16896', show: false },

  // [TODO: decision] Reviews section:
  //   'link'  → only links to doctoranytime and Google (default, most conservative)
  //   'score' → also shows «9,9/10 από 524 αξιολογήσεις στο doctoranytime»
  //   'none'  → hide the section
  // Never copy individual patient reviews onto the site, and never add aggregateRating markup.
  ratings: { mode: 'link', score: '9,9/10', count: 524 },

  areasServed: {
    el: ['Ίλιον (Νέα Λιόσια)', 'Περιστέρι', 'Πετρούπολη', 'Καματερό', 'Άγιοι Ανάργυροι', 'Καμίνια'],
    en: ['Ilion (Nea Liosia)', 'Peristeri', 'Petroupoli', 'Kamatero', 'Agioi Anargyroi', 'Kaminia'],
  },

  studio: { name: 'Istoselidakias', url: 'https://istoselidakias.gr' },
}
