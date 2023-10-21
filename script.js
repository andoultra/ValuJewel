const jewelryForm = document.getElementById('jewelryForm');
const descriptionElement = document.getElementById('description');

jewelryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jewelryType = encodeURIComponent(document.getElementById('jewelryType').value);
    const jewelryMaterial = encodeURIComponent(document.getElementById('jewelryMaterial').value);
    const giaCertification = encodeURIComponent(document.getElementById('giaCertification').value);
    const ringType =encodeURIComponent(document.getElementById('ringType').value);
    const gender =encodeURIComponent(document.getElementById('gender').value);
    const ringSize=encodeURIComponent(document.getElementById('ringSize').value)

    const requestURL = `https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description?type=${jewelryType}&material=${jewelryMaterial}&giaCertification=${giaCertification}&ringType=${ringType}&gender=${gender}&ringSize=${ringSize}`;

    try {
        const response = await fetch(requestURL);

        if (!response.ok) {
            throw new Error('Failed to fetch description');
        }

        const data = await response.json();
        descriptionElement.textContent = data.description;
    } catch (error) {
        console.error('Error:', error);
        descriptionElement.textContent = 'Error fetching description. Please try again.';
    }
});

document.getElementById('jewelryType').addEventListener('change', function() {
    const ringOptionsDiv = document.getElementById('ringOptions');
    if (this.value === 'ring') {
        ringOptionsDiv.style.display = 'block';
    } else {
        ringOptionsDiv.style.display = 'none';
    }
document.getElementById('jewelryForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const ownerName = document.getElementById('ownerName').value;
        const ownerAddress = document.getElementById('ownerAddress').value;
        const appraisalDate = document.getElementById('appraisalDate').value;
        const estimatedValue = document.getElementById('estimatedValue').value;

        const images = [];

        // Iterate over the image inputs
        for (let i = 1; i <= 3; i++) {
            const imageInput = document.getElementById('image' + i);

            // Only proceed if the input exists and has files
            if (imageInput && imageInput.files.length > 0) {
                const base64Image = await toBase64(imageInput.files[0]);
                images.push(base64Image);
            }
        }

        const requestData = {
            description,
            ownerName,
            ownerAddress,
            appraisalDate,
            estimatedValue,
            images
        };

        // ... [the rest of your code]
    });

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
});

