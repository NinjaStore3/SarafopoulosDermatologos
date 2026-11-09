#!/usr/bin/env node
// Screenshots for review + layout checks. Builds nothing: run `npm run build` first.
//  - full-page + thumbnail WebP at 1440 and 390 for every page → screenshots/
//  - checks for horizontal scroll at 360, 390, 768, 1024, 1440, 1920
// Usage: npm run shots [-- --only el-home,en-home] [--scale 2]
import { createRequire } from 'node:module'
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const { chromium } = createRequire(import.meta.url)('playwright')
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'screenshots')
const PORT = 8765
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null }
const only = arg('--only')?.split(',')
const scale = Number(arg('--scale') || 1)

const pages = {
  'el-home': '/', 'el-akmi': '/akmi', 'el-kondylomata': '/kondylomata-hpv', 'el-spiloi': '/elegxos-spilon',
  'el-aisthitiki': '/aisthitiki', 'el-dermatoxeirourgiki': '/dermatoxeirourgiki', 'el-aporrito': '/politiki-aporritou',
  'el-404': '/den-yparxei', 'en-home': '/en/', 'en-acne': '/en/acne', 'en-moles': '/en/mole-check', 'en-privacy': '/en/privacy-policy',
}
const widths = [360, 390, 768, 1024, 1440, 1920]

mkdirSync(OUT, { recursive: true })
const server = spawn('node', [join(ROOT, 'scripts/serve.mjs'), '--port', String(PORT)], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 600))
const browser = await chromium.launch()
const problems = []
try {
  for (const [name, path] of Object.entries(pages)) {
    if (only && !only.includes(name)) continue
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: [390, 1440].includes(w) ? scale : 1 })
      const page = await ctx.newPage()
      page.on('console', (m) => m.type() === 'error' && !(name.endsWith('404') && m.text().includes('404')) && problems.push(`${name}@${w}: console error: ${m.text()}`))
      page.on('pageerror', (e) => problems.push(`${name}@${w}: ${e.message}`))
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      // Trigger lazy-loaded images before full-page capture (scroll like a user).
      if (w === 390 || w === 1440) {
        const h = await page.evaluate(() => document.body.scrollHeight)
        for (let y = 0; y < h; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(30) }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(250)
      }
      const overflow = await page.evaluate(() => {
        const d = document.documentElement
        if (d.scrollWidth <= d.clientWidth) return null
        const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > d.clientWidth + 1)
          .slice(0, 3).map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''))
        return `${d.scrollWidth}px > ${d.clientWidth}px (${wide.join(', ')})`
      })
      if (overflow) problems.push(`${name}@${w}: horizontal scroll ${overflow}`)
      if (w === 390 || w === 1440) {
        const png = join(OUT, `${name}-${w}.png`)
        await page.screenshot({ path: png, fullPage: true })
        execFileSync('python3', ['-I', '-c', `
from PIL import Image
im=Image.open(${JSON.stringify(png)}).convert('RGB')
im.save(${JSON.stringify(png.replace('.png', '.webp'))},'WEBP',quality=80)
t=im.crop((0,0,im.width,min(im.height,int(im.width*(1.6 if ${w}<800 else 0.75)))))
t.thumbnail((720,720)); t.save(${JSON.stringify(png.replace('.png', '-thumb.webp'))},'WEBP',quality=80)`])
        rmSync(png)
      }
      await ctx.close()
    }
  }
} finally {
  await browser.close()
  server.kill()
}
console.log(problems.length ? `Problems:\n  ${problems.join('\n  ')}` : 'No horizontal scroll, no console errors.')
console.log(`Screenshots in ${OUT}`)
