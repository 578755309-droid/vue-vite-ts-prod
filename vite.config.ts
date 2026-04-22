import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'

  return {
    base: '/b-end-medical-manager/',
    plugins: [vue()],
    server: {
      proxy: {
        // 开发环境：将 /api 转发到后端，避免 CORS 并方便本地联调
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
          // 后端通常不以 /api 为前缀；如你的后端确实带 /api，可在服务端/后端侧调整
          // 这里保守起见：先不改路径。线上由 server/index.ts 支持 stripPrefix 开关。
        },
      },
    },
    build: {
      // 生产默认不生成 source map（减少体积与源码暴露面）
      sourcemap: false,
      // 适当提高警告阈值，避免小项目误报
      chunkSizeWarningLimit: 1500,
    },
  }
})
