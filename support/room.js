import db from './firebase';
import Player from './player';

class Room {
  constructor(roomObj, currentUser, roomRef) {

    this.currentUser = currentUser;
    this.roomRef = roomRef;

    this.color = roomObj.color;
    this.current = roomObj.current || {};
    this.id = roomObj.id;
    this.name = roomObj.name;
    this.playing = roomObj.playing || {};
  }

  get players() {
    return Object.values(this.playing).map((playerObj) => {
      return new Player(this, playerObj);
    })
  };

  get dbRef() {
    return db.ref(`rooms/room_${this.id}`);
  };

  isCurrentUserLoggedIn() {
    // return !!this.players.find(player => player.id === this.currentUser.id);
    return !!this.playing[this.currentUser.id];
  }

  loginCurrentUser() {

    let newPlayingUserRef = db.ref(`rooms/room_${this.id}/playing/${this.currentUser.id}`);
    newPlayingUserRef.set({
      ...this.currentUser,
      currentPoints: 0,
      lastInteractedAt: +new Date(),
      lastHeartBeatAt: +new Date(),
    });
  }

  cleanPlayersList() {
    // kick out dead/kickable players

    // console.log(this);

    this.players.forEach((player) => {
      if ( player.id !== this.currentUser.id && !player.isAlive() ) {
        console.log("Removing player " + player.id + " " + player.username);
        player.dbRef.remove();
      }
    });
  };

  setInteractedAt() {
    let lastInteractedAt = playingListRef.current.child(`${currentUser.id}/lastInteractedAt`);
    lastInteractedAt.set(+new Date());
  }
}

export default Room;