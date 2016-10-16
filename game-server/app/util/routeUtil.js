var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.barjis = function(session, msg, app, cb) {
	var barjisServers = app.getServersByType('barjis');

	if(!barjisServers || barjisServers.length === 0) {
		cb(new Error('can not find barjis servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('rid'), barjisServers);

	cb(null, res.id);
};