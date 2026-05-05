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

  const destinationInput = document.querySelector("#destination-input") as HTMLInputElement;

  destinationInput?.addEventListener("input", () => {
    const query = destinationInput.value.toLowerCase();

    const filteredHotels = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(query) ||
      hotel.name.toLowerCase().includes(query)
    );

    displayHotels(filteredHotels);
  });

  const guestLabel = document.getElementById("guest-label") as HTMLElement;
  const guestInput = document.getElementById("guest-input") as HTMLInputElement;
  const guestDropdown = document.querySelector(".guest-dropdown") as HTMLElement;
  const adultsCount = document.getElementById("adults-count") as HTMLElement;
  const childCount = document.getElementById("child-count") as HTMLElement;

  let adults = 2;
  let children = 0;

function updateGuestInput() {
  guestInput.value = `${adults} voksne, ${children} barn`;
}

  guestLabel.addEventListener("click", (e) => {
    e.stopPropagation();
    guestDropdown?.classList.toggle("open");

    const rect = guestInput.getBoundingClientRect();
    guestDropdown.style.left = rect.left + "px";
    guestDropdown.style.top = rect.bottom + 12 + "px";
  });

  document.addEventListener("click", (e) => {
    if (!guestInput.contains(e.target as Node) &&
    !guestDropdown?.contains(e.target as Node)) {
      guestDropdown?.classList.remove("open");
    }
  });

  document.getElementById("adults-plus")?.addEventListener("click", () => {
    adults++;
    adultsCount.textContent = adults.toString();
    updateGuestInput();
  });

  document.getElementById("adults-minus")?.addEventListener("click", () => {
    if (adults > 1) {
      adults--;
      adultsCount.textContent = adults.toString();
      updateGuestInput();
    }
  });

  document.getElementById("child-plus")?.addEventListener("click", () => {
    children++;
    childCount.textContent = children.toString();
    updateGuestInput();
  });

  document.getElementById("child-minus")?.addEventListener("click", () => {
    if (children > 0) {
      children--;
      childCount.textContent = children.toString();
      updateGuestInput();
    }
  });
  updateGuestInput();

  const applyBtn = document.querySelector(".btn-apply");
  const clearBtn = document.querySelector(".btn-clear");
  const checkboxes = document.querySelectorAll(".filters input[type='checkbox']") as NodeListOf<HTMLInputElement>;

  applyBtn?.addEventListener("click", () => {
    const selectedAmenities: string[] = [];

    checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedAmenities.push(checkbox.parentElement?.textContent?.trim() ?? "");
    }
  });

  if (selectedAmenities.length === 0) {
    displayHotels(hotels);
    return;
  }

  const filtered = hotels.filter((hotel) =>
    selectedAmenities.every((amenity) => 
      hotel.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
    )
  );

  displayHotels(filtered);
});

clearBtn?.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  displayHotels(hotels);
});

});

