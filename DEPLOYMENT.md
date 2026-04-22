# Vue3 + Vite + TS（生产部署 Node 运行时）

本项目采用：
- Vite 产物：`dist/`
- Node 服务：`server/index.ts`（托管静态 + SPA 回退 + `/api` 反向代理）

## 1. 环境变量

复制并准备：

- `.env.production`（建议）

你至少需要设置：

1. 前端对接的 API 基地址（用于浏览器发请求）
   - `VITE_API_BASE_URL=/api`
2. Node 侧反向代理后端真实地址（用于服务端转发）
   - `API_PROXY_TARGET=http://your-backend:8080`
3. 是否剥离 `/api` 前缀
   - `API_PROXY_STRIP_PREFIX=true`（前端 `/api/users` -> 后端 `/users`）

同时可以保留健康检查路径：
- `VITE_API_HEALTH_PATH=/healthz`

## 2. 本地构建与启动

在项目目录执行：

```bash
npm run build:all
npm start
```

然后访问：
- 浏览器：`http://localhost:3000/`
- 健康检查：`http://localhost:3000/healthz`

如果你访问页面时看到了“API 状态：失败”，通常说明：
- 没配 `API_PROXY_TARGET`
- 或后端健康检查路径不是 `/healthz`

## 3. Docker 部署

构建镜像：

```bash
docker build -t vue-vite-ts-prod .
```

启动容器（示例）：

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e API_PROXY_TARGET=http://host.docker.internal:8080 \
  -e API_PROXY_STRIP_PREFIX=true \
  vue-vite-ts-prod
```

说明：
- 浏览器端请求仍会以 `/api/*` 发出
- Node 服务会将 `/api/*` 转发到 `API_PROXY_TARGET`

## 4. 生产平台部署建议

1. 建议把这个 Node 服务放在容器/进程里托管（具备可观测性与快速回滚能力）
2. 在网关/负载均衡层做健康检查：`/healthz`
3. 如果你已经有 Nginx，也可以把 SPA 托管交给 Nginx，把 `/api` 转发交给后端；此项目依然能用作“最小运行时参考”

