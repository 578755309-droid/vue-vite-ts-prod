# Vue3 + Vite + TypeScript（生产可部署模板）

该项目在 Vite 默认模板基础上加入了“生产运行层”（Node/Express）以实现：
- 静态托管 `dist/`
- SPA history 模式回退到 `index.html`
- `/api/*` 反向代理（对接生产后端）

## 本地开发

```bash
npm run dev
```

## 生产构建 + 启动

```bash
npm run build:all
npm start
```

浏览器访问：
- `http://localhost:3000/`
- `http://localhost:3000/healthz`

## 环境变量

参见：
- `.env.example`
- `.env.production.example`
- `DEPLOYMENT.md`

如需反向代理后端请配置：
- `API_PROXY_TARGET`
- `API_PROXY_STRIP_PREFIX`
