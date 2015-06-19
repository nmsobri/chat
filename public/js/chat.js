$( function() {

    /*Auto focus on nickname input*/
    $('#nickname').focus();

    /*#############################################
     *#################### Handler ################
     *#############################################*/

    var sendMessage = function() {

        var message = $( '#message' ).val();

        if ( message !== '' ) {
            chatUser.send( JSON.stringify( {
                    message : message,
                    type: 'userMessage'
                } ) 
            );
            $( '#message' ).val( '' );
        }
    };

    var setNickname = function() {
        var nickname = $( '#nickname').val();
         if ( nickname !== '' && nickname.length >= 3 ) {
            chatSystem.emit( 'set.name', { name: nickname });
         }
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

     /*start new chatroom*/
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
    $( '#send' ).click( sendMessage );

    /*quit button*/
    $( '#quit').click( function() {
        chatSystem.disconnect();
        window.location = '/rooms';
    });

    /*set nickname when user click set name button*/
    $( '#setname' ).click( setNickname );

    /*or when user press enter*/
    $( '#nickname' ).keypress( function(e) {
        if(e.which == 13) {
            return setNickname();
        }
    })
});
