// DOM elements selected
const message = document.querySelector("#message");
const handle = document.querySelector("#handle");
const btn = document.querySelector("#send");
const output = document.querySelector("#output");
const feedback = document.querySelector("#feedback");

// emit events

btn.addEventListener("click", function(e) {
  e.preventDefault();
  socket.emit("chatMessage", {
    message: message.value,
    handle: handle.value
  });
  message.value = "";
});

message.addEventListener("keypress", function() {
  socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chatMessage", function(data) {
  feedback.innerHTML = "";
  output.innerHTML += `<p><strong>${data.handle}:</strong> ${data.message}</p>`;
});

socket.on("typing", function(data) {
  feedback.innerHTML = `<p><em>${data}</em> is typing...</p>`;
});
