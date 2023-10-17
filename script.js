// script.js

document.addEventListener('DOMContentLoaded', () => {
    const jewelryForm = document.getElementById('jewelryForm');
    const descriptionElement = document.getElementById('description');

    jewelryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const jewelryType = document.getElementById('jewelryType').value;
        const jewelryMaterial = document.getElementById('jewelryMaterial').value;

        try {
            const response = await fetch('https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jewelryType, jewelryMaterial }),
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
});
