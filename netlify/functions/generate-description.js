const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const maxExecutionTime = 8000; // Set a maximum execution time (in milliseconds)

async function describeJewelry(type, material, cut, ringSize, necklaceLength) {
    let promptText;

    if (type === 'ring') {
        promptText = `Generate a technical description of a ${type} jewelry piece made of ${material} with a size of ${ringSize}. Include details such as design, cut, size, and any unique features.`;
    } else if (type === 'necklace') {
        promptText = `Generate a technical description of a ${type} jewelry piece made of ${material} with a length of ${necklaceLength}. Include details such as design, cut, size, and any unique features.`;
    } else {
        promptText = `Generate a technical description of a ${type} jewelry piece made of ${material}. Include details such as design, cut, size, and any unique features.`;
    }

    try {
        const startTime = Date.now();

        const response = await axios.post(
            'https://api.openai.com/v1/engines/text-davinci-003/completions',
            {
                prompt: promptText,
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
        const { type, material, Cut, ringSize, necklaceLength } = JSON.parse(event.body);
        const description = await describeJewelry(type, material, Cut, ringSize, necklaceLength);

        // Configure CORS headers
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
