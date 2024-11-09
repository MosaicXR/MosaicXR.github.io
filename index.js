// script.js

// Get references to the DOM elements
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const uploadButton = document.getElementById('uploadButton');
const resultContainer = document.getElementById('result');

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

        // The fixed base URL for uploading the image
        const uploadUrl = 'https://kite-prompt-koi.ngrok-free.app/images/upload';

        // Send the base64 string to the fixed URL
        fetch(uploadUrl, {  // Use the fixed URL directly
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
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            resultContainer.textContent = 'Error uploading image. Please check the URL.';
            resultContainer.style.color = 'red';
        });
    };

    reader.readAsDataURL(file);  // Convert the image file to base64
});
