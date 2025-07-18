document.addEventListener("DOMContentLoaded", () => {
  const contacts = document.querySelectorAll(".contact");

  contacts.forEach((contact) =>
    contact.addEventListener("click", (e) => {
      let pseudo = e.currentTarget.querySelector(".contactPseudo").innerHTML;
      openChat(pseudo);
    })
  );
});

let currentContact = null;

function closeChat() {
  document.querySelector(".sidebar").classList.add("active");
}

function openChat(contact) {
  const chatKey = `chat-${contact}`;
  let messages = [];

  const stored = localStorage.getItem(chatKey);
  if (stored) {
    messages = JSON.parse(stored);
  } else {
    localStorage.setItem(chatKey, JSON.stringify([]));
  }

  document.querySelector(".sidebar").classList.remove("active");
  document.querySelector(".chat").classList.remove("hide");
  document.querySelector(".accueil").classList.add("hide");
  document.querySelector(".mainTitle").classList.add("hide");
  document.querySelector(".chatPseudo").textContent = contact;
  document.querySelector(".chatAvatar").innerHTML = `<p class="avatarLetter">${contact.slice(0,2).toUpperCase()}</p>`;

  const chatContent = document.querySelector(".chatContent");
  chatContent.innerHTML = "";
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `message ${msg.sent ? "sent" : "received"}`;
    div.innerHTML = `
      <div class="messageText">${msg.text}</div>
      <div class="messageTime">${msg.time}</div>
    `;
    chatContent.appendChild(div);
  });

  chatContent.scrollTop = chatContent.scrollHeight;
  currentContact = contact;
  console.log(`openChat ${currentContact}`);
}

function saveMessage(text) {
  if (!currentContact || !text.trim()) return;

  const chatKey = `chat-${currentContact}`;
  let messages = JSON.parse(localStorage.getItem(chatKey)) || [];

  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const newMessage = { text, sent: true, time };

  console.log(`saveMessage ${currentContact}`);

  messages.push(newMessage);
  localStorage.setItem(chatKey, JSON.stringify(messages));
  simulateReception(currentContact, text);

  const chatContent = document.querySelector(".chatContent");
  const div = document.createElement("div");
  div.className = "message sent";
  div.innerHTML = `
    <div class="messageText">${text}</div>
    <div class="messageTime">${time}</div>
  `;
  chatContent.prepend(div);
  requestAnimationFrame(() => {
    chatContent.scrollTop = chatContent.scrollHeight;
  });

  document.getElementById("message").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");

  sendBtn.addEventListener("click", () => {
    const text = document.getElementById("message").value;
    saveMessage(text);
  });

  document.getElementById("message").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = document.getElementById("message").value;
      saveMessage(text);
      console.log(`neutral2 ${currentContact}`);
    }
  });
});

//la j'ai rajouté les notifications

function simulateReception(contact, originalText) {
  setTimeout(() => {
    const chatKey = `chat-${contact}`;
    let messages = JSON.parse(localStorage.getItem(chatKey)) || [];

    const replyText = `Réponse à: ${originalText}`;
    const time = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const reply = {
      text: replyText,
      sent: false,
      time,
    };

    messages.push(reply);
    localStorage.setItem(chatKey, JSON.stringify(messages));

    if (currentContact === contact) {
      const chatContent = document.querySelector(".chatContent");
      const div = document.createElement("div");
      div.className = "message received";
      div.innerHTML = `
        <div class="messageText">${replyText}</div>
        <div class="messageTime">${time}</div>
      `;
      chatContent.appendChild(div);
      chatContent.scrollTop = chatContent.scrollHeight;
    }

    if (Notification.permission === "granted") {
      new Notification(`Message de ${contact}`, {
        body: replyText,
        icon: "./assets/images/icon.ico"
      });

    }
  }, 2000);
}


if ("Notification" in window) {
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log("Permission de notification :", permission);
    });
  } else {
    console.log("Permission déjà définie :", Notification.permission);
  }
}
