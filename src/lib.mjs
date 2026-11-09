// Small helpers shared by all page templates. No dependencies.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import cfg from '../site.config.mjs'

const images = JSON.parse(readFileSync(fileURLToPath(new URL('./data/images.json', import.meta.url)), 'utf8'))

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Visible placeholder for an unanswered question. The launch build fails while any remain. */
export const todo = (text) => `<mark class="todo">[TODO: ${text}]</mark>`

/** Responsive <img> from the processed-image manifest (always with width/height). */
export function img(name, { alt, sizes = '100vw', cls = '', eager = false } = {}) {
  const m = images[name]
  if (!m) throw new Error(`Unknown image: ${name}`)
  if (alt === undefined) throw new Error(`Missing alt for ${name}`)
  const largest = m.variants[m.variants.length - 1]
  const srcset = m.variants.map((v) => `${v.src} ${v.w}w`).join(', ')
  return `<img src="${largest.src}" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
}
export const imgUrl = (name) => {
  const m = images[name]
  return m.variants[m.variants.length - 1].src
}

// Inline SVG icons. The web font has no arrow glyphs, so arrows are always SVG.
const svg = (body, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`

export const icon = {
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  external: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>'),
  pin: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  access: svg('<circle cx="12" cy="4.5" r="1.6"/><path d="M12 7.5v6h5l2 5"/><path d="M8.5 10.5a5.5 5.5 0 1 0 7.2 7"/>'),
  map: svg('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>'),
  star: svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  // Service icons
  drop: svg('<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'),
  shield: svg('<path d="M12 3 4.5 6v6c0 4.6 3.2 7.9 7.5 9 4.3-1.1 7.5-4.4 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  lens: svg('<circle cx="11" cy="11" r="6.5"/><circle cx="11" cy="11" r="2.5"/><path d="m16 16 4.5 4.5"/>'),
  sparkle: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>'),
  scalpel: svg('<path d="M4 20 15.5 8.5a2.1 2.1 0 0 1 3 3L8 22"/><path d="m13 11 3 3"/><path d="M19 3l2 2"/>'),
  stethoscope: svg('<path d="M6 3v6a5 5 0 0 0 10 0V3"/><path d="M11 14v2a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="12" r="2"/>'),
  document: svg('<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
}

/** External link that opens in a new tab, announced to screen readers. */
export function extLink(href, label, t, cls = '') {
  // Outside buttons, keep the icon glued to the last word so it never wraps alone.
  let text = `${label}${icon.external}`
  const i = label.lastIndexOf(' ')
  if (!/\bbtn\b/.test(cls)) text = `${label.slice(0, i + 1)}<span class="nowrap">${label.slice(i + 1)}${icon.external}</span>`
  return `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''} target="_blank" rel="noopener">${text}<span class="visually-hidden"> ${t.newTab}</span></a>`
}

/** Booking button: calendar icon before the label, no external-link arrow
 *  (the new tab is still announced to screen readers). */
export function bookButton(lang, t, cls = '') {
  return `<a href="${esc(cfg.booking[lang])}" class="btn btn-primary${cls ? ` ${cls}` : ''}" target="_blank" rel="noopener">${icon.calendar}<span>${t.book}</span><span class="visually-hidden"> ${t.newTab}</span></a>`
}

export const telHref = `tel:${cfg.phone.e164}`

export { cfg }
