#!/usr/bin/env node
//var debug = require('debug')('KanbanBoard');
//process.env.NODE_ENV="c9";

var app = require('../app');
console.log([process.env.NODE_ENV,' NODE_ENV is this *********']);

console.log([app.get('port'),' port is this *********']);
//app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
//    debug('Express server listening on port ' + server.address().port);
});
