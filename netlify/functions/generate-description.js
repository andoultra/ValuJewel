const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;

async function describe_jewelry(type, material) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
      {
        prompt: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}`,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const description = response.data.choices[0].text.trim();
    console.log(description);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

describe_jewelry('Ring', 'Gold');


exports.handler = async (event) => {
  await describe_jewelry('Ring', 'Gold');
  return {
    statusCode: 200,
    body: JSON.stringify('Description generated'),
  };
};
