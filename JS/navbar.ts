
const hamburger = document.getElementById('hamburger') as HTMLDivElement | null;
const navLinks = document.getElementById('nav-links') as HTMLElement | null;


if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
    });

} else {
    console.error('Hamburger menu or navigation links not found.');
}

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = localStorage.getItem("apiKey");
    const menu = document.getElementById("auth-menu") as HTMLElement;
    const profileIcon = document.getElementById("profile-icon") as HTMLElement;

    if (apiKey) {
        menu.style.display = "none";
        profileIcon.style.display = "block";
    } else {
        menu.style.display = "block";
        profileIcon.style.display = "none";
    }
});

