    const express = require('express');
    const app = express();

    const server = require('http').createServer(app);
    const {Server} = require('socket.io');

    const io = new Server(server);
    let roomIdGlobal, imgUrlGlobal;
    app.get('/', (req,res) => {
        return res.send('This is a mern backend for presentation-share-app');
    });
    io.on("connection",(socket) => {
        console.log("User Joined");
        socket.on('userJoined', (data) => {
            const {name, roomId, userId, host, presenter} = data;
            roomIdGlobal= roomId;
            socket.join(roomId);
            socket.emit("UserIsJoined",{ success: true})
            socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
                imgUrl: imgUrlGlobal
            })
        })
        socket.on("whiteBoardData", (data) => {
            imgUrlGlobal= data;
            socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
                imgUrl: data,
            })
        })
    });

    const port = 5000;

    server.listen(port,() => {
        console.log("Server is runnong on port #" , port);
    })