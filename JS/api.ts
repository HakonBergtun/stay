import type { Booking, NewBooking, Room, User } from "./types";

const BASE_URL = "http://localhost:3000";

function getApiKey(): string {
    return localStorage.getItem("api_key") ?? "Stay-ingAnonymous";
}

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
    if (!response.ok) {
        let message = fallbackMessage;

        try {
            const error = await response.json();
            message = error.message ?? fallbackMessage;
        } catch {
            // Kommentar: Fallback hvis API ikke returnerer JSON error.
        }

        throw new Error(message);
    }

    return response.json();
}

/* ROOMS */

export async function getRooms(): Promise<Room[]> {
    const response = await fetch(`${BASE_URL}/rooms`);
    return handleResponse<Room[]>(response, "Kan ikke hente rom");
}

/* BOOKINGS */

export async function getBookings(userId = 1): Promise<Booking[]> {
    const response = await fetch(`${BASE_URL}/bookings?userId=${userId}`);
    return handleResponse<Booking[]>(response, "Kan ikke hente bookinger");
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify(booking),
    });

    return handleResponse<Booking>(response, "Kunne ikke opprette booking");
}

export async function updateBooking(
    booking: Booking,
    fromDate: string,
    toDate: string,
    message: string,
): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
            ...booking,
            fromDate,
            toDate,
            message,
            updated: new Date().toISOString(),
        }),
    });

    return handleResponse<Booking>(response, "Kunne ikke oppdatere booking");
}

export async function deleteBooking(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Kunne ikke slette booking");
    }
}

/* USERS / PROFILE */

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    return handleResponse<User[]>(response, "Kan ikke hente brukere");
}

export async function getUser(id: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    return handleResponse<User>(response, "Kan ikke hente bruker");
}

export async function updateUser(user: User): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
            ...user,
            updated: new Date().toISOString(),
        }),
    });

    return handleResponse<User>(response, "Kunne ikke oppdatere bruker");
}

export async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Kunne ikke slette bruker");
    }
}