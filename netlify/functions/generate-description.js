const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const maxExecutionTime = 8000; // Set a maximum execution time (in milliseconds)

async function describeJewelry(type, material) {
  try {
    const startTime = Date.now(); // Record the start time
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions', // Use the correct endpoint for chat models
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

    // Calculate the time taken by the function
    const executionTime = Date.now() - startTime;

    // Check if execution time is approaching the Lambda timeout
    if (executionTime >= maxExecutionTime) {
      console.warn('Function execution approaching Lambda timeout.');
    }

    return description;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for Lambda error handling
  }
}

exports.handler = async (event) => {
  try {
    const description = await describeJewelry('Ring', 'Gold');
    return {
      statusCode: 200,
      body: JSON.stringify('Description generated'),
    };
  } catch (error) {
    // Handle errors and return an appropriate response
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify('Error generating description'),
    };
  }
};
