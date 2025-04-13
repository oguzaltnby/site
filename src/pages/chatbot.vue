<template>
  <div class="chat-container">
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="['message', message.role]"
    >
      {{ message.content }}
    </div>
    <input
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Mesajınızı yazın..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import $fetch from 'ohmyfetch'

// Kullanıcının mesajı
const userInput = ref("")

// Mesaj geçmişi
const messages = ref([
  { role: "assistant", content: "Merhaba! Size nasıl yardımcı olabilirim?" }
])

// Mesaj gönderme işlevi
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // Kullanıcı mesajını ekle
  messages.value.push({ role: "user", content: userInput.value })

  // API isteği gönder
  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value
      }
    })

    // Cevabı ekle
    const reply = response.choices?.[0]?.message?.content || "Bir hata oluştu."
    messages.value.push({ role: "assistant", content: reply })

  } catch (error) {
    messages.value.push({ role: "assistant", content: "Hata: Sunucuya ulaşılamıyor." })
  }

  // Giriş kutusunu temizle
  userInput.value = ""
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: sans-serif;
}

.message {
  padding: 10px 15px;
  border-radius: 10px;
  margin: 6px 0;
  max-width: 80%;
  word-break: break-word;
}

.user {
  background-color: #cce5ff;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
}

.assistant {
  background-color: #f1f1f1;
  align-self: flex-start;
  margin-right: auto;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-top: 10px;
  border-radius: 6px;
}
</style>
