import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
let allsockets = [];
wss.on("connection", function (socket) {
    socket.on("message", (message) => {
        // console.log("message received  " + message, toString());
        // for (let i = 0; i < allsockets.length; i++) {
        //   const s = allsockets[i];
        //   s.send(message.toString() + " send by the server");
        // }
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allsockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = allsockets.find((x) => x.socket == socket)?.room;
            allsockets.forEach((e) => {
                if (e.room == currentUserRoom) {
                    e.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    socket.on("disconnect", () => {
        // @ts-ignore
        allsockets = allsockets.filter((x) => x != socket);
    });
});
