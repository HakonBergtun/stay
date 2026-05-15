import { getCurrentUserId } from "./api";
import { BASE_URL, API_KEY } from "./config";

interface Room {
    id: number;
    name: string;
    pricePrNight: number;
    description: string;
    features: string[];
    maxGuests: number;
    created: string;
    updated: string;
}

interface Booking {
    id: number;
    userId: number;
    roomId: number;
    fromDate: string;
    toDate: string;
    status: string;
    message: string;
    created: string;
    updated: string;
}

const CURRENT_USER_ID = getCurrentUserId();

let rooms: Room[] = [];
let bookings: Booking[] = [];

/* API */

async function getRooms(): Promise<Room[]> {
    const response = await fetch(`${BASE_URL}/rooms`);

    if (!response.ok) {
        throw new Error("Kunne ikke hente rom");
    }

    return response.json();
}

async function getBookings(): Promise<Booking[]> {
    const response = await fetch(`${BASE_URL}/bookings?userId=${CURRENT_USER_ID}`);

    if (!response.ok) {
        throw new Error("Kunne ikke hente bookinger");
    }

    return response.json();
}

async function createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        throw new Error("Kunne ikke opprette booking");
    }

    return response.json();
}

async function updateBooking(booking: Booking): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        throw new Error("Kunne ikke oppdatere booking");
    }

    return response.json();
}

async function deleteBooking(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error("Kunne ikke slette booking");
    }
}

/* RENDER */

function showMessage(message: string, isError = false): void {
    const pageMessage = document.getElementById("pageMessage");

    if (!pageMessage) return;

    pageMessage.textContent = message;
    pageMessage.style.color = isError ? "#b65c5c" : "var(--primary)";
}

function getRoomName(roomId: number): string {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : `Rom #${roomId}`;
}

function renderRooms(): void {
    const roomSelect = document.getElementById("roomId") as HTMLSelectElement | null;

    if (!roomSelect) return;

    roomSelect.innerHTML = `<option value="" selected disabled>Velg rom</option>`;

    rooms.forEach((room) => {
        roomSelect.innerHTML += `
      <option value="${room.id}">
        ${room.name} - ${room.pricePrNight} kr/natt
      </option>
    `;
    });
}

function renderBookings(): void {
    const bookingsList = document.getElementById("bookingsList");
    const emptyState = document.getElementById("emptyState");

    if (!bookingsList || !emptyState) return;

    if (bookings.length === 0) {
        bookingsList.innerHTML = "";
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    bookingsList.innerHTML = bookings
        .map(
            (booking) => `
        <article class="booking-card">
          <h3>${getRoomName(booking.roomId)}</h3>
          <p><strong>Fra:</strong> ${booking.fromDate}</p>
          <p><strong>Til:</strong> ${booking.toDate}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>Melding:</strong> ${booking.message || "Ingen melding"}</p>

          <div class="booking-actions">
            <button type="button" data-action="edit" data-id="${booking.id}">
              Rediger
            </button>
            <button type="button" data-action="delete" data-id="${booking.id}">
              Kanseller
            </button>
          </div>
        </article>
      `,
        )
        .join("");
}

/* EDIT */

function openEditBooking(booking: Booking): void {
    const editSection = document.getElementById("editBookingSection") as HTMLElement | null;
    const editBookingId = document.getElementById("editBookingId") as HTMLInputElement | null;
    const editFromDate = document.getElementById("editFromDate") as HTMLInputElement | null;
    const editToDate = document.getElementById("editToDate") as HTMLInputElement | null;
    const editMessage = document.getElementById("editMessage") as HTMLTextAreaElement | null;

    if (!editSection || !editBookingId || !editFromDate || !editToDate || !editMessage) return;

    editBookingId.value = String(booking.id);
    editFromDate.value = booking.fromDate;
    editToDate.value = booking.toDate;
    editMessage.value = booking.message;

    editSection.hidden = false;
    editSection.scrollIntoView({ behavior: "smooth" });
}

function closeEditBooking(): void {
    const editSection = document.getElementById("editBookingSection") as HTMLElement | null;
    const editForm = document.getElementById("editBookingForm") as HTMLFormElement | null;

    if (editSection) editSection.hidden = true;
    if (editForm) editForm.reset();
}

/* DATA */

async function loadPage(): Promise<void> {
    try {
        showMessage("Laster bookinger...");

        rooms = await getRooms();
        bookings = await getBookings();

        renderRooms();
        renderBookings();

        showMessage("");
    } catch (error) {
        showMessage((error as Error).message, true);
    }
}

/* EVENT LISTENERS */

function setupEventListeners(): void {
    const newBookingForm = document.getElementById("newBookingForm") as HTMLFormElement | null;
    const bookingsList = document.getElementById("bookingsList");
    const editBookingForm = document.getElementById("editBookingForm") as HTMLFormElement | null;
    const cancelEditBtn = document.getElementById("cancelEditBtn") as HTMLButtonElement | null;

    newBookingForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const roomIdInput = document.getElementById("roomId") as HTMLSelectElement;
        const fromDateInput = document.getElementById("fromDate") as HTMLInputElement;
        const toDateInput = document.getElementById("toDate") as HTMLInputElement;
        const messageInput = document.getElementById("message") as HTMLTextAreaElement;

        try {
            const newBooking = {
                userId: CURRENT_USER_ID,
                roomId: Number(roomIdInput.value),
                fromDate: fromDateInput.value,
                toDate: toDateInput.value,
                status: "pending",
                message: messageInput.value.trim(),
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            };

            await createBooking(newBooking);
            newBookingForm.reset();

            showMessage("Booking opprettet");
            await loadPage();
        } catch (error) {
            showMessage((error as Error).message, true);
        }
    });

    bookingsList?.addEventListener("click", async (e) => {
        const target = e.target as HTMLButtonElement;
        const action = target.dataset.action;
        const id = Number(target.dataset.id);

        if (!action || !id) return;

        const booking = bookings.find((b) => b.id === id);
        if (!booking) return;

        if (action === "edit") {
            openEditBooking(booking);
        }

        if (action === "delete") {
            const confirmed = confirm("Er du sikker på at du vil kansellere bookingen?");
            if (!confirmed) return;

            try {
                await deleteBooking(id);
                showMessage("Booking slettet");
                await loadPage();
            } catch (error) {
                showMessage((error as Error).message, true);
            }
        }
    });

    editBookingForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const editBookingId = document.getElementById("editBookingId") as HTMLInputElement;
        const editFromDate = document.getElementById("editFromDate") as HTMLInputElement;
        const editToDate = document.getElementById("editToDate") as HTMLInputElement;
        const editMessage = document.getElementById("editMessage") as HTMLTextAreaElement;

        const id = Number(editBookingId.value);
        const oldBooking = bookings.find((b) => b.id === id);

        if (!oldBooking) return;

        try {
            const updatedBooking: Booking = {
                ...oldBooking,
                fromDate: editFromDate.value,
                toDate: editToDate.value,
                message: editMessage.value.trim(),
                updated: new Date().toISOString(),
            };

            await updateBooking(updatedBooking);

            closeEditBooking();
            showMessage("Booking oppdatert");
            await loadPage();
        } catch (error) {
            showMessage((error as Error).message, true);
        }
    });

    cancelEditBtn?.addEventListener("click", () => {
        closeEditBooking();
    });
}

/* INIT */

setupEventListeners();
loadPage();