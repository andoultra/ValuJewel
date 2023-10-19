const jewelryForm = document.getElementById('jewelryForm');
const descriptionElement = document.getElementById('description');

// Reference to additional fields
const ringSizeElement = document.getElementById('ringSize');
const necklaceLengthElement = document.getElementById('necklaceLength');

// Add event listener to the jewelryType input to show/hide additional fields
document.getElementById('jewelryType').addEventListener('change', (event) => {
    const type = event.target.value;

    // Elements for the labels
    const ringSizeLabelElement = document.getElementById('ringSizeLabel');
    const necklaceLengthLabelElement = document.getElementById('necklaceLengthLabel');

    // Hide all additional inputs and labels initially
    if (ringSizeElement) ringSizeElement.style.display = 'none';
    if (ringSizeLabelElement) ringSizeLabelElement.style.display = 'none';

    if (necklaceLengthElement) necklaceLengthElement.style.display = 'none';
    if (necklaceLengthLabelElement) necklaceLengthLabelElement.style.display = 'none';

    if (type === 'ring' && ringSizeElement) {
        ringSizeElement.style.display = 'block';
        ringSizeLabelElement.style.display = 'block';
    } else if (type === 'necklace' && necklaceLengthElement) {
        necklaceLengthElement.style.display = 'block';
        necklaceLengthLabelElement.style.display = 'block';
    }
});

// Form submission event
jewelryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jewelryType = document.getElementById('jewelryType').value;
    const jewelryMaterial = document.getElementById('jewelryMaterial').value;
    const Cut = document.getElementById('Cut').value;

    const ringSize = ringSizeElement ? ringSizeElement.value : null;
    const necklaceLength = necklaceLengthElement ? necklaceLengthElement.value : null;

    const requestData = { 
        jewelryType, 
        jewelryMaterial, 
        Cut, 
        ringSize, 
        necklaceLength 
    };

    try {
        const response = await fetch('https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
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
