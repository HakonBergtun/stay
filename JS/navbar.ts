
const hamburger = document.getElementById('hamburger') as HTMLDivElement | null;
const navLinks = document.getElementById('nav-links') as HTMLElement | null;
const bookBtn = document.getElementById('book-btn') as HTMLButtonElement | null;

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
    });

} else {
    console.error('Hamburger menu or navigation links not found.');
}

if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        window.location.href = 'bookingside.html';
    });
}
