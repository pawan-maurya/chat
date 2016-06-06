var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');
var http = require('http').Server(app);             //Create a http server that use express app

//After installing socket.io on server, now installing it into our app
var io = require('socket.io')(http);                //This is the format that socket.io expectss


app.use(express.static(__dirname + '/public'));     //telling app to use public folder. __dirname is default app location.

//Create connection with socket.io
io.on('connection', function (socket) {                   //call a function on a connection event. it's like a jquery event "Like on click".
    console.log('User connected via Socket.io!');
    
    socket.on('message', function (message) {
        console.log('Message Recieved: ' + message.text);
        
        message.timeStamp = moment().valueOf();             // valueOf() is the javascript milisecond version. 
        
        //socket.broadcast.emit('message', message);        // Messages displayed to all others
        io.emit('message', message);                        // Messages displayed to all and my self also.
        
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the Chat application!',
        timeStamp: moment().valueOf()
    });
});


//Start the SERVER
http.listen(PORT, function () {
    console.log('Server Started!');                 //This message will be print in terminal when server starts.
});