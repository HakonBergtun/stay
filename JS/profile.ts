
// VISNING / RENDER 
// EVENT LISTENERS
const loginform

async function fetchArticleCount

async function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
        .slice(0, 2);
}

async function showprofile(): Promise<void> {
    const session = loadSession();
    if (!session) return;

    const nameEl = document.getElementById("profile-name") as HTMLHeadingElement;
    const emailEl = document.getElementById("profile-email") as HTMLParagraphElement;
    const initialsEl = document.getElementById("profile-initials") as HTMLDivElement;
    const avatarEl = document.getElementById("profile-avatar") as HTMLImageElement;

    if (nameEl) nameEl.textContent = session.name;
    if (emailEl) emailEl.textContent = session.email;
    if (initialsEl) initialsEl.textContent = await getInitials(session.name);

