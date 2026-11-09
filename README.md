# Ανδρέας Σαραφόπουλος · Δερματολόγος – Αφροδισιολόγος, Ίλιον

Website of the dermatology practice of Andreas Sarafopoulos MD, MSc, at Μενελάου 74 & Κάλχου, Ίλιον.
Greek at `/`, English at `/en/`. Static HTML/CSS/vanilla JS, no framework, no runtime dependencies,
deployed on **Cloudflare Pages**. Built by Istoselidakias.

> **Status: preview.** Every page carries `noindex` until the doctor approves all texts
> (bio, service pages, FAQ, privacy policy). See [Launch checklist](#launch-checklist).

## Pages

| Greek | English | Content |
|---|---|---|
| `/` | `/en/` | Home: hero, doctor, services, practice, reviews, hours & access, FAQ, contact |
| `/akmi` | `/en/acne` | Θεραπεία ακμής |
| `/kondylomata-hpv` | `/en/genital-warts-hpv` | Κονδυλώματα HPV |
| `/elegxos-spilon` | `/en/mole-check` | Έλεγχος & χαρτογράφηση σπίλων |
| `/aisthitiki` | `/en/aesthetic-dermatology` | Αισθητική δερματολογία |
| `/dermatoxeirourgiki` | `/en/dermatosurgery` | Δερματοχειρουργική |
| `/politiki-aporritou` | `/en/privacy-policy` | Πολιτική απορρήτου (GDPR) |
| `404.html` | `en/404.html` | Always `noindex` |

## Where to edit things

| What | File |
|---|---|
| Phone, booking link, hours, domain, email, legal name, licence, ratings mode, areas served | `site.config.mjs` |
| Greek texts (home, FAQ, privacy, 404) | `src/content/el.mjs` |
| Greek service pages | `src/content/el-services.mjs` |
| English texts | `src/content/en.mjs`, `src/content/en-services.mjs` |
| Menu labels, buttons, footer strings, URLs | `src/i18n.mjs` |
| Page markup | `src/pages.mjs`, `src/layout.mjs` |
| Structured data (JSON-LD) | `src/jsonld.mjs` |
| Styles / script | `src/static/css/style.css`, `src/static/js/main.js` |
| Headers (security, cache, pages.dev noindex) | `src/static/_headers` |

Open questions appear on the page as yellow **`[TODO: …]`** markers. The launch build refuses to run
while any remain.

## Commands

```bash
npm run build          # preview build into dist/ (noindex everywhere), lists open TODOs
npm run build:launch   # launch build: removes noindex; fails on TODOs / placeholder domain / unconfirmed booking link
npm run serve          # http://localhost:8080 — mimics Cloudflare Pages (extensionless URLs, 404.html)
npm run check          # SEO + HTML + JSON-LD + Greek final-ν checks, and glyph coverage of the fonts
npm run shots          # screenshots (390 + 1440, WebP) into screenshots/, and horizontal-scroll check at 6 widths
npm run images         # re-process photos from assets-src/photos (needs Python + Pillow)
npm run og             # re-render OG images + icons (needs Playwright)
```

`npm run bust` is an alias of `build`: CSS/JS are always linked as `style.css?v=<content hash>`.
`check` needs `pip install fonttools brotli`; `shots`/`og` need Playwright with Chromium.

## Deploy on Cloudflare Pages

- **Build command:** `npm run build` · **Output directory:** `dist` · **Node:** 18+ (`NODE_VERSION=22`)
- The build needs only Node: processed photos, OG images and icons are committed in `src/static/`.
- **Production environment variable:** `SITE_LAUNCH=1` *only after approval*. It turns on launch mode
  (no `noindex`, strict checks). Preview deployments keep `noindex`, and `_headers` adds
  `X-Robots-Tag: noindex` on every `*.pages.dev` host anyway.

## Photos

Raw photos live in `assets-src/photos/` and are never deployed. `scripts/images.py` crops them,
blurs sensitive areas, strips all metadata (EXIF/XMP/ICC) and exports WebP ≤ 200 KB.

| Photo | Use | Notes |
|---|---|---|
| `giatros-dermatoskopio.jpg` | Hero portrait, moles page, OG image | Dermoscopy monitor **blurred** (lesion image + patient panel) |
| `exetastirio.jpg` | Gallery: examination room | — |
| `xoros-anamonis.jpg` | Gallery: waiting room | Cropped: Christmas tree on the right edge |
| `diadromos-vivliothiki.jpg` | Gallery: hallway | — |
| `eisodos-rampa.jpg` | Step-free access | Other tenants’ plaques are unreadable at this size |
| `ktirio-menelaou-74.jpg` | Map preview (before consent) | Cropped: parked cars removed |
| `rejected/giatros-500x500-no-exif.jpg` | **Not used** | 500×500 crop with no metadata: looks downloaded from a profile platform |
| `rejected/anamoni-kontina.jpg` | **Not used** | Duplicate of the waiting room; personal items on the table |

The originals are only 600–800 px wide, so no 960/1600 px variants exist yet. With full-resolution
originals from the doctor, add the widths in `scripts/images.py` and run `npm run images`.

## Medical & legal guardrails

- Κώδικας Ιατρικής Δεοντολογίας (Ν. 3418/2005, άρθρο 17): informational only; no promises, superlatives,
  comparisons, before/after photos or promotional language. Footer: «Οι πληροφορίες του ιστότοπου δεν
  αντικαθιστούν την ιατρική εξέταση.»
- No contact form (health data is special-category data under GDPR). Booking via doctoranytime and phone.
- No cookies, no analytics, self-hosted fonts. Google Maps loads **only after a click**.
- No `aggregateRating` markup and no copied patient reviews.
- The doctor may need to inform his Ιατρικός Σύλλογος about the website; he should confirm this himself.

## Launch checklist

1. **Doctor’s approval** of every text: bio, timeline order, service pages, FAQ answers, privacy policy (both languages).
2. Answer the open questions in `site.config.mjs` / content files until `npm run build:launch` passes.
3. **Domain** registered in the doctor’s name → set `siteUrl` in `site.config.mjs`.
4. Cloudflare Pages project → connect the repo → add the custom domain → set `SITE_LAUNCH=1` for Production.
5. Verify on a real phone: tap-to-call, booking link, «Εμφάνιση χάρτη», language switch.
6. **Google Search Console**: verify the domain, submit `https://<domain>/sitemap.xml`.
7. **Google Business Profile**: set the website link to the new domain, keep the doctoranytime booking link,
   and make sure name, address and phone match the site exactly.
8. Optionally add the GBP share link to `maps.profile` in `site.config.mjs` (used in JSON-LD `sameAs`).
