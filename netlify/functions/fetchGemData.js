const axios = require('axios');
const cheerio = require('cheerio');

async function fetchGemData(certificationNumber) {
    // Define the GIA URL structure (this is a placeholder, adjust as needed)
    const url = `https://gia.example.com/certificates/${certificationNumber}`;

    try {
        const response = await axios.get(url);
        const html = response.data;
        
        const $ = cheerio.load(html);
        
        // Extract data using cheerio selectors. Adjust these based on actual website structure!
        const gemData = {
            color: $('#colorSelector').text().trim(),
            clarity: $('#claritySelector').text().trim(),
            // ... add other selectors as needed
        };

        return gemData;
    } catch (error) {
        console.error(`Error fetching data for GIA number ${certificationNumber}:`, error);
        throw error;
    }
}

exports.handler = async (event) => {
    try {
        const certificationNumber = event.queryStringParameters.certificationNumber;
        
        if (!certificationNumber) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Certification number is required." })
            };
        }
        
        const gemData = await fetchGemData(certificationNumber);

        return {
            statusCode: 200,
            body: JSON.stringify(gemData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch gem data.' })
        };
    }
};
