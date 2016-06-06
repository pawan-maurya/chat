var name = getQueryVariable('name') || 'Anonymous';    // After adding QueryParams.js file
var room = getQueryVariable('room');
var socket = io();                      // io() function is not defining by me it's into the socket.io library.
                                        // This is important to connect from server using socket.io

console.log(name + ' wants to join ' + room);

//Display Room Name:
jQuery('.room-title').text(room);

socket.on('connect', function () {
    console.log('connected to socket.io server!');
    
    //Creating custom event when someone join the room
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
    
});

socket.on('message', function (message) {
    var momentTimeStamp = moment.utc(message.timeStamp);
    
    var $conversation = jQuery('.conversation');
    
    console.log('New Message: ' + message.text);
    
    // Show messages in conversation div.
    $conversation.append('<p><strong>' + ' ' + message.name + ' ' + momentTimeStamp.local().format('h:mm a') + ': </strong></p>');
    $conversation.append('<p>' + message.text + '</p>');
});


// Handle Submiting of new messages
var $form = jQuery('#message-form');

$form.on('submit', function () {
    
    var inputOfMsg = $form.find('input[name=msg]');
    
    event.preventDefault();
    
    socket.emit('message', {
        name: name,
        text: inputOfMsg.val()
    });
    
    inputOfMsg.val('');                         // clear the text field after message sent.
    
});



