const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;

async function describe_jewelry(type, material) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', // Use the correct endpoint for chat completions
      {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}`,
          },
        ],
        max_tokens: 150,
        model: 'gpt-3.5-turbo', // Specify the model
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const description = response.data.choices[0].message.content.trim();
    console.log(description);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

exports.handler = async (event) => {
  await describe_jewelry('Ring', 'Gold');
  return {
    statusCode: 200,
    body: JSON.stringify('Description generated'),
  };
};
