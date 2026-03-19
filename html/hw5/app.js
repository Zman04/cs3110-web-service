const https = require('https');
const fs = require('fs');

// Read the certificate files
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Create the HTTPS server
const server = https.createServer(options, (req, res) => {
    // We will put our routing and authentication logic here
});

server.listen(443, () => {
    console.log('Secure server running on port 443');
});

// 1. MAIN ROUTE: Serve the HTML file
if (req.url === "/" && req.method === "GET") {
    const html = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
}
if (req.url === "/api/public" && req.method === "GET") {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is public data everyone can see');
    return;
}

if (req.url === "/api/things" && req.method === "POST") {

    // Check if the header is missing
    if (!authHeader) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
        return res.end("Authentication Required");
    }

    // If the header exists, we will process it here
    function authenticate(username, password) {
        if (!username || !password) return false;
        return username === "admin" && password === "password123";
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
}

if (req.url === "/api/things" && req.method === "PUT") {

    // Check if the header is missing
    if (!authHeader) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
        return res.end("Authentication Required");
    }

    // If the header exists, we will process it here
    function authenticate(username, password) {
        if (!username || !password) return false;
        return username === "admin" && password === "password123";
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
}

if (req.url === "/api/things" && req.method === "DELETE") {

    // Check if the header is missing
    if (!authHeader) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
        return res.end("Authentication Required");
    }

    // If the header exists, we will process it here
    function authenticate(username, password) {
        if (!username || !password) return false;
        return username === "admin" && password === "password123";
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
}

