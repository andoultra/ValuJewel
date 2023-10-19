const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const maxExecutionTime = 8000; // Set a maximum execution time (in milliseconds)

async function describeJewelry(type, material, cut, ringSize, necklaceLength) {
    let promptDescription = `Generate a technical description of a ${type} jewelry piece made of ${material}. Include details such as design, size, and any unique features.`;

    if (type === 'ring' && ringSize) {
        promptDescription += ` The ring size is ${ringSize}.`;
    }

    if (type === 'necklace' && necklaceLength) {
        promptDescription += ` The necklace length is ${necklaceLength}.`;
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/text-davinci-003/completions',
            {
                prompt: promptDescription,
                max_tokens: 150,
                temperature: 0.2,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.choices[0].text.trim();

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch description from OpenAI API');
    }
}

exports.handler = async (event) => {
    try {
        const { type, material, Cut, ringSize, necklaceLength } = event.queryStringParameters || {};

        const description = await describeJewelry(type, material, Cut, ringSize, necklaceLength);

        const headers = {
            'Access-Control-Allow-Origin': 'https://andoultra.github.io',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ description }),
        };

    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Error generating description' }),
        };
    }
};
