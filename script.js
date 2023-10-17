const jewelryForm = document.getElementById('jewelryForm');
const descriptionElement = document.getElementById('description');

jewelryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jewelryType = document.getElementById('jewelryType').value;
    const jewelryMaterial = document.getElementById('jewelryMaterial').value;
    const Cut = document.getElementById('Cut').value; // Capture Cut value

    try {
        const response = await fetch('/.netlify/functions/generate-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jewelryType, jewelryMaterial, Cut }), // Include Cut in the API request
        });

        if (!response.ok) {
            throw new Error('Failed to fetch description');
        }

        const data = await response.json();
        descriptionElement.textContent = data.description;
    } catch (error) {
        console.error('Error:', error);
    }
});
