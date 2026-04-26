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
        <h2>${hotel.name}</h2>
        <p>${hotel.location}</p>
        <p>${hotel.price} NOK per natt</p>
        `;
    });
}
document.addEventListener("DOMContentLoaded", loadHotel);
