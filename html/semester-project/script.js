// HTML elements
const scoreCorrect = document.getElementById('score-correct')
const scoreIncorrect = document.getElementById('score-incorrect')
const cardIncorrect = document.getElementById('card-incorrect')
const cardCorrect = document.getElementById('card-correct')


// Initialization
let scoreCorrectCounter = 0;
let scoreIncorrectCounter = 0;


// handleIncorrectClick handles clicks on the red box
const handleIncorrectClick = (event) => {
    console.log("Red box was clicked.");
    scoreIncorrectCounter++;
    scoreIncorrect.innerText = scoreIncorrectCounter;
};
// handleCorrectClick handles clicks on the green box
const handleCorrectClick = (event) => {
    console.log("Green box was clicked.");

    /* stopPropagation is needed here because without it, when the green correct area is clicked, it
    propagates through and triggers an incorrect click event too. */
    event.stopPropagation();

    // Increments the incorrect counter and updates the text on screen
    scoreCorrectCounter++;
    scoreCorrect.innerText = scoreCorrectCounter;

    event.target.remove()

    const newCard = document.createElement("div");

    newCard.classList.add("card-correct");

    newCard.addEventListener("click", handleCorrectClick)

    cardIncorrect.append(newCard);
};

const handleReset = (event) => {
    console.log("Key was pressed.");

    if (event.key == 'r') {
        scoreIncorrectCounter = 0;
        scoreCorrectCounter = 0;

        scoreIncorrect.innerText = scoreIncorrectCounter;
        scoreCorrect.innerText = scoreCorrectCounter;
    }

}

document.addEventListener("keydown", handleReset)

cardIncorrect.addEventListener("click", handleIncorrectClick);
cardCorrect.addEventListener("click", handleCorrectClick)

// --- Screen Transition Logic ---
const mainMenuScreen = document.getElementById('main-menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');

startBtn.addEventListener('click', () => {
    // Hide the menu, show the flashcards
    mainMenuScreen.style.display = 'none';
    flashcardScreen.style.display = 'block'; 
});

backBtn.addEventListener('click', () => {
    // Hide the flashcards, show the menu
    flashcardScreen.style.display = 'none';
    mainMenuScreen.style.display = 'block';
});
