   const apiKey = 'O6927LOqx1DiiUXcmFXEnGdq_puDNFd6z0aQL4_snqg';
        const apiUrl = 'https://api.unsplash.com/photos/random';
        let currentIndex = 0;
        let imagesData = [];
        let currentPage = 1;
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const imageContainer = document.getElementById('imageContainer');
        const overlay = document.getElementById('overlay');
        const overlayImg = document.getElementById('overlayImg');

  // Event listener for clicking the search button
        searchBtn.addEventListener('click', async () => {
            currentPage = 1;
            const searchTerm = searchInput.value;
            // Clear existing images
            clearImages();
            // Fetch new images based on the search term
            const response = await fetch(`${apiUrl}?query=${searchTerm}&client_id=${apiKey}&count=15&page=${currentPage}`);
            const data = await response.json();
            imagesData = data;
            displayImages(data);
        });

        // Function to clear existing images
        function clearImages() {
            const imageColumns = document.querySelectorAll('.imageItem');
            imageColumns.forEach(column => {
                column.innerHTML = ''; // Remove all child elements
            });
        }

        // Event listener for clicking the load more button
        loadMoreBtn.addEventListener('click', async () => {
            currentPage++;
            const searchTerm = searchInput.value;
            const response = await fetch(`${apiUrl}?query=${searchTerm}&client_id=${apiKey}&count=15&page=${currentPage}`);
            const data = await response.json();
            const startIndex = imagesData.length; // Get the starting index for newly loaded images
            imagesData = imagesData.concat(data);
            displayImages(data, startIndex); // Pass the starting index to displayImages
        });

// Function to display images
function displayImages(images) {
  images.forEach((image, index) => {
                const columnIndex = index % 3; // Distribute images equally among the columns
                const column = document.querySelector(`.column${columnIndex + 1}`);
                const imageItem = document.createElement('div');
                imageItem.classList.add('imageItem');
                const img = document.createElement('img');
                img.src = image.urls.small;
                img.alt = image.alt_description;

                // Create download button
                const downloadBtn = document.createElement('button');
                downloadBtn.classList.add('downloadBtn');
                downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'; // Font Awesome icon
 downloadBtn.addEventListener('click', () => downloadImage(image.urls.full, `${image.alt_description || 'image'}_${index + 1}.jpg`));

                // Add click event listener to open overlay on image click
                img.addEventListener('click', () => {
                    openOverlay(index);
                });
           // Append elements to image item
                imageItem.appendChild(img);
                imageItem.appendChild(downloadBtn);
                column.appendChild(imageItem);
            });
        }
  // Function to download image
        function downloadImage(imageUrl, fileName) {
            fetch(imageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Download failed:', error));
        }


    // Function to open overlay with full-size image
        function openOverlay(index) {
            currentIndex = index;
            const imageUrl = imagesData[index].urls.full;
            overlayImg.src = imageUrl;
            overlay.style.display = 'block';
        }

        // Function to close overlay
        function closeOverlay() {
            overlay.style.display = 'none';
        }

        // Function to navigate to next image in overlay
        function nextImage() {
            if (currentIndex < imagesData.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            const imageUrl = imagesData[currentIndex].urls.full;
            overlayImg.src = imageUrl;
        }

        // Function to navigate to previous image in overlay
        function prevImage() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = imagesData.length - 1;
            }
            const imageUrl = imagesData[currentIndex].urls.full;
            overlayImg.src = imageUrl;
        }

        // Fetch images and display them when the page loads
        window.onload = async () => {
            const response = await fetch(`${apiUrl}?client_id=${apiKey}&count=15`);
            const data = await response.json();
            imagesData = data;
            displayImages(data);
        };
