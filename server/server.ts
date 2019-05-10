import WebSocket from "ws";

const port = 8000;
const server = new WebSocket.Server({ port });

server.on("connection", socket => {
    socket.on("message", message => console.log(message));
    socket.send("Hello world!");
});

console.log(`Listening on ${port}`);
