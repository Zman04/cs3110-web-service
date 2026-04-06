// Grab the elements from the DOM
const itemsContainer = document.getElementById('itemsContainer');
const newItemInput = document.getElementById('newItemInput');
const addBtn = document.getElementById('addBtn');

// GET
async function loadItems() {
    const response = await fetch('/api');
    const items = await response.json();

    // Clear the current list
    itemsContainer.innerText = '';

    items.forEach((item) => {
        const li = document.createElement('li');

        // Ask for the item's name specifically
        li.innerText = item.name + " ";

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        // Pass the database ID instead of the array index
        editBtn.onclick = () => editItem(item.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteItem(item.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        itemsContainer.appendChild(li);
    });
}

// POST
addBtn.addEventListener('click', async () => {
    const newItem = newItemInput.value.trim();
    if (!newItem) return alert("Please enter an item.");

    await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: newItem })
    });

    newItemInput.value = '';
    loadItems();
});

// PUT
async function editItem(id) {
    const updatedItem = prompt("Enter the new name for this item:");
    if (!updatedItem) return;

    // We pass the true database ID to the backend
    await fetch(`/api?index=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: updatedItem })
    });

    loadItems();
}

// DELETE
async function deleteItem(id) {
    // We pass the true database ID to the backend
    await fetch(`/api?index=${id}`, {
        method: 'DELETE'
    });

    loadItems();
}

loadItems();
