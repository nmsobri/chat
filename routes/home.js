var express = require( 'express' );
var app = express();
var router = express.Router();

router.get( '/', function( req, res, nxt ) {
    res.render('index');
});

router.get( '/chatroom', function( req, res, nxt ) {
    res.render( 'chatroom' );
});

router.get( '/rooms', function( req, res, nxt ) {
    res.render( 'rooms' );
});

module.exports = router;