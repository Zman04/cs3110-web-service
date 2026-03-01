#!/usr/bin/env node
const http = require("http");
const url = require("url");

// Global State: This persists as long as the server is running [cite: 349]
const itemsList = ["apple", "banana", "cherry"];

const handleRequest = (req, res) => {
    const parsedURL = url.parse(req.url, true);
    const query = parsedURL.query;
    const path = parsedURL.pathname;

    // 1. GET Endpoint - Read resources 
    if (req.method === 'GET') {
        res.writeHead(200, { "Content-Type": "application/json" });
        if (query.index !== undefined) {
            // Return specific item or 404 if it doesn't exist
            const item = itemsList[query.index];
            if (item) {
                return res.end(JSON.stringify({ item }));
            } else {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: "Item not found" }));
            }
        }
        // Return everything if no index is provided
        return res.end(JSON.stringify(itemsList));
    }

    // 2. POST, PUT, and DELETE require body parsing or index handling
    let body = "";
    req.on("data", (chunk) => { body += chunk; }); // Accumulate chunks
    
    req.on("end", () => {
        //  POST creates a new resourc
	if (req.method === 'POST') {
	    let body = "";
		req.on("data", (chunk) => { body += chunk; }); [cite: 332-334]

    		req.on("end", () => {
        // Use parseData to turn "newItem=dragonfruit" into { newItem: "dragonfruit" }
        const parsed = parseData(body); [cite: 340, 363]

        if (parsed.newItem) {
            itemsList.push(parsed.newItem); [cite: 363]
            res.writeHead(201, { "Content-Type": "text/plain" }); [cite: 366]
            return res.end("Item Added: " + parsed.newItem);
        }

        res.writeHead(400); // Bad Request if newItem is missing
        return res.end("Error: Missing newItem parameter");
    });
    return; // Ensure the outer function doesn't send a response yet [cite: 343-346]
}
        // 3. PUT - Update an existing resource
        if (req.method === 'PUT') {
            if (query.index !== undefined && itemsList[query.index]) {
                itemsList[query.index] = body || "Updated Item";
                res.writeHead(200);
                return res.end("Item Updated");
            }
            res.writeHead(404);
            return res.end("Cannot update: Index not found");
        }

        // 4. DELETE - Remove a resource
        if (req.method === 'DELETE') {
            if (query.index !== undefined && itemsList[query.index]) {
                itemsList.splice(query.index, 1); // Remove from array
                res.writeHead(200);
                return res.end("Item Deleted");
            }
            res.writeHead(404);
            return res.end("Cannot delete: Index not found");
        }
    });
};

const server = http.createServer(handleRequest);
server.listen(3000); 
console.log("Server listening on port 3000");
