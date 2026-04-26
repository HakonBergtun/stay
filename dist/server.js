import express from 'express';
//import means we are going to get something from another file or package, but in this case we are getting the express package which is a popular tool for building servers in JavaScript.
//express is like a giant toolbox someone else built for us to use, so we do not need to build it ourselves
// We just need to import it into our file. It has tools to create a server, handle requests and send responses. 
//"from express" means we are going to get the tool called "express" from the package called express. 
import cors from 'cors';
//cors = cross origin resource sharing, its a special safety tool that browser uses to protect users from sus websites.
//It only allows websites that we trust to access our server.
const app = express(); // app is the name of our box, inside is our entire server. 
//express() - the () means "turn on the tool and get it ready to use", like a switch that turns on the tool.
const PORT = 4000; //this means variable called PORT has the value of 3000, this means we are telling our server to listen for requests on port 3000.
app.use(cors());
app.use(express.json());
//app.use() - this line is saying "hey server, before you do anything else, make sure to use these tools first", so we are telling our server to use the cors tool and the express.json tool before it handles any requests.
//cors() - WITHOUT cors tool other websites get blocked from talking to our server, but with this tool they can talk to our server.
//express.json() - data sent over the internet comes in a format called JSON,
//express.json() translates that JSON data that we get from internet into a format the server can understand and work with.
const hotels = [
    { id: 1, name: "Grand Hotel Oslo", location: "Karl Johans gate - 0.8 km til sentrum", price: 1490, rooms: "double bed", modern: false, view: "golfbane", available: true, facilities: ["Gratis Wi-Fi", "Frokost", "Gym"], Description: "Grand Hotel Oslo er et ikonisk hotell som ligger i hjertet av Oslo, på den berømte Karl Johans gate. Hotellet tilbyr elegante rom med klassisk innredning og moderne fasiliteter, inkludert gratis Wi-Fi, frokost og et treningsrom. Med sin sentrale beliggenhet og historiske sjarm, er Grand Hotel Oslo et ideelt valg for både forretningsreisende og turister som ønsker å oppleve det beste av Oslo." },
    { id: 2, name: "Thon Hotel Opera", location: "Bjørvika - 1.5km til sentrum", price: 2380, rooms: "single bed", modern: false, view: "utsikt over havet", available: true, facilities: ["Spa", "Pool", "Restaurant"], Description: "Thon Hotel Opera er et moderne hotell som ligger i det pulserende området Bjørvika, bare en kort spasertur fra Oslo sentrum. Hotellet tilbyr komfortable rom med moderne fasiliteter, inkludert gratis Wi-Fi, spa, pool og en restaurant som serverer deilige retter. Med sin sentrale beliggenhet og flotte fasiliteter, er Thon Hotel Opera et ideelt valg for både forretningsreisende og turister som ønsker å utforske Oslo." },
    { id: 3, name: "Budget Inn Grunderløkka", location: "Grunerløkka - 2.2km til sentrum", price: 940, rooms: "suite", modern: true, view: "utsikt fjorden", available: true, facilities: ["Gratis Wi-Fi", "Felles kjøkken - Vaskeri", "Gym"], Description: "Budget Inn Grunderløkka er et budsjettvennlig hotell som tilbyr komfortable rom og en sentral beliggenhet i det trendy området Grunerløkka. Hotellet har moderne fasiliteter, inkludert gratis Wi-Fi, et felles kjøkken og vaskeri, samt et treningsrom for gjestene. Med sin unike kombinasjon av rimelige priser og praktiske fasiliteter, er Budget Inn Grunderløkka et ideelt valg for reisende som ønsker å utforske Oslo uten å sprenge budsjettet." }
];
//const is variable which we store data in, and hotels is the name of that variable, the value of this variable is an array[] or a list of hotels.
// {} - curly brackets means one hotel or one object, each object has properties like id, name, location, price, rooms, available, each property has a value f.eks id: 1, name: "Grand Fjord Hotel" etc. value and key = key is the name of the property and value is the data
//in a real application, this data would come from a database
app.get("/api/hotels", (req, res) => {
    res.json(hotels);
});
//this a route - its teaching our server if someones asks THIS question, then give them THIS answer.
//app.get() - its when someone asks for something, GET means asking  for something like asking for menu at a restaurant, here we are saying "hey server, can I have the list of hotels?" - this is a GET request.
//"api/hotels" - this is the what they are asking for,  
//(req, res) => - this a function that runs when someone asks for "api/hotels", req is the request THEY made, res is the response WE will send back.
//res.json(hotels) - this is how we send the list of all hotels back to them, we are saying "here is the list of hotels in JSON format"
app.get("/api/hotels/:id", (req, res) => {
    const hotel = hotels.find(h => h.id === Number(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
});
// /api/hotels/:id - the :id part is a placeholder or blank space, if someone visits /api/hotels/2, then :id will be replaced with 2 etc.
//req.params.id - grab that number from the URL and use it to find the hotel with that id in our hotels array and return it to them.
//number(...) - URL parameters are always a string or text, but our hotel id are numbers, thats why its important to convert that string into a number so we can compare it with the hotel ids in our array, if not we will get an error because we are comparing a string with a number which will never be equal.
//hotels.find(...) - this method search through the hotels array and find the hotel that has the same id as the one we got from the URL, if we find it we return that hotel, if not we return a 404 error saying "Hotel not found"
//h => h.id ===.. - this is an arrow function that takes each hotel (h) and checks if its id matches the id we got from the URL
//if (!hotels) - if nothing was found then res.status(404).json({error: "Hotel not found"}) - this means if we did not find a hotel with that id, we send back a 404 status code which means "not found" and a JSON message saying "Hotel not found"
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
//app.listen(PORT) - this means we are starting our server and telling it to LISTEN for requests on PORT 3000, like opening the door to our apartment then waiting for people to knock and ask for something.
//() => {...} - this function is called a callback function and it says "after the server starts and is ready to listen, run this code inside the curly brackets", in this case we are just logging a message to the console that says "server is running on http://localhost:${PORT}".
//${PORT} - this automatically gets replaced with the actual value of PORT which is 3000, so the message will say "server is running on http://localhost:3000" 
