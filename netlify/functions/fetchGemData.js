const axios = require('axios');
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retries: 3 }); // Retry the request up to 3 times on failure

exports.handler = async (event) => {
    const giaCertification = event.queryStringParameters.giaCertification;

    if (!giaCertification) {
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
        // Retrieve your Browserless API key from the environment variable
        const apiKey = process.env.Browserless_Api_Key;

        // Construct the Browserless API URL for interaction
        const apiUrl = `https://chrome.browserless.io/interact?url=https://www.gia.edu/report-check-landing`;

        console.log('Making a request to Browserless...');
        const response = await axios.post(
            apiUrl,
            {
                args: ['--no-sandbox'],
                code: `
                    const giaCertification = "${giaCertification}";
                    const puppeteer = require('puppeteer-core');  // Import puppeteer-core
                    const chromium = require('chrome-aws-lambda');

                    (async () => {
                        const executablePath = await chromium.executablePath; 
                        const browser = await puppeteer.launch({
                            args: chromium.args,
                            defaultViewport: chromium.defaultViewport,
                            executablePath: executablePath,
                            headless: chromium.headless,
                        });
                        const page = await browser.newPage();

                        await page.goto('https://www.gia.edu/report-check-landing');
                        await page.type('#reportno', giaCertification);
                        await page.click('.btn.search-btn[data-uw-rm-form="submit"]');
                        await page.waitForTimeout(5000);
                        const reportData = await page.$eval('#SHAPE', el => el.textContent);

                        await browser.close();
                        
                        return reportData;
                    })();
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
