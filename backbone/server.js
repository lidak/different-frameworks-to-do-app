'use strict';

var express = require('express'),
    app = express(),
    server,
    port = process.env.PORT || 5000;

app.use('/js', express.static(__dirname + '/public/js'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server = app.listen(port, function() {
    console.log('Static was served by express.');
});