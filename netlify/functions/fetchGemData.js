const axios = require('axios');

exports.handler = async (event) => {
    const reportNumber = event.queryStringParameters.reportNumber;

    if (!reportNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Report number is required' }),
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

    try {
        // Retrieve your Browserless API key from environment variables
        const apiKey = process.env.Browserless_Api_Key;

        // Construct the Browserless API URL for interaction
        const apiUrl = `https://chrome.browserless.io/interact?url=https://www.gia.edu/report-check-landing`;

        console.log('Making a request to Browserless...');
        const response = await axios.post(
            apiUrl,
            {
                args: ['--no-sandbox'],
                code: `
                    // Your Puppeteer code here
                    const reportNumber = "${reportNumber}";
                    await page.goto('https://www.gia.edu/report-check-landing');
                    await page.type('#reportno', reportNumber);
                    await page.click('.btn.search-btn[data-uw-rm-form="submit"]');
                    await page.waitForTimeout(5000);
                    const reportData = await page.$eval('#SHAPE', el => el.textContent);
                    return reportData;
                `,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (response.status === 200) {
            const reportData = response.data;

            return {
                statusCode: 200,
                body: JSON.stringify({ data: reportData }),
                headers: {
                    'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            };
        } else {
            throw new Error('Failed to retrieve data from Browserless');
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve data: ' + error.message }),
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }
};
