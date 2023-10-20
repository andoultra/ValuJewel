const axios = require('axios');
const { PDFDocument, rgb } = require('pdf-lib');

exports.handler = async (event) => {
    // We assume the event body will contain the image(s) in base64 format and the description
    const { images, description, ownerName, ownerAddress, appraisalDate, estimatedValue } = JSON.parse(event.body);

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a new page to the document
        const page = pdfDoc.addPage([600, 750]);

        // Setup fonts
        const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

        // Add your logo, header, and other static elements here...

        // Add the description and other dynamic elements
        page.drawText(description, {
            x: 50,
            y: 500,
            size: 12,
            font: font,
        });

        // Add images - you can adjust positions/sizes as needed
        for (let i = 0; i < images.length; i++) {
            const imageBuffer = Buffer.from(images[i], 'base64');
            const image = await pdfDoc.embedPng(imageBuffer);
            page.drawImage(image, {
                x: 50 + (i * 150), // This places images side by side; adjust as needed
                y: 350,
                width: 130,
                height: 130,
            });
        }

        // Add the footer and other static elements...

        // Serialize the document to bytes
        const pdfBytes = await pdfDoc.save();

        // Send the PDF as a response
        const headers = {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=jewelry_appraisal.pdf',
            'Access-Control-Allow-Origin': '*',
        };
        return {
            statusCode: 200,
            headers: headers,
            body: pdfBytes.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Error generating PDF' }),
