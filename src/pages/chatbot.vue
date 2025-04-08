<!-- pages/chat.vue -->
<template>
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index" :class="message.role">
      {{ message.content }}
    </div>
    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Mesajınızı yazın..." />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { $fetch } from 'ofetch'

const userInput = ref("")
const messages = ref([{ role: "bot", content: "Merhaba! Size nasıl yardımcı olabilirim?" }])

const sendMessage = async () => {
  if (!userInput.value) return

  messages.value.push({ role: "user", content: userInput.value })

  const { choices } = await $fetch('/api/chat', {
    method: 'POST',
    body: { messages: messages.value }
  })

  messages.value.push({ role: "bot", content: choices[0].message.content })
  userInput.value = ""
}
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.bot {
  background: #eee;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
}
.user {
  background: #cce5ff;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  text-align: right;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}
</style>
