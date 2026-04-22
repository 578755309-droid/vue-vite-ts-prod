import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import HomeView from '../views/HomeView.vue'
import AssetLedgerView from '../views/AssetLedgerView.vue'
import AssetLedgerDetailView from '../views/AssetLedgerDetailView.vue'
import AssetLedgerCreateView from '../views/AssetLedgerCreateView.vue'
import RepairOrderDetailView from '../views/RepairOrderDetailView.vue'
import OperationLogView from '../views/OperationLogView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'asset-ledger', name: 'asset-ledger', component: AssetLedgerView },
        { path: 'asset-ledger/create', name: 'asset-ledger-create', component: AssetLedgerCreateView },
        { path: 'asset-ledger/:assetNo', name: 'asset-ledger-detail', component: AssetLedgerDetailView },
        { path: 'repair-order/:id', name: 'repair-order-detail', component: RepairOrderDetailView },
        { path: 'operation-log', name: 'operation-log', component: OperationLogView },
      ],
    },
    // 兜底：匹配任意不存在路径
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router

