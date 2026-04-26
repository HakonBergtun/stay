const bookBtn = document.getElementById('book-btn') as HTMLButtonElement | null;

if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        window.location.href = 'bookingside.html';
    });
}