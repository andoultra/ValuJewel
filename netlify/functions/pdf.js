async function generatePDF() {
    const { PDFDocument, rgb } = PDFLib;

    const form = document.getElementById('jewelryForm');
    const description = form.querySelector('#description').value;
    const ownerName = form.querySelector('#ownerName').value;
    const ownerAddress = form.querySelector('#ownerAddress').value;
    const appraisalDate = form.querySelector('#appraisalDate').value;
    const estimatedValue = form.querySelector('#estimatedValue').value;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page
    const page = pdfDoc.addPage([600, 750]);

    // Add company logo and header details - assuming you have a logo.png in the same directory
    const logoImageBytes = await fetch('logo.png').then(res => res.arrayBuffer());
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

    // Add images
    const imageInputs = [form.querySelector('#jewelryImages1'), form.querySelector('#jewelryImages2'), form.querySelector('#jewelryImages3')];
    let yPosition = 320;

    for (let input of imageInputs) {
        if (input.files[0]) {
            const imageBytes = await input.files[0].arrayBuffer();
            const image = await pdfDoc.embedPng(imageBytes);
            page.drawImage(image, {
                x: 50,
                y: yPosition,
                width: 150,
                height: 150
            });
            yPosition -= 160; // Adjust the yPosition for the next image
        }
    }

    // Download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'jewelry_appraisal.pdf';
    link.click();
}

document.getElementById('jewelryAppraisalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    generatePDF();
});
