#!/usr/bin/env node
// Local preview server for dist/ that mimics Cloudflare Pages:
//   /akmi → akmi.html, /en/ → en/index.html, unknown URLs → nearest 404.html (status 404).
// Usage: npm run serve [-- --port 8080]
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const i = process.argv.indexOf('--port')
const PORT = i > -1 ? Number(process.argv[i + 1]) : 8080
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
}
const isFile = (p) => existsSync(p) && statSync(p).isFile()

function resolve(urlPath) {
  const p = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const base = join(DIST, p)
  if (p.endsWith('/') && isFile(join(base, 'index.html'))) return [200, join(base, 'index.html')]
  if (isFile(base) && !p.endsWith('.html')) return [200, base]
  if (isFile(base + '.html')) return [200, base + '.html']
  // nearest 404.html walking up
  let dir = dirname(p.endsWith('/') ? p + 'x' : p)
  while (true) {
    const f = join(DIST, dir, '404.html')
    if (isFile(f)) return [404, f]
    if (dir === '/' || dir === '.') break
    dir = dirname(dir)
  }
  return [404, join(DIST, '404.html')]
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/en') return res.writeHead(308, { Location: '/en/' }).end()
  const [status, file] = resolve(url.pathname)
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(PORT, () => console.log(`Serving dist/ on http://localhost:${PORT}`))
