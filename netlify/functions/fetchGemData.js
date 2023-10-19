const chrome = require('chrome-aws-lambda');

exports.handler = async (event) => {
    const reportNumber = event.queryStringParameters.reportNumber;

    if (!reportNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Report number is required' }),
        };
    }

    let browser = null;
    try {
        browser = await chrome.puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });
        
        const page = await browser.newPage();
        await page.goto('https://www.gia.edu/report-check-landing');
        await page.type('#reportno', reportNumber);
        await page.click('.btn.search-btn[data-uw-rm-form="submit"]');
        await page.waitForTimeout(5000); // increased to 5 seconds

        const reportData = await page.$eval('#SHAPE', el => el.textContent);

        await browser.close();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ data: reportData }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ error: `Failed to retrieve data: ${error.message}` }) };
            
    }

console.log('Navigating to GIA website...');
await page.goto('https://www.gia.edu/report-check-landing');

console.log('Typing report number...');
await page.type('#reportno', reportNumber);

console.log('Clicking the lookup button...');
await page.click('.btn.search-btn[data-uw-rm-form="submit"]');

console.log('Waiting for data to load...');
await page.waitForTimeout(10000);

console.log('Trying to extract data...');
const reportData = await page.$eval('#SHAPE', el => el.textContent);
console.log('Data extracted:', reportData);
};
