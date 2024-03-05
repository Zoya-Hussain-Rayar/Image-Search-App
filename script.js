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
    const response = await fetch(`${apiUrl}?query=${searchTerm}&client_id=${apiKey}&count=15&page=${currentPage}`);
    const data = await response.json();
    imagesData = data;
    displayImages(data);
});

// Event listener for pressing Enter key in the search input field
searchInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        searchBtn.click(); // Simulate click on the search button
    }
});

// Event listener for clicking the load more button
loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    const searchTerm = searchInput.value;
    const response = await fetch(`${apiUrl}?query=${searchTerm}&client_id=${apiKey}&count=15&page=${currentPage}`);
    const data = await response.json();
    imagesData = imagesData.concat(data);
    displayImages(data);
});

// Function to display images
function displayImages(images) {
    images.forEach((image, index) => {
        const columnIndex = index % 3; // Distribute images equally among the columns
        const column = document.querySelector(`.column${columnIndex + 1}`);
        const imageItem = document.createElement('div');
        imageItem.classList.add('imageItem');
        imageItem.setAttribute('onclick', `openOverlay(${index})`);
        const img = document.createElement('img');
        img.src = image.urls.small;
        img.alt = image.alt_description;
        imageItem.appendChild(img);
        column.appendChild(imageItem);
    });
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
    currentIndex = (currentIndex + 1) % imagesData.length;
    const imageUrl = imagesData[currentIndex].urls.full;
    overlayImg.src = imageUrl;
}

// Function to navigate to previous image in overlay
function prevImage() {
    currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
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