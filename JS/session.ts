export interface Session {
    id: number;
    name: string;
    email: string;
    apiKey: string;
}

const STORAGE_KEY = "stay_session";

export function saveSession(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession(): Session | null {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return null;
    }

    return JSON.parse(data) as Session;
}

export function clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
}