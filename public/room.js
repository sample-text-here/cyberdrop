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

let canvas = document.getElementById("anim");
let context = canvas.getContext("2d");
let stars = []; // the array of stars
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
window.requestAnimationFrame(animate);

var dropZone = document.getElementById("drop");

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

dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  e.stopPropagation();
  var file = e.dataTransfer.files[0];
  dropZone.classList.remove("hover");
  var blob = new Blob([file]);
  socket.emit("file", {
    file: blob,
    type: file.type,
    for: location.pathname,
    name: file.name
  });
  var li = document.createElement("li");
  li.innerText = "Sent: " + file.name;
  document.getElementById("files").appendChild(li);
});

const $ = e => document.getElementById(e);
console.log("hello world :o");
var socket = io();
socket.on("file", function(msg) {
  var file = new Blob([msg.file], { type: msg.type });
  saveData(file, msg.name);
  var li = document.createElement("li");
  li.innerText = "Recieved: " + msg.name;
  document.getElementById("files").appendChild(li);
});

socket.on("connect", function() {
  socket.emit("room", location.pathname);
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
