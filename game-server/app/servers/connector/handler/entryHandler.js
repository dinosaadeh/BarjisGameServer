var rooms = require('../../../util/rooms');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry barjis server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.enter = function(msg, session, next) {

	var self = this;
	var rid = rooms.getAvailableRoom();
	var uid = msg.username.toString().concat('*').concat(rid);
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));


        //put user into channel
        self.app.rpc.barjis.barjisRemote.add(session, uid, self.app.get('serverId'), rid, true,rooms.userShouldWait(), function (users) {
            next(null, {
                users: users,
                room: rid
            });
        });

};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}

	if(rooms.userShouldWait()) {
        rooms.resetRoom();
    }

	app.rpc.barjis.barjisRemote.close(session, session.uid, app.get('serverId'), session.get('rid'), null);
};