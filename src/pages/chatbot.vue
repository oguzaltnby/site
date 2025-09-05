<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <div v-for="(message, index) in messages" :key="index" class="mb-4">
        <div :class="message.sender === 'user' ? 'text-right' : 'text-left'">
          <div
            :class="[
              'inline-block',
              'px-4',
              'py-2',
              'rounded-xl',
              message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            ]"
          >
            {{ message.text }}
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="mt-4 flex">
        <input
          v-model="input"
          type="text"
          placeholder="Mesajınızı yazın..."
          class="flex-1 px-4 py-2 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Gönder
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Klasik fetch kullanıyorum, ofetch yok
const messages = ref([
  { sender: 'bot', text: 'Merhaba! Size nasıl yardımcı olabilirim?' }
])
const input = ref('')

const sendMessage = async () => {
  if (!input.value.trim()) return

  messages.value.push({ sender: 'user', text: input.value })

  const userMessage = input.value
  input.value = ''

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await response.json()

    messages.value.push({ sender: 'bot', text: data.reply })
  } catch (error) {
    messages.value.push({ sender: 'bot', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
  }
}
</script>

<style scoped>
/* İstersen buraya ekstra stiller ekleyebilirsin */
</style>
