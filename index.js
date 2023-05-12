import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  console.log('Just got a webhook request!');
  const prompts = req.body.prompts || [];

  try {
    const results = await Promise.all(prompts.map(prompt => chatGPT(prompt)));
    const generatedTexts = results.map(result => data.choices[0].message.trim());
    res.status(200).json({prompts});
    //res.status(200).json({results});
    res.status(200).json({ generatedTexts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  return data.choices[0].message;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
