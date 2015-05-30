/*#############################################
 *############### Socket io code ###############
 *#############################################*/
var chatSystem = io.connect( '/chatSystem' );

chatSystem.on( 'connect', function() {
   chatSystem.emit( 'get.rooms', {} );
});

chatSystem.on( 'rooms.list', function( rooms ) {
    if( Object.keys(rooms.rooms).length > 0 ) {
        $( '#allrooms').show();
        $( '#rooms_list').empty();
        for ( var room in rooms.rooms ) {
            var roomDiv =  '<div class="room_div">';
            roomDiv += '<span class="room_name">';
            roomDiv += room;
            roomDiv += '</span><span class="room_users">[ ';
            roomDiv += rooms.rooms[room];
            roomDiv += ' Users ] </span>';
            roomDiv += '<a class="room" href="/chatroom?room=';
            roomDiv += room + '">Join</a></div>';
            $( '#rooms_list').append( roomDiv );
        }
    }
    else {
        $('#allrooms').hide();
    }
});



/*#############################################
 *############### Event handler ###############
 *#############################################*/

$( function() {
    $( '#new_room_btn').click( function(){
        window.location = '/chatroom?room=' + $( '#new_room_name').val();
    });

    /*send message when user press enter*/
    $( '#new_room_name' ).keypress(function (e) {
        if( e.which == 13 ) {
            window.location = '/chatroom?room=' + $( '#new_room_name').val();
        }
    });
});