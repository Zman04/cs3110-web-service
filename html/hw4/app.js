const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const itemsList = ["apple", "banana", "cherry"];

const handleRequest = (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // --- API ROUTES ---
    if (pathname === "/api") {
        
        // GET (Read)
        if (req.method === "GET") {
            const index = searchParams.get("index");
            if (index !== null) {
                if (itemsList[index]) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ item: itemsList[index] }));
                } else {
                    res.writeHead(404);
                    return res.end("Not Found");
                }
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(itemsList));
        }

        // POST (Create)
        else if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
                const parsedBody = new URLSearchParams(body);
                const newItem = searchParams.get("newItem") || parsedBody.get("newItem");
                if (newItem) {
                    itemsList.push(newItem);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Created", list: itemsList }));
                }
                res.writeHead(400); res.end("Missing data");
            });
        }

        // PUT (Update)
        else if (req.method === "PUT") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
                const index = searchParams.get("index");
                const parsedBody = new URLSearchParams(body);
                const updatedItem = parsedBody.get("newItem");
                if (index !== null && itemsList[index] && updatedItem) {
                    itemsList[index] = updatedItem;
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Updated", list: itemsList }));
                }
                res.writeHead(400); res.end("Invalid index or data");
            });
        }

        // DELETE (Remove)
        else if (req.method === "DELETE") {
            const index = searchParams.get("index");
            if (index !== null && itemsList[index]) {
                itemsList.splice(index, 1);
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Deleted", list: itemsList }));
            }
            res.writeHead(400); res.end("Invalid index");
        }
    } 
    // --- STATIC FILES ---
    else {
        let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404); res.end("File Not Found");
                return;
            }
            res.writeHead(200); res.end(data);
        });
    }
};

const server = http.createServer(handleRequest);
server.listen(4000, () => {
    console.log("HW4 Legacy Server (In-Memory) running on http://localhost:4000");
});
