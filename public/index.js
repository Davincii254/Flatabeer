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

// Main entry point 
document.addEventListener('DOMContentLoaded', () => {
    getBeers('http://localhost:3000/beers');
    updateReviewListener();
    updateDescriptionListener();
})

// Fetch all beers from the database
const getBeers = async (url) => {
    const response = await fetch(url); 
    beerArray = await response.json();
    console.log(beerArray)
    mainBeerDisplay = beerArray[0];
    renderBeers(mainBeerDisplay);
    renderBeerMenu(beerArray);
};

// Generate a unique id for each beer based on its name and id
function createUniqueId(item) {
    const removeSpace = item.name.replace(/ |:| /g, ''); //Remove spaces and colons from the name
    const makeId = removeSpace.substring(0, 4) + item.id;  //Combines the name and id
    return makeId;
}

// Generate HTML for a single beer in the menu
function createHtmlBeerMenu(beer){
    const makeId = createUniqueId(beer);   // create a unique id for the beer
    return `<li id="${makeId}"> <a href='#'>${beer.name}</a> </li>`  // return menu item HTML
}



// Render the main beer details on the ui
const renderBeers = (beer) => {
    beerHeading.innerHTML = beer.name;      //Setting the beer name
    beerPic.src = beer.image_url;           //  set beer image
    beerDesc.innerHTML = beer.description;  // set beed description
    createReviews(beer);                     // rendering the beer reviews 
};   

// Render reviews for a beer
function createReviews(beer) {
    reviewArray = beer.reviews;             // Update reviewArray with the beer's reviews
    reviewDisplay.innerText = '';           // Clear the existing review display
    reviewArray.forEach(item => {           // Loop through each review
        const htmlReviews = createHtml(item);
        reviewDisplay.innerHTML += htmlReviews; // Add review to the UI
    });
}

function renderBeerMenu(array){
    sideListBeers.innerText = '';              // clear the menu 
    array.forEach( item => {                   // Loop through each beer
        const htmlMenu = createHtmlBeerMenu(item);
        sideListBeers.innerHTML += htmlMenu;   // Add beer to the menu
    });
    array.forEach(item => {
        menuEventListener(item);               // Add event listener to each beer
    })
}

// Generate a html for every single review
function createHtml(review){
    return `<li>${review}</li>`
}


// Add click event listener to each beer in the menu
function menuEventListener(item) {
    const makeId = createUniqueId(item);    // Generate unique ID for the beer
    const getIdentifier = document.querySelector(`#${makeId}`);
    getIdentifier.addEventListener('click', () => {
        mainBeerDisplay = item;             // Update mainBeerDisplay to the selected beer
        renderBeers(mainBeerDisplay);       // Render the selected beer on the main UI
    });
}

// Add event listener to the "Update Description" button
function updateDescriptionListener() {
    updateDescButton.addEventListener('click', (event) => {
        event.preventDefault();             // Prevent form default submission behavior
        updateDb();                          // Update the description in the database
        alert("Description updated");        // Notify the user of the update
    });
}

// Add event listener to the review submission button
function updateReviewListener() {
    submitReviewButton.addEventListener('click', (event) => {
        event.preventDefault();             // Prevent form default submission behavior
        updateDbReview();                   // Update the database with the new review
        reviewInput.value = '';             // Clear the review input field
    });
}

// Update the beer description in the database
function updateDb() {
    const updateDescription = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "description": beerDesc.value    // Send updated description to the database
        })
    };
    fetch(`http://localhost:3000/beers/${mainBeerDisplay.id}`, updateDescription)
        .then(response => response.json())
        .then(updatedDesc => {
            renderBeers(updatedDesc);       // Update the UI with the new description
        });
}

// Update beer reviews in the database
function updateDbReview() {
    reviewArray.unshift(reviewInput.value); // Add new review to the beginning of the array
    const updateReview = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "reviews": reviewArray          // Send updated reviews to the database
        })
    };
    fetch(`http://localhost:3000/beers/${mainBeerDisplay.id}`, updateReview)
        .then(response => response.json())
        .then(updatedReviews => {
            renderBeers(updatedReviews);    // Update the UI with the new reviews
        });
}