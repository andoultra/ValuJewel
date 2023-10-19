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
const giaCertificationInput = document.getElementById('giaCertification');
const fetchGemDataButton = document.getElementById('fetchGemDataButton');
const gemDataElement = document.getElementById('gemData');

fetchGemDataButton.addEventListener('click', async () => {
    const certificationNumber = giaCertificationInput.value;

    if (!certificationNumber) {
        alert('Please enter a GIA certification number.');
        return;
    }

    try {
        const response = await fetch(`https://willowy-pie-2fe033.netlify.app/.netlify/functions/fetchGemData?reportNumber=${certificationNumber}`);

        if (!response.ok) {
    const responseBody = await response.text();
    console.error('Server responded with:', responseBody);
    throw new Error('Failed to fetch gem data.');
      }


        const data = await response.json();
        gemDataElement.textContent = JSON.stringify(data.data, null, 2);
    } catch (error) {
        console.error('Error:', error);
        gemDataElement.textContent = 'Failed to fetch gem data. Please try again later.';
    }
});

