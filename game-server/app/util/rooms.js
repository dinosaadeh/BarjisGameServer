var roomIndex=0;
var availableRoom=undefined;


function getNewRoomId(){
    roomIndex++;
    return "Room-"+roomIndex;
}

function getAvailableRoomId(){
    if(availableRoom===undefined){
        availableRoom=getNewRoomId();
        return availableRoom;

    }
    var returnedRoom= "".concat(availableRoom);
    availableRoom=undefined;
    return returnedRoom;
}

function userShouldWait(){
    return (availableRoom!=undefined)
}


module.exports.userShouldWait=userShouldWait;
module.exports.getAvailableRoom=getAvailableRoomId;