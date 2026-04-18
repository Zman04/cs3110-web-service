// HTML elements
const scoreCorrect = document.getElementById('score-correct');
const scoreIncorrect = document.getElementById('score-incorrect');
const cardIncorrect = document.getElementById('card-incorrect');
const cardCorrect = document.getElementById('card-correct');
const flashcardImage = document.getElementById('flashcard-image');
const flashcardQuestion = document.getElementById('flashcard-question');
const flashcardExplanation = document.getElementById('flashcard-explanation');

const loginScreen = document.getElementById('login-screen');const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

const mainMenuScreen = document.getElementById('main-menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const startBtn = document.getElementById('start-btn');
const deck2Btn = document.getElementById('deck2-btn');
const backBtn = document.getElementById('back-btn');
const createDeckBtn = document.getElementById('create-deck-btn');

const deckDetailsScreen = document.getElementById('deck-details-screen');
const deckDetailsTitle = document.getElementById('deck-details-title');
const studyDeckBtn = document.getElementById('study-deck-btn');
const editDeckBtn = document.getElementById('edit-deck-btn');
const detailsBackBtn = document.getElementById('details-back-btn');

const editDeckScreen = document.getElementById('edit-deck-screen');
const addCardBtn = document.getElementById('add-card-btn');
const editBackBtn = document.getElementById('edit-back-btn');

const addCardModal = document.getElementById('add-card-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

let selectedDeckKey = null;
let selectedDeckName = null;

// --- Flashcard Data Storage ---
const decks = {
    spatial: [
        {
            id: 1,
            imageSrc: 'images/cs3160-hospital-image.png',
            question: "Which direction should I take to get to the hospital?",
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
    ],
    deck2: [
        {
            id: 1,
            imageSrc: 'https://via.placeholder.com/400x300?text=Deck+2+Sample',
            question: "Click anywhere on this sample image.",
            correctArea: { x: 0, y: 0, width: 100, height: 100 },
            explanation: "This is a placeholder for Deck 2."
        }
    ]
};

// Initialization
let currentDeck = decks.spatial;
let scoreCorrectCounter = 0;
let scoreIncorrectCounter = 0;
let currentCardIndex = 0;

// Loads the flashcard data onto the screen
function loadFlashcard(index) {
    if (index >= currentDeck.length) {
        flashcardQuestion.innerText = "Deck Complete. Press 'Back to Menu' or 'R' to restart.";
        cardIncorrect.style.display = 'none'; // Hide the image area
        flashcardExplanation.innerText = "";
        return;
    }

    cardIncorrect.style.display = 'inline-block'; // Make sure image is visible
    const cardData = currentDeck[index];

    flashcardImage.src = cardData.imageSrc;
    flashcardQuestion.innerText = cardData.question;
    flashcardExplanation.innerText = ""; // Clear explanation from previous card

    // Position the correct green area using percentages so it scales with the image
    cardCorrect.style.left = cardData.correctArea.x + "%";
    cardCorrect.style.top = cardData.correctArea.y + "%";
    cardCorrect.style.width = cardData.correctArea.width + "%";
    cardCorrect.style.height = cardData.correctArea.height + "%";

    // Make sure the correct card is attached to the DOM
    if (!document.getElementById('card-correct')) {
        cardIncorrect.appendChild(cardCorrect);
    }
}

// handleIncorrectClick handles clicks anywhere on the image outside the green box
const handleIncorrectClick = (event) => {
    scoreIncorrectCounter++;
    scoreIncorrect.innerText = scoreIncorrectCounter;

    if (currentCardIndex < currentDeck.length) {
        flashcardExplanation.innerText = "Incorrect. " + currentDeck[currentCardIndex].explanation;

        // Move to next card after a brief delay
        setTimeout(() => {
            currentCardIndex++;
            loadFlashcard(currentCardIndex);
        }, 2000);
    }
};

// handleCorrectClick handles clicks on the green box
const handleCorrectClick = (event) => {
    event.stopPropagation(); // Prevents the click from reaching cardIncorrect

    scoreCorrectCounter++;
    scoreCorrect.innerText = scoreCorrectCounter;

    if (currentCardIndex < currentDeck.length) {
        flashcardExplanation.innerText = "Correct! " + currentDeck[currentCardIndex].explanation;

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

function startDeck(deckKey) {
    if (decks[deckKey]) {
        currentDeck = decks[deckKey];
        currentCardIndex = 0;
        scoreCorrectCounter = 0;
        scoreIncorrectCounter = 0;
        scoreCorrect.innerText = 0;
        scoreIncorrect.innerText = 0;

        deckDetailsScreen.style.display = 'none';
        flashcardScreen.style.display = 'block';
        loadFlashcard(currentCardIndex);
    }
}

// --- UI Navigation Methods ---
function showDeckDetails(deckKey, deckName) {
    selectedDeckKey = deckKey;
    selectedDeckName = deckName;
    
    deckDetailsTitle.innerText = deckName;
    
    mainMenuScreen.style.display = 'none';
    deckDetailsScreen.style.display = 'block';
}

function hideAllScreens() {
    loginScreen.style.display = 'none';
    mainMenuScreen.style.display = 'none';
    flashcardScreen.style.display = 'none';
    deckDetailsScreen.style.display = 'none';
    editDeckScreen.style.display = 'none';
    addCardModal.style.display = 'none';
}

function showStartScreen() {
    hideAllScreens();
    loginScreen.style.display = 'block';
}

// --- Event Listeners ---
loginBtn.addEventListener('click', () => {
    hideAllScreens();
    mainMenuScreen.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    showStartScreen();
});

document.addEventListener("keydown", handleReset);
cardIncorrect.addEventListener("click", handleIncorrectClick);
cardCorrect.addEventListener("click", handleCorrectClick);

startBtn.addEventListener('click', () => showDeckDetails('spatial', 'Spatial Directions'));
deck2Btn.addEventListener('click', () => showDeckDetails('deck2', 'Deck 2'));

// Deck Details Screen Listeners
studyDeckBtn.addEventListener('click', () => {
    if (selectedDeckKey) startDeck(selectedDeckKey);
});

editDeckBtn.addEventListener('click', () => {
    hideAllScreens();
    editDeckScreen.style.display = 'block';
});

detailsBackBtn.addEventListener('click', () => {
    hideAllScreens();
    mainMenuScreen.style.display = 'block';
});

// Edit Deck Screen Listeners
addCardBtn.addEventListener('click', () => {
    addCardModal.style.display = 'flex';
});

editBackBtn.addEventListener('click', () => {
    hideAllScreens();
    deckDetailsScreen.style.display = 'block';
});

// Add Card Modal Listeners
closeModalBtn.addEventListener('click', () => {
    addCardModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addCardModal) {
        addCardModal.style.display = 'none';
    }
});

backBtn.addEventListener('click', () => {
    flashcardScreen.style.display = 'none';
    mainMenuScreen.style.display = 'block';
});

createDeckBtn.addEventListener('click', () => {
    const deckName = prompt("Enter a name for the new deck:");
    if (deckName && deckName.trim() !== "") {
        const deckKey = deckName.trim().toLowerCase().replace(/\s+/g, '-');
        
        if (decks[deckKey]) {
            alert("A deck with this name already exists.");
            return;
        }

        // Create empty deck
        decks[deckKey] = [];

        // Add to DOM
        const deckList = document.getElementById('deck-list');
        const newDeckBtn = document.createElement('button');
        newDeckBtn.className = 'deck-btn';
        newDeckBtn.id = deckKey + '-btn';
        newDeckBtn.innerText = deckName.trim();
        
        newDeckBtn.addEventListener('click', () => showDeckDetails(deckKey, deckName.trim()));
        
        deckList.appendChild(newDeckBtn);
    }
});
