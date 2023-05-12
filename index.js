import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const prompts = req.body.prompts || [];

  const results = await Promise.all(prompts.map(prompt => chatGPT(prompt)));
  const generatedTexts = results.map(result => result.choices[0].message);

  res.status(200).json({ generatedTexts: generatedTexts });
});

async function chatGPT(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a chatbot' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  });

  const data = await response.json();
  return data;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
