document.addEventListener("DOMContentLoaded", () => {
  const contacts = document.querySelectorAll(".contact");
  const message = document.querySelector("textarea").value;

  contacts.forEach((contact) =>
    contact.addEventListener("click", (e) => {
      let pseudo = e.currentTarget.querySelector(".contactPseudo").innerHTML;
      openChat(pseudo);
    })
  );
});

function openChat(contact) {
  document.querySelector(".sidebar").classList.remove("active");
  document.querySelector(".chatPseudo").textContent = contact;
}

function closeChat() {
  document.querySelector(".sidebar").classList.add("active");
}

