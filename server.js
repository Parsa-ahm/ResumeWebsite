const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");

// Paths to SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, "server.key"), "utf8");
const certificate = fs.readFileSync(
  path.join(__dirname, "server.cert"),
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

// Initialize Express app
const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Fallback for SPA (Single Page Application) - Optional
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

// Optionally, also create HTTP server to redirect to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Listen on ports
httpServer.listen(8080, () => {
  console.log("HTTP Server running on port 8080 and redirecting to HTTPS");
});

httpsServer.listen(8443, () => {
  console.log("HTTPS Server running on port 8443");
});
