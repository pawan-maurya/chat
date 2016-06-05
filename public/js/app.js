var socket = io();                      // io() function is not defining by me it's into the socket.io library.
                                        // This is important to connect from server using socket.io

socket.on('connect', function () {
   console.log('connected to socket.io server!');
});

socket.on('message', function (message) {
    var momentTimeStamp = moment.utc(message.timeStamp);
        
    console.log('New Message: ' + message.text);
    
    // Show messages in conversation div.
    jQuery('.conversation').append('<p><span style="font-size=6px;">' + momentTimeStamp.local().format('h:mm a') + ': </span>' + message.text + '</p>') ;
    
});


// Handle Submiting of new messages
var $form = jQuery('#message-form');

$form.on('submit', function () {
    
    var inputOfMsg = $form.find('input[name=msg]');
    
    event.preventDefault();
    
    socket.emit('message', {
       text: inputOfMsg.val()
    });
    
    inputOfMsg.val('');                         // clear the text field after message sent.
    
});



