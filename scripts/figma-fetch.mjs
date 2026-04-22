/**
 * 使用 Figma REST API 拉取文件结构（需个人访问令牌）。
 * @see https://www.figma.com/developers/api#get-files-endpoint
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

function loadDotEnv(relPath) {
  const p = join(projectRoot, relPath)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = val
  }
}

loadDotEnv('.env.figma')

const token = process.env.FIGMA_ACCESS_TOKEN
const fileKey = process.argv[2] || process.env.FIGMA_FILE_KEY

if (!token) {
  console.error(
    '缺少 FIGMA_ACCESS_TOKEN。请在 Figma → Settings → Security → Personal access tokens 创建令牌，\n' +
      '并写入项目根目录的 .env.figma（可参考 .env.figma.example）。',
  )
  process.exit(1)
}

if (!fileKey) {
  console.error(
    '用法: npm run figma:pull -- <file_key>\n' +
      'file_key 取自设计链接: https://www.figma.com/design/<file_key>/...\n' +
      '或在 .env.figma 中设置 FIGMA_FILE_KEY。',
  )
  process.exit(1)
}

const url = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}`
const res = await fetch(url, {
  headers: { 'X-Figma-Token': token },
})

if (!res.ok) {
  const text = await res.text()
  console.error(`Figma API ${res.status}: ${text}`)
  process.exit(1)
}

const data = await res.json()
const outDir = join(projectRoot, 'figma-cache')
mkdirSync(outDir, { recursive: true })
const safeName = `${fileKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`
const outPath = join(outDir, safeName)
writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8')

console.log('已写入:', outPath)
console.log('文档名:', data.name || '(无)')
console.log('最后修改:', data.lastModified || '(无)')
