let PORT = process.env.PORT || 8001;

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};
let count = 0;

app.use(express.static('client/build'))

io.on('connection', socket => {

    if (!users[socket.id]) {
        users[socket.id] = (++count).toString();
        console.log(users[socket.id]);
        socket.emit("yourID", socket.id);
        io.sockets.emit("allUsers", users);

        socket.on('disconnect', () => {
            console.log(users[socket.id] + " - deleted");
            delete users[socket.id];
            io.sockets.emit("allUsers", users);
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

        socket.on("callerSignal", (data) => {
            // if (users[socket.id] === "professor") {                
            console.log(`${users[data.from]} sent signal to ${users[data.userToCall]}`);
            io.to(data.userToCall).emit('receiveSignal', { signal: data.signalData, from: { id: data.from, name: users[data.from] } });
            // } else {
            // socket.emit("error", {message: "Student can't call"})
            // }
        })

        socket.on("acceptCall", (data) => {
            io.to(data.to).emit('callAccepted', data.signal);
        });

        socket.on("endCall", (data) => {
            console.log(users[socket.id] + " ended call with " + users[data.id]);
            io.to(data.id).emit("callEnded");
            // socket.emit("callEnded");            
        })


        socket.on("changeName", (data) => {
            let alreadyTaken = false;
            Object.keys(users).map(key => {
                if (key !== socket.id) {
                    if (data.name === users[key]) {
                        alreadyTaken = true;
                    }
                }
            })
            if (alreadyTaken) {
                socket.emit("changeNameStatus", { status: false });
            } else {
                users[socket.id] = data.name;
                io.sockets.emit("allUsers", users);
                socket.emit("changeNameStatus", { status: true });
            }
        })

        socket.on("videostream", (videoStream) => {
            console.log(videoStream)
            socket.emit("videoStatusChange", videoStream)
        })

        socket.on("audiostream", (audioStream) => {
            console.log(audioStream)
            socket.emit("audioStatusChange", audioStream)
        })


    }

});

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

