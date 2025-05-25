import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
// import __dirname from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;
const app = express();
// import express from 'express';
// import { createServer } from 'http';
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
const server = createServer(app);
// import { Server } from 'socket.io';
const io = new Server(server);
io.on('connection', (socket) => {
    socket.on("send-location", (data) => {
        // socket.emit("location", location); 
        // sending the location to the client
        io.emit("receive-location", {id:socket.id, ...data}); // sending the location to all clients
    });
    socket.on("disconnect" , ()=>{
        io.emit("user-disconnected",socket.id); // notifying all clients that a user has disconnected
    }) // chating apps also uses these socket.io

})

// socket.io is used for real-time communication between client and server
// it is used for chat applications, online games, etc.
app.get('/',(req,res)=>{
    res.render('index');
})


server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})