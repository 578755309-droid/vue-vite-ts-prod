# 资产台账详情页：Figma 快速还原流程

## 1) 拉取 Figma 文件（可选）

项目已内置脚本：

```bash
npm run figma:pull -- <file_key>
```

准备：

1. 在项目根目录创建/修改 `.env.figma`
2. 填写 `FIGMA_ACCESS_TOKEN=...`
3. 执行上面的命令（`file_key` 来自 Figma 链接）

拉取结果会写到 `figma-cache/*.json`，用于查颜色、字号、间距和图层命名。

## 2) 在 Figma 插件中复制样式

推荐插件：`Figma to Code`、`Copy CSS`（任选其一）。

建议优先复制：

- 颜色（Color styles）
- 字体（Typography）
- 间距和圆角（Spacing / Radius）
- 阴影（Effects）

## 3) 对应到页面骨架类名

详情页入口：

- 路由：`/asset-ledger/:assetNo`
- 文件：`src/views/AssetLedgerDetailView.vue`

已预留可直接映射的类名：

- 页面：`.figma-detail-page`
- 头部：`.figma-detail-header`
- 基础信息卡：`.figma-detail-base`
- 指标卡：`.figma-detail-stats`
- 记录卡：`.figma-detail-log`

你可以把插件复制的 CSS 直接粘到该文件的 `<style scoped>` 中，并优先覆盖以上类名。

## 4) 推荐粘贴顺序（减少返工）

1. 先贴布局（宽高、padding、gap、grid）
2. 再贴文字（font、line-height、color）
3. 最后贴细节（边框、圆角、阴影、状态色）

## 5) 联调建议

- 列表页点击“台账详情”可跳转详情页。
- 如果你给我 Figma 的节点链接（Frame/Section），我可以继续帮你把当前详情页做成更接近 1:1 的还原版。
