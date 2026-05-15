type Hotel = {
  id: number;
  name: string;
  location: string;
  stars: number;
  price: number;
  facilities: string[];
  image: string;
};

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://localhost:4000/api/hotels");
  const hotels: Hotel[] = await response.json();

  const hotelList = document.querySelector(".hotel-list");

  function displayHotels(filtered: Hotel[]) {
    if (!hotelList) return;

    hotelList.innerHTML = "";

    filtered.forEach((hotel) => {
      const stars = "★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars);

      hotelList.innerHTML += `
        <article class="hotel">
          <img class="hotel-image" src="${hotel.image}" alt="${hotel.name}">
          <div class="hotel-info">
            <h2>${hotel.name}</h2>
            <p>${stars}</p>
            <p>${hotel.location}</p>
            <p>${hotel.facilities.join(" · ")}</p>
            <div class="hotel-price">
              <div>
                <p class="price"><strong>${hotel.price} NOK</strong></p>
                <p class="price-label">per natt</p>
              </div>
              <a href="infoside.html?id=${hotel.id}">View deal</a>
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
      if (checkbox.checked && !checkbox.classList.contains("star-checkbox")) {
        selectedAmenities.push(checkbox.parentElement?.textContent?.trim() ?? "");
      }
    });

    const selectedStars: Number[] = [];
    document.querySelectorAll(".star-checkbox:checked").forEach((checkbox) => {
      selectedStars.push(Number((checkbox as HTMLInputElement).value));
    });

    const minPrice = Number((document.getElementById("price-min") as HTMLInputElement).value) || 0;
    const maxPrice = Number((document.getElementById("price-max") as HTMLInputElement).value) || Infinity;

    const filtered = hotels.filter((hotel) => {
      const amenityMatch = selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          hotel.facilities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
        );

      const starMatch = selectedStars.length === 0 || selectedStars.includes(hotel.stars);

      const priceMatch = hotel.price >= minPrice && hotel.price <= maxPrice;

      return amenityMatch && starMatch && priceMatch;
    });

    displayHotels(filtered);
  });

  clearBtn?.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    (document.getElementById("price-min") as HTMLInputElement).value = "";
    (document.getElementById("price-max") as HTMLInputElement).value = "";
    displayHotels(hotels);
  });

  const sortSelect = document.querySelector(".sort-control select") as HTMLSelectElement;

  sortSelect?.addEventListener("change", () => {
    const value = sortSelect.value;

    let sortedHotels = [...hotels];

    if (value === "Pris (lav til høy)") {
      sortedHotels.sort((a, b) => a.price - b.price);
    } else if (value === "Pris (høy til lav)") {
      sortedHotels.sort((a, b) => b.price - a.price);
    } else if (value === "Stjerner") {
      sortedHotels.sort((a, b) => b.stars - a.stars);
    }

    displayHotels(sortedHotels);
  });

});