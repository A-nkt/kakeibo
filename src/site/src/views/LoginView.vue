<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

const handleGoogleLogin = async () => {
  isLoading.value = true

  // 仮のGoogle OAuth処理（実際のAPIに置き換え）
  await new Promise(resolve => setTimeout(resolve, 1000))

  // デモ用：ログイン成功
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userEmail', 'user@gmail.com')
  router.push('/dashboard')

  isLoading.value = false
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="w-full max-w-md animate-slide-up rounded-2xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
      <!-- Logo / Title -->
      <div class="mb-8 text-center">
        <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Dashboard
        </h1>
        <p class="mt-2 text-sm text-gray-500">アカウントにログイン</p>
      </div>

      <!-- Google Login Button -->
      <button
        @click="handleGoogleLogin"
        :disabled="isLoading"
        class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg v-if="isLoading" class="h-5 w-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ isLoading ? 'ログイン中...' : 'Googleでログイン' }}
      </button>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-gray-500">
        ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}
</style>
