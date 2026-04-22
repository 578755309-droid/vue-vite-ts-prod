import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import path from 'node:path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import fs from 'node:fs'
import type { NextFunction, Request, Response } from 'express'

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(
  cors({
    // 同源部署一般无需 CORS；这里给一个宽松默认，避免联调时踩坑。
    // 如果你只做同源，可把这段配置收紧。
    origin: true,
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))

const port = Number(process.env.PORT ?? 3000)
const distDir = path.join(process.cwd(), 'dist')
const indexFile = path.join(distDir, 'index.html')

function isImmutableAsset(filePath: string): boolean {
  // Vite 的生产静态资源一般带 hash：例如 app.3f2a1b9c.js
  const name = path.basename(filePath)
  return /\.[0-9a-f]{8,}\./i.test(name)
}

// 健康检查（建议被负载均衡/监控探测）
app.get('/healthz', (_req: Request, res: Response) => {
  const pkgPath = path.join(process.cwd(), 'package.json')
  let version: string | undefined
  try {
    version = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version
  } catch {
    // ignore
  }
  res.json({ ok: true, time: new Date().toISOString(), version })
})

// API 反向代理：前端统一调用 /api/*，交给后端再分发到真实服务
const apiProxyTarget = process.env.API_PROXY_TARGET
const stripPrefix = (process.env.API_PROXY_STRIP_PREFIX ?? 'true') !== 'false'

if (apiProxyTarget) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiProxyTarget,
      changeOrigin: true,
      ws: true,
      secure: false,
      // stripPrefix=true 时：/api/users -> /users
      pathRewrite: stripPrefix ? { '^/api': '' } : undefined,
    }),
  )
} else {
  app.use('/api', (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'API proxy target not configured',
      hint: '请设置环境变量 API_PROXY_TARGET，例如：http://backend:8080',
    })
  })
}

// 托管静态资源（assets 走长缓存，其余走不缓存策略）
app.use(
  express.static(distDir, {
    index: false,
    setHeaders: (res: Response, filePath: string) => {
      if (isImmutableAsset(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      } else {
        res.setHeader('Cache-Control', 'no-cache')
      }
    },
  }),
)

// SPA 回退：history 模式下刷新任意路由都返回 index.html
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  const accept = req.headers.accept ?? ''
  if (!accept.includes('text/html')) return next()
  res.sendFile(indexFile)
})

// 非 HTML 请求的 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// 通用错误处理
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on http://localhost:${port}`)
})

