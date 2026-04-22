<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface LogRow {
  id: string
  userName: string
  deviceCode: string
  commonName: string
  manageDept: string
  dept: string
  module: string
  action: string
  result: string
  content: string
  time: string
}

const router = useRouter()
const selectedIds = ref<string[]>([])
const detailOpen = ref(false)
const activeRow = ref<LogRow | null>(null)
const rows: LogRow[] = [
  { id: '1', userName: '张三', deviceCode: '1601020101000025', commonName: '飞利浦 16 排 CT', manageDept: '设备科', dept: '放射科', module: '资产台账', action: '新增', result: '成功', content: '新增设备台账信息', time: '2026-04-14 09:12:21' },
  { id: '2', userName: '李四', deviceCode: '1601020101000026', commonName: 'GE DR 摄影系统', manageDept: '设备科', dept: '影像中心', module: '操作日志', action: '导出', result: '成功', content: '导出操作日志列表', time: '2026-04-14 10:25:43' },
  { id: '3', userName: '王五', deviceCode: '1601020101000031', commonName: '迈瑞监护仪', manageDept: '医学工程部', dept: 'ICU', module: '维修工单', action: '删除', result: '失败', content: '删除维修记录失败：数据已锁定', time: '2026-04-14 11:08:09' },
  { id: '4', userName: '赵六', deviceCode: '1601020101000048', commonName: '呼吸机', manageDept: '设备科', dept: '重症医学科', module: '资产台账', action: '编辑', result: '成功', content: '修改资产所属科室', time: '2026-04-14 13:46:55' },
  { id: '5', userName: '钱七', deviceCode: '1601020101000062', commonName: '除颤监护仪', manageDept: '医学工程部', dept: '急诊科', module: '系统管理', action: '启用', result: '失败', content: '启用设备编码规则失败', time: '2026-04-14 15:02:18' },
] as const

const allChecked = computed(() => rows.length > 0 && selectedIds.value.length === rows.length)
const indeterminate = computed(() => selectedIds.value.length > 0 && selectedIds.value.length < rows.length)

function toggleAll() {
  selectedIds.value = allChecked.value ? [] : rows.map((row) => row.id)
}

function exportLogs() {
  window.alert('已触发导出')
}

function openDetail(row: LogRow) {
  activeRow.value = row
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
}
</script>

<template>
  <div class="oplog-page">
    <section class="oplog-shell">
      <div class="oplog-toolbar">
        <button class="oplog-btn" type="button" @click="exportLogs">导出</button>
      </div>

      <div class="oplog-table-wrap">
        <table class="oplog-table">
          <thead>
            <tr>
              <th class="c-check">
                <input
                  type="checkbox"
                  :checked="allChecked"
                  :indeterminate="indeterminate"
                  @change="toggleAll"
                />
              </th>
              <th>用户名称</th>
              <th>设备编码</th>
              <th>通用名</th>
              <th>科室管理</th>
              <th>所属科室</th>
              <th>操作模块</th>
              <th>操作功能</th>
              <th>操作结果</th>
              <th>操作内容</th>
              <th>操作时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td class="c-check"><input v-model="selectedIds" type="checkbox" :value="row.id" /></td>
              <td>{{ row.userName }}</td>
              <td>{{ row.deviceCode }}</td>
              <td>{{ row.commonName }}</td>
              <td>{{ row.manageDept }}</td>
              <td>{{ row.dept }}</td>
              <td>{{ row.module }}</td>
              <td>{{ row.action }}</td>
              <td>
                <span class="oplog-result" :class="row.result === '成功' ? 'ok' : 'fail'">
                  <i />{{ row.result }}
                </span>
              </td>
              <td>
                <button class="oplog-content-btn" type="button" @click="openDetail(row)">{{ row.content }}</button>
              </td>
              <td>{{ row.time }}</td>
              <td><button class="oplog-link-btn" type="button" @click="router.push({ name: 'repair-order-detail', params: { id: 'wx-20230818' } })">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="detailOpen && activeRow" class="oplog-modal-mask" @click.self="closeDetail">
        <div class="oplog-modal">
          <div class="oplog-modal-head">
            <div class="oplog-modal-title">操作内容</div>
            <button class="oplog-modal-close" type="button" @click="closeDetail"><span /><span /></button>
          </div>

          <div class="oplog-modal-body">
            <div class="oplog-detail-list">
              <div class="oplog-detail-row"><div class="oplog-detail-label">用户名称：</div><div class="oplog-detail-value">{{ activeRow.userName }}</div></div>
              <div class="oplog-detail-row"><div class="oplog-detail-label">设备编码：</div><div class="oplog-detail-value">{{ activeRow.deviceCode }}</div></div>
              <div class="oplog-detail-row"><div class="oplog-detail-label">通用名：</div><div class="oplog-detail-value">{{ activeRow.commonName }}</div></div>
              <div class="oplog-detail-row"><div class="oplog-detail-label">科室管理：</div><div class="oplog-detail-value">{{ activeRow.manageDept }}</div></div>
              <div class="oplog-detail-row"><div class="oplog-detail-label">所属科室：</div><div class="oplog-detail-value">{{ activeRow.dept }}</div></div>
              <div class="oplog-detail-row"><div class="oplog-detail-label">操作模块：</div><div class="oplog-detail-value">{{ activeRow.module }}</div></div>
            </div>

            <div class="oplog-detail-table">
              <div class="oplog-detail-col">
                <div class="oplog-detail-cell oplog-detail-cell--head">操作结果</div>
                <div class="oplog-detail-cell"><span class="oplog-result" :class="activeRow.result === '成功' ? 'ok' : 'fail'"><i />{{ activeRow.result === '成功' ? '已完成' : '论证失败' }}</span></div>
                <div class="oplog-detail-cell">{{ activeRow.action }}</div>
                <div class="oplog-detail-cell">{{ activeRow.time.slice(0, 10) }}</div>
              </div>
              <div class="oplog-detail-col">
                <div class="oplog-detail-cell oplog-detail-cell--head">操作功能</div>
                <div class="oplog-detail-cell">{{ activeRow.action }}</div>
                <div class="oplog-detail-cell">{{ activeRow.module }}</div>
                <div class="oplog-detail-cell">{{ activeRow.userName }}</div>
              </div>
              <div class="oplog-detail-col">
                <div class="oplog-detail-cell oplog-detail-cell--head">操作内容</div>
                <div class="oplog-detail-cell">{{ activeRow.content }}</div>
                <div class="oplog-detail-cell">{{ activeRow.commonName }}</div>
                <div class="oplog-detail-cell">{{ activeRow.time }}</div>
              </div>
            </div>
          </div>

          <div class="oplog-modal-foot">
            <button class="oplog-modal-btn" type="button" @click="closeDetail">取消</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.oplog-page{min-height:100%;background:var(--app-page-bg)}.oplog-shell{background:var(--app-card-bg);border:1px solid #fff;border-radius:var(--app-card-radius);padding:16px 24px 24px}.oplog-toolbar{display:flex;align-items:center;justify-content:flex-start;padding-bottom:16px}.oplog-btn{height:32px;padding:0 20px;border:0;border-radius:8px;background:rgba(5,137,203,.15);color:#1c2d66;font-size:14px;cursor:pointer}.oplog-table-wrap{overflow:auto;border:1px solid #e8eaec;border-radius:8px;background:#fff}.oplog-table{width:100%;min-width:1660px;border-collapse:collapse;table-layout:fixed}.oplog-table th,.oplog-table td{padding:10px 14px;border-bottom:1px solid #e8eaec;font-size:14px;line-height:20px;text-align:left;color:#333;vertical-align:middle}.oplog-table th{background:#f3f4f6;font-weight:500}.oplog-table td{background:linear-gradient(0deg,rgba(233,242,250,.25),rgba(233,242,250,.25)),#fff}.oplog-table tr:last-child td{border-bottom:0}.c-check{width:52px;text-align:center}.c-check input{width:14px;height:14px}.c-content{color:#424242}.oplog-content-btn,.oplog-link-btn{padding:0;border:0;background:transparent;color:#1474a4;font-size:14px;line-height:20px;cursor:pointer;text-align:left}.oplog-content-btn:hover,.oplog-link-btn:hover{text-decoration:underline}.oplog-result{display:inline-flex;align-items:center;font-size:14px}.oplog-result i{width:8px;height:8px;margin-right:6px;border-radius:50%;background:currentColor}.oplog-result.ok{color:#0589cb}.oplog-result.fail{color:#ff4d4f}.oplog-modal-mask{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.3);z-index:300}.oplog-modal{display:flex;flex-direction:column;align-items:center;width:560px;height:600px;padding:0 24px;gap:24px;background:linear-gradient(0deg,#F9FAFE,#F9FAFE),#FFFFFF;border:1px solid #FFFFFF;box-shadow:0 0 60px rgba(20,116,164,.12);border-radius:10px;box-sizing:border-box}.oplog-modal-head{display:flex;justify-content:space-between;align-items:center;width:560px;height:76px;padding:15px 16px;box-sizing:border-box;background:#F9FAFE;border-bottom:1px solid #E8EAEC}.oplog-modal-title{font-size:18px;line-height:18px;font-weight:500;color:#333}.oplog-modal-close{position:relative;width:20px;height:20px;border:0;background:transparent;cursor:pointer}.oplog-modal-close span{position:absolute;left:5px;top:9px;width:10px;border-top:2px solid #666}.oplog-modal-close span:first-child{transform:rotate(45deg)}.oplog-modal-close span:last-child{transform:rotate(-45deg)}.oplog-modal-body{display:flex;flex-direction:column;align-items:flex-start;width:512px;height:420px;gap:24px}.oplog-detail-list{display:flex;flex-direction:column;align-items:flex-start;width:512px;gap:24px}.oplog-detail-row{display:flex;align-items:flex-start;width:512px}.oplog-detail-label{display:flex;justify-content:flex-end;align-items:center;width:84px;height:32px;font-size:14px;line-height:14px;color:#666;white-space:nowrap;flex-shrink:0}.oplog-detail-value{display:flex;align-items:center;width:428px;min-height:14px;padding-top:9px;font-size:14px;line-height:14px;font-weight:500;color:#333}.oplog-detail-table{display:flex;align-items:flex-start;width:512px;height:154px;border:1px solid #E8EAEC;border-radius:10px;overflow:hidden;background:#fff}.oplog-detail-col{display:flex;flex-direction:column;flex:1}.oplog-detail-cell{display:flex;align-items:center;padding:9px 14px;min-height:38px;border-right:1px solid #E8EAEC;border-bottom:1px solid #E8EAEC;font-size:14px;line-height:20px;color:#333;box-sizing:border-box}.oplog-detail-col:last-child .oplog-detail-cell{border-right:0}.oplog-detail-col .oplog-detail-cell:last-child{border-bottom:0}.oplog-detail-cell--head{min-height:40px;padding:10px 14px;background:#F3F5FB;font-weight:500;white-space:nowrap}.oplog-modal-foot{display:flex;justify-content:flex-end;align-items:center;width:559px;height:56px;padding:12px 16px;gap:20px;background:#F9FAFE;box-shadow:0 0 12px 3px rgba(0,0,0,.1);box-sizing:border-box}.oplog-modal-btn{display:flex;justify-content:center;align-items:center;width:88px;height:32px;padding:5px 30px;border:1px solid #DCDFE6;border-radius:4px;background:#fff;color:#666;font-size:14px;line-height:22px;cursor:pointer;white-space:nowrap}
</style>
