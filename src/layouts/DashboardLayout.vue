<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const current = computed(() => String(route.name ?? ''))
const inAsset = computed(() => ['asset-ledger','asset-ledger-detail','asset-ledger-create','repair-order-detail'].includes(current.value))
const messageOpen = ref(false)
const hiddenToastIds = ref<string[]>([])
const messages = [
  { id:'1', category:'计量管理', title:'2022年保养计划', date:'2022-10-31', desc:'您有新的保养任务待确认，请及时查看并安排执行。', unread:true },
  { id:'2', category:'性能检测', title:'证书到期提醒', date:'2022-10-31', desc:'部分设备检测证书即将到期，请提前安排复检或换证流程。', unread:true },
  { id:'3', category:'风险评估', title:'2022年保养计划', date:'2022-10-30', desc:'风险评估报告已生成，点击查看详情并完成整改反馈。', unread:false },
] as const
const toasts = [
  { id:'toast-a', category:'计量', time:'2022-10-31 13:15:15', body:'您有一条新消息，请及时处理！' },
  { id:'toast-b', category:'计量', time:'2022-10-31 13:15:15', body:'您有一条新消息，请及时处理！' },
] as const
function dismissToast(id:string){ if (hiddenToastIds.value.includes(id)) return; hiddenToastIds.value = [...hiddenToastIds.value, id] }
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <div class="title">上海市智慧医院闵行分院智慧医疗管理系统</div>
      <div class="actions">
        <button class="icon-btn" type="button" @click="messageOpen = !messageOpen">铃</button>
        <button class="icon-btn" type="button">屏</button>
        <button class="icon-btn" type="button">设</button>
        <div class="user"><span class="avatar">R</span><span>Roder</span></div>
      </div>
    </header>

    <Teleport to="body">
      <div v-show="messageOpen" class="msg-layer">
        <div class="msg-overlay" @click="messageOpen = false" />
        <div class="msg-panel">
          <div class="msg-head"><div class="msg-title">消息通知</div><div class="msg-actions"><button class="msg-action">清空已读</button><button class="msg-action">全部已读</button></div></div>
          <ul class="msg-list">
            <li v-for="(item, index) in messages" :key="item.id" class="msg-item" :class="{ active:index === 0 }">
              <div class="msg-ico">{{ item.category.slice(0,1) }}</div>
              <div class="msg-body"><p class="msg-cat">{{ item.category }}</p><div class="msg-title-row"><span class="msg-item-title">{{ item.title }}<span v-if="item.unread" class="msg-dot" /></span><time class="msg-date">{{ item.date }}</time></div><p class="msg-desc">{{ item.desc }}</p></div>
            </li>
          </ul>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div class="toast-stack">
        <div v-for="t in toasts.filter(x => !hiddenToastIds.includes(x.id))" :key="t.id" class="toast" @click="dismissToast(t.id)">
          <span class="toast-close">✕</span>
          <div class="toast-head"><span class="toast-cat">{{ t.category }}</span><time class="toast-time">{{ t.time }}</time></div>
          <p class="toast-body">{{ t.body }}</p>
        </div>
      </div>
    </Teleport>

    <div class="body">
      <aside class="sidebar">
        <nav class="nav">
          <RouterLink :to="{ name: 'home' }" class="nav-item" :class="{ active: current === 'home' }">工作台</RouterLink>
          <div class="nav-group">
            <div class="nav-item nav-item--group" :class="{ active: inAsset }">设备管理</div>
            <RouterLink :to="{ name: 'asset-ledger' }" class="sub-item" :class="{ active: inAsset }">设备台账</RouterLink>
          </div>
          <RouterLink :to="{ name: 'operation-log' }" class="nav-item" :class="{ active: current === 'operation-log' }">操作日志</RouterLink>
        </nav>
      </aside>

      <main class="main">
        <div class="outlet">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout{height:100vh;overflow:hidden;background:#edf2fb;color:#333;font-family:'PingFang SC','Microsoft YaHei',sans-serif}.topbar{position:fixed;top:0;left:0;right:0;z-index:20;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px 0 20px;background:linear-gradient(90deg,#0a5da8 0%,#1587c7 48%,#0a5da8 100%);box-shadow:0 2px 12px rgba(0,48,99,.14)}.title{font-size:24px;line-height:32px;font-weight:700;color:#fff}.actions{display:flex;align-items:center;gap:12px}.icon-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0;border-radius:18px;background:rgba(255,255,255,.12);color:#fff;cursor:pointer}.user{display:flex;align-items:center;gap:10px;margin-left:8px;color:#fff}.avatar{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.2);font-weight:700}.msg-layer{position:fixed;inset:0;z-index:60}.msg-overlay{position:absolute;inset:0;background:rgba(14,29,52,.12)}.msg-panel{position:absolute;top:72px;right:24px;width:520px;background:#fff;border-radius:14px;box-shadow:0 18px 40px rgba(0,41,87,.18);overflow:hidden}.msg-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid #e8edf5}.msg-title{font-size:15px;font-weight:600;color:#0b75b9}.msg-actions{display:flex;gap:10px}.msg-action{height:30px;padding:0 10px;border:1px solid #dbe5f0;background:#fff;border-radius:8px;color:#46607a}.msg-list{list-style:none;margin:0;padding:6px 0;max-height:420px;overflow:auto}.msg-item{display:flex;gap:14px;padding:14px 18px}.msg-item.active{background:#f6fbff}.msg-ico{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:12px;background:linear-gradient(180deg,#57bfff,#1787d7);font-size:15px;font-weight:700;color:#fff}.msg-body{flex:1}.msg-cat{font-size:12px;line-height:18px;color:#7b8798}.msg-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:2px}.msg-item-title{display:flex;align-items:center;gap:6px;font-size:15px;line-height:22px;color:#22324a;font-weight:600}.msg-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff5d5d}.msg-date{font-size:12px;color:#8b96a7;white-space:nowrap}.msg-desc{margin-top:6px;font-size:13px;line-height:20px;color:#66778f}.toast-stack{position:fixed;top:88px;right:28px;z-index:55;display:flex;flex-direction:column;gap:12px}.toast{position:relative;width:320px;padding:14px 16px;border-radius:14px;background:linear-gradient(180deg,#eef8ff 0%,#fff 100%);box-shadow:0 14px 30px rgba(8,60,107,.16);cursor:pointer}.toast-close{position:absolute;top:10px;right:12px;font-size:13px;color:#7d8da2}.toast-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.toast-cat{font-size:14px;font-weight:700;color:#15466b}.toast-time{font-size:12px;color:#8392a6}.toast-body{margin-top:4px;font-size:13px;line-height:20px;color:#4b5d72}.body{display:flex;height:100vh;padding-top:64px;box-sizing:border-box}.sidebar{position:fixed;top:64px;left:0;bottom:0;width:240px;overflow:auto;background:#f9fafe;border-right:1px solid #edf1f8}.nav{display:flex;flex-direction:column;padding-top:8px}.nav-item,.sub-item{display:flex;align-items:center;height:40px;padding:0 28px;text-decoration:none;color:#333;font-size:14px;font-weight:600}.nav-item.active,.sub-item.active{color:#0589cb}.nav-item--group{cursor:default}.nav-group{display:flex;flex-direction:column}.sub-item{height:36px;padding-left:52px;font-weight:500}.sub-item.active{background:linear-gradient(92deg,#00c5e8 0%,#0589cb 100%);color:#fff;border-radius:8px;margin:0 18px 0 18px;padding-left:34px}.main{margin-left:240px;flex:1;min-width:0;height:calc(100vh - 64px);overflow:auto;padding:16px;box-sizing:border-box}.outlet{display:flex;flex-direction:column;gap:16px;box-sizing:border-box;flex:1;min-height:0;height:100%}
</style>
