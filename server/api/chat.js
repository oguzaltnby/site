export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const messages = body.messages
  const apiKey = process.env.OPENAI_API_KEY

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages
    })
  })

  const data = await response.json()
  return data
})
