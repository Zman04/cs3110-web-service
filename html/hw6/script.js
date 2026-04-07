const itemsContainer = document.getElementById('itemsContainer');
const newItemInput = document.getElementById('newItemInput');
const addBtn = document.getElementById('addBtn');
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');

// State Management
let currentUser = null;

// AUTHENTICATION
async function handleAuth(endpoint) {
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    if (!usernameInput || !passwordInput) return alert("Please enter both fields.");

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: usernameInput, password: passwordInput })
    });

    if (res.ok) {
        if (endpoint === '/api/login') {
            const data = await res.json();
            currentUser = data.username; // Store user in memory
            authSection.style.display = 'none';
            appSection.style.display = 'block';
            loadItems();
        } else {
            alert("Registered successfully! You can now log in.");
        }
    } else {
        const errText = await res.text();
        alert(errText);
    }
}

function logout() {
    currentUser = null; // Clear memory
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    itemsContainer.innerHTML = '';
}

// CRUD OPERATIONS
async function loadItems() {
    if (!currentUser) return; // Don't load if not logged in

    const response = await fetch(`/api?username=${currentUser}`);
    const items = await response.json();

    itemsContainer.innerText = '';

    items.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = item.name + " ";

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => editItem(item.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteItem(item.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        itemsContainer.appendChild(li);
    });
}

addBtn.addEventListener('click', async () => {
    const newItem = newItemInput.value.trim();
    if (!newItem) return alert("Please enter an item.");

    await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: newItem, username: currentUser })
    });

    newItemInput.value = '';
    loadItems();
});

async function editItem(id) {
    const updatedItem = prompt("Enter the new name for this item:");
    if (!updatedItem) return;

    await fetch(`/api?index=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ newItem: updatedItem, username: currentUser })
    });

    loadItems();
}

async function deleteItem(id) {
    await fetch(`/api?index=${id}&username=${currentUser}`, {
        method: 'DELETE'
    });

    loadItems();
}
