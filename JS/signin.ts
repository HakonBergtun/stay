// Sander Marinius de Graaf Bendal
import { loginUser } from "./api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".auth-form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const user = await loginUser(email, password);

      showMessage(`Velkommen, ${user.userName}!`, "success");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1000);
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  });

  function showMessage(message: string, type: "success" | "error") {
    const existing = document.querySelector(".auth-message");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = `auth-message ${type}`;
    div.textContent = message;

    document.body.prepend(div);

    setTimeout(() => {
      div.classList.add("fade-out");
      setTimeout(() => div.remove(), 400);
    }, 3000);
  }
});