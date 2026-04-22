<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-white">
    <div class="text-center">
      <div class="text-2xl font-semibold text-slate-900">页面不存在</div>
      <div class="mt-3 text-slate-600">检查路径是否正确，或返回首页。</div>
      <router-link
        to="/"
        class="mt-6 inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

