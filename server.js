var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');
var http = require('http').Server(app);             //Create a http server that use express app

var systemName = 'System';                          //Defining a system name for showing when system display any message

//After installing socket.io on server, now installing it into our app
var io = require('socket.io')(http);                //This is the format that socket.io expectss

var clientInfo = {};

app.use(express.static(__dirname + '/public'));     //telling app to use public folder. __dirname is default app location.

//Create connection with socket.io
io.on('connection', function (socket) {                   //call a function on a connection event. it's like a jquery event "Like on click".
    console.log('User connected via Socket.io!');
    
    // Function for the same specified event 'joinRoom'
    socket.on('joinRoom', function (req) {              // req is the object that I created in joinRoom event in app.js
        clientInfo[socket.id] = req;
        socket.join(req.room);                          // socket.join is a built in method
        socket.broadcast.to(req.room).emit('message', {
            name: systemName,
            text: req.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });
    
    // Function for when user leave a room
    socket.on('disconnect', function () {               // disconnect is a built in event 
        var userData = clientInfo[socket.id];
        
        if(typeof userData !== 'undefined'){
            socket.leave(userData.room);                // socket.leave is a built in method like socket.join
            
            // now desplay message when user leave
            io.to(userData.room).emit('message', {
                name: systemName,
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
            
            // Deleting clientInfo
            delete userData;
        }
    });
    
    socket.on('message', function (message) {
        console.log('Message Recieved: ' + message.text);
        
        message.timeStamp = moment().valueOf();             // valueOf() is the javascript milisecond version. 
        
        //socket.broadcast.emit('message', message);        // Messages displayed to all others
        io.to(clientInfo[socket.id].room).emit('message', message);                        // Messages displayed to all and my self also.
        
    });
    
    
    
    socket.emit('message', {
        name: systemName,
        text: 'Welcome to the Chat application!',
        timeStamp: moment().valueOf()
    });
});


//Start the SERVER
http.listen(PORT, function () {
    console.log('Server Started!');                 //This message will be print in terminal when server starts.
});