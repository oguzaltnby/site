<template>
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index" :class="message.role">
      {{ message.content }}
    </div>
    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Mesajınızı yazın..." />
  </div>
</template>

<script setup>
import { ref } from "vue";

const messages = ref([{ role: "bot", content: "Merhaba! Size nasıl yardımcı olabilirim?" }]);
const userInput = ref("");

const sendMessage = async () => {
  if (!userInput.value) return;

  messages.value.push({ role: "user", content: userInput.value });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Sen kullanıcıyla sohbet eden bir asistansın." }, ...messages.value]
    })
  });

  const data = await response.json();
  messages.value.push({ role: "bot", content: data.choices[0].message.content });
  userInput.value = "";
};
</script>

<style scoped>
.chat-container { width: 300px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
.bot { background: #f1f1f1; padding: 5px; border-radius: 5px; margin-bottom: 5px; }
.user { background: #cce5ff; padding: 5px; border-radius: 5px; margin-bottom: 5px; text-align: right; }
input { width: 100%; padding: 5px; margin-top: 10px; }
</style>
