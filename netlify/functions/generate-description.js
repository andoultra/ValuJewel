const axios = require('axios');

exports.handler = async function(event, context) {
  const jewelryData = JSON.parse(event.body);

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: `Describe a jewelry piece with the following attributes: Type: ${jewelryData.type}, Material: ${jewelryData.material}`,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': 'Bearer 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'
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ description: response.data.choices[0].text.trim() })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
