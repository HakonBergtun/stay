import { getCurrentUserId } from "./api";
import { BASE_URL, API_KEY } from "./config";

interface User {
    id: number;
    userName: string;
    password: string;
    email: string;
    created: string;
    updated: string;
}

const CURRENT_USER_ID = getCurrentUserId();

/* API */

async function getCurrentUser(): Promise<User> {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
        throw new Error(`Kunne ikke hente brukere (${response.status})`);
    }

    const users = (await response.json()) as User[];
    const user = users.find((u) => u.id === CURRENT_USER_ID);

    if (!user) {
        throw new Error("Fant ikke bruker");
    }

    return user;
}

async function updateUser(user: User): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error(`Kunne ikke oppdatere bruker (${response.status})`);
    }

    return response.json();
}

async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Kunne ikke slette bruker (${response.status})`);
    }
}

/* RENDER */

function showMessage(message: string, isError = false): void {
    const pageMessage = document.getElementById("pageMessage");

    if (!pageMessage) return;

    pageMessage.textContent = message;
    pageMessage.style.color = isError ? "#b65c5c" : "var(--primary)";
}

function renderUser(user: User): void {
    const profileEmail = document.getElementById("profileEmail");
    const profileUserName = document.getElementById("profileUserName");
    const profileCreated = document.getElementById("profileCreated");
    const profileUpdated = document.getElementById("profileUpdated");

    const editUserId = document.getElementById("editUserId") as HTMLInputElement | null;
    const userNameInput = document.getElementById("userName") as HTMLInputElement | null;
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;

    if (profileEmail) profileEmail.textContent = user.email;
    if (profileUserName) profileUserName.textContent = user.userName;
    if (profileCreated) profileCreated.textContent = user.created.slice(0, 10);
    if (profileUpdated) profileUpdated.textContent = user.updated.slice(0, 10);

    if (editUserId) editUserId.value = String(user.id);
    if (userNameInput) userNameInput.value = user.userName;
    if (emailInput) emailInput.value = user.email;
    if (passwordInput) passwordInput.value = user.password;
}

/* DATA */

async function loadProfile(): Promise<void> {
    try {
        showMessage("Laster profil...");
        const user = await getCurrentUser();
        renderUser(user);
        showMessage("");
    } catch (error) {
        console.error(error);
        showMessage((error as Error).message, true);
    }
}

/* EVENT LISTENERS */

function setupEventListeners(): void {
    const editProfileForm = document.getElementById("editProfileForm") as HTMLFormElement | null;
    const deleteUserBtn = document.getElementById("deleteUserBtn") as HTMLButtonElement | null;

    editProfileForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const oldUser = await getCurrentUser();

            const userNameInput = document.getElementById("userName") as HTMLInputElement;
            const emailInput = document.getElementById("email") as HTMLInputElement;
            const passwordInput = document.getElementById("password") as HTMLInputElement;

            if (!userNameInput.value.trim()) {
                showMessage("Brukernavn kan ikke være tomt", true);
                return;
            }

            if (!emailInput.value.trim()) {
                showMessage("E-post kan ikke være tom", true);
                return;
            }

            if (passwordInput.value.length < 4) {
                showMessage("Passord må være minst 4 tegn", true);
                return;
            }

            const updatedUser: User = {
                ...oldUser,
                userName: userNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                updated: new Date().toISOString(),
            };

            const savedUser = await updateUser(updatedUser);
            renderUser(savedUser);
            showMessage("Profil oppdatert");
        } catch (error) {
            console.error(error);
            showMessage((error as Error).message, true);
        }
    });

    deleteUserBtn?.addEventListener("click", async () => {
        const confirmed = confirm("Er du sikker på at du vil slette brukeren?");
        if (!confirmed) return;

        try {
            await deleteUser(CURRENT_USER_ID);
            localStorage.removeItem("stay_session");
            showMessage("Bruker slettet");
            window.location.href = "signin.html";
        } catch (error) {
            console.error(error);
            showMessage((error as Error).message, true);
        }
    });
}

/* INIT */

setupEventListeners();
loadProfile();