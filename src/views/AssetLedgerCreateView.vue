<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

type K='input'|'select'|'date'|'search'|'radio'|'upload'|'textarea'|'percent'|'hint'
type F={label:string,key:string,kind:K,required?:boolean,options?:string[],tip?:string}
type S={title:string,toggle?:string,cols:F[][]}
const route=useRoute()
const router=useRouter()
const base={purchaseCode:'',assetCode:'',assetName:'',serialNo:'',invoiceNo:'',purchaseDate:'',isMeter:'是',specification:'',assetCategory:'',useDepartment:'',keeper:'',useStatus:'',manufacturer:'',useDirection:'',user:'',managerLevel:'',importance:'',riskLevel:'',useAddress:'',warehouseAddress:'',financeCategory:'',financeCode:'',assetSource:'',country:'',fundSource:'',isResearch:'是',depreciationMethod:'',usefulLife:'',residualRate:'',remark:''}
const form=reactive<Record<string,string>>({...base})
const sections:S[]=[
{title:'基础信息',toggle:'展开',cols:[
[{label:'采购单编码',key:'purchaseCode',kind:'select',required:true},{label:'资产编码',key:'assetCode',kind:'input'},{label:'资产名称',key:'assetName',kind:'input'},{label:'出厂编号',key:'serialNo',kind:'input',required:true},{label:'发票号',key:'invoiceNo',kind:'input',required:true},{label:'采购日期',key:'purchaseDate',kind:'date'},{label:'是否计量',key:'isMeter',kind:'radio',options:['是','否']},{label:'生产厂家',key:'manufacturer',kind:'search'}],
[{label:'规格型号',key:'specification',kind:'select'},{label:'设备类别',key:'assetCategory',kind:'select'},{label:'使用科室',key:'useDepartment',kind:'input'},{label:'保管人',key:'keeper',kind:'select'},{label:'使用状态',key:'useStatus',kind:'select'},{label:'用途方向',key:'useDirection',kind:'input'},{label:'使用人',key:'user',kind:'input'},{label:'管理等级',key:'managerLevel',kind:'select'}],
[{label:'重要等级',key:'importance',kind:'select',required:true},{label:'风险等级',key:'riskLevel',kind:'select',required:true},{label:'使用地点',key:'useAddress',kind:'input'},{label:'存放位置',key:'warehouseAddress',kind:'date'},{label:'财务分类',key:'financeCategory',kind:'select'},{label:'财务编码',key:'financeCode',kind:'date'},{label:'资产来源',key:'assetSource',kind:'select'},{label:'国别',key:'country',kind:'select'}]
]},
{title:'使用信息',toggle:'展开',cols:[
[{label:'设备层级',key:'a1',kind:'select'},{label:'使用年限',key:'a2',kind:'input'},{label:'启用日期',key:'a3',kind:'date'},{label:'开机状态',key:'a4',kind:'select'},{label:'维保方式',key:'a5',kind:'select'},{label:'效益等级',key:'a6',kind:'select'}],
[{label:'设备用途',key:'b1',kind:'select'},{label:'临床用途',key:'b2',kind:'input'},{label:'负责人',key:'b3',kind:'select'},{label:'安装日期',key:'b4',kind:'date'},{label:'启用状态',key:'b5',kind:'select'},{label:'使用说明',key:'b6',kind:'input'}],
[{label:'责任班组',key:'c1',kind:'select'},{label:'能耗等级',key:'c2',kind:'input'},{label:'维修等级',key:'c3',kind:'select',required:true},{label:'管理模式',key:'c4',kind:'select',required:true},{label:'资产属性',key:'c5',kind:'input'},{label:'预警标签',key:'c6',kind:'input'}]
]},
{title:'类别信息',cols:[
[{label:'资金来源',key:'fundSource',kind:'select',required:true},{label:'科研设备',key:'isResearch',kind:'radio',options:['是','否']},{label:'设备来源',key:'d1',kind:'select'},{label:'分类编码',key:'d2',kind:'select'}],
[{label:'设备品牌',key:'d3',kind:'select'},{label:'品牌系列',key:'d4',kind:'select'},{label:'注册分类',key:'d5',kind:'select'},{label:'国资分类代码',key:'d6',kind:'select'}],
[{label:'计量类别',key:'d7',kind:'select'},{label:'折旧类别',key:'d8',kind:'select'},{label:'配置类型',key:'d9',kind:'select'},{label:'设备大类',key:'d10',kind:'select'}]
]},
{title:'折旧信息',cols:[
[{label:'折旧方式',key:'depreciationMethod',kind:'input'},{label:'平均年限',key:'usefulLife',kind:'input'}],
[{label:'月残值率',key:'residualRate',kind:'percent'}],
[{label:'',key:'hint1',kind:'hint',tip:'平均年限法折旧公式：采购单价 / 寿命年限 = 月折旧金额； 百分比折旧公式：采购单价 * 月残值率 = 月折旧金额'}]
]},
{title:'资质证件',cols:[
[{label:'注册证附件',key:'u1',kind:'upload'},{label:'生产许可',key:'u2',kind:'upload'},{label:'检验报告',key:'u3',kind:'upload'}],
[{label:'保修文件',key:'u4',kind:'upload'},{label:'设备照片',key:'u5',kind:'upload'},{label:'其他附件',key:'u6',kind:'upload'}],
[{label:'说明文档',key:'u7',kind:'upload'}]
]},
{title:'其他',toggle:'展开',cols:[[{label:'备注',key:'remark',kind:'textarea'}]]}
]
const resetForm=()=>Object.assign(form,base)
const saveForm=()=>{
  ElMessage.success(route.query.mode==='edit'?'修改成功':'新增成功')
  router.push({ name:'asset-ledger' })
}
</script>

<template>
  <div class="page">
    <div class="shell">
      <section v-for="s in sections" :key="s.title" class="sec">
        <div class="head"><div class="title"><span class="mark" />{{ s.title }}</div><button v-if="s.toggle" class="toggle" type="button">{{ s.toggle }}<span class="bars" /></button></div>
        <div class="grid" :class="{single:s.cols.length===1}">
          <div v-for="(col,i) in s.cols" :key="i" class="col">
            <template v-for="f in col" :key="f.key">
              <div v-if="f.kind==='hint'" class="hint">{{ f.tip }}</div>
              <div v-else-if="f.kind==='textarea'" class="row area-row"><label class="lab">{{ f.label }}</label><div class="area"><textarea v-model="form[f.key]" placeholder="请输入" maxlength="1000" /><span>{{ form[f.key]?.length||0 }}/1000</span></div></div>
              <div v-else-if="f.kind==='upload'" class="row up-row"><label class="lab">{{ f.label }}</label><button type="button" class="upload"><span class="plus">+</span><span class="uphint">最大支持20M，仅支持jpg、png格式</span></button></div>
              <div v-else-if="f.kind==='radio'" class="row"><label class="lab" :class="{req:f.required}">{{ f.label }}</label><div class="radios"><label v-for="o in f.options" :key="o" class="radio"><input v-model="form[f.key]" type="radio" :name="f.key" :value="o"><span class="dot" :class="{on:form[f.key]===o}" />{{ o }}</label></div></div>
              <div v-else class="row"><label class="lab" :class="{req:f.required}">{{ f.label }}</label><div class="ctl"><input v-model="form[f.key]" placeholder="请输入"><span v-if="f.kind==='percent'" class="suf solid">%</span><span v-else-if="f.kind==='select'" class="suf"><span class="arr"/></span><span v-else-if="f.kind==='date'" class="suf"><span class="date"/></span><span v-else-if="f.kind==='search'" class="suf"><span class="search"/></span></div></div>
            </template>
          </div>
        </div>
      </section>
    </div>
    <div class="footer"><div class="foot"><button class="btn ghost" type="button" @click="router.back()">取消</button><button class="btn soft" type="button" @click="resetForm">重置</button><button class="btn primary" type="button" @click="saveForm">保存</button></div></div>

  </div>
</template>

<style scoped>
.page{display:flex;min-height:100%;flex-direction:column;background:#eef2fb;margin:0 -24px}.shell{display:flex;flex-direction:column;gap:12px;padding:0 0 24px}.sec{display:flex;flex-direction:column;gap:16px;padding:16px 16px;background:#fff;border-radius:8px}.head{display:flex;align-items:center;justify-content:space-between}.title{display:flex;align-items:center;gap:6px;font-size:16px;color:#2f2e3e}.mark{width:4px;height:14px;background:#1474a4;border-radius:1px}.toggle{display:flex;align-items:center;gap:6px;border:0;background:transparent;color:#1474a4;font-size:14px}.bars{width:10px;height:9px;display:grid;grid-template-rows:repeat(2,1fr);gap:.5px;transform:scaleY(-1)}.bars:before,.bars:after{content:'';display:block;background:#1474a4;border:1px solid #1474a4}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}.grid.single{grid-template-columns:1fr}.col{display:flex;flex-direction:column;gap:24px}.row{display:grid;grid-template-columns:126px 1fr;gap:10px;align-items:center}.lab{min-height:36px;display:flex;align-items:center;justify-content:flex-end;font-size:14px;color:#212121}.lab.req:after{content:'*';margin-left:2px;color:#ff332f}.ctl{display:flex;align-items:center;height:36px;border:1px solid #c4c4c4;border-radius:4px;background:#fff;overflow:hidden}.ctl input,.area textarea{border:0;outline:none;background:transparent;color:#424242;font-size:14px}.ctl input{flex:1;height:100%;padding:0 14px}.ctl input::placeholder,.area textarea::placeholder{color:#8c8c8c}.suf{width:32px;height:32px;display:flex;align-items:center;justify-content:center}.solid{border-left:1px solid #c4c4c4;background:#f5f7fa;color:#9c9ca4}.arr{width:10px;height:5px;background:#424242;opacity:.5;clip-path:polygon(0 0,100% 0,50% 100%)}.date{position:relative;width:16px;height:16px;border:1px solid #a1a1a1;border-radius:2px}.date:before{content:'';position:absolute;left:2px;right:2px;top:4px;height:1px;background:#a1a1a1}.date:after{content:'';position:absolute;left:4px;top:-2px;width:8px;height:4px;border-left:1px solid #a1a1a1;border-right:1px solid #a1a1a1}.search{position:relative;width:15px;height:15px}.search:before{content:'';position:absolute;left:0;top:0;width:11px;height:11px;border:1px solid #a1a1a1;border-radius:50%}.search:after{content:'';position:absolute;right:0;bottom:0;width:5px;border-top:1px solid #a1a1a1;transform:rotate(45deg);transform-origin:right center}.radios{display:flex;gap:24px;min-height:36px;align-items:center}.radio{display:flex;gap:8px;align-items:center;font-size:14px;color:#424242}.radio input{display:none}.dot{width:14px;height:14px;border:1px solid #1474a4;border-radius:50%;box-sizing:border-box}.dot.on{border-width:4px}.hint{padding-left:136px;font-size:14px;line-height:20px;color:#fa8c2b}.up-row,.area-row{align-items:start}.upload{width:100px;height:132px;border:1px dashed #1474a4;border-radius:4px;background:rgba(20,116,164,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}.plus{width:20px;height:20px;border:1px solid #1474a4;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#1474a4;font-size:16px}.uphint{width:70px;text-align:center;font-size:11px;line-height:18px;color:#8c8c8c}.area{position:relative;height:64px;border:1px solid #c4c4c4;border-radius:4px;background:#fff}.area textarea{width:100%;height:100%;resize:none;padding:8px 12px 24px;box-sizing:border-box}.area span{position:absolute;right:10px;bottom:3px;font-size:14px;line-height:22px;color:#8c8c8c}.footer{position:sticky;bottom:0;margin-top:auto;padding:0;background:linear-gradient(180deg,rgba(238,242,251,0) 0%,#eef2fb 38%,#eef2fb 100%)}.foot{height:56px;padding:0 24px;background:#fff;box-shadow:0 0 12px 3px rgba(0,0,0,.1);border-radius:0;display:flex;align-items:center;justify-content:flex-end;gap:16px}.btn{height:32px;padding:0 24px;border-radius:2px;font-size:14px}.ghost{border:1px solid #dcdfe6;background:#fff;color:#595a60}.soft{border:0;background:#bfe2eb;color:#1c2d66}.primary{border:0;background:#1474a4;color:#fff}@media (max-width:1400px){.grid{grid-template-columns:1fr}.hint{padding-left:0}.page{margin:0}}
</style>
