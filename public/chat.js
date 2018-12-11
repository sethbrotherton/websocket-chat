// DOM elements selected
const message = document.querySelector("#message");
const handle = document.querySelector("#handle");
const btn = document.querySelector("#send");
const output = document.querySelector("#output");
const feedback = document.querySelector("#feedback");
const users = document.querySelector("#users");
const cards = document.querySelectorAll(".card");
const signUpBtn = document.querySelector("#sign-up-btn");
const signInBtn = document.querySelector("#sign-in-btn");
const signOutBtn = document.querySelector("#sign-out-btn");
const signInDiv = document.querySelector("#sign-in-div");
const signUpDiv = document.querySelector("#sign-up-div");
const signInError = document.querySelector("#sign-in-error");
const signUpError = document.querySelector("#sign-up-error");
const newUsernameInput = document.querySelector("#new-username");
let username = null;
let signedIn = false;

// AUTHENTICATION VIA FIREBASE
// SIGN - UP ABILITY
function signUp(e) {
  e.preventDefault();
  signUpError.innerHTML = "";
  // variables for firebase sign-up
  let email = document.querySelector("#new-email").value;
  let password = document.querySelector("#new-password").value;
  console.log(email, password);
  username = newUsernameInput.value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      signUpError.innerHTML = `${errorMessage}`;
    });
  //signedIn = true;
}
// Attach sign up event to sign up button
signUpBtn.addEventListener("click", signUp);

// SIGN - IN
function signIn(e) {
  e.preventDefault();
  signInError.innerHTML = "";
  // variables for firebase sign-up
  let email = document.querySelector("#user-email").value;
  let password = document.querySelector("#user-password").value;
  console.log(email, password);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      signInError.innerHTML = `${errorMessage}`;
    });
  //signedIn = true;
}

// Attach sign in event to sign in button
signInBtn.addEventListener("click", signIn);

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

// SIGN - OUT
function signOutUser(e) {
  e.preventDefault();

  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
      console.log("you signed out!");
      // signedIn = false;
    })
    .catch(function(error) {
      // An error happened.
    });
  output.innerHTML = "";
}

// Attach sign out event to sign out button
signOutBtn.addEventListener("click", signOutUser);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
    signedIn = true;
    username = user.displayName;
    if (!user.displayName) {
      var user = firebase.auth().currentUser;

      user
        .updateProfile({
          displayName: username
        })
        .then(function() {
          console.log(user.displayName);
          handle.value = user.displayName || user.email;
          // handle.style.pointerEvents = "none";
        })
        .catch(function(error) {
          console.log(error);
        });
      //handle.value = user.displayName || user.email;
      //handle.style.pointerEvents = "none";
    }

    signOutBtn.style.display = "inline";
    signInDiv.style.display = "none";
    signUpDiv.style.display = "none";
  } else {
    // No user is signed in.
    console.log(user);
    signedIn = false;
    //handle.value = "";
    signOutBtn.style.display = "none";
    signInDiv.style.display = "inline";
    signUpDiv.style.display = "inline";
  }
});

// emit events

btn.addEventListener("click", function(e) {
  e.preventDefault();
  if (signedIn) {
    socket.emit("chatMessage", {
      message: message.value,
      handle: username.toUpperCase(), //handle.value.toUpperCase(),
      time: moment().format("h:mm a")
    });
    message.value = "";
    scrollToBottom();
  }
});

message.addEventListener("keypress", function() {
  socket.emit("typing", username /*handle.value*/);
});

message.addEventListener("blur", function(e) {
  socket.emit("blurred");
});

// Listen for events
let perspective = "";
socket.on("chatMessage", function(data) {
  feedback.innerHTML = "";

  data.handle === username.toUpperCase()
    ? //data.handle.toUpperCase() === handle.value.toUpperCase()
      (perspective = "blue left lighten-2")
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

socket.on("newConnection", function(serverNumOfUsers) {
  users.textContent = `${serverNumOfUsers} users are now online.`;
});

socket.on("disconnection", function(serverNumOfUsers) {
  users.textContent = `${serverNumOfUsers} users are now online.`;
});
