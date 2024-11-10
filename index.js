// Get references to the DOM elements
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const uploadButton = document.getElementById('uploadButton');
const resultContainer = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const uploadArea = document.getElementById('uploadArea');
const clearButton = document.getElementById('clearButton'); // Clear All button reference

// To store base64 images for uploading
let base64Images = [];

// Handle image preview
imageInput.addEventListener('change', function(event) {
    const files = event.target.files; // Get all selected files

    if (files.length) {
        // Loop through the files and add them to the preview container
        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.style.opacity = 0; // Initially set opacity to 0 for smooth fade-in
                imagePreviewContainer.appendChild(imgElement);

                // Fade-in effect using transition
                setTimeout(() => {
                    imgElement.style.opacity = 1;
                }, 0);

                // Store base64 string of each image
                base64Images.push(e.target.result.split(',')[1]); // Remove the base64 prefix (data:image/png;base64,)

                // Add event listener for the shine effect and removal on click
                imgElement.addEventListener('click', function() {
                    imgElement.classList.add('fade-out', 'scatter'); // Apply fade-out and scatter effect
                    setTimeout(() => {
                        imgElement.remove(); // Remove image after fade-out
                        base64Images = base64Images.filter(base64 => base64 !== e.target.result.split(',')[1]);
                    }, 500); // Match the timing with the animation duration
                });
            };

            reader.readAsDataURL(file); // Convert each file to base64 string
        });
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

    const files = e.dataTransfer.files; // Get the dropped files

    // Append dropped files to the input field (this won't overwrite existing files)
    const currentFiles = imageInput.files;
    const newFiles = [...currentFiles, ...files];
    imageInput.files = new FileList(...newFiles); // Combine current files with new files

    // Trigger change event to show previews
    const changeEvent = new Event('change');
    imageInput.dispatchEvent(changeEvent);
});

// Handle image upload
uploadButton.addEventListener('click', function() {
    if (base64Images.length === 0) {
        alert('Please select at least one image first!');
        return;
    }

    
    // Show loading overlay while uploading
    loadingOverlay.style.display = 'flex';

    // The fixed base URL for uploading the image (ngrok URL)
    const uploadUrl = 'https://kite-prompt-koi.ngrok-free.app/images/upload-multiple'; // Fixed URL

    // Send the base64 strings to the fixed URL
    fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: base64Images }), // Send the array of base64 images
    })
    .then(response => response.json())
    .then(data => {
        console.log('Images uploaded successfully:', data);

        // Fade out the images and add scatter effect
        const images = imagePreviewContainer.querySelectorAll('img');
        images.forEach((img, index) => {
            // Add scatter effect by adding class
            img.classList.add('fade-out', 'scatter');
        });

        // After fade out, clear previews and reset base64 images
        setTimeout(() => {
            imagePreviewContainer.innerHTML = ''; // Clear preview container
            base64Images = []; // Reset base64 image data
        }, 500); // Match the timing with the animation duration

        // Update result message and apply success styling
        resultContainer.textContent = 'Images uploaded successfully!';
        resultContainer.classList.add('success'); // Apply success styling
        resultContainer.classList.remove('error'); // Ensure error class is removed
        loadingOverlay.style.display = 'none'; // Hide loading overlay after upload completes
    })
    .catch(error => {
        console.error('Error uploading images:', error);

        // Update result message and apply error styling
        resultContainer.textContent = 'Error uploading images. Please try again.';
        resultContainer.classList.add('error'); // Apply error styling
        resultContainer.classList.remove('success'); // Ensure success class is removed
        loadingOverlay.style.display = 'none'; // Hide loading overlay if upload fails
    });
});

// Clear all images and reset previews when the clear button is clicked
clearButton.addEventListener('click', function() {
    const images = imagePreviewContainer.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('fade-out', 'scatter'); // Apply fade-out and scatter effect
    });

    setTimeout(() => {
        imagePreviewContainer.innerHTML = ''; // Clear all images from the preview container
        base64Images = []; // Reset the base64 images array
        resultContainer.textContent = ''; // Clear the result message
        resultContainer.classList.remove('success', 'error'); // Remove success and error classes
        imageInput.value = ''; // Reset the file input to allow re-uploading the same images
    }, 500); // Wait for the fade-out animation to finish before clearing images
});
