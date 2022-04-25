const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);

app.set('views', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true}));

const rooms = {};

app.get('/', (req, res) => {
    res.render('index.ejs', {rooms: rooms, roomName: req.params.room})
});

app.post('/room',( req, res) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    };
    rooms[req.body.room] = { users: {}}
    res.redirect('/')
    //Send Message that new room was created
    io.emit('room-created', req.body.room)
});


app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null){
        return res.redirect('/')
    }
    res.render('room.ejs', {roomName: req.params.room})
});

io.on("connection", function(socket){
    socket.on("newUser", (room, username) => {
        socket.join(room)
        socket.to(room).emit("update", username + " joined the chat")
    });
    socket.on("exitUser", (room, username) => {
        socket.to(room).emit("update", username + " has left the chat")
    });
    socket.on("chat", (room, message) => {
        socket.to(room).emit("chat",  message);
    });

});
server.listen(process.env.PORT || 3000);