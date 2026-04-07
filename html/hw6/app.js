const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// MODELS
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING, allowNull: false }
});

const Item = sequelize.define('Item', {
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false } // Links item to user
});

// Hashing
const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

const handleRequest = async (req, res) => {
    const parsedUrl = new URL(req.url, `https://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // Helper to parse POST/PUT body
    const getBody = () => new Promise(resolve => {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => resolve(new URLSearchParams(body)));
    });

    // AUTH ROUTES
    if (pathname === "/api/register" && req.method === "POST") {
        const body = await getBody();
        const username = body.get("username");
        const password = body.get("password");

        if (!username || !password) {
            res.writeHead(400); return res.end("Missing username or password");
        }

        try {
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = hashPassword(password, salt);
            
            await User.create({ username, passwordHash, salt });
            res.writeHead(201, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Registration successful" }));
        } catch (err) {
            res.writeHead(400); return res.end("Username already exists");
        }
    }

    if (pathname === "/api/login" && req.method === "POST") {
        const body = await getBody();
        const username = body.get("username");
        const password = body.get("password");

        const user = await User.findOne({ where: { username } });

        if (user) {
            const hashAttempt = hashPassword(password, user.salt);
            if (hashAttempt === user.passwordHash) {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Login successful", username: user.username }));
            }
        }
        res.writeHead(401); return res.end("Invalid credentials");
    }

    // API ROUTES
    if (pathname === "/api") {
        // GET
        if (req.method === "GET") {
            const username = searchParams.get("username");
            if (!username) { res.writeHead(401); return res.end("Unauthorized"); }

            const items = await Item.findAll({ where: { username } });
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(items));
        }

        // POST
        else if (req.method === "POST") {
            const body = await getBody();
            const newItem = body.get("newItem");
            const username = body.get("username");
            
            if (newItem && username) {
                await Item.create({ name: newItem, username });
                res.writeHead(201, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Created" }));
            }
            res.writeHead(400); res.end("Missing data");
        }

        // PUT
        else if (req.method === "PUT") {
            const body = await getBody();
            const id = searchParams.get("index");
            const updatedItem = body.get("newItem");
            const username = body.get("username");
            
            if (id && updatedItem && username) {
                const item = await Item.findOne({ where: { id, username } }); 
                if (item) {
                    item.name = updatedItem;
                    await item.save();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Updated" }));
                }
            }
            res.writeHead(400); res.end("Invalid operation");
        }

        // DELETE
        else if (req.method === "DELETE") {
            const id = searchParams.get("index");
            const username = searchParams.get("username");
            
            if (id && username) {
                const item = await Item.findOne({ where: { id, username } });
                if (item) {
                    await item.destroy();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Deleted" }));
                }
            }
            res.writeHead(400); res.end("Invalid operation");
        }
    } 
    // STATIC FILES
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

// Start plain HTTP server (Nginx handles the HTTPS termination)
sequelize.sync().then(() => {
    // removed the options object and the fs.readFileSync calls
    const server = http.createServer(handleRequest);
    
    server.listen(3000, () => {
        console.log("Local server running on port 3000 (Behind Nginx)");
    });
});