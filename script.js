const jewelryForm = document.getElementById('jewelryForm');
const descriptionElement = document.getElementById('description');

jewelryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jewelryType = encodeURIComponent(document.getElementById('jewelryType').value);
    const jewelryMaterial = encodeURIComponent(document.getElementById('jewelryMaterial').value);
    const Cut = encodeURIComponent(document.getElementById('Cut').value); // Capture Cut value

    const requestURL = `https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description?type=${jewelryType}&material=${jewelryMaterial}&Cut=${Cut}`;

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
