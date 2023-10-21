const { PDFDocument } = require('pdf-lib');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: '', // OPTIONS request doesn't have a body
        };
    }

    try {
        // Parse the incoming data from event.body
        const data = JSON.parse(event.body);
        const {
            description,
            ownerName,
            ownerAddress,
            appraisalDate,
            estimatedValue,
            images,
            logoUrl
        } = data;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 750]);

        // Fetch and embed the company logo
        const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        page.drawImage(logoImage, {
            x: 50,
            y: 700,
            width: 100,
            height: 50
        });
        
        page.drawText('DAVID GARDNER’S', { x: 200, y: 720, size: 18 });
        page.drawText('JEWELERS & GEMOLOGISTS', { x: 200, y: 700, size: 16 });
        page.drawText('911 University Drive East', { x: 200, y: 680, size: 12 });
        page.drawText('College Station, TX 77840', { x: 200, y: 665, size: 12 });
        page.drawText('(979) 268-0800', { x: 200, y: 650, size: 12 });

        // Add the 'Property of' section
        page.drawText('Property of', { x: 400, y: 720, size: 14 });
        page.drawText(ownerName, { x: 400, y: 700, size: 12 });
        page.drawText(ownerAddress, { x: 400, y: 685, size: 12 });
        page.drawText('Date', { x: 400, y: 650, size: 12 });
        page.drawText(appraisalDate, { x: 445, y: 650, size: 12 });

        // Add article description
        page.drawText('Article Description', { x: 50, y: 600, size: 16 });
        page.drawText(description, { x: 50, y: 570, size: 12, width: 500, height: 250 });

        // Add estimated replacement value
        page.drawText('Estimated', { x: 400, y: 600, size: 12 });
        page.drawText('Replacement Value', { x: 400, y: 585, size: 12 });
        page.drawText(`$ ${estimatedValue}`, { x: 450, y: 570, size: 12 });

        // Embed images from base64 encoded array
        let yPosition = 320;
        for (let base64Image of images) {
            const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
            const image = await pdfDoc.embedPng(imageBytes);
            page.drawImage(image, {
                x: 50,
                y: yPosition,
                width: 150,
                height: 150
            });
            yPosition -= 160;
        }

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const base64PDF = Buffer.from(pdfBytes).toString('base64');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ pdfData: base64PDF }),
        };

    } 

    catch (error) {
    console.error('Error:', error);
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error generating PDF' }),
    };
}