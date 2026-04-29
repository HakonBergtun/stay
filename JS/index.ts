document.addEventListener("DOMContentLoaded", () => {

  const hotels = [
    {
      id: 1,
      name: "Hotel Oslo",
      location: "Oslo",
      stars: 4,
      pricePerNight: 1200,
      amenities: ["Gratis Wi-Fi", "Breakfast", "Gym"],
      image: null,
      href: "infoside.html"
    },
    {
      id: 2,
      name: "Thon Hotel Opera",
      location: "Bergen",
      stars: 5,
      pricePerNight: 2380,
      amenities: ["Spa", "Badebasseng", "Restaurant"],
      image: null,
      href: "infoside.html"
    },
    {
      id: 3,
      name: "Scandic Holmenkollen Park",
      location: "Trondheim",
      stars: 4,
      pricePerNight: 940,
      amenities: ["Gratis Wi-Fi", "Frokost", "Gym"],
      image: null,
      href: "infoside.html"
    },
  ];

  const hotelList = document.querySelector(".hotel-list");

  function displayHotels(filtered: typeof hotels) {
    if (!hotelList) return;

    hotelList.innerHTML = "";

    filtered.forEach((hotel) => {
      const stars = "★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars);

      hotelList.innerHTML += `
        <article class="hotel">
          <div class="hotel-image">Bilde</div>
          <div class="hotel-info">
            <h2>${hotel.name}</h2>
            <p>${stars}</p>
            <p>${hotel.location}</p>
            <p>${hotel.amenities.join(" · ")}</p>
            <div class="hotel-price">
              <div>
                <p class="price"><strong>${hotel.pricePerNight} NOK</strong></p>
                <p class="price-label">per natt</p>
              </div>
              <a href="${hotel.href}">View deal</a>
            </div>
          </div>
        </article>
      `;
    });
  }

  displayHotels(hotels);

  const destinationInput = document.querySelector(".search-form input[type='text']") as HTMLInputElement;

  destinationInput?.addEventListener("input", () => {
    const query = destinationInput.value.toLowerCase();

    const filteredHotels = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(query) ||
      hotel.name.toLowerCase().includes(query)
    );

    displayHotels(filteredHotels);
  });

});