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
            logoUrl,
            appraiserName
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
        
        page.drawText('Jewelry', { x: 450, y: 750, size: 18 });
        page.drawText('Appraisal', { x: 450, y: 730, size: 18 });
        

        page.drawText('911 University Drive East', { x: 100, y: 700, size: 10});
        page.drawText('College Station, TX 77840', { x: 100, y: 685, size: 10 });
        page.drawText('(979) 268-0800', { x: 125, y: 670, size: 10 });
        
        page.drawText('The following estimated replacement values are based upon market value at the time of the apprasial. Mounted gemstones are graded only to the extent that mounting permits examination. We assume no lability with respect to any action that may be taken on the basis of this apprasial.', { x: 50, y: 655, size: 10, maxWidth: 250, lineHeight:10})
        
        // Add the 'Property of' section
        page.drawText('Property of', { x: 400, y: 700, size: 14 });
        page.drawText(ownerName, { x: 400, y: 685, size: 12 });
        page.drawText(ownerAddress, { x: 400, y: 670, size: 12 });
        page.drawText('Date', { x: 400, y: 650, size: 12 });
        page.drawText(appraisalDate, { x: 445, y: 650, size: 12 });

       // Add article description with text wrapping
        page.drawText('Article Description', { x: 140, y: 585, size: 16 });
        page.drawText(description, { x: 50, y: 565, size: 10, maxWidth: 380 });

    // Add estimated replacement value
        //page.drawText('Estimated', { x: 400, y: 600, size: 10 });
        page.drawText('Estimated Replacement Value', { x: 433, y: 585, size: 10 });
        page.drawText(`$ ${estimatedValue}`, { x: 480, y: 550, size: 12 });
        
       // Horizontal line after the header
        page.drawLine({
            start: { x: 40, y: 720 },
            end: { x: 572, y: 720 },
        });

        // Horizontal line Top Description
        page.drawLine({
            start: { x: 40, y: 600 },
            end: { x: 572, y: 600 },
        });
        
        // Horizontal line bottom Descirption
        page.drawLine({
            start: { x: 40, y: 580 },
            end: { x: 572, y: 580 },
        });
        // Vertical line left hand side
        page.drawLine({
            start: { x: 40, y: 720 },
            end: { x: 40, y: 150 },
        });
        // Vertical line right hand side
        page.drawLine({
            start: { x: 572, y: 720 },
            end: { x: 572, y: 150 },
        });
        // Vertical line internal right
        page.drawLine({
            start: { x: 430, y: 600 },
            end: { x: 430, y: 150 },
        });
       
            // Embed images from base64 encoded array
            let xPosition = 50; // Starting X position for the first image
            let yPosition = 280; // Starting Y position
            const gap = 10; // Gap between images, adjust as needed

            for (let index = 0; index < images.length; index++) {
                const base64Image = images[index];
                const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                const image = await pdfDoc.embedPng(imageBytes);
                page.drawImage(image, {
                    x: xPosition,
                    y: yPosition,
                    width: 150,
                    height: 150
                });

                // We'll adjust the image layout for up to 4 images
                // After the 2nd image, we'll move to the next row
                if (index === 1 || index === 4) {
                    yPosition -= 160; // Adjust to the desired y-level for the next row
                    xPosition = 50;   // Reset x position to the starting position
                } else {
                    xPosition += 150 + gap; // Move to the right for the next image (width of the image + gap)
                }
            }

        // Draw the appraiser's name and credentials at the bottom of the PDF
        page.drawText(`Appraiser`, { x: 50, y: 50, size: 12 });
        page.drawText(appraiserName, { x: 50, y: 65, size: 12 });
        // Horizontal line Appraiser
        page.drawLine({
            start: { x: 50, y: 60 },
            end: { x: 130, y: 60 },
        });
        

        // Signature
        page.drawText(`Signature`, { x: 400, y: 50, size: 12 });
        // Horizontal line Appraiser
        page.drawLine({
            start: { x: 350, y: 60 },
            end: { x: 450, y: 60 },
        });







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
