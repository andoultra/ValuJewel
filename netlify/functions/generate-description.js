import OpenAI from "openai";
const OpenAI = new OpenAI();

// Ensure to replace 'your_api_key_here' with your actual API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function describe_jewelry(type, material) {
  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'You are a helpful assistant.'
      }, {
        role: 'user',
        content: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}`
      }]
    });
    
    const description = completion.data.choices[0].message.content.trim();;
    console.log(description);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

describe_jewelry('Ring', 'Gold');
