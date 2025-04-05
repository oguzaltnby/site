<template>
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index" :class="message.role">
      {{ message.content }}
    </div>
    <input
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Mesajınızı yazın..."
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const messages = ref([
  { role: "bot", content: "Merhaba! Size nasıl yardımcı olabilirim?" },
]);
const userInput = ref("");

const sendMessage = async () => {
  if (!userInput.value) return;

  messages.value.push({ role: "user", content: userInput.value });

  const { data, error } = await useFetch("/api/chat", {
    method: "POST",
    body: { message: userInput.value },
  });

  if (error.value) {
    messages.value.push({ role: "bot", content: "Bir hata oluştu!" });
  } else {
    messages.value.push({ role: "bot", content: data.value.reply });
  }

  userInput.value = "";
};
</script>

<style scoped>
.chat-container {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.bot {
  background: #f1f1f1;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
}
.user {
  background: #cce5ff;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  text-align: right;
}
input {
  width: 100%;
  padding: 5px;
  margin-top: 10px;
}
</style>
