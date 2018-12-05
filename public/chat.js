// DOM elements selected
const message = document.querySelector("#message");
const handle = document.querySelector("#handle");
const btn = document.querySelector("#send");
const output = document.querySelector("#output");
const feedback = document.querySelector("#feedback");
const users = document.querySelector("#users");
const cards = document.querySelectorAll(".card");
let numUsers = 0;

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

// emit events

btn.addEventListener("click", function(e) {
  e.preventDefault();
  socket.emit("chatMessage", {
    message: message.value,
    handle: handle.value.toUpperCase(),
    time: moment().format("h:mm a")
  });
  message.value = "";
  scrollToBottom();
});

message.addEventListener("keypress", function() {
  socket.emit("typing", handle.value);
});

message.addEventListener("blur", function(e) {
  socket.emit("blurred");
});

// Listen for events
let perspective = "";
socket.on("chatMessage", function(data) {
  feedback.innerHTML = "";

  data.handle.toUpperCase() === handle.value.toUpperCase()
    ? (perspective = "blue left lighten-2")
    : (perspective = "green right lighten-2");

  output.innerHTML += `<div class="card ${perspective}"><div class="card-content"><p><strong>${
    data.handle
  }:</strong> ${data.message}</p>
  <p>Sent at ${data.time}</p></div></div>`;
  scrollToBottom();
});

socket.on("typing", function(data) {
  feedback.innerHTML = `<p class="center-align"><em>${data}</em> is typing...</p>`;
});

socket.on("blurred", function() {
  feedback.innerHTML = ``;
});

socket.on("newConnection", function() {
  numUsers += 1;
  users.textContent = `${numUsers} users are now online.`;
});

socket.on("disconnect", function() {
  numUsers -= 1;
  users.textContent = `${numUsers} users are now online.`;
});
