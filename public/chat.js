// DOM elements selected
const message = document.querySelector("#message");
const handle = document.querySelector("#handle");
const btn = document.querySelector("#send");
const output = document.querySelector("#output");
const feedback = document.querySelector("#feedback");
const users = document.querySelector("#users");
let numUsers = 0;

// emit events

btn.addEventListener("click", function(e) {
  e.preventDefault();
  socket.emit("chatMessage", {
    message: message.value,
    handle: handle.value.toUpperCase(),
    time: moment().format("h:mm a")
  });
  message.value = "";
});

message.addEventListener("keypress", function() {
  socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chatMessage", function(data) {
  feedback.innerHTML = "";
  output.innerHTML += `<div class="card grey"><div class="card-content"><p><strong>${
    data.handle
  }:</strong> ${data.message}</p>
  <p>Sent at ${data.time}</p></div></div>`;
});

socket.on("typing", function(data) {
  feedback.innerHTML = `<p><em>${data}</em> is typing...</p>`;
});

socket.on("newConnection", function() {
  numUsers += 1;
  users.textContent = `${numUsers} users are now online.`;
});

socket.on("disconnect", function() {
  newUsers -= 1;
});
