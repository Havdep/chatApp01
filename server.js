const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {}; // Keep track of users

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("new user", (username) => {
    users[socket.id] = username;
    io.emit("user list", Object.values(users));
  });

  socket.on("chat message", (data) => {
    socket.broadcast.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user list", Object.values(users));
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
