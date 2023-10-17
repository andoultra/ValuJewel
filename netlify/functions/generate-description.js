const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const maxExecutionTime = 8000; // Set a maximum execution time (in milliseconds)

async function describeJewelry(type, material, temperature) {
  try {
    const startTime = Date.now(); // Record the start time
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions', // Use the correct endpoint for chat models
      {
        prompt: `Generate a technical description of a ${type} with the following attributes: Type: ${type}, Material: ${material}`,
        max_tokens: 150,
        temperature: temperature || 0.2, // Use provided temperature or default to 0.2
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

    // Check if execution time exceeds Lambda timeout
    if (executionTime >= maxExecutionTime) {
      console.warn('Function execution approaching Lambda timeout.');
      throw new Error('Function execution time exceeded.');
    }

    return description;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch description from OpenAI API');
  }
}

exports.handler = async (event) => {
  try {
    const { type, material, temperature } = event.queryStringParameters || {}; // Get type, material, and temperature from query parameters
    const description = await describeJewelry(type, material);

    // Configure CORS headers
    const headers = {
      'Access-Control-Allow-Origin': 'https://andoultra.github.io/', // Replace with your domain
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    return {
      statusCode: 200,
      headers, // Include the CORS headers in the response
      body: JSON.stringify({ description }), // Return the description as JSON
    };
  } catch (error) {
    // Handle errors and return an appropriate response
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://andoultra.github.io/', // Replace with your domain
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Error generating description' }),
    };
  }
};
