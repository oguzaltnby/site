<template>
  <section class="chatbot">
    <div class="messages">
      <div v-for="(msg, i) in messages" :key="i" class="message">
        <strong>{{ msg.role === 'user' ? 'Sen' : 'Bot' }}:</strong> {{ msg.content }}
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="form">
      <input
        v-model="input"
        type="text"
        placeholder="Mesajını yaz..."
        class="input"
      />
      <button type="submit" class="button">Gönder</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ofetch } from 'ofetch'

const $fetch = ofetch

const input = ref('')
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])

const sendMessage = async () => {
  if (!input.value.trim()) return

  messages.value.push({ role: 'user', content: input.value })

  const response = await $fetch('/api/chat', {
    method: 'POST',
    body: { messages: messages.value },
  })

  messages.value.push({ role: 'assistant', content: response.text })
  input.value = ''
}
</script>

<style scoped>
.chatbot {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
.messages {
  background: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
}
.message {
  margin-bottom: 0.5rem;
}
.form {
  display: flex;
}
.input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
}
.button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #10b981;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
