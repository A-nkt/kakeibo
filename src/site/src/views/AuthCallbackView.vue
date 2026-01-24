<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { handleAuthCallback } = useAuth()
const error = ref('')

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const errorParam = params.get('error')

  if (errorParam) {
    error.value = 'ログインがキャンセルされました'
    setTimeout(() => router.push('/login'), 2000)
    return
  }

  if (code) {
    const result = await handleAuthCallback(code)
    if (!result.success) {
      error.value = '認証に失敗しました。もう一度お試しください。'
      setTimeout(() => router.push('/login'), 2000)
    }
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="text-center">
      <div v-if="error" class="rounded-lg bg-red-50 p-4 text-red-600">
        {{ error }}
      </div>
      <div v-else class="flex flex-col items-center gap-4">
        <svg class="h-8 w-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">認証中...</p>
      </div>
    </div>
  </div>
</template>
