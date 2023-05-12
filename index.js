const http = require('http');
const url = require('url');
const fetch = require('node-fetch');

const server = http.createServer(async (req, res) => {
  console.log(`Just got a request at ${req.url}!`);

  const parsedUrl = url.parse(req.url, true);
  const prompts = parsedUrl.query.prompts || [];

  try {
    // Execute ChatGPT calls concurrently using Promise.all()
    const results = await Promise.all(prompts.map(prompt => chatGPT(prompt)));

    // Process the results as needed
    const generatedTexts = results.map(result => result.choices[0].message.content.trim());

    // Send the generated texts as a response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(generatedTexts));
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('Internal server error');
    res.end();
  }
});

// Function to make ChatGPT API calls
async function chatGPT(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
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

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
