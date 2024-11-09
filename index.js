// Get references to the DOM elements
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const uploadButton = document.getElementById('uploadButton');
const resultContainer = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const uploadArea = document.getElementById('uploadArea');

// Handle image preview
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Display the image preview
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imagePreviewContainer.innerHTML = ''; // Clear previous previews
            imagePreviewContainer.appendChild(imgElement);
        };

        reader.readAsDataURL(file); // Convert the image to base64 string
    }
});

// Drag-and-drop functionality
uploadArea.addEventListener('click', function() {
    imageInput.click(); // Trigger the file input click when the user clicks the upload area
});

uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over'); // Add hover effect when dragging
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over'); // Reset hover effect
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over'); // Reset hover effect

    const file = e.dataTransfer.files[0];
    imageInput.files = e.dataTransfer.files; // Update file input with the dropped file

    // Trigger change event to show preview
    const changeEvent = new Event('change');
    imageInput.dispatchEvent(changeEvent);
});

// Handle image upload
uploadButton.addEventListener('click', function() {
    const file = imageInput.files[0];

    if (!file) {
        alert('Please select an image first!');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64String = reader.result.split(',')[1]; // Remove the "data:image/png;base64," prefix if it's there

        // Show loading overlay
        loadingOverlay.style.display = 'flex';

        // The fixed base URL for uploading the image (ngrok URL)
        const uploadUrl = 'https://kite-prompt-koi.ngrok-free.app/images/upload'; // Fixed URL

        // Send the base64 string to the fixed URL
        fetch(uploadUrl, {  // Use the fixed ngrok URL directly
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64String }), // Send the base64 string as JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Image uploaded successfully:', data);
            resultContainer.textContent = 'Image uploaded successfully!';
            resultContainer.style.color = 'green';
            // Hide the loading overlay
            loadingOverlay.style.display = 'none';
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            resultContainer.textContent = 'Error uploading image.';
            resultContainer.style.color = 'red';
            // Hide the loading overlay
            loadingOverlay.style.display = 'none';
        });
    };

    reader.readAsDataURL(file);  // Convert the image file to base64
});
