//SHAIMA NAZAND 
import { initNavbar } from "./navbar.js";

type Hotel = { 
    id: number;
    name: string;
    location: string;
    price: number;
    rooms: string;
    modern: boolean;
    view: string;
    available: boolean;
    facilities: string[];
    Description: string;
    stars: number;
    image: string;
}

type Review = {
    id: number;
    hotelId: number;
    author: string;
    text: string;
    date: string;
}

function getHotelId(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") ?? "1";
}

let isEditing = false;

async function saveHotel(hotel: Hotel): Promise<void> {
    const priceInput = document.getElementById('input-price') as HTMLInputElement;
    const roomsInput = document.getElementById('input-rooms') as HTMLInputElement;
    const modernInput = document.getElementById('input-modern') as HTMLInputElement;
    const availableInput = document.getElementById('input-available') as HTMLInputElement;

    const updatedFields = {
        price: Number(priceInput.value),
        rooms: roomsInput.value,
        modern: modernInput.checked,
        available: availableInput.checked,
    };

    const response = await fetch(`http://localhost:4000/api/hotels/${hotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
        alert("Kunne ikke lagre endringer. Prøv igjen.");
        return;
    }

    const data = await response.json();
    hotel.price = data.hotel.price;
    hotel.rooms = data.hotel.rooms;
    hotel.modern = data.hotel.modern;
    hotel.available = data.hotel.available;
    hotel.stars = data.hotel.stars;

    isEditing = false;
    renderDetails(hotel);
}

async function deleteFacility(hotel: Hotel, facilityToRemove: string): Promise<void> {
    const encoded = encodeURIComponent(facilityToRemove);


    const response = await fetch(
        `http://localhost:4000/api/hotels/${hotel.id}/facilities?facility=${encoded}`,
        { method: "DELETE" }
    );

    if (!response.ok) {
        alert("Kunne ikke slette fasiliteten. Prøv igjen.");
        return;
    }

    const data = await response.json();
    hotel.facilities = data.facilities;


    renderFacilities(hotel);
}


async function postReview(hotelId: number): Promise<void> {
    const authorInput = document.getElementById('review-author') as HTMLInputElement;
    const textInput = document.getElementById('review-text') as HTMLTextAreaElement;


    const author = authorInput.value.trim();
    const text = textInput.value.trim();


    if (!author || !text) {
        alert("Vennligst fyll inn både navn og anmeldelse.");
        return;
    }

    const newReview = {
        hotelId,
        author,
        text,
        date: new Date().toLocaleDateString('nb-NO'),

    };

    const response = await fetch(`http://localhost:4000/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
    });

    if (!response.ok) {
        alert("Kunne ikke sende anmeldelsen. Prøv igjen.");
        return;
    }

    const data = await response.json();

    authorInput.value = '';
    textInput.value = '';


    prependReview(data.review);

}


function prependReview(review: Review): void {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    const li = document.createElement('li');

    li.className = 'review-item';
    li.innerHTML = `
        <div class="review-header">
            <strong class="review-author">${review.author}</strong>
            <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.text}</p>
    `;

    reviewsList.prepend(li);

}


async function loadReviews(hotelId: number): Promise<void> {
    const response = await fetch(`http://localhost:4000/api/reviews/${hotelId}`);

    if (!response.ok) {
        console.error("Kunne ikke hente anmeldelser.");
        return;
    }

    const reviews: Review[] = await response.json();
    reviews.forEach(review => prependReview(review));

}

function renderDetails(hotel: Hotel): void {
    const detailsContainer = document.getElementById('hotel-details');
    const editBtn = document.getElementById('edit-btn');
    if (!detailsContainer || !editBtn) return;

    if (isEditing) {
        detailsContainer.innerHTML = `
            <div class="details" role="group" aria-label="Hotell detaljer">
                <p>
                    <label for="input-price"><strong>Pris:</strong></label>
                    <input id="input-price" type="number" value="${hotel.price}" class="edit-input" />
                    kr per natt
                </p>
                <p>
                    <label for="input-rooms"><strong>Romtype:</strong></label>
                    <input id="input-rooms" type="text" value="${hotel.rooms}" class="edit-input" />
                </p>
                
                <p>
                    <label for="input-stars"><strong>Stjerner:</strong></label>
                 <input id="input-stars" type="number" min="1" max="5" value="${hotel.stars}" class="edit-input" />
                </p>

                <p>
                    <label for="input-available"><strong>Tilgjengelighet:</strong></label>
                    <input id="input-available" type="checkbox" ${hotel.available ? 'checked' : ''} class="edit-checkbox" />
                    Ledig rom
                </p>
                <p>
                    <label for="input-modern"><strong>Modern:</strong></label>
                    <input id="input-modern" type="checkbox" ${hotel.modern ? 'checked' : ''} class="edit-checkbox" />
                    Nye og moderne møbler
                </p>

                
            </div>
            <div class="btn-group">
                <button class="btn" id="save-btn" aria-label="Lagre endringer">Lagre</button>
                <button class="btn btn-cancel" id="cancel-btn" aria-label="Avbryt">Avbryt</button>
            </div>
        `;

        editBtn.style.display = 'none';

        document.getElementById('save-btn')?.addEventListener('click', () => saveHotel(hotel));
        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            isEditing = false;
            renderDetails(hotel);
        });

    } else {
        detailsContainer.innerHTML = `
            <div class="details" role="group" aria-label="Hotell detaljer">
                <p><strong>Pris:</strong> ${hotel.price}kr per natt</p>
                <p><strong>Romtype:</strong> ${hotel.rooms}</p>
                <p><strong>Tilgjengelighet:</strong> ${hotel.available ? 'Ledig rom' : 'Ikke tilgjengelig'}</p>
                <p><strong>Modern:</strong> ${hotel.modern ? 'Nye og moderne møbler' : 'Standard møbler'}</p>
                <p><strong>Utsikt:</strong> ${hotel.view}</p>
                <p></p><strong>Stjerner:</strong> ${"★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars)}</p>
            </div>
        `;

        editBtn.style.display = 'inline-block';
    }
}

function renderFacilities(hotel: Hotel): void {
    const facilitiesList = document.getElementById('facilities-list');
    if (!facilitiesList) return;

    facilitiesList.innerHTML = hotel.facilities.map(facility => `
        <li class="facility-item">
            <span>${facility}</span>
            <button
                class="btn-delete-facility"
                aria-label="Slett ${facility}"
                data-facility="${facility}"
            >
                ✕
            </button>
        </li>
    `).join('');

    facilitiesList.querySelectorAll('.btn-delete-facility').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const facility = target.dataset.facility;
            if (facility) deleteFacility(hotel, facility);
        });
    });
}

async function loadHotel(): Promise<void> {
    const id = getHotelId();

    if (!id) {
        console.error("No hotel ID provided in URL");
        return;
    }

    const response = await fetch(`http://localhost:4000/api/hotels/${id}`);
    if (!response.ok) {
        console.error("Hotel not found");
        return;
    }
    const hotel: Hotel = await response.json();

    const container = document.getElementById('hotel-container');
    if (!container) return;

    container.innerHTML = `
        <main class="container" aria-labelledby="hotell-navn">
            <section class="hero" aria-label="Hotelloversikt">
                <article class="hero-content">
                    <header>
                        <h1 id="hotell-navn">${hotel.name}</h1>
                        <p class="location">${hotel.location}</p>
                    </header>

                    <div id="hotel-details"></div>

                    <div class="btn-group" id="main-btn-group">
                        <button class="btn" id="book-btn" aria-label="Bestill rom på ${hotel.name}">
                            Bestill nå
                        </button>
                        <button class="btn btn-edit" id="edit-btn" aria-label="Rediger hotell">
                            Rediger
                        </button>
                    </div>
                </article>

                <figure class="hero-image">
                    <img src="${hotel.image}" alt="${hotel.name}" />
                </figure>
            </section>

            <section class="facilities" aria-labelledby="fasiliteter-tittel">
                <h2 id="fasiliteter-tittel">Fasiliteter</h2>
                <ul id="facilities-list"></ul>
            </section>

            <section class="description" aria-labelledby="beskrivelse-tittel">
                <h2 id="beskrivelse-tittel">Beskrivelse</h2>
                <p>${hotel.Description}</p>
            </section>

            <section class="reviews" aria-labelledby="anmeldelser-tittel">
                <h2 id="anmeldelser-tittel">Anmeldelser</h2>

                <ul id="reviews-list" aria-live="polite">
                    <!-- polite means screen readers announce new reviews
                         without interrupting whatever they are currently reading -->
                </ul>

                <div class="review-form" aria-label="Skriv en anmeldelse">
                    <h3>Skriv en anmeldelse</h3>
                    <input
                        id="review-author"
                        type="text"
                        placeholder="Ditt navn"
                        class="review-author-input"
                        aria-label="Ditt navn"
                    />
                    <textarea
                        id="review-text"
                        placeholder="Del din opplevelse av hotellet..."
                        class="review-textarea"
                        aria-label="Din anmeldelse"
                        rows="5"
                    ></textarea>
                    <button class="btn" id="submit-review-btn" aria-label="Send inn anmeldelse">
                        Send anmeldelse
                    </button>
                </div>
            </section>
        </main>
    `;

    renderDetails(hotel);
    renderFacilities(hotel);
    loadReviews(hotel.id);

    document.getElementById('edit-btn')?.addEventListener('click', () => {
        isEditing = true;
        renderDetails(hotel);
    });

    document.getElementById('submit-review-btn')?.addEventListener('click', () => {
        postReview(hotel.id);
    });

    document.getElementById('book-btn')?.addEventListener('click', () => {
        window.location.href = "bookingside.html";
    });

}

document.addEventListener("DOMContentLoaded", loadHotel);
document.addEventListener("DOMContentLoaded", initNavbar);
