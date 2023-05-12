const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(express.json());

// Handle POST requests to the webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call ChatGPT 3.5 API
    const response = await chatGPT(prompt);

    // Process the response as needed
    const generatedText = response.choices[0].message.content.trim();

    // Send the generated text as a response
    res.status(200).json({ generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to make ChatGPT 3.5 API calls
async function chatGPT(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer Bearer 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'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
