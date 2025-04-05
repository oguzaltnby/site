// server/api/chat.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userMessage = body.message;

  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sen kullanıcıyla Türkçe konuşan yardımcı bir asistansın." },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();

  return {
    reply: data.choices?.[0]?.message?.content ?? "Bir şeyler yanlış gitti.",
  };
});
