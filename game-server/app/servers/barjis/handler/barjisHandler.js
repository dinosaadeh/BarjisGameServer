var barjisRemote = require('../remote/barjisRemote');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function (msg, session, next) {
    var rid = session.get('rid');
    var username = session.uid.split('*')[0];
    var channelService = this.app.get('channelService');
    var param;
    if (msg.type === "move") {

        param = {
            route: 'messageMoveReceived',
            currentPlayerIndex: msg.currentPlayerIndex,
            pawnUpdateIndex: msg.pawnUpdateIndex,
            selectedIndexInTable: msg.selectedIndexInTable,
            target: msg.target
        };

    } else {
        if (msg.type === "dice") {

            param = {
                route: 'messageDiceReceived',
                value: msg.value,
                target: msg.target
            };
        }
        else {
            param = {
                route: 'myTurn',
                target: msg.target
            };

        }
    }

    channel = channelService.getChannel(rid, false);


    var tuid = msg.target + '*' + rid;
    var tsid = channel.getMember(tuid)['sid'];
    channelService.pushMessageByUids(param, [{
        uid: tuid,
        sid: tsid
    }]);

    next(null, {
        route: msg.route
    });
};