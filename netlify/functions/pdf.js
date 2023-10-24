const { PDFDocument } = require('pdf-lib');

exports.handler = async (event) => {
    // Common CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
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
        const page = pdfDoc.addPage([612, 792]);

        // Fetch and embed the company logo
        const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        page.drawImage(logoImage, {
            x: 50,
            y: 725,
            width: 275,
            height: 50
        });
        
        page.drawText('Jewelry', { x: 400, y: 750, size: 18 });
        page.drawText('Appraisal', { x: 400, y: 730, size: 18 });
        

        page.drawText('911 University Drive East', { x: 50, y: 700, size: 10});
        page.drawText('College Station, TX 77840', { x: 50, y: 685, size: 10 });
        page.drawText('(979) 268-0800', { x: 50, y: 670, size: 10 });
        
        page.drawText('The following estimated replacement values are based upon market value at the time of the apprasial. Mounted gemstones are graded only to the extent that mounting permits examination. We assume no lability with respect to any action that may be taken on the basis of this apprasial.', { x: 50, y: 650, size: 6, maxWidth: 200})
        
        // Add the 'Property of' section
        page.drawText('Property of', { x: 400, y: 720, size: 14 });
        page.drawText(ownerName, { x: 400, y: 700, size: 12 });
        page.drawText(ownerAddress, { x: 400, y: 685, size: 12 });
        page.drawText('Date', { x: 400, y: 650, size: 12 });
        page.drawText(appraisalDate, { x: 445, y: 650, size: 12 });

       // Add article description with text wrapping
        page.drawText('Article Description', { x: 50, y: 600, size: 16 });
        page.drawText(description, { x: 50, y: 570, size: 12, maxWidth: 500 });

    // Add estimated replacement value
        page.drawText('Estimated', { x: 400, y: 600, size: 12 });
        page.drawText('Replacement Value', { x: 400, y: 585, size: 12 });
        page.drawText(`$ ${estimatedValue}`, { x: 400, y: 570, size: 12 });
        
       // Horizontal line after the header
        page.drawLine({
            start: { x: 40, y: 720 },
            end: { x: 560, y: 720 },
        });

        // Horizontal line after "Property of" and "Date" details
        page.drawLine({
            start: { x: 40, y: 200 },
            end: { x: 560, y: 200 },
        });

        // Vertical line separating "Property of" and "Date"
        page.drawLine({
            start: { x: 400, y: 730 },
            end: { x: 400, y: 675 },
        });

        // Horizontal line after "Article Description" and before the image
        page.drawLine({
            start: { x: 50, y: 635 },
            end: { x: 560, y: 635 },
        });

        // Vertical line separating "Article Description" and "Estimated Replacement Value"
        page.drawLine({
            start: { x: 400, y: 660 },
            end: { x: 400, y: 200 },
        });

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

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Error generating PDF' }),
        };
    }
};
