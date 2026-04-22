<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const processSteps = [
  { title: '报修提交', desc: '2023-08-18 09:12', done: true },
  { title: '工程师接单', desc: '2023-08-18 09:30', done: true },
  { title: '维修处理', desc: '2023-08-18 11:25', done: true },
  { title: '结果验收', desc: '2023-08-18 15:40', active: true },
]

const workOrderInfo = [
  ['工单编号', 'WX20230818001'], ['设备名称', '飞利浦 16 排 CT'], ['设备编码', '1601020101000025'], ['使用科室', '放射科'],
  ['报修时间', '2023-08-18 09:12:23'], ['故障等级', '严重故障'], ['报修人', '张三'], ['联系电话', '13800138000'],
]

const repairInfo = [
  ['接单工程师', '李工程师'], ['接单时间', '2023-08-18 09:30:20'], ['维修班组', '第一班组'],
  ['到场时间', '2023-08-18 10:05:16'], ['完成时间', '2023-08-18 11:25:47'], ['维修状态', '完全维修'],
]

const usedParts = [
  ['高压发生器模块', 'PH-CT-AX12', '1', '件', '¥12,000', '库存'],
  ['冷却风扇', 'FAN-8802', '2', '个', '¥360', '采购'],
]

const timeline = [
  ['验收人：王主任（放射科）', '2023-08-18 15:40:01', '验收完成', '评分：7分，设备恢复正常使用。'],
  ['维修人：李工程师（医学工程科）', '2023-08-18 11:25:47', '维修完工', '已更换高压发生器模块并完成通电测试。'],
  ['接单人：李工程师（医学工程科）', '2023-08-18 09:30:20', '工程师接单', '已确认故障现象，准备到场。'],
  ['报修人：张三（放射科）', '2023-08-18 09:12:23', '发起报修', '扫描成像中断，设备无法继续工作。'],
]
</script>

<template>
  <div class="repair-page">
    <div class="med-tabbar">
      <div class="med-tab"><span class="med-tab-ico">⌂</span>资产台账</div>
      <div class="med-tab"><span class="med-tab-ico">▦</span>资产详情</div>
      <div class="med-tab med-tab--active"><span class="med-tab-ico">🛠</span>维修工单</div>
    </div>

    <section class="repair-shell">
      <section class="repair-card repair-progress-card">
        <div class="repair-badge"><span class="repair-badge-dot" />已完成</div>
        <div class="repair-steps">
          <div v-for="step in processSteps" :key="step.title" class="repair-step">
            <div class="repair-step-top">
              <div class="repair-step-icon" :class="{ filled: step.done || step.active }" />
              <div class="repair-step-line" />
            </div>
            <div class="repair-step-title">{{ step.title }}</div>
            <div class="repair-step-desc">{{ step.desc }}</div>
          </div>
          <button class="repair-soft-btn" type="button">导出流程</button>
        </div>
      </section>

      <section class="repair-card repair-timeline-card">
        <div v-for="(item, idx) in timeline" :key="item[2]" class="repair-timeline-item">
          <div class="repair-node" :class="{ done: idx < 3 }"><span /></div>
          <div class="repair-timeline-main">
            <div class="repair-timeline-meta">{{ item[0] }} {{ item[1] }}</div>
            <div class="repair-timeline-box">
              <div>
                <div class="repair-timeline-title">{{ item[2] }}</div>
                <div class="repair-timeline-note">{{ item[3] }}</div>
              </div>
              <button v-if="idx === 1" class="repair-mini-btn" type="button">收起选填</button>
            </div>
          </div>
        </div>
      </section>

      <section class="repair-card">
        <div class="repair-title">工单信息</div>
        <div class="repair-info-grid">
          <div v-for="item in workOrderInfo" :key="item[0]" class="repair-info-item"><span class="repair-label">{{ item[0] }}：</span><span>{{ item[1] }}</span></div>
          <div class="repair-info-item"><span class="repair-label">紧急程度：</span><span class="repair-tag repair-tag--danger">非常紧急</span></div>
        </div>
        <div class="repair-section">
          <div class="repair-subtitle">现场照片</div>
          <div class="repair-photo-row"><div v-for="n in 7" :key="n" class="repair-photo">现场照片</div></div>
        </div>
        <div class="repair-section">
          <div class="repair-subtitle">报修描述</div>
          <div class="repair-text">设备于上午检查过程中突然报错停机，控制台提示高压模块异常，扫描流程中断，需尽快安排工程师处理。</div>
        </div>
      </section>

      <section class="repair-card">
        <div class="repair-title">维修信息</div>
        <div class="repair-info-grid repair-info-grid--3">
          <div v-for="item in repairInfo" :key="item[0]" class="repair-info-item">
            <span class="repair-label">{{ item[0] }}：</span>
            <span v-if="item[0] === '维修状态'" class="repair-tag repair-tag--success">{{ item[1] }}</span>
            <span v-else>{{ item[1] }}</span>
          </div>
        </div>
        <div class="repair-section">
          <div class="repair-subtitle">更换配件</div>
          <div class="repair-table-wrap">
            <table class="repair-table">
              <thead><tr><th>配件名称</th><th>规格型号</th><th>数量</th><th>单位</th><th>单价</th><th>来源</th></tr></thead>
              <tbody><tr v-for="part in usedParts" :key="part[0]"><td v-for="cell in part" :key="cell">{{ cell }}</td></tr></tbody>
            </table>
          </div>
        </div>
        <div class="repair-section">
          <div class="repair-subtitle">相关照片</div>
          <div class="repair-photo-row"><div v-for="n in 7" :key="`r-${n}`" class="repair-photo repair-photo--repair">维修照片</div></div>
        </div>
        <div class="repair-section">
          <div class="repair-subtitle">维修结论</div>
          <div class="repair-text">已完成高压发生器模块更换，重新上电后系统自检通过，试扫图像清晰，无异常报警，设备恢复正常。</div>
        </div>
      </section>

      <section class="repair-card">
        <div class="repair-title">结果验收</div>
        <div class="repair-info-grid">
          <div class="repair-info-item"><span class="repair-label">验收结果：</span><span class="repair-accept"><i />通过</span></div>
          <div class="repair-info-item"><span class="repair-label">评分：</span><span class="repair-score">7分</span></div>
        </div>
        <div class="repair-section compact">
          <div class="repair-subtitle">验收意见</div>
          <div class="repair-text">维修后设备功能恢复，满足科室使用要求，同意验收通过；建议后续一周内持续观察设备运行稳定性。</div>
        </div>
      </section>
    </section>

    <div class="repair-footer">
      <div class="repair-footer-inner">
        <button class="repair-footer-btn repair-footer-btn--ghost" type="button" @click="router.back()">返回</button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.repair-page{display:flex;flex:1;min-height:0;flex-direction:column}.repair-shell{display:flex;flex-direction:column;gap:16px;padding:0 24px 24px;background:#eef1fb}.repair-card{background:#f9fafe;border-radius:10px;padding:24px}.repair-progress-card{display:flex;gap:24px;align-items:flex-start}.repair-badge{display:flex;align-items:center;gap:8px;height:32px;padding:0 18px;border-radius:999px;background:#00b42a;color:#fff;font-size:16px}.repair-badge-dot{width:10px;height:10px;border-radius:50%;background:#fff}.repair-steps{display:flex;align-items:flex-start;gap:18px;flex:1;overflow:auto}.repair-step{min-width:150px;text-align:center}.repair-step-top{display:flex;align-items:center}.repair-step-icon{width:44px;height:44px;border-radius:50%;border:2px solid #0589cb;background:#fff;flex:none}.repair-step-icon.filled{background:#0589cb}.repair-step-line{flex:1;height:1px;border-top:1px dashed #0589cb;margin-left:10px}.repair-step:last-child .repair-step-line{display:none}.repair-step-title,.repair-step-desc{color:#0589cb}.repair-step-title{margin-top:8px;font-size:16px;font-weight:500}.repair-step-desc{margin-top:3px;font-size:14px}.repair-soft-btn,.repair-mini-btn{border:0;background:rgba(5,137,203,.15);color:#1c2d66}.repair-soft-btn{height:32px;padding:0 16px;border-radius:8px}.repair-timeline-card{background:#fff}.repair-timeline-item{display:flex;gap:12px;padding:10px 0}.repair-node{position:relative;width:24px;flex:none}.repair-node::after{content:'';position:absolute;left:11px;top:24px;bottom:-10px;width:2px;background:#e8eaec}.repair-timeline-item:last-child .repair-node::after{display:none}.repair-node span{display:block;width:12px;height:12px;margin:4px 0 0 6px;border-radius:50%;border:2px solid #0589cb;background:#fff}.repair-node.done span{background:#00b42a;border-color:#00b42a}.repair-timeline-main{flex:1}.repair-timeline-meta{font-size:12px;line-height:22px;color:#8c8c8c}.repair-timeline-box{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:12px 16px 12px 8px;background:rgba(243,245,251,.8);border-radius:2px}.repair-timeline-title{font-size:14px;line-height:20px;font-weight:600;color:#0589cb}.repair-timeline-note{margin-top:4px;font-size:14px;line-height:22px;color:#606266}.repair-mini-btn{height:24px;padding:0 10px;border-radius:2px}.repair-title,.repair-subtitle{position:relative;padding-left:10px;font-size:15px;font-weight:600;line-height:21px;color:#2f2e3e}.repair-title::before,.repair-subtitle::before{content:'';position:absolute;left:0;top:3px;width:4px;height:14px;border-radius:1px;background:#1474a4}.repair-info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 48px;margin-top:24px}.repair-info-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}.repair-info-item{display:flex;gap:8px;align-items:flex-start}.repair-label{min-width:84px;text-align:right;color:#424242}.repair-section{display:flex;flex-direction:column;gap:16px;margin-top:24px}.repair-section.compact{margin-top:20px}.repair-tag{display:inline-flex;align-items:center;justify-content:center;padding:0 8px;min-height:20px;border-radius:2px}.repair-tag--danger{background:#ff4d4f;color:#fff}.repair-tag--success{color:#52c41a;border:1px solid #52c41a;background:#fff}.repair-photo-row{display:flex;gap:24px;overflow:auto}.repair-photo{display:flex;align-items:center;justify-content:center;flex:none;width:100px;height:132px;border-radius:4px;background:linear-gradient(160deg,#dbe7f7,#f4f7fd);color:#5a6b85;font-size:12px}.repair-photo--repair{background:linear-gradient(160deg,#d7eef9,#f5fbff)}.repair-text{padding:10px;background:#fff;border-radius:4px;line-height:20px;color:#2f2e3e}.repair-table-wrap{overflow:auto;border:1px solid #e8eaec;border-radius:10px}.repair-table{width:100%;min-width:760px;border-collapse:collapse;background:#fff}.repair-table th,.repair-table td{padding:10px 14px;border-right:1px solid #e8eaec;border-bottom:1px solid #e8eaec;text-align:left}.repair-table th:last-child,.repair-table td:last-child{border-right:0}.repair-table th{background:#f3f5fb;color:#2f2e3e}.repair-accept{display:flex;align-items:center;gap:4px;color:#52c41a;font-weight:600}.repair-accept i{width:10px;height:10px;border-radius:50%;background:#52c41a}.repair-score{color:#fa8c2b;font-weight:600}.repair-footer{position:sticky;bottom:0;z-index:8;margin-top:auto;padding:0 24px 24px;background:linear-gradient(180deg,rgba(238,241,251,0) 0%,#eef1fb 42%,#eef1fb 100%)}.repair-footer-inner{display:flex;justify-content:flex-end;align-items:center;gap:16px;width:100%;height:56px;padding:0 24px;box-sizing:border-box;border-radius:0 0 4px 4px;background:#fff;box-shadow:0 0 12px 3px rgba(0,0,0,.1)}.repair-footer-btn{display:inline-flex;align-items:center;justify-content:center;min-width:88px;height:32px;padding:0 26px;border-radius:2px;font-size:14px;line-height:22px;cursor:pointer;box-sizing:border-box}.repair-footer-btn--ghost{border:1px solid #dcdfe6;background:#fff;color:#595a60}.repair-footer-btn--primary{border:0;background:#1474a4;color:#fff}@media (max-width:1200px){.repair-info-grid--3{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:900px){.repair-shell{padding:0 12px 12px}.repair-progress-card{flex-direction:column}.repair-info-grid,.repair-info-grid--3{grid-template-columns:1fr}.repair-footer{padding:0 12px 12px}.repair-footer-inner{padding:0 12px;gap:10px}.repair-footer-btn{min-width:0;flex:1}}
</style>
