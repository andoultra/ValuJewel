const puppeteer = require('puppeteer');

exports.handler = async (event) => {
    const reportNumber = event.queryStringParameters.reportNumber;

    if (!reportNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Report number is required' }),
        };
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.gia.edu/report-check-landing');

        await page.type('#reportno', reportNumber);

        await page.click('.btn.search-btn[data-uw-rm-form="submit"]');

        await page.waitForTimeout(3000);  // wait for 3 seconds for data to load

        // Replace '#YOUR_DATA_ELEMENT_ID' with the selector that targets the element containing the desired data
        const reportData = await page.$eval('SHAPE', el => el.textContent);

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({ data: reportData }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve data' }),
        };
    }
return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': 'https://andoultra.github.io',
        'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({ data: reportData }),
};};
