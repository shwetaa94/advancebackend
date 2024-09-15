import { WebSocketServer, WebSocket } from 'ws'; // Import the WebSocket library

// Array to store client information
const clients = []; // Format: [{ id: uniqueId, ws: WebSocket }]

let nextId = 1; // ID counter for new clients

// Function to create and configure the WebSocket server
export const setupWebSocket = (server) => {
    // Create a WebSocket server
    const wss = new WebSocketServer({ server });

    // Function to generate a new unique ID
    const generateId = () => {
        return nextId++;
    };

    // Function to send the updated client list to all clients
    const broadcastClientList = () => {
        const clientData = clients.map(({ id }) => ({ id })); // Send only the client IDs
        clients.forEach((client) => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({id:client.id, flag: true, clients: clientData }));
            }
        });
    };

    // Handle new client connections
    wss.on('connection', (ws) => {
        const id = generateId(); // Assign a unique ID to the new client
        clients.push({ id, ws }); // Store client information

        // Broadcast the updated client list to all clients
        broadcastClientList();

        console.log(`New client connected with ID ${id}`);

        // Handle incoming messages from clients
        ws.on('message', (message) => {
            try {
                const { targetID, text } = JSON.parse(message);
                console.log(text);
                clients.forEach((client) => {
                    if (client.ws.readyState === WebSocket.OPEN && client.id === targetID) {
                        client.ws.send(JSON.stringify({ id, text, flag: false }));
                    }
                });
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log(`Client disconnected with ID ${id}`);
            // Remove the client from the array
            const index = clients.findIndex((client) => client.id === id);
            if (index !== -1) {
                clients.splice(index, 1);
            }
            // Broadcast the updated client list to all clients after disconnection
            broadcastClientList();
        });

        // Handle any errors
        ws.on('error', (error) => {
            console.error(`WebSocket error for client ${id}:`, error);
        });
    });
};
