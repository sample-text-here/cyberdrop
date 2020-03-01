const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

var server = app.listen(3000, function() {
  console.log("Your app is listening on port 3000");
});

const io = require("socket.io")(server);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/:id", function(req, res) {
  res.sendFile(__dirname + "/views/room.html");
});

var users = {};

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnecting", function() {
    var room = Object.keys(this.rooms)[1];
    console.log("user disconnected");
    console.log(Object.keys(this.rooms)[1]);
    users[room]--;
    io.in(room).emit("announce", "Somebody left - Total: " + users[room]);
  });
  socket.on("send-file", function(file) {
    io.in(file.for).emit("file", file);
  });
  socket.on("send-msg", function(msg) {
    io.in(msg.for).emit("msg", msg);
  });
  socket.on("room", function(room) {
    socket.join(room);
    if (users[room]) {
      users[room]++;
    } else {
      users[room] = 1;
    }
    io.in(room).emit("announce", "Somebody joined - Total: " + users[room]);
  });
});