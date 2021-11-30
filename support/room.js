import Player from './player';

class Room {
  constructor(roomObj, currentUserId) {
    // this.roomObj = roomObj;

    this.currentUserId = currentUserId;

    this.color = roomObj.color;
    this.current = roomObj.current || {};
    this.id = roomObj.id;
    this.name = roomObj.name;
    this.playing = roomObj.playing || {};

    this.players = Object.values(this.playing).map(function(playerObj) {
      return new Player(playerObj);
    });

    // this.state = roomObj.color;

    // console.log(roomObj);
  }

  isCurrentUserLoggedIn() {
    // console.log("this.players");
    // console.log(this.playing);
    return !!this.players.find(player => player.id === this.currentUserId);
  }
}

export default Room;