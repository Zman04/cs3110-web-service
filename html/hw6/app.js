const http = require('http');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// new item system
const Item = sequelize.define('Item', {
    name: { type: DataTypes.STRING, allowNull: false }
});

const handleRequest = async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // API ROUTES
    if (pathname === "/api") {
        
        // GET
        if (req.method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            const items = await Item.findAll();
            return res.end(JSON.stringify(items));
        }

        // POST
        else if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const parsedBody = new URLSearchParams(body);
                const newItem = searchParams.get("newItem") || parsedBody.get("newItem");
                
                if (newItem) {
                    await Item.create({ name: newItem });
                    res.writeHead(201, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Created" }));
                }
                res.writeHead(400); res.end("Missing data");
            });
        }

        // PUT
        else if (req.method === "PUT") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const index = searchParams.get("index");
                const parsedBody = new URLSearchParams(body);
                const updatedItem = parsedBody.get("newItem");
                
                // We let the database find the item first.
                if (index !== null && updatedItem) {
                    const itemToUpdate = await Item.findByPk(index); 
                    
                    if (itemToUpdate) {
                        itemToUpdate.name = updatedItem;
                        await itemToUpdate.save();
                        res.writeHead(200, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Updated" }));
                    } else {
                        res.writeHead(404); return res.end("Item not found");
                    }
                }
                res.writeHead(400); res.end("Invalid index or data");
            });
        }

        // DELETE (Remove)
        else if (req.method === "DELETE") {
            const index = searchParams.get("index");
            
            // Removed itemsList check.
            if (index !== null) {
                const itemToDelete = await Item.findByPk(index);
                
                if (itemToDelete) {
                    await itemToDelete.destroy();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Deleted" }));
                } else {
                    res.writeHead(404); return res.end("Item not found");
                }
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

// CRITICAL: You must sync the database to create the table before listening!
sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log("HW6 server running on http://localhost:3000");
    });
});
