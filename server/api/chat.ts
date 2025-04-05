export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sen kullanıcıyla sohbet eden bir asistansın." },
        ...body.messages
      ]
    }
  });

  return res;
});
