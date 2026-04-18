// HTML elements
const scoreCorrect = document.getElementById('score-correct');
const scoreIncorrect = document.getElementById('score-incorrect');
const cardIncorrect = document.getElementById('card-incorrect');
const cardCorrect = document.getElementById('card-correct');
const flashcardImage = document.getElementById('flashcard-image');
const flashcardQuestion = document.getElementById('flashcard-question');
const flashcardExplanation = document.getElementById('flashcard-explanation');

const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
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

const saveCardBtn = document.getElementById('save-card-btn');
const cardPromptInput = document.getElementById('card-prompt-input');
const imageFileInput = document.getElementById('image-file-input');
const cardListContainer = document.getElementById('card-list-container');
const dropzonePreview = document.getElementById('dropzone-preview');
const dropzonePlaceholder = document.getElementById('dropzone-placeholder');
const correctAreaContainer = document.getElementById('correct-area-container');
const correctAreaSelector = document.getElementById('correct-area-selector');
const correctAreaPlaceholder = document.getElementById('correct-area-placeholder');
const correctAreaBg = document.getElementById('correct-area-bg');

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
let selectorRectPct = {x: 10, y: 10, width: 30, height: 30};
let dragState = null;

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

let pendingImageSrc = '';

function resetAddCardForm() {
    pendingImageSrc = '';
    cardPromptInput.value = '';
    imageFileInput.value = '';

    dropzonePreview.src = '';
    dropzonePlaceholder.style.display = 'block';
    dropzonePreview.style.display = 'none';

    correctAreaBg.src = '';
    correctAreaBg.style.display = 'none';
    correctAreaSelector.style.display = 'none';
    correctAreaPlaceholder.style.display = 'block';
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

function renderCardTitleList(deckKey) {
    cardListContainer.replaceChildren();

    const deck = decks[deckKey] || [];
    if (deck.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.style.padding = '10px';
        emptyState.innerText = 'No cards yet.';
        cardListContainer.appendChild(emptyState);
        return;
    }

    deck.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = 'card-list-item';
        item.style.padding = '8px 10px';
        item.style.borderBottom = '1px solid #e6efe9';

        const title = card.question && card.question.trim() !== ''
            ? card.question
            : `Untitled card ${index + 1}`;

        item.textContent = `${index + 1}. ${title}`;
        cardListContainer.appendChild(item);
    });
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
    renderCardTitleList(selectedDeckKey);
});

detailsBackBtn.addEventListener('click', () => {
    hideAllScreens();
    mainMenuScreen.style.display = 'block';
});

// Edit Deck Screen Listeners
addCardBtn.addEventListener('click', () => {
    resetAddCardForm();
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

imageFileInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        imageFileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        pendingImageSrc = reader.result;

        // Left preview
        dropzonePreview.src = pendingImageSrc;
        dropzonePreview.style.display = 'block';
        dropzonePlaceholder.style.display = 'none';

        // Right panel background
        correctAreaBg.src = pendingImageSrc;
        correctAreaBg.style.display = 'block';
        correctAreaPlaceholder.style.display = 'none';

        // Keep selector hidden for now
        correctAreaSelector.style.display = 'block';

        selectorRectPct = { x: 10, y: -100, width: 30, height: 30 };
        correctAreaSelector.style.display = 'block';
        requestAnimationFrame(renderSelectorFromPct);
    };

    reader.readAsDataURL(file);
});

saveCardBtn.addEventListener('click', () => {
    if (!selectedDeckKey || !decks[selectedDeckKey]) {
        alert('No deck selected. Go back and choose a deck first.');
        return;
    }

    if (!pendingImageSrc) {
        alert('Please upload an image before saving.');
        return;
    }

    const promptText = cardPromptInput.value.trim();

    const newCard = {
        id: Date.now(),
        imageSrc: pendingImageSrc,
        question: promptText || 'Untitled card',
        correctArea: { ...selectorRectPct},
        explanation: ''
    };

    decks[selectedDeckKey].push(newCard);
    renderCardTitleList(selectedDeckKey);

    alert('Card saved to deck.');
    addCardModal.style.display = 'none';
    resetAddCardForm();
});
correctAreaSelector.addEventListener('pointerdown', (event) => {
    if (!pendingImageSrc) return;

    const selectorRect = correctAreaSelector.getBoundingClientRect();
    const containerRect = correctAreaContainer.getBoundingClientRect();

    dragState = {
        offsetX: event.clientX - selectorRect.left,
        offsetY: event.clientY - selectorRect.top,
        selectorWidth: selectorRect.width,
        selectorHeight: selectorRect.height,
        containerLeft: containerRect.left,
        containerTop: containerRect.top
    };

    correctAreaSelector.setPointerCapture(event.pointerId);
});

window.addEventListener('pointermove', (event) => {
    if (!dragState) return;

    const bounds = getImageBoundsInContainer();

    let newLeftPx = event.clientX - dragState.containerLeft - dragState.offsetX;
    let newTopPx = event.clientY - dragState.containerTop - dragState.offsetY;

    newLeftPx = clamp(newLeftPx, bounds.left, bounds.left + bounds.width - dragState.selectorWidth);
    newTopPx = clamp(newTopPx, bounds.top, bounds.top + bounds.height - dragState.selectorHeight);

    selectorRectPct.x = ((newLeftPx - bounds.left) / bounds.width) * 100;
    selectorRectPct.y = ((newTopPx - bounds.top) / bounds.height) * 100;

    renderSelectorFromPct();
});

window.addEventListener('pointerup', () => {
    dragState = null;
});


function getImageBoundsInContainer() {
    const c = correctAreaContainer.getBoundingClientRect();
    const i = correctAreaBg.getBoundingClientRect();

    return {
        left: i.left - c.left,
        top: i.top - c.top,
        width: i.width,
        height: i.height
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function renderSelectorFromPct() {
    const bounds = getImageBoundsInContainer();
    if (!bounds.width || !bounds.height) return;

    const leftPx = bounds.left + (selectorRectPct.x / 100) * bounds.width;
    const topPx = bounds.top + (selectorRectPct.y / 100) * bounds.height;
    const widthPx = (selectorRectPct.width / 100) * bounds.width;
    const heightPx = (selectorRectPct.height / 100) * bounds.height;

    correctAreaSelector.style.left = `${leftPx}px`;
    correctAreaSelector.style.top = `${topPx}px`;
    correctAreaSelector.style.width = `${widthPx}px`;
    correctAreaSelector.style.height = `${heightPx}px`;
}