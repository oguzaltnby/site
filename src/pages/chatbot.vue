<template>
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index" :class="message.role">
      {{ message.content }}
    </div>
    <input
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Bir mesaj yaz..."
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userInput = ref('')
const messages = ref([{ role: 'bot', content: 'Merhaba! Size nasıl yardımcı olabilirim?' }])

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  messages.value.push({ role: 'user', content: userInput.value })

  const res = await $fetch('/api/chat', {
    method: 'POST',
    body: {
      messages: [
        { role: 'system', content: 'Sen kullanıcıyla sohbet eden bir asistansın.' },
        ...messages.value.map(msg => ({
          role: msg.role === 'bot' ? 'assistant' : 'user',
          content: msg.content
        }))
      ]
    }
  })

  messages.value.push({ role: 'bot', content: res.choices[0].message.content })
  userInput.value = ''
}
</script>

<style scoped>
.chat-container {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
.bot {
  background: #e2ffe2;
  padding: 8px;
  border-radius: 6px;
  margin: 6px 0;
}
.user {
  background: #cce5ff;
  padding: 8px;
  border-radius: 6px;
  margin: 6px 0;
  text-align: right;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}
</style>
