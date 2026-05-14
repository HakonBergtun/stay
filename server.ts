//SHAIMA NAZAND
import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

const hotels = [
    { id: 1, name: "Grand Hotel Oslo", location: "Karl Johans gate - 0.8 km til sentrum", price: 1490, rooms: "double bed", modern: false, view: "golfbane", available: true, facilities: ["Gratis Wi-Fi", "Frokost", "Gym"], Description: "Grand Hotel Oslo er et ikonisk hotell som ligger i hjertet av Oslo, på den berømte Karl Johans gate. Hotellet tilbyr elegante rom med klassisk innredning og moderne fasiliteter, inkludert gratis Wi-Fi, frokost og et treningsrom. Med sin sentrale beliggenhet og historiske sjarm, er Grand Hotel Oslo et ideelt valg for både forretningsreisende og turister som ønsker å oppleve det beste av Oslo." },
    { id: 2, name: "Thon Hotel Opera", location: "Bjørvika - 1.5km til sentrum", price: 2380, rooms: "single bed", modern: false, view: "utsikt over havet", available: true, facilities: ["Spa", "Pool", "Restaurant"], Description: "Thon Hotel Opera er et moderne hotell som ligger i det pulserende området Bjørvika, bare en kort spasertur fra Oslo sentrum. Hotellet tilbyr komfortable rom med moderne fasiliteter, inkludert gratis Wi-Fi, spa, pool og en restaurant som serverer deilige retter. Med sin sentrale beliggenhet og flotte fasiliteter, er Thon Hotel Opera et ideelt valg for både forretningsreisende og turister som ønsker å utforske Oslo." },
    { id: 3, name: "Budget Inn Grunderløkka", location: "Grunerløkka - 2.2km til sentrum", price: 940, rooms: "suite", modern: true, view: "utsikt fjorden", available: true, facilities: ["Gratis Wi-Fi", "Felles kjøkken - Vaskeri", "Gym"], Description: "Budget Inn Grunderløkka er et budsjettvennlig hotell som tilbyr komfortable rom og en sentral beliggenhet i det trendy området Grunerløkka. Hotellet har moderne fasiliteter, inkludert gratis Wi-Fi, et felles kjøkken og vaskeri, samt et treningsrom for gjestene. Med sin unike kombinasjon av rimelige priser og praktiske fasiliteter, er Budget Inn Grunderløkka et ideelt valg for reisende som ønsker å utforske Oslo uten å sprenge budsjettet." }
];


app.get("/api/hotels", (req, res) => {
    res.json(hotels);
});


app.get("/api/hotels/:id", (req, res) => {
    const hotel = hotels.find(h => h.id === Number(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
});




app.put("/api/hotels/:id", (req, res) => {

    const hotelId = Number(req.params.id);

    const hotel = hotels.find(h => h.id === hotelId);

    if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
    }


    const { price, rooms, modern, available } = req.body;

    if (price !== undefined) hotel.price = price;
    if (rooms !== undefined) hotel.rooms = rooms;
    if (modern !== undefined) hotel.modern = modern;
    if (available !== undefined) hotel.available = available;

    res.json({
        message: "Hotel updated successfully",
        hotel
    });
});

app.delete("/api/hotels/:id/facilities", (req, res) => {
    const hotelId = Number(req.params.id);

    const hotel = hotels.find(h => h.id === hotelId);

    if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
    }

    const { facility } = req.query;


    if (!facility || typeof facility !== 'string') {
        return res.status(400).json({ error: "facility query parameter is required" });
    }

    const index = hotel.facilities.indexOf(facility);


    if (index === -1) {
        return res.status(404).json({ error: "Facility not found" });
    }

    hotel.facilities.splice(index, 1);


    res.json({
        message: "Facility deleted successfully",
        facilities: hotel.facilities

    });
});



type Review = {
    id: number;
    hotelId: number;
    author: string;
    text: string;
    date: string;
}


const reviews: Review[] = [];


app.post("/api/reviews", (req, res) => {
    const { hotelId, author, text, date } = req.body;

    if (!hotelId || !author || !text) {
        return res.status(400).json({ error: "hotelId, author and text are required" });
    }

    const newReview = {
        id: reviews.length + 1,
        hotelId: Number(hotelId),
        author,
        text,
        date: date || new Date().toLocaleDateString('nb-NO'),
    };

    reviews.push(newReview);

    res.status(201).json({
        message: "Review created successfully",
        review: newReview
    });
});

app.get("/api/reviews/:hotelId", (req, res) => {
    const hotelId = Number(req.params.hotelId);
    const hotelReviews = reviews.filter(r => r.hotelId === hotelId);
    res.json(hotelReviews);
});


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});

