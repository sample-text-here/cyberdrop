const $ = e => document.getElementById(e);

$("join").onsubmit = e => {
  e.preventDefault();
  location.href = $("channel").value;
};

const socket = io();
socket.on("pair", pair => {
  $("new").href = "/" + pair;
});

socket.emit("pair");