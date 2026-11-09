// Progressive enhancement only: the site works without JavaScript
// (the map then simply stays a photo with a directions link).
;(() => {
  // ── Mobile menu ──────────────────────────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle')
  const nav = document.getElementById('site-nav')
  if (toggle && nav) {
    const label = toggle.querySelector('.nav-toggle-text')
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true'
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open))
      label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen
      document.body.classList.toggle('nav-open', open)
    }
    toggle.addEventListener('click', () => setOpen(!isOpen()))
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false)
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false)
        toggle.focus()
      }
    })
    document.addEventListener('click', (e) => {
      if (isOpen() && !e.target.closest('.site-header')) setOpen(false)
    })
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (m) => {
      if (m.matches) setOpen(false)
    })
  }

  // ── Click-to-load Google map (no request to Google before consent) ──────
  for (const frame of document.querySelectorAll('.map-frame')) {
    const button = frame.querySelector('.map-load')
    if (!button) continue
    button.addEventListener('click', () => {
      const iframe = document.createElement('iframe')
      iframe.src = frame.dataset.mapSrc
      iframe.title = frame.dataset.mapTitle
      iframe.referrerPolicy = 'strict-origin-when-cross-origin'
      iframe.allowFullscreen = true
      frame.replaceChildren(iframe)
      frame.classList.add('is-loaded')
      frame.setAttribute('tabindex', '-1')
      frame.focus({ preventScroll: true })
    })
  }
})()
