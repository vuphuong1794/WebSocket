const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; connect-src 'self' ws://localhost:8000"
    );
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});