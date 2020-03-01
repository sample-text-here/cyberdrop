const $ = e => document.getElementById(e);
document.title += " " + location.pathname.slice(1);
function animate() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (stars.length < 300 && Math.random() < 0.5) {
    // if fewer than 300 stars, a 50% chance of creating a new one
    let star = {
      x: 0,
      y: 0,
      vx: -5 + Math.random() * 10,
      vy: -5 + Math.random() * 10
    }; // create a new star in the middle with random velocity
    stars.push(star); // add the star to the array
  }
  for (let n = 0; n < stars.length; n++) {
    // for each star
    stars[n].x = stars[n].x + stars[n].vx; // add the velocity to the current position
    stars[n].y = stars[n].y + stars[n].vy; // in both axles
    if (stars[n].x > 400 || stars[n].x < -400) {
      // if the star is out of bounds
      stars[n].x = 0; // put it back in the center
      stars[n].y = 0;
    }
    let color = Math.floor((Math.abs(stars[n].x) + Math.abs(stars[n].y)) / 5);
    context.fillStyle = "rgb(" + color + "," + color + "," + color + ")"; // use the color value for the R, G and B component
    context.beginPath();
    context.arc(
      400 + stars[n].x,
      400 + stars[n].y,
      Math.abs(stars[n].y / 100 + n / 200),
      0,
      2 * Math.PI
    ); // draw a circle
    context.fill();
  }
  window.requestAnimationFrame(animate); // request another animation frame
}

let canvas = $("anim");
let context = canvas.getContext("2d");
let stars = []; // the array of stars
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
window.requestAnimationFrame(animate);

var dropZone = $("drop");

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener("dragover", function(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

var counter = 0;

dropZone.addEventListener("dragenter", function(e) {
  counter++;
  dropZone.classList.add("hover");
});

dropZone.addEventListener("dragleave", function(e) {
  counter--;
  if (counter === 0) {
    dropZone.classList.remove("hover");
  }
});

// Get file data on drop
var from;
dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  e.stopPropagation();
  var file = e.dataTransfer.files[0];
  dropZone.classList.remove("hover");
  var blob = new Blob([file]);
  from = +(Math.random() + "").substring(2);
  var x = socket.emit("send-file", {
    file: blob,
    type: file.type,
    for: location.pathname,
    name: file.name,
    from: from
  });
  $("title").innerHTML = "Sending <span class=\"dots\"></span>";
  counter--;
});

$("message").addEventListener("submit", e => {
  e.preventDefault();
  socket.emit("send-msg", {
    msg: $("input").value,
    for: location.pathname
  });
  $("input").value = "";
});

console.log("hello world :o");
var socket = io();
socket.on("file", function(msg) {
  var file = new Blob([msg.file], { type: msg.type });
  if (msg.from == from) {
    $("title").innerText="<Drag and drop a file here>";
  } else {
    saveData(file, msg.name);
  }
  var tr = document.createElement("tr");
  tr.innerHTML = `<td>${getTime(new Date())}</td><td>${cleanStr(
    msg.name
  )}</td><td>${msg.type}</td>`;
  document.getElementById("files").appendChild(tr);
});

socket.on("msg", function(msg) {
  var tr = document.createElement("tr");
  tr.innerHTML = `<td>${getTime(new Date())}</td><td>Message: ${
    msg.msg
  }</td><td>Message</td>`;
  document.getElementById("files").appendChild(tr);
});

socket.on("connect", function() {
  socket.emit("room", location.pathname);
});

socket.on("announce", function(msg) {
  var tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="3" style="text-align:center"><b>${msg}</b></td>`;
  document.getElementById("files").appendChild(tr);
});

function saveData(blob, filename) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 10);
}

function cleanStr(str) {
  return str
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/&/g, "&amp;");
}

function getTime(date) {
  console.log(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}
