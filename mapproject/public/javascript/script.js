const socket = io();// connection request go to backend server
if(navigator.geolocation){ // checking if geolocation is supported by the browser
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords; // getting the latitude and longitude from the position object
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        socket.emit("send-location", {latitude, longitude}); // emitting the location to the server
    },(error) => {
        console.error("Error getting location: ", error.message);
    },{
        enableHighAccuracy:true, // enabling high accuracy for the locationtion
        timeout: 5000, // setting a timeout of 5 seconds
        maximumAge: 0 // setting maximum age to 0 to get the latest location
    });
}

const mapp = L.map("map"); 
// initializing the map with the id "map"
mapp.setView([0, 0], 10); // setting the initial view of the map to [0, 0] with a zoom level of 10
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:20,
    attribution: '© OpenStreetMap contributors'
}).addTo(mapp); // adding the tile layer to the map

const marker = {}

socket.on("receive-location", (data)=>{
    const {id,latitude,longitude} = data; 
    console.log(data);
    // destructuring the data object to get the id, latitude and longitude

    mapp.setView([latitude, longitude], 15); // setting the view of the map to the received latitude and longitude
    if(marker[id]){ // checking if the marker already exists
        marker[id].setLatLng([latitude, longitude]); // updating the position of the existing marker
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(mapp); // adding a new marker to the map
    }
})
socket.on("user-disconnect", (id)=>{
    if(marker[id]){ // checking if the marker exists
        mapp.removeLayer(marker[id]); // removing the marker from the map
        delete marker[id]; // deleting the marker from the marker object
    }
})