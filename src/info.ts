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
}

function getHotelId(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadHotel() {
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
}

document.addEventListener("DOMContentLoaded", loadHotel);