// HTML elements
const scoreCorrect = document.getElementById('score-correct');
const scoreIncorrect = document.getElementById('score-incorrect');
const cardIncorrect = document.getElementById('card-incorrect');
const cardCorrect = document.getElementById('card-correct');
const flashcardImage = document.getElementById('flashcard-image');
const flashcardQuestion = document.getElementById('flashcard-question');
const flashcardExplanation = document.getElementById('flashcard-explanation');

const mainMenuScreen = document.getElementById('main-menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');

// --- Flashcard Data Storage ---
const spatialDeck = [
    {
        id: 1,
        imageSrc: 'images/cs3160-hospital-image.png',
        question: "Which direction should I take to get to the hospital?",
        // x and y in percentages to be responsive to image scaling
        correctArea: { x: 70, y: 30, width: 20, height: 20 },
        explanation: "The hospital is located to the right."
    },
    {
        id: 2,
        imageSrc: 'images/cs3160-hallway-image.png',
        question: "Where is the emergency exit?",
        correctArea: { x: 40, y: 10, width: 20, height: 15 },
        explanation: "The glowing red sign above indicates the exit."
    },
    {
        id: 3,
        imageSrc: 'images/cs3160-parabola-image.png',
        question: "Click on the vertex of the parabola.",
        correctArea: { x: 45, y: 50, width: 10, height: 15 },
        explanation: "The vertex is the lowest or highest point of the parabola."
    }
];

// Initialization
let scoreCorrectCounter = 0;
let scoreIncorrectCounter = 0;
let currentCardIndex = 0;

// Loads the flashcard data onto the screen
function loadFlashcard(index) {
    if (index >= spatialDeck.length) {
        flashcardQuestion.innerText = "Deck Complete. Press 'Back to Menu' or 'R' to restart.";
        cardIncorrect.style.display = 'none'; // Hide the image area
        flashcardExplanation.innerText = "";
        return;
    }

    cardIncorrect.style.display = 'inline-block'; // Make sure image is visible
    const cardData = spatialDeck[index];

    flashcardImage.src = cardData.imageSrc;
    flashcardQuestion.innerText = cardData.question;
    flashcardExplanation.innerText = ""; // Clear explanation from previous card

    // Position the correct green area using percentages so it scales with the image
    cardCorrect.style.left = cardData.correctArea.x + "%";
    cardCorrect.style.top = cardData.correctArea.y + "%";
    cardCorrect.style.width = cardData.correctArea.width + "%";
    cardCorrect.style.height = cardData.correctArea.height + "%";

    // Make sure the correct card is attached to the DOM (since we removed it before)
    if (!document.getElementById('card-correct')) {
        cardIncorrect.appendChild(cardCorrect);
    }
}

// handleIncorrectClick handles clicks anywhere on the image outside the green box
const handleIncorrectClick = (event) => {
    console.log("Incorrect area was clicked.");
    scoreIncorrectCounter++;
    scoreIncorrect.innerText = scoreIncorrectCounter;

    if (currentCardIndex < spatialDeck.length) {
        flashcardExplanation.innerText = "Incorrect. " + spatialDeck[currentCardIndex].explanation;

        // Move to next card after a brief delay
        setTimeout(() => {
            currentCardIndex++;
            loadFlashcard(currentCardIndex);
        }, 2000);
    }
};

// handleCorrectClick handles clicks on the green box
const handleCorrectClick = (event) => {
    console.log("Correct area was clicked.");
    event.stopPropagation(); // Prevents the click from reaching cardIncorrect

    scoreCorrectCounter++;
    scoreCorrect.innerText = scoreCorrectCounter;

    if (currentCardIndex < spatialDeck.length) {
        flashcardExplanation.innerText = "Correct! " + spatialDeck[currentCardIndex].explanation;

        // Briefly remove the target box to give visual feedback
        cardCorrect.remove();

        // Move to next card after a brief delay
        setTimeout(() => {
            currentCardIndex++;
            loadFlashcard(currentCardIndex);
        }, 1500);
    }
};

const handleReset = (event) => {
    if (event.key === 'r' || event.key === 'R') {
        scoreIncorrectCounter = 0;
        scoreCorrectCounter = 0;
        currentCardIndex = 0;

        scoreIncorrect.innerText = scoreIncorrectCounter;
        scoreCorrect.innerText = scoreCorrectCounter;

        loadFlashcard(currentCardIndex);
    }
}

// --- Event Listeners ---
document.addEventListener("keydown", handleReset);
cardIncorrect.addEventListener("click", handleIncorrectClick);
cardCorrect.addEventListener("click", handleCorrectClick);

startBtn.addEventListener('click', () => {
    // Hide the menu, show the flashcards
    mainMenuScreen.style.display = 'none';
    flashcardScreen.style.display = 'block';

    // Load the first card when starting
    loadFlashcard(currentCardIndex);
});

backBtn.addEventListener('click', () => {
    // Hide the flashcards, show the menu
    flashcardScreen.style.display = 'none';
    mainMenuScreen.style.display = 'block';
});
