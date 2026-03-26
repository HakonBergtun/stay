
const hamburger = document.getElementById('hamburger') as HTMLDivElement | null;
const navLinks = document.getElementById('nav-links') as HTMLElement | null;


if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
    });

} else {
    console.error('Hamburger menu or navigation links not found.');
}


