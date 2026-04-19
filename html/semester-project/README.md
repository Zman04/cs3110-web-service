This project is the baseline for a flashcard application. The cards will be designed around spacial answering (click the right spot on the image). 

The user can bypass login to see the main menu currently where they are met with two sample decks: "Spatial Directions", and
"Deck 2". The user can click on these sample decks adn are then given the option to either "Study" or "Edit" the deck.

When "Study" is clicked. The user is able to interract with the flashcards stored in the deck.

**Study**
A question, an image, and a correct area is shown for each flashcard. The user must click on the defined correct area in order to get the question correct and the correct counter increments. If the user clicks anywhere other than this correct area, the question is counted as incorrect and the incorrect counter increments.

**Edit**
In edit mode, the user can click on the edit button. A skeleton is shown for the edit function, but the logic is coming in a later sprint.

Next sprint: Now that we can create new card decks, the user should be able to create 
and save their cards. Storing the uploaded image as well as the user defined “correct area.” 
I will have to refine the functionality so that images will be saved when inserted and the 
draggable area is also saved. The save card button will be functional.

python3 -m http.server 8000