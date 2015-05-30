var io = require( 'socket.io' );

module.exports.init = function( server ) {

    io = io.listen( server );

    function getRoomList() {
        var realRooms = {};
        var rooms = io.nsps['/chatSystem'].adapter.rooms; /*list of rooms (this will include socket it)*/
        var sids = io.nsps['/chatSystem'].adapter.sids; /*list of socket id*/

        for ( var room in rooms ) {
            if ( !( room in sids ) ) {
                realRooms[room] = Object.keys( io.nsps['/chatSystem'].adapter.rooms[room] ).length;
            }
        }
        return realRooms;
    }

    var chatSystem = io.of( '/chatSystem' ).on( 'connection', function( socket ) {

        /*handling set nickname event*/
        socket.on( 'set.name', function( data ) {
            /*attach nickname key to this socket, direct attach would not work in namespace.have to attach to client property of socket*/
            socket.client.nickname = data.name;
            socket.emit( 'name.set', data );
        });

        /*handling join room event*/
        socket.on( 'join.room', function( data ) {
            socket.client.room = data.room;
            socket.join( data.room );

            var userSocket =  chatUser.connected[socket.id]; /*this is how to get socket reference in another namespace*/
            userSocket.join( data.room );
            userSocket.client.room = data.room; /*save room name so it can be use in another namespace*/

            socket.send( JSON.stringify( { type: 'serverMessage',message: 'Welcome to the most interesting chat room on earth!'}));
            socket.in( data.room ).broadcast.emit( 'user.entered', {name: socket.client.nickname} );
            socket.emit( 'user.entered', {name: socket.client.nickname} );

        });

        /*handling get room event*/
        socket.on( 'get.rooms', function( data ) {
            var rooms = getRoomList();
            socket.broadcast.emit('rooms.list', { rooms: rooms }); /*broadcast this event to all connected client, not just this socket*/
            socket.emit('rooms.list', { rooms: rooms });
        });

        /*handling disconnect event*/
        socket.on( 'disconnect', function() {
            socket.in( socket.client.room ).broadcast.send( JSON.stringify({ type: 'serverMessage', message: socket.client.nickname + ' has left the room.'}));
            var rooms = getRoomList();
            socket.broadcast.emit('rooms.list', { rooms: rooms }); /*broadcast this event to all connected client, not just this socket*/
            socket.emit('rooms.list', { rooms: rooms });

        })
    });

    var chatUser = io.of( '/chatUser').on( 'connection', function( socket ) {
        /*handling client event socket.send*/
        socket.on( 'message', function( data ) {
            data = JSON.parse( data );
            data.nickname = socket.client.nickname;

            /*send to all connected client( broadcast will not send message to socket that created the message)*/
            socket.in( socket.client.room ).broadcast.send( JSON.stringify( data ) );
            data.type = 'myMessage';

            /*manually send back the message to the socket that created the message*/
            socket.send( JSON.stringify( data) );

        });
    });
};