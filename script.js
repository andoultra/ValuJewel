const jewelryForm = document.getElementById('jewelryForm');
const descriptionElement = document.getElementById('descriptionTextarea'); // Corrected this line

jewelryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jewelryType = encodeURIComponent(document.getElementById('jewelryType').value);
    const jewelryMaterial = encodeURIComponent(document.getElementById('jewelryMaterial').value);
    const ringType = encodeURIComponent(document.getElementById('ringType').value);
    const gender = encodeURIComponent(document.getElementById('gender').value);
    const ringSize = encodeURIComponent(document.getElementById('ringSize').value);

    const requestURL = `https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description?type=${jewelryType}&material=${jewelryMaterial}&ringType=${ringType}&gender=${gender}&ringSize=${ringSize}`;

    try {
        const response = await fetch(requestURL);

        if (!response.ok) {
            throw new Error('Failed to fetch description');
        }

        const data = await response.json();
        descriptionElement.value = data.description; // Corrected this line
    } catch (error) {
        console.error('Error:', error);
        descriptionElement.value = 'Error fetching description. Please try again.'; // Corrected this line
    }
});

document.getElementById('jewelryType').addEventListener('change', function() {
    const ringOptionsDiv = document.getElementById('ringOptions');
    if (this.value === 'ring') {
        ringOptionsDiv.style.display = 'block';
    } else {
        ringOptionsDiv.style.display = 'none';
    }
});

document.getElementById('ringType').addEventListener('change', function() {
    const engagementOptionsDiv = document.getElementById('engagementOptions');
    
    if (this.value === 'engagement_ring') {
        engagementOptionsDiv.style.display = 'block';
    } else {
        engagementOptionsDiv.style.display = 'none';
    }
});

document.getElementById("generatePdfButton").addEventListener("click", generatePDF);

async function generatePDF() {
    const description = descriptionElement.value; // Corrected this line
    const ownerName = document.getElementById('ownerName').value;
    const ownerAddress = document.getElementById('ownerAddress').value;
    const appraisalDate = document.getElementById('appraisalDate').value;
    const estimatedValue = document.getElementById('estimatedValue').value;
    const images = await getBase64Images();
    const appraiserName = document.getElementById('appraiserName').value;
    const logoUrl = 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_811,h_124/https://www.davidgardnersjewelers.com/wp-content/themes/ttg/src/dist/img/logo.png'; 
    const requestData = {
        description,
        ownerName,
        ownerAddress,
        appraisalDate,
        estimatedValue,
        images,
        logoUrl,
        appraiserName
    };

    const requestURL = "https://willowy-pie-2fe033.netlify.app/.netlify/functions/pdf";
    try {
        const response = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate PDF');
        }

        const data = await response.json();
        if (data && data.pdfData) {
            const pdfBlob = base64ToBlob(data.pdfData, 'application/pdf');
            const blobURL = URL.createObjectURL(pdfBlob);
            window.open(blobURL, '_blank'); // Opens the PDF in a new tab
        } else {
            descriptionElement.value = 'Error downloading the PDF. Please try again.'; // Corrected this line
        }
    } catch (error) {
        console.error('Error:', error);
        descriptionElement.value = 'Error generating PDF. Please try again.'; // Corrected this line
    }
}

async function getBase64Images() {
    const images = [];

    for (let i = 1; i <= 4; i++) {
        const imageInput = document.getElementById(`image${i}`);
        if (imageInput && imageInput.files.length > 0) {
            const base64Image = await toBase64(imageInput.files[0]);
            images.push(base64Image);
        }
    }

    return images;
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Removes the MIME type prefix
        reader.onerror = error => reject(error);
    });
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

document.getElementById('editDescriptionButton').addEventListener('click', function() {
    const textarea = document.getElementById('descriptionTextarea');
    textarea.readOnly = false;
    textarea.focus();
    this.style.display = 'none';
    document.getElementById('saveDescriptionButton').style.display = 'block';
    document.getElementById('generatePdfButton').disabled = true; // Disable the "Generate PDF" button during editing
});

document.getElementById('saveDescriptionButton').addEventListener('click', function() {
    const textarea = document.getElementById('descriptionTextarea');
    textarea.readOnly = true;
    this.style.display = 'none';
    document.getElementById('editDescriptionButton').style.display = 'block';
    document.getElementById('generatePdfButton').disabled = false; // Re-enable the "Generate PDF" button after editing
});
