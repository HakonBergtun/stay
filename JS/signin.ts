document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".auth-form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        showMessage("Innlogging vellykket! Sender deg videre...", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showMessage("Feil e-post eller passord. Prøv igjen!", "error");
      }

    } catch (error) {
      showMessage("Kunne ikke koble til serveren. Er APIet kjørende?", "error");
    }
  });

  function showMessage(message: string, type: "success" | "error") {
    const existing = document.querySelector(".auth-message");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = `auth-message ${type}`;
    div.textContent = message;

    setTimeout(() => {
        div.classList.add("fade-out");
        setTimeout(() => div.remove(), 400);
    }, 3000);
}

});