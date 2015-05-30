#!/bin/env node
var express = require( 'express' );
var swig = require( 'swig' );
var path = require( 'path' );
var http = require( 'http' );
var app = express();

/*Configure framework*/
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'html' );
app.engine( 'html', swig.renderFile );

app.set( 'port', process.env.OPENSHIFT_NODEJS_PORT || 80 );
app.set( 'ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' );

/*Middleware*/
app.use( express.static( path.join( __dirname, 'public' ) ) );

/*Routes*/
app.use( '/', require( './routes/home' ) );

/*Server instance*/
var server = http.createServer(app).listen( app.get('port'), app.get('ip'), function(){
    console.log( 'Server running at http://%s:%s', app.get('ip'), server.address().port );
});

/*Socket.io*/
require( './routes/socket').init( server );