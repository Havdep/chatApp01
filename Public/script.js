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

  // Call replaceWordsWithEmojis function to modify the message
  const emojiMessage = replaceWordsWithEmojis(message);

  socket.emit("new user", username); // Send username to the server
  socket.emit("chat message", { username, message: emojiMessage }); // Use emojiMessage here
  appendMessage("You", emojiMessage); // And here
  messageInput.value = "";
}

function replaceWordsWithEmojis(message) {
  const emojiMap = {
    // hello: "😁",
    // sad: "🥴",
    hi: "こんいちは",
    hru: "元気ですか",
    bye: "さようなら",
    // hey: "HEY", // Add the emoji you want for 'hey' here
  };

  const words = message.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (emojiMap[words[i].toLowerCase()]) {
      words[i] = emojiMap[words[i].toLowerCase()];
    }
  }

  return words.join(" ");
}

// Receive messages from the server
socket.on("chat message", (data) => {
  appendMessage(data.username, data.message);
});

// Update user list
socket.on("user list", (userList) => {
  updateUsersList(userList);
});
