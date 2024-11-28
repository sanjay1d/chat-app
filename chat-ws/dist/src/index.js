"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allsockets = [];
wss.on("connection", function (socket) {
    socket.on("message", (message) => {
        var _a;
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
            const currentUserRoom = (_a = allsockets.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
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
