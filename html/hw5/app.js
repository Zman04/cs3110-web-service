const https = require('https');
const fs = require('fs');

// Read the certificate files
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Helper function to parse basic auth
function parseBasicAuth(authHeader) {
    if (!authHeader || !authHeader.startsWith('Basic ')) return null;
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    return { username, password };
}

// Helper function to authenticate
function authenticate(username, password) {
    if (!username || !password) return false;
    return username === "admin" && password === "password123";
}

// Create the HTTPS server
const server = https.createServer(options, (req, res) => {
    // 1. MAIN ROUTE: Serve the HTML file
    if (req.url === "/" && req.method === "GET") {
        try {
            const html = fs.readFileSync('index.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("index.html not found");
        }
        return;
    }

    if (req.url === "/api/public" && req.method === "GET") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('This is public data everyone can see');
        return;
    }

    if (req.url === "/api/things" && req.method === "POST") {
        const authHeader = req.headers.authorization;

        // Missing credentials
        if (!authHeader) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Authentication Required");
        }

        // Parse credentials
        const credentials = parseBasicAuth(authHeader);

        // Invalid credentials
        if (!credentials || !authenticate(credentials.username, credentials.password)) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Invalid Credentials");
        }

        // They are authorized to create something
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end("Thing created successfully!");
    }

    if (req.url === "/api/things" && req.method === "PUT") {
        const authHeader = req.headers.authorization;

        // Missing credentials
        if (!authHeader) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Authentication Required");
        }

        // Parse credentials
        const credentials = parseBasicAuth(authHeader);

        // Invalid credentials
        if (!credentials || !authenticate(credentials.username, credentials.password)) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Invalid Credentials");
        }

        // They are authorized to update something
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end("Thing updated successfully!");
    }

    if (req.url === "/api/things" && req.method === "DELETE") {
        const authHeader = req.headers.authorization;

        // Missing credentials
        if (!authHeader) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Authentication Required");
        }

        // Parse credentials
        const credentials = parseBasicAuth(authHeader);

        // Invalid credentials
        if (!credentials || !authenticate(credentials.username, credentials.password)) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
            return res.end("Invalid Credentials");
        }

        // They are authorized to delete something
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end("Thing deleted successfully!");
    }

    // Default 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(8443, () => {
    console.log('Secure server running on port 8443');
});

