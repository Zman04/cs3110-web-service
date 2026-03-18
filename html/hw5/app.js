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