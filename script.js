// JavaScript code in your frontend
const descriptionContainer = document.getElementById('description-container');

// Function to fetch the description from your server
async function fetchDescription() {
  try {
    const response = await fetch('/https://willowy-pie-2fe033.netlify.app/.netlify/functions/generate-description'); // Update with the correct URL
    if (response.ok) {
      const data = await response.json();
      const description = data.description;
      descriptionContainer.textContent = description;
    } else {
      console.error('Failed to fetch description:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to fetch and display the description
fetchDescription();
