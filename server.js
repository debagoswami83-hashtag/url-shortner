const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const urlDatabase = [];

// Generate Random Code
function generateCode(length = 6) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";

    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}

// Create Short URL
app.post("/api/shorten", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            error: "URL cannot be empty"
        });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).json({
            error: "Invalid URL"
        });
    }

    let shortCode = generateCode();

    while (urlDatabase.find(item => item.shortCode === shortCode)) {
        shortCode = generateCode();
    }

    urlDatabase.push({
        shortCode,
        originalUrl: url,
        clicks: 0
    });

    res.json({
        shortUrl: `http://localhost:${PORT}/${shortCode}`
    });
});

// Redirect
app.get("/:shortCode", (req, res) => {
    const shortCode = req.params.shortCode;

    const record = urlDatabase.find(
        item => item.shortCode === shortCode
    );

    if (!record) {
        return res.status(404).send("Short URL not found");
    }

    record.clicks++;

    res.redirect(record.originalUrl);
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", error => {
        if (error.code === "EADDRINUSE") {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use. Trying port ${nextPort}...`);
            startServer(nextPort);
            return;
        }
        throw error;
    });
}

startServer(PORT);

