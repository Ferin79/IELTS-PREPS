let PORT = process.env.PORT || 8000;

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};
const role = {};
let count = 0;

app.use(express.static('web/build'))

io.on('connection', socket => {

    socket.emit("yourID", socket.id);

    socket.on("initializeUser", (data) => {

        Object.keys(users).map(key => {
            if (users[key] === data.uniqueName) {
                console.log("deleted same - " + users[key]);
                delete users[key];
                delete role[key];
                io.sockets.emit("allUsers", { users, role });
            }
        })

        users[(socket.id).toString()] = data.uniqueName;
        role[socket.id] = data.role;

        console.log(users);

        io.sockets.emit("allUsers", { users, role });


        socket.on('disconnect', () => {
            console.log("deleted - " + users[socket.id]);
            delete users[socket.id];
            delete role[socket.id];
            io.sockets.emit("allUsers", { users, role });
        })

        socket.on("giveCallPermission", (data) => {
            console.log(`${users[data.from]} gave call permission to ${users[data.to]}`);
            io.to(data.to).emit('callPermissionGranted', { from: data.from });
        })

        socket.on("callUser", (data) => {
            // if (users[socket.id] === "professor") {                
            console.log(`${users[data.from]} called ${users[data.userToCall]}`);
            io.to(data.userToCall).emit('receiveCall', { signal: data.signalData, from: { id: data.from, name: users[data.from] } });
            // } else {
            //     socket.emit("error", {message: "Student can't call"})
            // }
        })

        // socket.on("callerSignal", (data) => {
        //     // if (users[socket.id] === "professor") {                
        //     console.log(`${users[data.from]} sent signal to ${users[data.userToCall]}`);
        //     io.to(data.userToCall).emit('receiveSignal', { signal: data.signalData, from: { id: data.from, name: users[data.from] } });
        //     // } else {
        //     // socket.emit("error", {message: "Student can't call"})
        //     // }
        // })

        socket.on("acceptCall", (data) => {
            io.to(data.to).emit('callAccepted', data.signal);
        });

        socket.on("endCall", (data) => {
            console.log(users[socket.id] + " ended call with " + users[data.id]);
            io.to(data.id).emit("callEnded");
            // socket.emit("callEnded");            
        })        

        socket.on("videostream", (videoStream) => {
            console.log(videoStream)
            socket.emit("videoStatusChange", videoStream)
        })

        socket.on("audiostream", (audioStream) => {
            console.log(audioStream)
            socket.emit("audioStatusChange", audioStream)
        })

        socket.on("sendMessage", (data) => {
            console.log(users[data.from] + " sent message to " + users[data.to]);
            io.to(data.to).emit("receiveMessage", {from: data.from, message: data.message})
        })

    })

});

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

