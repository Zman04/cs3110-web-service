// Grab the elements from the DOM
const itemsContainer = document.getElementById('itemsContainer');
const newItemInput = document.getElementById('newItemInput');
const addBtn = document.getElementById('addBtn');

// 1. GET: Load
async function loadItems() {
    const response = await fetch('/api');
    const items = await response.json();

    // Clear the current list
    itemsContainer.innerText = '';

    items.forEach((item, index) => {
        const li = document.createElement('li');

        // innerText safely handles the item string, preventing XSS
        li.innerText = item + " ";

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => editItem(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteItem(index);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        itemsContainer.appendChild(li);
    });
}

// 2. POST: Create
addBtn.addEventListener('click', async () => {
    const newItem = newItemInput.value.trim();
    if (!newItem) return alert("Please enter an item.");

    await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: newItem })
    });

    // Clear the input box and instantly reload the list to show the change
    newItemInput.value = '';
    loadItems();
});

// 3. PUT: Edit
async function editItem(index) {
    const updatedItem = prompt("Enter the new name for this item:");
    if (!updatedItem) return; // Stop if they hit cancel or leave it blank

    await fetch(`/api?index=${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: updatedItem })
    });

    // Reload the list to show the updated item
    loadItems();
}

// 4. DELETE: Remove
async function deleteItem(index) {

    await fetch(`/api?index=${index}`, {
        method: 'DELETE'
    });

    // Reload the list to show the item is gone
    loadItems();
}

loadItems();
