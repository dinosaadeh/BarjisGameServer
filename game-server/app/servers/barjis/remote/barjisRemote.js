module.exports = function (app) {
    return new barjisRemote(app);
};

var barjisRemote = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 * Add user into barjis channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
barjisRemote.prototype.add = function (uid, sid, name, flag, userShouldWait, cb) {

    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];

    var param;
    if (!!channel) {
        channel.add(uid, sid);
    }
    if (userShouldWait) {
        param = {
            route: 'wait'
        };
    } else {
        var users = channel.getMembers();// waiting user is users[0]
        var waitingUserName = users[0].split('*')[0];
        var resultForPlayer1 = 0;
        var resultForPlayer2 = 0;
        while (resultForPlayer1 == resultForPlayer2) {
            resultForPlayer1 = randomIntFromInterval(0, 3);
            resultForPlayer2 = randomIntFromInterval(0, 3);
        }// end while , we have 2 difference number between 0 and 3
        param = {
            route: 'startGame',
            playerInfo: [{
                username: waitingUserName,
                playerIndex: resultForPlayer1 > resultForPlayer2 ? 0 : 1,
                initialThreeDicesThrowValue: resultForPlayer1
            }, {
                username: username,
                playerIndex: resultForPlayer1 > resultForPlayer2 ? 1 : 0,
                initialThreeDicesThrowValue: resultForPlayer2
            }
            ]


        };

    }
    channel.pushMessage(param);


    cb(this.get(name, flag));


};

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * Get user from barjis channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
barjisRemote.prototype.get = function (name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if (!!channel) {
        users = channel.getMembers();
    }
    for (var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

/**
 * Close the channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
barjisRemote.prototype.close = function (uid, sid, name, cb) {
    var channel = this.channelService.getChannel(name, false);
    var username = uid.split('*')[0];
    var param = {
        route: 'close',
    };
    channel.pushMessage(param);

    this.channelService.destroyChannel(channel);
    cb();
};
