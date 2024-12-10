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

// Generate HTML for a single beer in the menu
function createHtmlBeerMenu(beer){
    const makeId = createUniqueId(beer);   // create a unique id for the beer
    return `<li id="${makeId}"> <a href='#'>${beer.name}</a> </li>`  // return menu item HTML
}

// Generate a unique id for each beer based on its name and id
function createUniqueId(item) {
    const removeSpace = item.name.replace(/ |:/g, ''); //Remove spaces and colons from the name
    const makeId = removeSpace.subString(0, 4) + item.id;  //Combines the name and id
    return makeId;
}

// Render the main beer details on the ui
const renderBeers = (beer) => {
    beerHeading.innerHTML = beer.name;      //Setting the beer name
    beerPic.src = beer.image_url;           //  set beer image
    beerDesc.innerHTML = beer.description;  // set beed description
    createReview(beer);                     // rendering the beer reviews 
};   

function createReview(beer){
    reviewArray = beer.reviews;            // Update the reviewArray with the beer's reviews
    reviewDisplay.innerText = '';            // Clear the existing review display
    reviewArray.forEach(item => {           // Loop through each array
        const htmlReviews = createElement(item); 
        reviewDisplay.innerHTML += htmlReviews;   //Add the reviews to the UI
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


