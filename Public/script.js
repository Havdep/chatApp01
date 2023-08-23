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

function handleCommand(command, username) {
  switch (command) {
    case "/hello":
      return username + " says hello!";
    case "/weather":
      return "The weather is nice today!"; // You could implement a real weather check here
    case "/time":
      return "look at the clock for time"; // You could implement a real weather check here
    // Add more cases for other commands
    default:
      return "Unknown command.";
  }
}

function sendMessage() {
  const usernameInput = document.getElementById("username");
  const messageInput = document.getElementById("message");
  const username = usernameInput.value.trim();
  let message = messageInput.value.trim();

  if (username === "" || message === "") return;

  if (message.startsWith("/")) {
    message = handleCommand(message, username); // Call the handleCommand function
  } else {
    message = replaceWordsWithEmojis(message);
  }

  socket.emit("new user", username);
  socket.emit("chat message", { username, message });
  appendMessage("You", message);
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
