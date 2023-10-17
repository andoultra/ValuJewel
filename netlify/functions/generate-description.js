const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function describe_jewelry(type, material) {
  try {
    const response = await openai.complete({
      engine: 'davinci-codex',
      prompt: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}`,
      max_tokens: 150
    });
    
    const description = response.data.choices[0].text.trim();
    console.log(description);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

describe_jewelry('Ring', 'Gold');
