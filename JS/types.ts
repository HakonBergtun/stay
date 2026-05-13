export interface User {
    id: number;
    userName: string;
    password: string;
    email: string;
    created: string;
    updated: string;
}

export interface Room {
    id: number;
    name: string;
    pricePrNight: number;
    description: string;
    features: string[];
    maxGuests: number;
    reviews: Review[];
    created: string;
    updated: string;
}

export interface Review {
    id: number;
    userId: number;
    rating: number;
    comment: string;
    created: string;
    updated: string;
}

export interface Booking {
    id: number;
    userId: number;
    roomId: number;
    fromDate: string;
    toDate: string;
    status: "pending" | "confirmed" | "cancelled";
    message: string;
    created: string;
    updated: string;
}

export type NewBooking = Omit<Booking, "id">;