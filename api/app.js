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
        // Use the lecture's logic: POST creates a new resource
        if (req.method === 'POST') {
            // In a real form, this might be 'newItem=value'
            // For now, we'll push the raw body or a parsed version
            itemsList.push(body || "New Anonymous Item");
            res.writeHead(201, { "Content-Type": "text/plain" }); // 201: Created
            return res.end("Item Added");
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
