#!/usr/bin/env node
//var debug = require('debug')('KanbanBoard');
var app = require('../app');

console.log([app.get('port'),' port is this *********']);
//app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
//    debug('Express server listening on port ' + server.address().port);
});
