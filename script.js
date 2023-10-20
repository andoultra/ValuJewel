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
});

