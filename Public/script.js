const socket = io();

document.getElementById("message").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function appendMessage(username, msg) {
  const messagesList = document.getElementById("messages");
  const messageElement = document.createElement("li");
  messageElement.textContent = username + ": " + msg;
  messagesList.appendChild(messageElement);
  messagesList.scrollTop = messagesList.scrollHeight;
}

function updateUsersList(users) {
  const usersList = document.getElementById("users");
  usersList.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.textContent = user;
    usersList.appendChild(userElement);
  });
}

function sendMessage() {
  const usernameInput = document.getElementById("username");
  const messageInput = document.getElementById("message");
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (username === "" || message === "") return;

  socket.emit("new user", username); // Send username to the server
  socket.emit("chat message", { username, message });
  appendMessage("You", message);
  messageInput.value = "";
}

// Receive messages from the server
socket.on("chat message", (data) => {
  appendMessage(data.username, data.message);
});

// Update user list
socket.on("user list", (userList) => {
  updateUsersList(userList);
});
