// Import the 'http' module (built-in to Node.js)
const http = require('http');
const url = require('url'); // Optional helper, but modern Node uses the URL class
const path = require('path');

// Require bcrypt for password hashing
const bcrypt = require('bcrypt');

// Require Sequelize for database management
const { Sequelize, DataTypes } = require('sequelize');

// Set up Sequelize with SQLite
// Using path.join ensures the database file is created in the same directory as app.js
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite')
});

// Verify the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the SQLite database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Define the User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define the Card model
const Card = sequelize.define('Card', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deckName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    explanation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageSrc: {
        type: DataTypes.TEXT, // TEXT for potential base64 strings
        allowNull: false
    },
    correctArea: {
        type: DataTypes.JSON, // JSON to store {x, y, width, height}
        allowNull: false
    }
});

// Sync the models with the database
sequelize.sync()
    .then(() => console.log('Database synced successfully.'))
    .catch(err => console.error('Error syncing database:', err));

let itemsList = ["apple", "banana", "cherry"];

// Function to handle all incoming browser requests
const handleRequest = (req, res) => {
    
    // Use the request URL and the host to create a searchable object
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    // Accessing the 'query' part of the URL
    const queryParams = parsedUrl.searchParams;

    // Check if the user is visiting our /api path
    if (parsedUrl.pathname === "/api") {
        
        // --- HANDLE GET (Read Data) ---
        if (req.method === "GET") {
	    // GET endpoint parameters
	    if (queryParams.has("index")) {
		const index = parseInt(queryParams.get("index")); // Get the number

	    // If that item exists in our array
	    if (itemsList[index]) {
		res.writeHead(200, { "Content-Type": "application/json" });
		return res.end(JSON.stringify({ item: itemsList[index] } ));
	    } else {
		// get 404 (If the item doesn't exist)
		res.writeHead(404, { "Content-Type": "text/plain" });
		return res.end("404 Error: Item not found");
		}
	    }

	    // GET endpoint if no parameters are given
            res.writeHead(200, { "Content-Type": "text/plain" });
            return res.end(JSON.stringify(itemsList));
        }
        
        // --- HANDLE POST (Create Data) ---
        else if (req.method === "POST") {
            let body = "";
            // As data arrives in 'chunks' (Buffers), convert to string and collect
            req.on("data", (chunk) => { body += chunk.toString(); });

            // Once the stream is finished, we process the full data
            req.on("end", () => {
                console.log("Received POST data:", body);
		
		// Extract the new item
		const parsedBody = new URLSearchParams(body);

		// Check query params or the parsed body or the raw body
		const newItem = queryParams.get("newItem") || parsedBody.get("newItem") || body.trim();

		// POST Errors
		if (!newItem || newItem === "") {
		    res.writeHead(400, {"Content-Type": "text/plain" });
		    return res.end("400 Bad Request: Missing item data.");
		}
		// post endpoin
		itemsList.push(newItem);

                res.writeHead(201, { "Content-Type": "application/json" });
		return res.end(JSON.stringify({ message: "Data Created!", list: itemsList }));
            });
        }
        
        // --- HANDLE PUT (Update Data) ---
        else if (req.method === "PUT") {
            let body = "";
            req.on("data", (chunk) => { body += chunk.toString(); });

            req.on("end", () => {
                // Get the index from the url (?index=1)
		const index = queryParams.get("index");

		// Extract the new text from the body
		const parsedBody = new URLSearchParams(body);
		const updatedItem = parsedBody.get("newItem") || body.trim();

		// Error handling: 400 if index is missing, doesn't exist, or body is empty
		if (!index || !itemsList[index] || !updatedItem || updatedItem === "") {
		    res.writeHead(400, { "Content-Type": "text/plain" });
		    return res.end("400 Bad Request: Missing valid index or data to update.");
		}

		// Update the global array
		itemsList[index] = updatedItem;

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data Updated Successfully!", list: itemsList }));
            });
        }

	// --- HANDLE DELETE (Remove Data) ---
        else if (req.method === "DELETE") {
            // 1. Get the index from the URL (?index=1)
            const index = queryParams.get("index");

            // 2. Error handling: 400 if index is missing or doesn't exist
            if (!index || !itemsList[index]) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("400 Bad Request: Missing or invalid index.");
            }

            // 3. Remove the item from the global array using splice
            const removedItem = itemsList.splice(index, 1);
            
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: `Successfully deleted ${removedItem}`, list: itemsList }));
        }
    }

    // Handle specific sub-routes
    else if (req.url === "/api/test") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Good afternoon from test");
    }
    
    // Handle the query parameter example
    else if (parsedUrl.pathname === "/api/user") {
        // If the URL is /api/user?name=Hemant
        const name = queryParams.get("name"); // Gets "Hemant"

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Hello, ${name || "Guest"}! This came from a Query Parameter.`);
    }
    
    // Handle User Registration
    else if (parsedUrl.pathname === "/api/register" && req.method === "POST") {
        let body = "";
        
        // Collect data chunks as they arrive
        req.on("data", (chunk) => { body += chunk.toString(); });

        // Once all data is received, process it
        req.on("end", async () => {
            // Parse the JSON data sent by the client
            const parsedBody = JSON.parse(body);
            const username = parsedBody.username;
            const password = parsedBody.password;

            // Make sure both username and password were provided
            if (!username || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Username and password are required." }));
            }

            // Check if a user with this username already exists in the database
            const existingUser = await User.findOne({ where: { username: username } });
            
            if (existingUser) {
                // 409 Conflict status code for duplicate entries
                res.writeHead(409, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Username already exists." }));
            }

            // Hash the password using bcrypt
            // The salt rounds determine how secure/slow the hashing is
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create the new user in the database with the hashed password
            const newUser = await User.create({
                username: username,
                passwordHash: hashedPassword
            });

            // Respond with success
            res.writeHead(201, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ 
                message: "User registered successfully!", 
                username: newUser.username 
            }));
        });
    }
    
    // Handle User Login
    else if (parsedUrl.pathname === "/api/login" && req.method === "POST") {
        let body = "";
        
        // Collect data chunks as they arrive
        req.on("data", (chunk) => { body += chunk.toString(); });

        // Once all data is received, process it
        req.on("end", async () => {
            // Parse the JSON data sent by the client
            const parsedBody = JSON.parse(body);
            const username = parsedBody.username;
            const password = parsedBody.password;

            // Make sure both username and password were provided
            if (!username || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Username and password are required." }));
            }

            // Find the user in the database
            const user = await User.findOne({ where: { username: username } });
            
            // If the user doesn't exist, return an error
            if (!user) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid username or password." }));
            }

            // Use bcrypt to compare the provided password with the stored hash
            const match = await bcrypt.compare(password, user.passwordHash);

            if (match) {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ 
                    message: "Login successful!", 
                    username: user.username 
                }));
            } else {
                // Passwords do not match
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid username or password." }));
            }
        });
    }
    else if (parsedUrl.pathname === "/api/cards" && req.method === "GET") {
        const { userId, deckId } = queryParams;
        
    }
};

// Create the server using the logic above
const server = http.createServer(handleRequest);
// Tell the server to listen for traffic on Port 3000
server.listen(3000, () => {
    console.log("Server is running on port 3000...");
});
