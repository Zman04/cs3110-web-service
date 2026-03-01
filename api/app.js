const http = require("http"); // import http module
const url = require("url");

const itemsList = ["apple", "banana", "cherry"];
// Take in request and response and log
const handleRequest = (req, res) => {
    const parsedURL = url.parse(req.url, true);
    const query = parsedURL.query;

    console.log(parsedURL, "parsedURL");
        console.log(query, "query");

// search bar: http://localhost:3000/test?index=0
    if (req.method === 'GET'){
        if (query.index) {
            const item = itemsList [query.index];
            res.end(item || "item not found");
        }


    }
    res.writeHead(200, {
        "Content-Type": "text/HTML" })
    res.write("Good afternoon!")
    res.end()
};
const server = http.createServer(handleRequest)
server.listen(3000); // port 3000
