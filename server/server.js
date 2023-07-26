const WebSocket = require('ws');
const { Client } = require('pg');
const connectionString = 'postgressql://test:test@localhost:5432/test'

const wss = new WebSocket.Server({ port: 8080 });

const pgClient = new Client({
    connectionString: connectionString
});

pgClient.connect();
pgClient.query('LISTEN watchers');

pgClient.on('notification', data => {
    console.log('Received notification:', data.payload);  // Log received notifications
    const payload = JSON.parse(data.payload);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            console.log('Sending payload to client:', payload);  // Log sent payloads
            client.send(JSON.stringify(payload));
        }
    });
});


console.log('Listening for database notifications...');
