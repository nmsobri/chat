$( function() {

    /*Auto focus on nickname input*/
    $('#nickname').focus();

    /*#############################################
     *#################### Handler ################
     *#############################################*/

    var sendMessage = function() {
        var data = {
            message : $( '#message' ).val(),
            type: 'userMessage'
        };

        chatUser.send( JSON.stringify( data ) );
        $( '#message' ).val( '' );
    };

    var setNickname = function() {
        chatSystem.emit( 'set.name', { name: $( '#nickname').val() });
    };


    /*#############################################
    *############### Socket io code ###############
    *#############################################*/
    var chatSystem = io.connect( '/chatSystem' );
    var chatUser = io.connect( '/chatUser' );
    var defaultRoom = 'main';

    var room = /room=(.+?)(?:&|$)/ig.exec( location.search );
    room = room ? room[1] : defaultRoom;

    /*responding system chat message*/
    chatUser.on( 'message', function( data ) {
        data = JSON.parse( data );
        $( '#messages' ).append( '<div class="' + data.type + '"><span class="name">' + data.nickname + ':</span>' + data.message + '</div>');
    });

    /*responding user chat message*/
    chatSystem.on( 'message', function( data ) {
        data = JSON.parse( data );
        $( '#messages' ).append( '<div class="' + data.type + '">' + data.message + '</div>' );
    });

    /*responding to name set event*/
    chatSystem.on( 'name.set', function( data ) {
        chatSystem.emit( 'join.room', {room: room} );
        $( '#nameform').hide();
        $( '#messages').append( '<div class="systemMessage">Hello ' + data.name + '</div>' );
    });

    /*responding to new user joined*/
    chatSystem.on( 'user.entered', function( data ) {
        $( '#messages' ).append( '<div class="systemMessage">' + data.name + ' has joined the room.</div>');
        chatSystem.emit( 'get.rooms', {} );
    });

    /*#############################################
     *############### Event handler ###############
     *#############################################*/

    $( '#new_room_btn').click( function(){
        window.location = '/chatroom?room=' + $( '#new_room_name').val();
    });

    /*send message when user press enter*/
    $( '#message' ).keypress(function (e) {
        if( e.which == 13 ) {
           return sendMessage();
        }
    });

    /*or when user click on send button*/
    $( '#send').click( sendMessage );

    /*set nickname when user click set name button*/
    $( '#setname').click( setNickname );

    /*or when user press enter*/
    $( '#nickname').keypress( function(e) {
        if(e.which == 13) {
            return setNickname();
        }
    })
});
