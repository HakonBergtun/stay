"use strict";
const bookBtn = document.getElementById('book-btn');
if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        window.location.href = 'bookingside.html';
    });
}
