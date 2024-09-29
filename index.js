const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });

// Lưu trữ tất cả các kết nối client với tên người dùng
const clients = new Map();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received:', data);

        if (data.type === 'setUsername') {
            // Lưu tên người dùng
            clients.set(ws, data.username);
            ws.send(JSON.stringify({ type: 'usernameSet', username: data.username }));
        } else if (data.type === 'chatMessage') {
            const username = clients.get(ws) || 'Anonymous';
            // Gửi tin nhắn đến tất cả các client khác
            for (let [client, clientUsername] of clients) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'chatMessage',
                        username: username,
                        message: data.message
                    }));
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});