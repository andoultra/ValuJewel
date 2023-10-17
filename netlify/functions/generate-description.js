const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

exports.handler = async function(event, context) {
  try {
    const { type, material } = JSON.parse(event.body);
    const response = await openai.completions({
      engine: 'davinci-codex',
      prompt: `Describe a jewelry piece with the following attributes: Type: ${type}, Material: ${material}`,
      max_tokens: 150
    });
    
    const description = response.data.choices[0].text.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ description })
    };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
