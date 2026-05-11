document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".auth-form") as HTMLFormElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const confirmPassword = document.getElementById("confirm-password") as HTMLInputElement;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (password.value !== confirmPassword.value) {
            showMessage("Passordene er ikke like!", "error");
            return;
        }

        if (password.value.length < 8) {
            showMessage("Passordet må være minst 8 tegn langt!", "error");
            return;
        }

        const firstName = (document.getElementById("first-name") as HTMLInputElement).value;
        const lastName = (document.getElementById("last-name") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;

        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer Stay-ingAnonymous"
                },
                body: JSON.stringify({
                    userName: `${firstName} ${lastName}`,
                    email: email,
                    password: password.value
                })
            });

            if (response.ok) {
                showMessage("Brukeren ble opprettet!", "success");
                form.reset();
            } else {
                showMessage("Det oppsto en feil under registreringen!", "error");
            }

        } catch (error) {
            showMessage("Kunne ikke koble til serveren!", "error");
        }
    });

function showMessage(message: string, type: "success" | "error") {
    const existing = document.querySelector(".auth-message");
    if (existing) {
        existing.remove();
    }

    const div = document.createElement("div");
    div.className = `auth-message ${type}`;
    div.textContent = message;

    document.body.appendChild(div);

    setTimeout(() => {
        div.classList.add("fade-out");
        setTimeout(() => div.remove(), 400);
    }, 3000);
}

});