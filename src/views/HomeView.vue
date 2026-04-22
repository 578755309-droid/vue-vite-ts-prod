<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'

const pieChartEl = ref<HTMLDivElement | null>(null)
const barChartEl = ref<HTMLDivElement | null>(null)

let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

function handleResize() {
  pieChart?.resize()
  barChart?.resize()
}

const pieLegendItems = [
  { value: 2000, name: '有源手术器械', color: '#1b77d2', sub: '2000台（22%）' },
  { value: 1800, name: '无源手术器械', color: '#4fc3f7' },
  { value: 1200, name: '神经和心血管手术器械', color: '#7cb342' },
  { value: 1100, name: '骨科手术器械', color: '#a78bfa' },
  { value: 900, name: '放射治疗器械', color: '#ff9800' },
  { value: 700, name: '医用成像器械', color: '#26a69a' },
  { value: 800, name: '医用诊断和监护器械', color: '#43a047' },
  { value: 650, name: '呼吸、麻醉和急救器械', color: '#e91e63' },
  { value: 450, name: '物理治疗器械', color: '#8bc34a' },
  { value: 300, name: '输血、透析和体外循环器械', color: '#607d8b' },
]

type TaskRow = {
  title: string
  time: string | null
  desc: string | null
  badgeText: string
  badgeClass: string
}

const taskRows: TaskRow[] = [
  {
    title: '合同管理',
    time: '2022-10-23 12:45:30',
    desc: '日常保养计划0022日常保养计划0022日常保养计划0022日常保养计划0022...',
    badgeText: '终止待审核',
    badgeClass: 'med-task-badge--orange',
  },
  {
    title: 'YL23042016-2003575',
    time: null,
    desc: null,
    badgeText: '终止待审核',
    badgeClass: 'med-task-badge--orange',
  },
  {
    title: '临床监视',
    time: '2022-10-23 12:45:30',
    desc: null,
    badgeText: '待复核',
    badgeClass: 'med-task-badge--red',
  },
  {
    title: '合同管理',
    time: '2022-10-23 12:45:30',
    desc: 'YL23042016-2003575',
    badgeText: '终止待审核',
    badgeClass: 'med-task-badge--orange',
  },
  {
    title: '合同管理',
    time: '2022-10-23 12:45:30',
    desc: 'YL23042016-2003575',
    badgeText: '终止待审核',
    badgeClass: 'med-task-badge--orange',
  },
]

const taskTab = ref<string>('todo')
const taskSegmentOptions = [
  { label: '待办事项', value: 'todo' },
  { label: '我的提交', value: 'submitted' },
]

const businessType = ref<string>('')
const businessTypeOptions = [
  { label: '合同管理', value: 'contract' },
  { label: '临床监视', value: 'monitor' },
]

type RepairRow = {
  orderNo: string
  category: string
  repairDate: string
  emergencyText: string
  faultText: string
  faultClass: string
  assetText: string
  stateText: string
  stateClass: string
  teamText: string
}

const repairRows: RepairRow[] = [
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '非常紧急',
    faultText: '严重故障',
    faultClass: 'med-fault--critical',
    assetText: '飞利浦46叶C1',
    stateText: '待接单',
    stateClass: 'med-state--dispatch',
    teamText: '第一班组-张三',
  },
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '紧急',
    faultText: '重大故障',
    faultClass: 'med-fault--major',
    assetText: '飞利浦46叶C1',
    stateText: '特待派单',
    stateClass: 'med-state--dispatch',
    teamText: '第二班组-张三',
  },
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '非常紧急',
    faultText: '严重故障',
    faultClass: 'med-fault--critical',
    assetText: '飞利浦46叶C1',
    stateText: '待接单',
    stateClass: 'med-state--paused',
    teamText: '第三班组-张三',
  },
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '一般',
    faultText: '一般故障',
    faultClass: 'med-fault--normal',
    assetText: '飞利浦46叶C1',
    stateText: '待派单',
    stateClass: 'med-state--dispatch',
    teamText: '第一班组-张三',
  },
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '非常紧急',
    faultText: '一般故障',
    faultClass: 'med-fault--normal',
    assetText: '飞利浦46叶C1',
    stateText: '已暂停',
    stateClass: 'med-state--paused',
    teamText: '第二班组-张三',
  },
  {
    orderNo: '1601020101000025',
    category: '放射科',
    repairDate: '2022-10-20',
    emergencyText: '非常紧急',
    faultText: '严重故障',
    faultClass: 'med-fault--critical',
    assetText: '飞利浦46叶C1',
    stateText: '已完成',
    stateClass: 'med-state--done',
    teamText: '第三班组-张三',
  },
]

const repairTotal = ref<number>(40)
const repairPageSize = ref<number>(10)
const repairCurrentPage = ref<number>(1)
const repairTableMinWidth = 920 // 预留表头完整展示的最小宽度（不换行，放不下就横向滚动）

const calendarModel = ref<Date>(new Date())

function disposeCharts() {
  pieChart?.dispose()
  barChart?.dispose()
  pieChart = null
  barChart = null
}

onMounted(async () => {
  await nextTick()

  if (pieChartEl.value) {
    pieChart = echarts.init(pieChartEl.value)
    pieChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        confine: true, // 悬浮提示始终限制在图表容器内
      },
      // 图例改用 Vue 静态 DOM 渲染，避免 ECharts legend 无法做到“文字完全按设计图”
      legend: { show: false },
      series: [
        {
          name: '异常科室占比',
          type: 'pie',
          radius: ['38%', '62%'],
          // 让饼图在当前卡片内水平居中，并整体上移约 50 像素
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          label: { show: false },
          labelLine: { show: false },
          data: [
            { value: pieLegendItems[0].value, name: pieLegendItems[0].name },
            { value: pieLegendItems[1].value, name: pieLegendItems[1].name },
            { value: pieLegendItems[2].value, name: pieLegendItems[2].name },
            { value: pieLegendItems[3].value, name: pieLegendItems[3].name },
            { value: pieLegendItems[4].value, name: pieLegendItems[4].name },
            { value: pieLegendItems[5].value, name: pieLegendItems[5].name },
            { value: pieLegendItems[6].value, name: pieLegendItems[6].name },
            { value: pieLegendItems[7].value, name: pieLegendItems[7].name },
            { value: pieLegendItems[8].value, name: pieLegendItems[8].name },
            { value: pieLegendItems[9].value, name: pieLegendItems[9].name },
          ],
        },
      ],
      color: pieLegendItems.map(i => i.color),
    })
  }

  if (barChartEl.value) {
    barChart = echarts.init(barChartEl.value)
    barChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 14, top: 24, bottom: 10 },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: '#e6edf3' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 35,
        interval: 5,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#eef2f6' } },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      series: [
        {
          type: 'bar',
          barWidth: 14,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: '#1f6fa8',
          },
          data: [28, 24, 18, 12, 16, 10, 22],
        },
      ],
    })
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  disposeCharts()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="med-page-inner">
        <!-- 顶部“工作台”标签栏（截图中的 tab） -->
        <div class="med-tabbar">
          <div class="med-tab med-tab--active">
            <span class="med-tab-ico">⌂</span>
            工作台
            <span class="med-tab-close">×</span>
          </div>
        </div>

        <div class="med-grid">
          <!-- 第一行左：欢迎卡片 -->
          <section class="med-card med-card--welcome med-card--welcome-gap">
            <div class="med-welcome">
              <div class="med-avatar"></div>
              <div class="med-welcome-text">
               <!-- <div class="med-welcome-eyebrow">工作台总览</div>-->
                <div class="med-welcome-title">早安，超级管理员！</div>
                <div class="med-welcome-sub">开始您一天的工作吧！</div>
              </div>
              <button class="med-welcome-btn" type="button">消息提醒</button>
            </div>
          </section>

          <!-- 右侧：日历（跨两行，使用 Element Plus 封装） -->
          <section class="med-card med-card--calendar med-card--tall">
            <div class="med-calendar-head">
              <button class="med-cal-arrow" type="button">‹</button>
              <div class="med-cal-month">2023年03月</div>
              <button class="med-cal-arrow" type="button">›</button>
            </div>
            <el-calendar
              class="med-el-calendar"
              v-model="calendarModel"
            >
              <template #date-cell="{ data }">
                <div class="med-cal-cell">
                  <span class="med-cal-day">
                    {{ String(data.date.getDate()).padStart(2, '0') }}
                  </span>
                  <span
                    v-if="data.type === 'current-month' && data.date.getDay() === 5"
                    class="med-cal-tag"
                  >
                    待办 <span class="med-cal-tag-num">
                      {{ String(((data.date.getDate() * 7) % 90) + 10).padStart(2, '0') }}
                    </span>
                  </span>
                </div>
              </template>
            </el-calendar>
          </section>

          <!-- 第二行左：饼图卡片 -->
          <section class="med-card med-card--pie med-card--tall">
            <div class="med-card-head">
              <div class="med-card-head-left">
                <span class="med-card-head-icon med-card-head-icon--blue"></span>
                <span class="med-card-head-title">资产分类统计（资产总数：10000台）</span>
              </div>
            </div>
            <div class="med-card-body med-card-body--chart">
              <div class="med-pie-wrap">
                <div ref="pieChartEl" class="med-chart med-chart--pie" />
                <div class="med-pie-legend">
                  <div class="med-pie-legend-meta">
                    <div class="med-pie-legend-kicker">资产总数</div>
                    <div class="med-pie-legend-total">10000 台</div>
                  </div>
                  <div class="med-pie-legend-items">
                    <div
                      v-for="item in pieLegendItems"
                      :key="item.name"
                      class="med-pie-legend-item"
                    >
                      <span class="med-pie-legend-dot" :style="{ backgroundColor: item.color }" />
                      <span class="med-pie-legend-name">{{ item.name }}</span>
                      <span
                        v-if="item.sub"
                        class="med-pie-legend-callout"
                      >
                        {{ item.sub }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 第二行中：列表卡片（对应截图中间列表区域） -->
          <section class="med-card med-card--centerlist med-card--tall">
            <!-- 合并模块：分段条作为该卡片的顶部区域 -->
            <div class="med-center-tabs">
              <el-segmented
                v-model="taskTab"
                class="med-task-segmented"
                :options="taskSegmentOptions"
              />
            </div>
            <!-- 筛选行（参照图2） -->
            <div class="med-task-filters">
              <div class="med-task-filter">
                <span class="med-task-filter-label">业务类型</span>
                <el-dropdown
                  class="med-business-dd"
                  placement="bottom-start"
                  trigger="click"
                >
                  <button class="med-business-dd-trigger" type="button" aria-label="选择业务类型">
                    ▼
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu class="med-business-dd-menu">
                      <el-dropdown-item
                        v-for="opt in businessTypeOptions"
                        :key="opt.value"
                        @click="businessType = opt.value"
                      >
                        {{ opt.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="med-task-filter">
                <span class="med-task-filter-label">执行开始日期</span>
                <span class="med-task-filter-label med-task-filter-to">至</span>
                <span class="med-task-filter-label">执行结束日期</span>
              </div>
            </div>

            <el-table
              class="med-task-table"
              :data="taskRows"
              :show-header="false"
              :border="false"
            >
              <el-table-column width="auto">
                <template #default="{ row }">
                  <div class="med-task-row-left">
                    <div class="med-task-row-title">
                      <span class="med-task-bullet med-task-bullet--blue" />
                      <span class="med-task-row-title-main">{{ row.title }}</span>
                      <span class="med-task-row-title-time" v-if="row.time">{{ row.time }}</span>
                    </div>
                    <div class="med-task-row-desc" v-if="row.desc">{{ row.desc }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column width="140" align="right">
                <template #default="{ row }">
                  <div class="med-task-badge" :class="row.badgeClass">{{ row.badgeText }}</div>
                </template>
              </el-table-column>
            </el-table>
          </section>

          <!-- 第三行左：柱状图卡片 -->
          <section class="med-card med-card--bar">
            <div class="med-card-head">
              <div class="med-card-head-left">
                <span class="med-card-head-icon med-card-head-icon--teal"></span>
                <span class="med-card-head-title">近一周检验指数统计</span>
              </div>
            </div>
            <div class="med-card-body">
              <div ref="barChartEl" class="med-chart med-chart--bar" />
            </div>
          </section>

          <!-- 第三行中：表格卡片 -->
          <section class="med-card med-card--table">
            <div class="med-card-head">
              <div class="med-card-head-left">
                <span class="med-card-head-icon med-card-head-icon--teal"></span>
                <span class="med-card-head-title">报修工单</span>
              </div>
              <div class="med-card-head-right">
                <span class="med-muted">共 40 条</span>
              </div>
            </div>

            <div class="med-repair-table-wrap">
              <el-table
                class="med-repair-table"
                :data="repairRows"
                :style="{ minWidth: `${repairTableMinWidth}px` }"
                height="100%"
                :border="false"
              >
              <el-table-column label="工单编号" width="95" fixed="left">
                <template #default="{ row }">
                  <div class="med-link">{{ row.orderNo }}</div>
                </template>
              </el-table-column>

              <el-table-column label="报修类别" width="80">
                <template #default="{ row }">
                  <div>{{ row.category }}</div>
                </template>
              </el-table-column>

              <el-table-column label="报修时间" width="90">
                <template #default="{ row }">
                  <div>{{ row.repairDate }}</div>
                </template>
              </el-table-column>

              <el-table-column label="紧急程度" width="85">
                <template #default="{ row }">
                  <div>{{ row.emergencyText }}</div>
                </template>
              </el-table-column>

              <el-table-column label="故障等级" width="95">
                <template #default="{ row }">
                  <span class="med-fault" :class="row.faultClass">{{ row.faultText }}</span>
                </template>
              </el-table-column>

              <el-table-column label="报修资产" width="110">
                <template #default="{ row }">
                  <div>{{ row.assetText }}</div>
                </template>
              </el-table-column>

              <el-table-column label="处理状态" width="90">
                <template #default="{ row }">
                  <span class="med-state" :class="row.stateClass">{{ row.stateText }}</span>
                </template>
              </el-table-column>

              <el-table-column label="维修班组/维修" width="130">
                <template #default="{ row }">
                  <div class="med-state-person">{{ row.teamText }}</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="88" fixed="right">
                <template #default="{ row }">
                  <router-link class="med-link" :to="{ name: 'repair-order-detail', params: { id: row.orderNo } }">查看</router-link>
                </template>
              </el-table-column>
              </el-table>
            </div>

            <div class="med-pagination">
              <el-pagination
                class="med-repair-pagination"
                layout="prev, pager, next"
                :total="repairTotal"
                :page-size="repairPageSize"
                :current-page="repairCurrentPage"
                @current-change="repairCurrentPage = $event"
              />
            </div>
          </section>
        </div>
  </div>
</template>

