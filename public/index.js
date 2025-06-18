// 1. Selecting DOM Elements & Global Variables

// Selecting DOM elements
const beerHeading = document.querySelector(".beer-details h2");
const beerPic = document.querySelector("#image");
const beerDesc = document.querySelector(".description textarea");
const updateDescButton = document.querySelector(".description button");
const reviewInput = document.querySelector(".review-form textarea");
const submitReviewButton = document.querySelector("#submit");
const reviewDisplay = document.querySelector(".reviews");
const sideListBeers = document.querySelector("#list-of-beers");

// Global variables
let mainBeerDisplay; // Currently selected beer to display
let beerArray = [];  // Array to store beers fetched from the database
let reviewArray = []; // Array to store reviews for the selected beer

// 2. Main Entry Point

document.addEventListener('DOMContentLoaded', () => {
    getBeers('http://localhost:3000/beers'); // Initial fetch of beers
    updateReviewListener(); // Set up event listener for review submission
    updateDescriptionListener(); // Set up event listener for description update
});

// 3. R - Read Operations (Fetching and Displaying Data)

/**
 * Fetches all beers from the database and initializes the UI.
 * @param {string} url - The API endpoint for fetching beers.
 */
const getBeers = async (url) => {
    const response = await fetch(url);
    beerArray = await response.json();
    console.log(beerArray); // Log fetched data for debugging
    mainBeerDisplay = beerArray[0]; // Set the first beer as the default display
    renderBeers(mainBeerDisplay); // Render details of the first beer
    renderBeerMenu(beerArray); // Render the side menu with all beers
};

/**
 * Renders the main beer details (name, image, description) on the UI.
 * @param {object} beer - The beer object to display.
 */
const renderBeers = (beer) => {
    beerHeading.innerHTML = beer.name;
    beerPic.src = beer.image_url;
    beerDesc.innerHTML = beer.description;
    createReviews(beer); // Also renders the reviews for this beer
};

/**
 * Renders the reviews for a specific beer on the UI.
 * @param {object} beer - The beer object containing reviews.
 */
function createReviews(beer) {
    reviewArray = beer.reviews; // Update global reviewArray with the beer's reviews
    reviewDisplay.innerText = ''; // Clear existing reviews
    reviewArray.forEach(item => {
        const htmlReviews = createHtml(item); // Generate HTML for each review
        reviewDisplay.innerHTML += htmlReviews; // Add review HTML to the display
    });
}

/**
 * Renders the list of all beers in the side menu.
 * @param {Array<object>} array - An array of beer objects.
 */
function renderBeerMenu(array){
    sideListBeers.innerText = ''; // Clear existing menu items
    array.forEach( item => {
        const htmlMenu = createHtmlBeerMenu(item); // Generate HTML for each beer menu item
        sideListBeers.innerHTML += htmlMenu; // Add menu item HTML to the list
    });
    array.forEach(item => {
        menuEventListener(item); // Attach click event listener to each menu item
    })
}

/**
 * Generates HTML for a single beer menu item (helper for renderBeerMenu).
 * @param {object} beer - The beer object.
 * @returns {string} - HTML string for the menu item.
 */
function createHtmlBeerMenu(beer){
    const makeId = createUniqueId(beer);
    return `<li id="${makeId}"> <a href='#'>${beer.name}</a> </li>`
}

/**
 * Generates HTML for a single review (helper for createReviews).
 * @param {string} review - The review text.
 * @returns {string} - HTML string for the review list item.
 */
function createHtml(review){
    return `<li>${review}</li>`
}

// ------------------------------------------
// 4. U - Update Operations (Modifying Data)
// ------------------------------------------

/**
 * Updates the beer description in the database via a PATCH request.
 */
function updateDb() {
    const updateDescription = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "description": beerDesc.value
        })
    };
    fetch(`http://localhost:3000/beers/${mainBeerDisplay.id}`, updateDescription)
        .then(response => response.json())
        .then(updatedDesc => {
            renderBeers(updatedDesc); // Re-render UI with the updated description
        });
}

/**
 * Updates the beer reviews in the database by adding a new review.
 */
function updateDbReview() {
    reviewArray.unshift(reviewInput.value); // Add new review to the beginning of the local array
    const updateReview = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "reviews": reviewArray // Send the entire updated reviews array
        })
    };
    fetch(`http://localhost:3000/beers/${mainBeerDisplay.id}`, updateReview)
        .then(response => response.json())
        .then(updatedReviews => {
            renderBeers(updatedReviews); // Re-render UI with the new list of reviews
        });
}

// ------------------------------------------
// 5. Other Functions (Event Listeners & Utilities)
// ------------------------------------------

/**
 * Adds a click event listener to a single beer item in the side menu.
 * @param {object} item - The beer object associated with the menu item.
 */
function menuEventListener(item) {
    const makeId = createUniqueId(item);
    const getIdentifier = document.querySelector(`#${makeId}`);
    getIdentifier.addEventListener('click', () => {
        mainBeerDisplay = item; // Set the clicked beer as the main display beer
        renderBeers(mainBeerDisplay); // Render the selected beer's details
    });
}

/**
 * Sets up the event listener for the "Update Description" button.
 */
function updateDescriptionListener() {
    updateDescButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        updateDb(); // Call function to update description
        alert("Description updated"); // Simple user notification
    });
}

/**
 * Sets up the event listener for the review submission button.
 */
function updateReviewListener() {
    submitReviewButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        updateDbReview(); // Call function to add/update review
        reviewInput.value = ''; // Clear the review input field
    });
}

/**
 * Generates a unique HTML ID for a beer based on its name and ID.
 * @param {object} item - The beer object.
 * @returns {string} - A unique ID string.
 */
function createUniqueId(item) {
    const removeSpace = item.name.replace(/ |:| /g, '');
    const makeId = removeSpace.substring(0, 4) + item.id;
    return makeId;
}
