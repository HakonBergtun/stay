// Sander Marinius de Graaf Bendal
type Hotel = {
  id: number;
  name: string;
  location: string;
  stars: number;
  price: number;
  facilities: string[];
  image: string;
  Description?: string;
};

document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://localhost:3000/api/hotels";
  const API_KEY = "Stay-ingAnonymous";

  let editingId: number | null = null;

  let hotels: Hotel[] = [];

  const hotelList = document.querySelector(".hotel-list");

  async function loadHotels() {
    const response = await fetch(API_URL);
    if (!response.ok) {
      if (hotelList)
        hotelList.innerHTML =
          "<p>Kunne ikke hente hotellene. Vennligst prøv igjen senere.</p>";
      return;
    }
    hotels = await response.json();
    displayHotels(hotels);
  }

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
              <button type="button" class="edit-btn" data-id="${hotel.id}">Rediger</button>
              <button type="button" class="delete-btn" data-id="${hotel.id}">Slett</button>
            </div>
          </div>
        </article>
      `;
    });
  }

  loadHotels();

  const hotelForm = document.querySelector(".hotel-form") as HTMLFormElement;
  const formTitle = hotelForm?.querySelector("h2");
  const submitButton = hotelForm?.querySelector("button[type='submit']");

  const value = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const setValue = (id: string, newValue: string) => {
    (document.getElementById(id) as HTMLInputElement).value = newValue;
  };

  function resetForm() {
    hotelForm.reset();
    editingId = null;
    if (formTitle) formTitle.textContent = "Legg til hotell";
    if (submitButton) submitButton.textContent = "Lagre hotell";
  }

  hotelList?.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const id = Number(target.dataset.id);

    if (target.classList.contains("delete-btn")) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (response.ok) {
        loadHotels();
      }
    }

    if (target.classList.contains("edit-btn")) {
      const hotel = hotels.find((h) => h.id === id);
      if (!hotel) return;

      editingId = hotel.id;
      setValue("hotel-name", hotel.name);
      setValue("hotel-location", hotel.location);
      setValue("hotel-stars", String(hotel.stars));
      setValue("hotel-price", String(hotel.price));
      setValue("hotel-facilities", hotel.facilities.join(", "));
      setValue("hotel-image", hotel.image);
      setValue("hotel-description", hotel.Description ?? "");

      if (formTitle) formTitle.textContent = `Rediger ${hotel.name}`;
      if (submitButton) submitButton.textContent = "Oppdater hotell";
      hotelForm.scrollIntoView({ behavior: "smooth" });
    }
  });

  hotelForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: value("hotel-name"),
      location: value("hotel-location"),
      stars: Number(value("hotel-stars")),
      price: Number(value("hotel-price")),
      facilities: value("hotel-facilities")
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== ""),
      image: value("hotel-image"),
      Description: value("hotel-description"),
    };

    let response: Response;

    if (editingId === null) {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          ...formData,
          rooms: "",
          modern: false,
          view: "",
          available: true,
        }),
      });
    } else {
      const existingHotel = hotels.find((h) => h.id === editingId);

      response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ ...existingHotel, ...formData }),
      });
    }

    if (response.ok) {
      resetForm();
      loadHotels();
    }
  });

  const destinationInput = document.querySelector(
    "#destination-input",
  ) as HTMLInputElement;

  destinationInput?.addEventListener("input", () => {
    const query = destinationInput.value.toLowerCase();

    const filteredHotels = hotels.filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query),
    );

    displayHotels(filteredHotels);
  });

  const guestLabel = document.getElementById("guest-label") as HTMLElement;
  const guestInput = document.getElementById("guest-input") as HTMLInputElement;
  const guestDropdown = document.querySelector(
    ".guest-dropdown",
  ) as HTMLElement;
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
    if (
      !guestInput.contains(e.target as Node) &&
      !guestDropdown?.contains(e.target as Node)
    ) {
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
  const checkboxes = document.querySelectorAll(
    ".filters input[type='checkbox']",
  ) as NodeListOf<HTMLInputElement>;

  applyBtn?.addEventListener("click", () => {
    const selectedAmenities: string[] = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && !checkbox.classList.contains("star-checkbox")) {
        selectedAmenities.push(
          checkbox.parentElement?.textContent?.trim() ?? "",
        );
      }
    });

    const selectedStars: Number[] = [];
    document.querySelectorAll(".star-checkbox:checked").forEach((checkbox) => {
      selectedStars.push(Number((checkbox as HTMLInputElement).value));
    });

    const minPrice =
      Number(
        (document.getElementById("price-min") as HTMLInputElement).value,
      ) || 0;
    const maxPrice =
      Number(
        (document.getElementById("price-max") as HTMLInputElement).value,
      ) || Infinity;

    const filtered = hotels.filter((hotel) => {
      const amenityMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          hotel.facilities.some((a) =>
            a.toLowerCase().includes(amenity.toLowerCase()),
          ),
        );

      const starMatch =
        selectedStars.length === 0 || selectedStars.includes(hotel.stars);

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

  const sortSelect = document.querySelector(
    ".sort-control select",
  ) as HTMLSelectElement;

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
