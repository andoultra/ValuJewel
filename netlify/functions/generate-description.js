const OpenAI = require('openai');

// Ensure to replace 'your_api_key_here' with your actual API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function describe_jewelry(type, material) {
  try {
    const completion = await openai.completions.create({
      messages: [
        { role: 'user', content: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}` }
      ],
      model: 'gpt-3.5-turbo'
    });
    
    const description = completion.data.choices[0].message.content.trim();
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
