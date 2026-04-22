<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const assetNo = computed(() => String(route.params.assetNo || '2221838088'))

const summaryInfo = computed(() => ({
  name: '飞利浦MX 4000 双层螺旋CT',
  status: '在保',
  code: '设备编码：1601020101000025',
}))

const sectionTabs = ['基础信息', '合同发票', '相关文档', '质控记录', '使用记录', '动态监测', '效益分析']
const monitorCards = [
  { label: '液氨液位', value: '56%', tone: 'info' },
  { label: '球管温度', value: '72%', tone: 'warn' },
  { label: '线圈电流', value: '35%', tone: 'info' },
  { label: '冷却流量', value: '48%', tone: 'info' },
  { label: '重启次数', value: '03次', tone: 'neutral' },
]

const baseInfo = computed(() => [
  { label: '采购单编码', value: 'CG-2024-0918' },
  { label: '设备编码', value: assetNo.value },
  { label: '设备分类', value: '大型影像设备' },
  { label: '使用科室', value: '放射科' },
  { label: '存放位置', value: '3层-4号机房' },
  { label: '设备型号', value: 'MX4000-CT' },
  { label: '供应商', value: '飞利浦医疗系统' },
  { label: '负责人', value: '王主任' },
  { label: '启用日期', value: '2022-06-01' },
  { label: '保修截止', value: '2027-06-01' },
  { label: '原值', value: '5,800,000 元' },
  { label: '净值', value: '4,320,000 元' },
])

const lifeLogs = [
  { date: '2026-03-22', type: '巡检', content: '完成季度巡检，运行状态正常', user: '李工程师' },
  { date: '2026-02-13', type: '计量', content: '完成年度计量校准，结果合格', user: '王工程师' },
  { date: '2026-01-10', type: '维修', content: '更换球管冷却模块并完成验证', user: '张工程师' },
]

function goEdit() {
  ElMessage.success('修改成功')
  router.push({ name: 'asset-ledger-create', query: { mode: 'edit', assetNo: assetNo.value } })
}
</script>

<template>
  <div class="med-ledger-detail">
    <div class="med-tabbar">
      <div class="med-tab">
        <span class="med-tab-ico">⌂</span>
        资产台账
      </div>
      <div class="med-tab med-tab--active">
        <span class="med-tab-ico">▦</span>
        资产详情
      </div>
    </div>

    <section class="med-ledger-detail-shell figma-detail-page">
      <header class="med-ledger-summary figma-detail-header">
        <div class="med-ledger-summary-left">
          <div class="med-ledger-summary-cover" />
          <div>
            <div class="med-ledger-summary-title-row">
              <h2 class="med-ledger-detail-title">{{ summaryInfo.name }}</h2>
              <span class="med-ledger-insurance-tag">{{ summaryInfo.status }}</span>
            </div>
            <p class="med-ledger-detail-sub">{{ summaryInfo.code }}</p>
          </div>
        </div>
        <div class="med-ledger-detail-head-actions">
          <el-button size="small" @click="router.back()">返回列表</el-button>
          <el-button size="small" type="primary" @click="goEdit">编辑档案</el-button>
        </div>
      </header>

      <div class="med-ledger-section-tabs">
        <button
          v-for="(tab, idx) in sectionTabs"
          :key="tab"
          type="button"
          class="med-ledger-section-tab"
          :class="{ 'med-ledger-section-tab--active': idx === 0 }"
        >
          {{ tab }}
        </button>
      </div>

      <div class="med-ledger-detail-content figma-detail-base">
        <section class="med-ledger-info-block">
          <h3 class="med-ledger-block-title">动态监测总览</h3>
          <div class="med-monitor-grid">
            <div
              v-for="item in monitorCards"
              :key="item.label"
              class="med-monitor-card"
              :class="`med-monitor-card--${item.tone}`"
            >
              <div class="med-monitor-value">{{ item.value }}</div>
              <div class="med-monitor-label">{{ item.label }}</div>
            </div>
          </div>
        </section>

        <section class="med-ledger-info-block">
          <h3 class="med-ledger-block-title">基础信息</h3>
          <div class="med-ledger-detail-info">
            <div v-for="item in baseInfo" :key="item.label" class="med-ledger-detail-info-item">
              <span class="med-ledger-detail-info-label">{{ item.label }}：</span>
              <span class="med-ledger-detail-info-value">{{ item.value }}</span>
            </div>
          </div>
        </section>

        <section class="med-ledger-info-block figma-detail-stats">
          <h3 class="med-ledger-block-title">检定与运维</h3>
          <div class="med-ledger-detail-stats">
            <div class="med-ledger-detail-stat">
              <div class="med-ledger-detail-stat-label">上次检定</div>
              <div class="med-ledger-detail-stat-value">2026-02-13</div>
            </div>
            <div class="med-ledger-detail-stat">
              <div class="med-ledger-detail-stat-label">下次检定</div>
              <div class="med-ledger-detail-stat-value med-ledger-detail-stat-value--warn">2026-08-10</div>
            </div>
            <div class="med-ledger-detail-stat">
              <div class="med-ledger-detail-stat-label">累计维修次数</div>
              <div class="med-ledger-detail-stat-value">12</div>
            </div>
          </div>
        </section>
      </div>

      <section class="med-ledger-info-block figma-detail-log">
        <h3 class="med-ledger-block-title">生命周期记录</h3>
        <el-table :data="lifeLogs" stripe>
          <el-table-column prop="date" label="日期" width="140" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="content" label="内容" min-width="220" />
          <el-table-column prop="user" label="处理人" width="120" />
        </el-table>
      </section>
    </section>
  </div>
</template>

<style scoped>
.med-ledger-detail {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.med-ledger-detail-shell {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 2px;
  background: #eef1fb;
  padding: 16px;
}

.med-ledger-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 2px;
  background: #f9fafe;
}

.med-ledger-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.med-ledger-summary-cover {
  width: 120px;
  height: 90px;
  border-radius: 8px;
  background: linear-gradient(145deg, #e4e9f2, #f7f9fd);
  border: 1px solid #e2e8f0;
}

.med-ledger-summary-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.med-ledger-insurance-tag {
  height: 20px;
  padding: 0 6px;
  border-radius: 2px;
  background: #0589cb;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
}

.med-ledger-detail-title {
  margin: 0;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: #212121;
}

.med-ledger-detail-sub {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 22px;
  color: #333;
}

.med-ledger-detail-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.med-ledger-detail-head-actions :deep(.el-button--primary) {
  --el-button-bg-color: #1474a4;
  --el-button-border-color: #1474a4;
}

.med-ledger-section-tabs {
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid #e4e7fb;
  gap: 24px;
  padding: 0 8px;
}

.med-ledger-section-tab {
  height: 40px;
  padding: 13px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #666;
  font-size: 15px;
  cursor: default;
}

.med-ledger-section-tab--active {
  background: transparent;
  color: #0589cb;
  border-bottom: 1.5px solid #0589cb;
}

.med-ledger-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 24px;
  border-radius: 0 10px 10px 10px;
  background: #f9fafe;
  border: 1px solid #f1f4fd;
}

.med-ledger-info-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
}

.med-ledger-block-title {
  margin: 0;
  font-size: 15px;
  line-height: 21px;
  color: #2f2e3e;
  font-weight: 600;
  padding-left: 10px;
  position: relative;
}

.med-ledger-block-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 4px;
  height: 14px;
  border-radius: 1px;
  background: #1474a4;
}

.med-ledger-detail-card {
  border-color: #e2e8f0;
}

.med-ledger-detail-card-title {
  font-weight: 600;
  color: #0f172a;
}

.med-ledger-detail-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 48px;
}

.med-ledger-detail-info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.med-ledger-detail-info-label {
  color: #424242;
  font-size: 14px;
  line-height: 14px;
  flex-shrink: 0;
}

.med-ledger-detail-info-value {
  color: #212121;
  font-size: 14px;
  line-height: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.med-ledger-detail-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.med-ledger-detail-stat {
  border: none;
  border-radius: 8px;
  padding: 8px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #edf1f7;
}

.med-ledger-detail-stat-label {
  color: #424242;
  font-size: 14px;
}

.med-ledger-detail-stat-value {
  color: #212121;
  font-size: 18px;
  font-weight: 500;
  margin-top: 6px;
}

.med-ledger-detail-stat-value--warn {
  color: #ea580c;
}

.med-monitor-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.med-monitor-card {
  border-radius: 8px;
  background: #fff;
  padding: 8px;
  min-height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.med-monitor-card--info {
  box-shadow: inset 0 0 0 1px #e7eefb;
}

.med-monitor-card--warn {
  background: rgba(245, 63, 63, 0.1);
}

.med-monitor-card--neutral {
  background: rgba(140, 140, 140, 0.12);
}

.med-monitor-value {
  font-size: 18px;
  line-height: 25px;
  color: #0589cb;
}

.med-monitor-card--warn .med-monitor-value {
  color: #f53f3f;
}

.med-monitor-card--neutral .med-monitor-value {
  color: #8c8c8c;
}

.med-monitor-label {
  font-size: 14px;
  line-height: 20px;
  color: #1d4c84;
}
</style>
