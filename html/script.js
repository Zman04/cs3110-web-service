// Grab the elements from the DOM
const itemsContainer = document.getElementById('itemsContainer');
const newItemInput = document.getElementById('newItemInput');
const addBtn = document.getElementById('addBtn');

// 1. GET: Load content via AJAX
async function loadItems() {
    const response = await fetch('/api');
    const items = await response.json();

    // Clear the current list
    itemsContainer.innerText = '';

    // Loop through and just create simple list items
    items.forEach(item => {
        const li = document.createElement('li');
        
        // innerText safely handles the item string, preventing XSS
        li.innerText = item;
        
        itemsContainer.appendChild(li);
    });
}

// 2. POST: Create something via AJAX
addBtn.addEventListener('click', async () => {
    const newItem = newItemInput.value.trim();
    if (!newItem) return alert("Please enter an item!");

    // Send data
    await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: newItem })
    });

    // Clear the input box and instantly reload the list to show the change!
    newItemInput.value = '';
    loadItems();
});

loadItems();
