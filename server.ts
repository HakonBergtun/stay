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

const PORT = 3000; //this means variable called PORT has the value of 3000, this means we are telling our server to listen for requests on port 3000.

app.use(cors());  
app.use(express.json()); 
//app.use() - this line is saying "hey server, before you do anything else, make sure to use these tools first", so we are telling our server to use the cors tool and the express.json tool before it handles any requests.
//cors() - WITHOUT cors tool other websites get blocked from talking to our server, but with this tool they can talk to our server.
//express.json() - data sent over the internet comes in a format called JSON,
//express.json() translates that JSON data that we get from internet into a format the server can understand and work with.

const hotels = [
    { id: 1, name: "Grand Fjord Hotel", location: "Bergen", price: 1200, rooms: "double bed", modern: false, view: "golfbane", available: true },
    { id: 2, name: "Oslo City Hotel", location: "Oslo", price: 1200, rooms: "single bed", modern: false, view: "utsikt over havet", available: true },
    { id: 3, name: "Nordic Stay Lodge", location: "Trondheim", price: 900, rooms: "suite", modern: true, view: "utsikt fjorden", available: true }
];
 //const is variable which we store data in, and hotels is the name of that variable, the value of this variable is an array[] or a list of hotels.
 // {} - curly brackets means one hotel or one object, each object has properties like id, name, location, price, rooms, available, each property has a value f.eks id: 1, name: "Grand Fjord Hotel" etc. value and key = key is the name of the property and value is the data
 //in a real application, this data would come from a database

 app.get("api/hotels", (req, res) => {
    res.json(hotels);
 });
 //this a route - its teaching our server if someones asks THIS question, then give them THIS answer.
 //app.get() - its when someone asks for something, GET means asking  for something like asking for menu at a restaurant, here we are saying "hey server, can I have the list of hotels?" - this is a GET request.
 //"api/hotels" - this is the what they are asking for,  
 //(req, res) => - this a function that runs when someone asks for "api/hotels", req is the request THEY made, res is the response WE will send back.
 //res.json(hotels) - this is how we send the list of all hotels back to them, we are saying "here is the list of hotels in JSON format"

 app.get("/api/hotels/:id", (req, res) =>{
    const hotel = hotels.find(h => h.id === Number(req.params.id));
    if (!hotels) {
        return res.status(404).json({error: "Hotel not found"});
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
    console.log("server is running on http://localhost:${PORT}");
 });

 //app.listen(PORT) - this means we are starting our server and telling it to LISTEN for requests on PORT 3000, like opening the door to our apartment then waiting for people to knock and ask for something.
 //() => {...} - this function is called a callback function and it says "after the server starts and is ready to listen, run this code inside the curly brackets", in this case we are just logging a message to the console that says "server is running on http://localhost:${PORT}".
 //${PORT} - this automatically gets replaced with the actual value of PORT which is 3000, so the message will say "server is running on http://localhost:3000" 

 async function loadHotels() {
   const response = await fetch("http://localhost:3000/api/hotels");
   const hotels = await response.json();
   console.log(hotels);
 }
 loadHotels();

 //function - a function is a reusable block of code which does specific task, in this specific case loadHotel is a function that fetches also called gets the list of hotels from our server and logs it to the console.
 //async stands for asynchronous and the simples way to understand it is that it allows us to do things that take time (like fetching data from a server) without freezing or blocking the rest of our code, so we can still do other things while we wait for the data to come back, in this case we can still interact with our website while we wait for the hotels data to load.
 //fetch() - this is a built inn function in JS, this function basically goes out to the internet and gets data from a specific URL, in this case we are asking it to get the list of hotels from our server at "http://localhost:3000/api/hotels"
 //await - what this does is it tells our code to wait until the fetch() function has finished getting the data, then after getting the data it will store it in the variable called response, after we get the data we store it in Hotels variable
 //res.json() - this is method that takes the response we got from the fetch and converts it from JSON format into a JavaScript object that we can understand and use then we console.log(hotels) - this will print the list of hotels to the console.
 //loadHotel - this line runs the function and starts getting or fetching the hotels data from our server.

