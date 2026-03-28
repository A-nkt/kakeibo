<script setup lang="ts">
defineProps<{
  comments: string[]
}>()
</script>

<template>
  <div class="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
    <div class="flex items-center gap-2">
      <span class="text-xl">💡</span>
      <h3 class="text-base font-semibold text-gray-800">今日のAIアドバイス</h3>
    </div>

    <ul v-if="comments.length > 0" class="mt-4 space-y-3">
      <li
        v-for="(comment, index) in comments"
        :key="index"
        class="border-l-2 border-indigo-400 pl-3 text-sm text-gray-700"
      >
        {{ comment }}
      </li>
    </ul>

    <p v-else class="mt-4 text-sm text-gray-400">
      データを蓄積中です...
    </p>
  </div>
</template>
