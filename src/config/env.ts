// 只从 Vite 暴露给前端的环境变量中读取配置。
// 生产部署时请通过 `.env.production` 或运行时环境变量提供 VITE_* 配置。
export const env = {
  // 前端发起请求的统一 API 基地址。
  // 如果你使用 server 的 /api 反向代理，请将其设置为 `/api`（默认值）。
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api',

  // 后端健康检查路径（相对于 apiBaseUrl）
  apiHealthPath: (import.meta.env.VITE_API_HEALTH_PATH as string | undefined) ?? '/healthz',
}

