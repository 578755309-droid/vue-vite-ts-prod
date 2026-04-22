import { env } from '../config/env'

function joinUrl(base: string, path: string): string {
  const a = base.endsWith('/') ? base.slice(0, -1) : base
  const b = path.startsWith('/') ? path.slice(1) : path
  return `${a}/${b}`
}

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = joinUrl(env.apiBaseUrl, path)

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (!res.ok) {
    let body: unknown = undefined
    try {
      body = await res.json()
    } catch {
      // ignore: 非 JSON 响应
    }
    throw new ApiError(`API 请求失败: ${res.status}`, res.status, body)
  }

  // 允许后端返回空 body
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' })
}

export function apiHealth(): Promise<unknown> {
  return apiGet(env.apiHealthPath)
}

