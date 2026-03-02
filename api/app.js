// Import the 'http' module (built-in to Node.js)
const http = require('http');
const url = require('url'); // Optional helper, but modern Node uses the URL class

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
                // In a real app, you'd use this 'body' to update a database
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data Updated Successfully!" }));
            });
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
};

// Create the server using the logic above
const server = http.createServer(handleRequest);
// Tell the server to listen for traffic on Port 3000
server.listen(3000, () => {
    console.log("Server is running on port 3000...");
});
