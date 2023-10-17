const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const maxExecutionTime = 8000; // Set a maximum execution time (in milliseconds)

async function describeJewelry(type, material) {
  try {
    const startTime = Date.now(); // Record the start time
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions', // Use the correct endpoint for chat models
      {
        prompt: `Generate a technical description of a ${type} with the following attributes: Type: ${type}, Material: ${material}`,
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
    const { type, material } = event.queryStringParameters; // Get type and material from query parameters
    const description = await describeJewelry(type, material);
    return {
      statusCode: 200,
      body: JSON.stringify({ description }), // Return the description as JSON
    };
  } catch (error) {
    // Handle errors and return an appropriate response
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ error: 'Error generating description' }), // Return the error as JSON
    };
  }
};
