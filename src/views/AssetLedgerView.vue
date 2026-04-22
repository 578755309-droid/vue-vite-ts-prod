<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

type FieldType = 'input' | 'select' | 'money' | 'search'
type FieldItem = readonly [string, keyof typeof advancedForm, FieldType]

const keyword = ref('')
const router = useRouter()
const deptKeyword = ref('')
const statusKeyword = ref('')
const selectedStage = ref('全部')
const advancedSearchOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedIds = ref<string[]>([])
const expandedLifecycleRowId = ref<string | null>(null)
const repairId = 'wx-20230818'

const topTabs = ['采购管理', '采购管理采购管理采购']
const headerActions = [
  ['新增', 'p'],
  ['批量删除', 'd'],
  ['资料上传', 's'],
  ['冲红', 's'],
  ['维保统计', 's'],
  ['导入', 's'],
  ['导出', 's']
] as const

const actionTabs = ['全部', '账内设备', '账外设备', '正式设备', '低值设备', '主设备', '附属设备']
const rows = [
  { id: '1', no: '1', name: '飞利浦 16 排 CT', code: '1601020101000025', model: 'Brilliance 16', dept: '放射科', owner: '王主任', flow: '暂存', risk: '高风险' },
  { id: '2', no: '2', name: 'GE DR 摄影系统', code: '1601020101000026', model: 'Definium 6000', dept: '影像中心', owner: '赵医生', flow: '在保', risk: '低风险' },
]
const advancedForm = reactive({
  purchaseCode: '', assetName: '', model: '', manufacturer: '', supplier: '', price: '', quantity: '',
  dept: '', keeper: '', status: '', category: '', financeCategory: '', riskLevel: '', source: '',
  assetLevel: '', benefitLevel: '', enableDate: '', scrapDate: '',
})
const baseFieldsLeft: FieldItem[] = [
  ['采购单编码', 'purchaseCode', 'select'], ['资产名称', 'assetName', 'search'], ['设备型号', 'model', 'select'],
  ['生产厂家', 'manufacturer', 'input'], ['供应商', 'supplier', 'input'], ['采购单价', 'price', 'money'], ['数量', 'quantity', 'input'],
]
const baseFieldsRight: FieldItem[] = [
  ['使用科室', 'dept', 'select'], ['保管人', 'keeper', 'money'], ['使用状态', 'status', 'input'],
  ['设备类别', 'category', 'money'], ['财务分类', 'financeCategory', 'money'], ['风险等级', 'riskLevel', 'select'],
]
const moreFieldsLeft: FieldItem[] = [
  ['资产来源', 'source', 'input'], ['设备层级', 'assetLevel', 'money'], ['效益等级', 'benefitLevel', 'input'], ['启用日期', 'enableDate', 'select'],
  ['报废日期', 'scrapDate', 'input'], ['管理标签', 'category', 'input'], ['资产状态', 'status', 'select'], ['是否高值', 'riskLevel', 'select'],
]
const moreFieldsRight: FieldItem[] = [
  ['采购方式', 'purchaseCode', 'money'], ['使用年限', 'quantity', 'input'], ['折旧年限', 'price', 'money'], ['折旧方式', 'model', 'input'],
  ['残值率', 'dept', 'input'], ['计量类别', 'assetName', 'input'], ['维修等级', 'manufacturer', 'select'], ['存放位置', 'supplier', 'select'],
]
const timeNodes = [
  ['入库', '2023-02-18', 'g'], ['启用', '2023-08-18', 'ok'], ['维修', '2023-08-18', 'w'],
  ['保养', '2023-02-18', 'b'], ['保养', '2023-02-18', 'b'], ['保养', '2023-02-18', 'b'],
  ['保养', '2023-02-18', 'b'], ['保养', '2023-02-18', 'b'], ['已报废', '2023-02-18', 'r'],
] as const

const filteredRows = computed(() => rows.filter((row) => {
  const k = keyword.value.trim()
  const d = deptKeyword.value.trim()
  const s = statusKeyword.value.trim()
  return (!k || row.code.includes(k) || row.name.includes(k) || row.model.includes(k))
    && (!d || row.dept.includes(d))
    && (!s || row.flow.includes(s))
    && (selectedStage.value === '全部' || row.flow === selectedStage.value)
}))

function resetFilters() {
  keyword.value = ''
  deptKeyword.value = ''
  statusKeyword.value = ''
  selectedStage.value = '全部'
}

function resetAdvancedSearch() {
  Object.assign(advancedForm, {
    purchaseCode: '', assetName: '', model: '', manufacturer: '', supplier: '', price: '', quantity: '',
    dept: '', keeper: '', status: '', category: '', financeCategory: '', riskLevel: '', source: '',
    assetLevel: '', benefitLevel: '', enableDate: '', scrapDate: '',
  })
}

function toggleAllSelection() {
  selectedIds.value = selectedIds.value.length === filteredRows.value.length ? [] : filteredRows.value.map((row) => row.id)
}

function toggleRowSelection(id: string) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id]
}

function toggleLifecycle(id: string) {
  expandedLifecycleRowId.value = expandedLifecycleRowId.value === id ? null : id
}

function goCreate() {
  router.push({ name: 'asset-ledger-create' })
}

function goEdit(code: string) {
  router.push({ name: 'asset-ledger-create', query: { mode: 'edit', assetNo: code } })
}

function confirmDelete() {
  deleteDialogOpen.value = false
  if (!selectedIds.value.length) return
  selectedIds.value = []
  ElMessage.success('删除成功')
}
</script>

<template>
  <div class="asset-page">
    <section class="headbar">
      <div class="chips">
        <button v-for="(item,i) in topTabs" :key="item" class="chip" :class="{ mute:i===1 }">{{ item }}<i /></button>
      </div>
      <div class="layouticon"><span /><span class="on" /></div>
    </section>

    <section class="shell">
      <div class="filter">
        <label class="field"><span>采购单编码</span><input v-model="keyword" placeholder="请输入" /></label>
        <label class="field"><span>使用科室</span><input v-model="deptKeyword" placeholder="请输入" /></label>
        <label class="field"><span>状态</span><input v-model="statusKeyword" placeholder="请输入" /></label>
        <div class="factions">
          <button class="btn s" @click="resetFilters">重置</button>
          <button class="btn p">查询</button>
          <button class="btn s wide" @click="advancedSearchOpen = true">高级搜索</button>
        </div>
      </div>

      <div class="board">
        <div class="tabs">
          <button v-for="item in actionTabs" :key="item" class="tab" :class="{ on:selectedStage===item }" @click="selectedStage=item">{{ item }}</button>
        </div>

        <div class="actions">
          <button v-for="[label,tone] in headerActions" :key="label" class="btn" :class="tone" @click="label === '新增' ? goCreate() : label === '批量删除' ? (deleteDialogOpen = true) : undefined">{{ label }}</button>
        </div>

        <div class="scroll">
          <div class="table">
            <div class="row head">
              <div class="cell c0"><button class="box box-btn" :class="{ checked: selectedIds.length === filteredRows.length && filteredRows.length > 0 }" type="button" @click="toggleAllSelection"><span v-if="selectedIds.length === filteredRows.length && filteredRows.length > 0" class="box-tick" /></button></div><div class="cell c1">序号</div><div class="cell life-head">资产生命周期</div><div class="cell">设备名称</div><div class="cell">资产编号</div><div class="cell">设备型号</div><div class="cell">使用科室</div><div class="cell">负责人</div><div class="cell">流程状态</div><div class="cell">质保状态</div><div class="cell">风险等级</div><div class="cell c1">备注</div><div class="cell">创建时间</div><div class="cell">更新时间</div><div class="cell cop">操作</div>
            </div>
            <template v-for="row in filteredRows" :key="row.id">
              <div class="row">
                <div class="cell c0"><button class="box box-btn line" :class="{ checked: selectedIds.includes(row.id) }" type="button" @click="toggleRowSelection(row.id)"><span v-if="selectedIds.includes(row.id)" class="box-tick" /></button></div><div class="cell c1">{{ row.no }}</div><div class="cell life-cell"><button class="life-toggle" type="button" @click="toggleLifecycle(row.id)"><span class="life-toggle-arrow" :class="{ open: expandedLifecycleRowId === row.id }" /></button></div><div class="cell">{{ row.name }}</div><div class="cell">{{ row.code }}</div><div class="cell">{{ row.model }}</div><div class="cell">{{ row.dept }}</div><div class="cell">{{ row.owner }}</div>
                <div class="cell"><span class="status" :class="row.flow==='在保'?'blue':'gray'"><i />{{ row.flow }}</span></div>
                <div class="cell"><span class="status blue"><i />在保</span></div>
                <div class="cell"><span class="risk" :class="row.risk==='高风险'?'red':'green'"><b>!</b>{{ row.risk }}</span></div>
                <div class="cell c1">---</div><div class="cell">2023-02-18</div><div class="cell">2023-08-18</div>
                <div class="cell cop"><div class="cop-actions"><router-link class="op" :to="{ name:'asset-ledger-detail', params:{ assetNo:row.code } }">查看</router-link><a class="op" href="javascript:void(0)">关联工单</a><button class="op op-btn" type="button" @click="goEdit(row.code)">修改</button></div></div>
              </div>
              <div v-if="expandedLifecycleRowId === row.id" class="row-life-panel">
                <div class="timeline">
                  <div class="rail" />
                  <div v-for="([label,date,t],idx) in timeNodes" :key="`${row.id}-${idx}`" class="node" :class="[`t-${t}`, { down: idx===1 }]">
                    <span class="dot" />
                    <router-link v-if="label === '维修' && date === '2023-08-18'" class="bubble bubble-link" :to="{ name: 'repair-order-detail', params: { id: repairId } }">{{ label }}：{{ date }}</router-link>
                    <div v-else class="bubble">{{ label }}：{{ date }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="pager">
          <div class="left"><span>共 {{ filteredRows.length }} 条</span><button>10条/页</button></div>
          <div class="right"><button>‹</button><button class="now">1</button><button>2</button><button>3</button><button>4</button><button>›</button><div class="jump"><span>前往</span><em>1</em><span>页</span></div></div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="deleteDialogOpen" class="del-mask" @click.self="deleteDialogOpen = false">
        <div class="del-dialog">
          <div class="del-spacer" />
          <div class="del-frame">
            <div class="del-main">
              <div class="del-top">
                <div class="del-icon-wrap">
                  <span class="del-icon-circle" />
                  <span class="del-icon-dot" />
                </div>
                <div class="del-title-row">
                  <div class="del-title">确认删除选中的设备台账吗？</div>
                  <button class="del-close" type="button" @click="deleteDialogOpen = false"><span class="del-close-line del-close-line--a" /><span class="del-close-line del-close-line--b" /></button>
                </div>
              </div>
              <div class="del-body">
                <div class="del-desc">删除后将无法恢复，请谨慎操作。</div>
                <div class="del-actions">
                  <button class="del-btn del-btn--ghost" type="button" @click="deleteDialogOpen = false">取消</button>
                  <button class="del-btn del-btn--danger" type="button" @click="confirmDelete">确认删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="advancedSearchOpen" class="adv-overlay" @click.self="advancedSearchOpen = false">
        <div class="adv-drawer">
          <div class="adv-main">
            <div class="adv-header">
              <div class="adv-title">高级搜索</div>
              <button class="adv-close" type="button" @click="advancedSearchOpen = false"><span class="adv-close-line adv-close-line--a" /><span class="adv-close-line adv-close-line--b" /></button>
            </div>

            <div class="adv-body">
              <section class="adv-section">
                <div class="adv-section-title"><span class="adv-mark" />基础信息</div>
                <div class="adv-grid">
                  <div class="adv-col">
                    <div v-for="[label,key,type] in baseFieldsLeft" :key="label" class="adv-item">
                      <label class="adv-label">{{ label }}</label>
                      <div class="adv-control" :class="{ 'adv-control--money': type==='money' }">
                        <input v-model="advancedForm[key]" placeholder="请输入" class="adv-input" />
                        <span v-if="type==='search'" class="adv-tail adv-tail--search"><span class="adv-search-icon"><span class="adv-search-circle" /><span class="adv-search-handle" /><span class="adv-search-line adv-search-line--1" /><span class="adv-search-line adv-search-line--2" /><span class="adv-search-line adv-search-line--3" /></span></span>
                        <span v-else-if="type==='select'" class="adv-tail adv-tail--select"><span class="adv-arrow-icon" /></span>
                        <span v-else-if="type==='money'" class="adv-tail adv-tail--money">元</span>
                      </div>
                    </div>
                  </div>
                  <div class="adv-col">
                    <div v-for="[label,key,type] in baseFieldsRight" :key="label" class="adv-item">
                      <label class="adv-label">{{ label }}</label>
                      <div class="adv-control" :class="{ 'adv-control--money': type==='money' }">
                        <input v-model="advancedForm[key]" placeholder="请输入" class="adv-input" />
                        <span v-if="type==='search'" class="adv-tail adv-tail--search"><span class="adv-search-icon"><span class="adv-search-circle" /><span class="adv-search-handle" /><span class="adv-search-line adv-search-line--1" /><span class="adv-search-line adv-search-line--2" /><span class="adv-search-line adv-search-line--3" /></span></span>
                        <span v-else-if="type==='select'" class="adv-tail adv-tail--select"><span class="adv-arrow-icon" /></span>
                        <span v-else-if="type==='money'" class="adv-tail adv-tail--money">元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="adv-section">
                <div class="adv-section-title"><span class="adv-mark" />基础信息</div>
                <div class="adv-grid adv-grid--tall">
                  <div class="adv-col">
                    <div v-for="[label,key,type] in moreFieldsLeft" :key="label" class="adv-item">
                      <label class="adv-label">{{ label }}</label>
                      <div class="adv-control" :class="{ 'adv-control--money': type==='money' }">
                        <input v-model="advancedForm[key]" placeholder="请输入" class="adv-input" />
                        <span v-if="type==='select'" class="adv-tail adv-tail--select"><span class="adv-arrow-icon" /></span>
                        <span v-else-if="type==='money'" class="adv-tail adv-tail--money">元</span>
                      </div>
                    </div>
                  </div>
                  <div class="adv-col">
                    <div v-for="[label,key,type] in moreFieldsRight" :key="label" class="adv-item">
                      <label class="adv-label">{{ label }}</label>
                      <div class="adv-control" :class="{ 'adv-control--money': type==='money' }">
                        <input v-model="advancedForm[key]" placeholder="请输入" class="adv-input" />
                        <span v-if="type==='select'" class="adv-tail adv-tail--select"><span class="adv-arrow-icon" /></span>
                        <span v-else-if="type==='money'" class="adv-tail adv-tail--money">元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="adv-footer">
            <div class="adv-footer-actions">
              <button class="adv-btn adv-btn--ghost" type="button" @click="advancedSearchOpen = false">取消</button>
              <button class="adv-btn adv-btn--soft" type="button" @click="resetAdvancedSearch">重置</button>
              <button class="adv-btn adv-btn--primary" type="button" @click="advancedSearchOpen = false">查询</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.asset-page{min-height:100%;padding:0 0 24px;background:var(--app-page-bg);color:#333;font-family:'PingFang SC','Microsoft YaHei',sans-serif}.headbar{height:48px;padding-top:16px;display:flex;justify-content:space-between;align-items:center}.chips,.layouticon,.factions,.actions,.left,.right,.jump,.status,.risk{display:flex;align-items:center}.factions{gap:8px}.chips{gap:10px}.chip{height:32px;padding:0 12px;border:0;border-radius:8px;background:#f9fafe;font-size:14px;color:#333}.chip i{display:inline-block;width:8px;height:8px;border-right:1px solid #b7bdca;border-bottom:1px solid #b7bdca;transform:rotate(45deg);margin-left:10px;margin-top:-2px}.chip.mute{color:#999}.layouticon{gap:24px}.layouticon span{width:7px;height:14px;border:1.5px solid #c4c4c4}.layouticon .on{border-color:#1474a4}.shell{display:flex;flex-direction:column;gap:16px}.bubble-link{text-decoration:none;cursor:pointer}.bubble-link:hover{box-shadow:inset 0 0 0 1px currentColor,-2px 2px 14px rgba(0,0,0,.14)}.filter,.board{background:var(--app-card-bg);border-radius:var(--app-card-radius)}.filter{padding:24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;align-items:end}.field{display:flex;align-items:center;gap:12px}.field span{width:84px;text-align:right;font-size:14px;line-height:14px}.field input{flex:1;height:32px;padding:0 14px;border:1px solid #d8dde8;border-radius:8px;background:#fff;font-size:14px}.field input::placeholder,.adv-input::placeholder{color:#8c8c8c}.btn{height:32px;padding:0 32px;border:0;border-radius:8px;font-size:14px;cursor:pointer}.btn.p{background:#0589cb;color:#fff}.btn.d{background:rgba(245,63,63,.15);color:#ff332f}.btn.s{background:rgba(5,137,203,.15);color:#1c2d66}.btn.wide{padding:0 20px}.board{padding:11px 24px 24px;border:1px solid #fff}.tabs{display:flex;gap:24px;height:40px;border-bottom:1px solid #dee3ee}.tab{height:40px;padding:13px 0;border:0;background:transparent;color:#999;font-size:15px}.tab.on{color:#0589cb;border-bottom:2px solid #0589cb;font-weight:500}.actions{gap:8px;padding:16px 0;flex-wrap:wrap}.scroll{position:relative;overflow:auto}.table{min-width:1520px;border:1px solid #e8eaec;border-radius:8px 8px 0 0;overflow:hidden}.row{display:grid;grid-template-columns:64px 72px 1.2fr 1.2fr 1fr 1fr .8fr .9fr .9fr .9fr .8fr .9fr .9fr .9fr minmax(216px,216px)}.row.head .cell{background:#f3f4f6;min-height:40px;font-weight:500}.cell{min-height:38px;padding:9px 14px;display:flex;align-items:center;border-bottom:1px solid #e8eaec;background:linear-gradient(0deg,rgba(233,242,250,.25),rgba(233,242,250,.25)),#fff;font-size:14px;line-height:20px}.c0,.c1{justify-content:center}.cop{position:sticky;right:0;z-index:2;justify-content:flex-start;white-space:nowrap;min-width:216px;max-width:216px;box-shadow:-8px 0 12px rgba(15,23,42,.06),-1px 0 0 #e8eaec}.row:not(.head) .cop{background:linear-gradient(0deg,rgba(233,242,250,.25),rgba(233,242,250,.25)),#fff}.row.head .cop{z-index:3;background:#f3f4f6}.cop-actions{display:flex;align-items:center;justify-content:flex-start;gap:16px;flex-wrap:nowrap;white-space:nowrap;width:100%}.box{width:14px;height:14px;border:1px solid #e8eaec;border-radius:2px;background:#fff}.box-btn{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;padding:0;cursor:pointer;transition:border-color .2s,background-color .2s,box-shadow .2s}.box-btn:hover{border-color:#0589cb;box-shadow:0 0 0 2px rgba(5,137,203,.12)}.box-btn.checked{border-color:#0589cb;background:#0589cb}.box-tick{width:8px;height:4px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translateY(-1px)}.line{border-color:rgba(20,116,164,.5)}.status i{width:8px;height:8px;border-radius:50%;background:currentColor;margin-right:6px}.status.gray{color:#424242}.status.gray i{background:#999}.status.blue{color:#0589cb}.risk b{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:6px;border:1px solid currentColor;border-radius:3px;font-size:10px}.risk.red{color:#ff4d4f}.risk.green{color:#52c41a}.op{color:#0589cb;text-decoration:none;white-space:nowrap}.op-btn{padding:0;border:0;background:transparent;font:inherit;cursor:pointer}.timeline{position:relative;display:grid;grid-template-columns:repeat(9,1fr);gap:16px;min-width:1520px;margin-top:16px;padding:16px 20px;border:1px solid #e8eaec;background:linear-gradient(0deg,rgba(233,242,250,.25),rgba(233,242,250,.25)),#fff}.rail{position:absolute;left:20px;right:20px;top:73px;height:1px;background:#e8eaec}.node{position:relative;z-index:1}.node.down{margin-top:39px}.bubble{display:flex;align-items:center;justify-content:center;width:129px;min-height:33px;border-radius:8px;background:#fff;font-size:12px;line-height:17px;color:#333;box-shadow:inset 0 0 1px currentColor,-2px 2px 12px rgba(0,0,0,.1)}.dot{position:absolute;left:0;top:39px;width:10px;height:10px;border-radius:50%;border:1.5px solid currentColor;background:#fff}.node.down .dot{top:0}.node.down .bubble{margin-top:12px}.t-g{color:#999}.t-ok{color:#52c31a}.t-w{color:#fa8c2b}.t-b{color:#1474a4}.t-r{color:#f53f3f}.t-r .bubble{width:141px}.pager{display:flex;justify-content:space-between;align-items:center;padding-top:20px}.left{gap:15px}.right{gap:20px}.left span,.left button,.right button,.jump span,.jump em{font-family:'Noto Sans SC','PingFang SC',sans-serif}.left span,.jump span{font-size:12px;line-height:18px;color:#424242}.left button,.right button,.jump em{height:28px;min-width:28px;border:1px solid #f0f2f5;background:#fff;border-radius:4px}.left button{width:92px}.right button,.jump em{display:inline-flex;align-items:center;justify-content:center;font-size:12px;color:#424242}.right .now{color:#0589cb}.jump{gap:8px}.jump em{width:40px;font-style:normal;font-size:14px;line-height:22px}.del-mask{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;padding:0;gap:10px;background:rgba(0,0,0,.3);z-index:120}.del-dialog{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;width:100vw;height:100vh}.del-frame{box-sizing:border-box;display:flex;flex-direction:row;justify-content:flex-end;align-items:center;padding:30px;width:560px;height:200px;background:#F9FAFE;border:1px solid #FFFFFF;box-shadow:0 0 10px 1px rgba(47,46,62,.2);border-radius:12px}.del-spacer{width:8px;height:26px;flex:none}.del-main{display:flex;flex-direction:column;align-items:flex-start;padding:0;gap:20px;width:500px;height:140px;flex:1}.del-top{display:flex;flex-direction:row;align-items:center;padding:0;gap:10px;width:500px;height:36px}.del-icon-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;flex:none}.del-icon-circle{position:absolute;left:3px;top:3px;width:30px;height:30px;border-radius:50%;background:#FF9C44}.del-icon-circle::before{content:'';position:absolute;left:14px;top:6px;width:2px;height:11px;border-radius:1px;background:#fff}.del-icon-dot{position:absolute;left:17px;top:23px;width:2.02px;height:2px;border-radius:50%;background:#fff}.del-title-row{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:0;gap:20px;width:454px;height:24px}.del-title{width:280.74px;height:24px;font-family:'Microsoft YaHei';font-style:normal;font-weight:400;font-size:14px;line-height:22px;display:flex;align-items:center;font-feature-settings:'tnum' on,'lnum' on;color:#2F2E3E}.del-close{position:relative;width:20px;height:20px;border:0;background:#fff;cursor:pointer;flex:none}.del-close-line{position:absolute;left:5px;top:9px;width:10px;border-top:2px solid #424242}.del-close-line--a{transform:rotate(45deg)}.del-close-line--b{transform:rotate(-45deg)}.del-body{display:flex;flex-direction:column;align-items:flex-start;padding:0 0 0 46px;gap:30px;width:500px;height:84px}.del-desc{width:454px;height:22px;font-family:'Microsoft YaHei';font-style:normal;font-weight:400;font-size:14px;line-height:22px;display:flex;align-items:center;font-feature-settings:'tnum' on,'lnum' on;color:#424242}.del-actions{display:flex;flex-direction:row;justify-content:flex-end;align-items:flex-end;padding:0;gap:20px;width:454px;height:32px}.del-btn{display:flex;flex-direction:row;justify-content:center;align-items:center;height:32px;min-width:92px;border-radius:12px;font-size:14px;line-height:22px;cursor:pointer}.del-btn--ghost{box-sizing:border-box;padding:4px 14px;gap:4px;border:1px solid #C4C4C4;background:#fff;color:#424242}.del-btn--danger{padding:5px 14px;gap:4px;border:0;background:#FF4D4F;color:#fff}.adv-overlay{position:fixed;inset:0;display:flex;justify-content:flex-end;align-items:stretch;background:rgba(0,0,0,.3);z-index:100}.adv-drawer{display:flex;flex-direction:column;justify-content:space-between;align-items:center;width:800px;height:100vh;background:#fff;border-radius:4px 0 0 4px}.adv-main{display:flex;flex-direction:column;align-items:center;width:800px;height:990px;padding:0 60px;box-sizing:border-box}.adv-header{display:flex;justify-content:space-between;align-items:center;width:800px;height:76px;padding:15px 16px;border-bottom:1px solid #c4c4c4;box-sizing:border-box}.adv-title{font-size:18px;line-height:18px;font-weight:500;color:#424242}.adv-close{position:relative;width:20px;height:20px;border:0;background:#fff;cursor:pointer}.adv-close-line{position:absolute;left:5px;top:9px;width:10px;border-top:2px solid #424242}.adv-close-line--a{transform:rotate(45deg)}.adv-close-line--b{transform:rotate(-45deg)}.adv-body{display:flex;flex-direction:column;gap:24px;width:680px;padding:24px 0 0}.adv-section{display:flex;flex-direction:column;align-items:flex-start;gap:16px;width:680px}.adv-section-title{display:flex;align-items:center;gap:6px;font-size:15px;line-height:21px;font-weight:500;color:#2f2e3e}.adv-mark{width:4px;height:14px;background:#1474a4;border-radius:1px}.adv-grid{display:grid;grid-template-columns:repeat(2,316px);gap:48px;width:680px}.adv-grid--tall .adv-col{gap:24px}.adv-col{display:flex;flex-direction:column;gap:24px}.adv-item{display:grid;grid-template-columns:84px 222px;gap:10px;align-items:center}.adv-label{display:flex;justify-content:flex-end;align-items:center;font-size:14px;line-height:14px;color:#212121;opacity:.84}.adv-control{display:flex;align-items:center;width:222px;height:32px;border:1px solid #c4c4c4;border-radius:2px;background:#fff;box-sizing:border-box}.adv-input{flex:1;height:100%;border:0;outline:none;padding:0 0 0 14px;font-size:14px;line-height:24px;color:#424242;background:transparent}.adv-tail{display:flex;align-items:center;justify-content:center;width:32px;height:32px;color:#9c9ca4;font-size:14px;flex:none}.adv-tail--money{border-left:1px solid #c4c4c4;background:#f5f7fa}.adv-tail--search{position:relative}.adv-search-icon{position:relative;width:18px;height:12px}.adv-search-circle{position:absolute;right:0;top:0;width:8px;height:8px;border:1px solid #a1a1a1;border-radius:50%}.adv-search-handle{position:absolute;right:-1px;top:8px;width:4px;border-top:1px solid #a1a1a1;transform:rotate(45deg)}.adv-search-line{position:absolute;left:0;border-top:1px solid #a1a1a1}.adv-search-line--1{top:1px;width:6px}.adv-search-line--2{top:6px;width:8px}.adv-search-line--3{top:11px;width:6px}.adv-tail--select{padding:13.5px 11px;box-sizing:border-box}.adv-arrow-icon{display:block;width:10px;height:5px;background:#424242;opacity:.5;border-radius:.5px;clip-path:polygon(0 0,100% 0,50% 100%)}.adv-footer{display:flex;justify-content:flex-end;align-items:center;width:800px;height:56px;padding:12px 24px;background:#fff;box-shadow:0 0 12px 3px rgba(0,0,0,.1);box-sizing:border-box}.adv-footer-actions{display:flex;align-items:center;gap:20px}.adv-btn{display:flex;justify-content:center;align-items:center;height:32px;border-radius:2px;font-size:14px;line-height:22px;cursor:pointer}.adv-btn--ghost{width:88px;border:1px solid #dcdfe6;background:#fff;color:#595a60}.adv-btn--soft{width:92px;border:0;background:#bfe2eb;color:#1c2d66}.adv-btn--primary{width:88px;border:0;background:#1474a4;color:#fff}@media (max-width:1600px){.filter{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:1100px){.adv-drawer{width:min(800px,100vw)}.adv-main{width:100%;padding:0 24px}.adv-header,.adv-footer{width:100%}.adv-body,.adv-section,.adv-grid{width:100%}.adv-grid{grid-template-columns:1fr;gap:24px}.adv-item{grid-template-columns:84px 1fr}.adv-control{width:100%}}
</style>
