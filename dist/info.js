"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getHotelId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
function loadHotel() {
    return __awaiter(this, void 0, void 0, function* () {
        const id = getHotelId();
        if (!id) {
            console.error("No hotel ID provided in URL");
            return;
        }
        const response = yield fetch(`http://localhost:4000/api/hotels/${id}`);
        if (!response.ok) {
            console.error("Hotel not found");
            return;
        }
        const hotel = yield response.json();
        const container = document.getElementById('hotel-container');
        if (!container)
            return;
        container.innerHTML = `
        <main class="container" aria-labelledby="hotell-navn">
            <section class="hero" aria-label="Hotelloversikt">
                <article class="hero-content">
                    <header>
                        <h1 id="hotell-navn">${hotel.name}</h1>
                        <p class="location">${hotel.location}</p>
                    </header>

                    <div class="details" role="group" aria-label="Hotell detaljer">
                        <p><strong>Pris:</strong> ${hotel.price}kr per natt</p>
                        <p><strong>Romtype:</strong> ${hotel.rooms}</p>
                        <p><strong>Tilgjengelighet:</strong> ${hotel.available ? 'Ledig rom' : 'Ikke tilgjengelig'}</p>
                        <p><strong>Modern:</strong> ${hotel.modern ? 'Nye og moderne møbler' : 'Standard møbler'}</p>
                        <p><strong>Utsikt:</strong> ${hotel.view}</p>
                    </div>

                    <button
                        class="btn"
                        id="book-btn"
                        aria-label="Bestill rom på ${hotel.name}"
                    >
                        Bestill nå
                    </button>
                </article>

                <figure class="hero-image">
                    <img src="/assets/image01.png" alt="Moderne hotellbygning" />
                </figure>
            </section>

            <section class="facilities" aria-labelledby="fasiliteter-tittel">
                <h2 id="fasiliteter-tittel">Fasiliteter</h2>
                <ul>
                    ${hotel.facilities.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </section>

            <section class="description" aria-labelledby="beskrivelse-tittel">
                <h2 id="beskrivelse-tittel">Beskrivelse</h2>
                <p>${hotel.Description}</p>
            </section>
        </main>
    `;
    });
}
document.addEventListener("DOMContentLoaded", loadHotel);
