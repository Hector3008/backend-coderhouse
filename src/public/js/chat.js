let socket = io();

let chatBox = document.getElementById("chatBox");
chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user: document.getElementById("username").innerText,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

socket.on("logs", (data) => {
  const divLogs = document.getElementById("messagesLogs");
  let messages = "";
  data.reverse().forEach((message) => {
    messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
  });
  divLogs.innerHTML = messages;
});

socket.on("alerta", () => {
  alert("Un nuevo usuario se ha conectado...");
});
