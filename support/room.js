import db from './firebase';
import Player from './player';

class Room {

  static EMPTY = "empty";
  static WAITING = "waiting";
  static ACTIVE = "active";

  constructor(roomObj, currentUser, roomRef) {

    this.currentUser = currentUser;
    this.roomRef = roomRef;

    this.color = roomObj.color;
    this.current = roomObj.current || {};
    this.id = roomObj.id;
    this.name = roomObj.name;
    this.playing = roomObj.playing || {};

    this.pendingTime = roomObj.pendingTime || this.getPendingTime();
  }

  get players() {
    return Object.values(this.playing).map((playerObj) => {
      return new Player(this, playerObj);
    })
  };

  get dbRef() {
    return db.ref(`rooms/room_${this.id}`);
  };

  get currentPlayer(){
    return this?.playing[this.current?.player?.id];
  }

  isCurrentUserLoggedIn() {
    // return !!this.players.find(player => player.id === this.currentUser.id);
    return !!(this.playing[this.currentUser.id] && this.playing[this.currentUser.id].username);
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

  getPendingTime() {

    let maxTime = 0;

    if ( this.currentPlayerState == "selecting" ) {
      maxTime = 20000;
    }
    else if ( this.currentPlayerState == "drawing" ) {
      maxTime = 60000;
    }
    else {
      // alert("Error LD90256");
      // return ;
      console.error("Wrong this.currentPlayerState");
    }

    let pendingTime = (this.current?.lastStateChangeAt + maxTime) - (+new Date());

    return pendingTime;
  }

  selectNextPlayer() {

    let players = this.players;
    let currentPlayer = this.currentPlayer;
    let newCurrentPlayer = null;

    // Don't do anything if less than 2 players
    if ( players.length < 2 ) {
      return false;
    }

    if ( !currentPlayer ) {
      // select first player
      // TODO: Filter for active players
      newCurrentPlayer = this.playing[players[0].id];
    }
    else {
      let currentPlayerIndex = players.findIndex((player) => player.id == currentPlayer.id);
      let newPlayerIndex = currentPlayerIndex + 1;
      if ( newPlayerIndex >= players.length ) {
        newPlayerIndex = 0;
      }
      newCurrentPlayer = this.playing[players[newPlayerIndex].id];
    }

    let newCurrent = {
      ...this.current,
      player: newCurrentPlayer,
      state: "selecting",
      lastStateChangeAt: +new Date(),
      selectedWord: null,
      startedAt: +new Date(),
      board: {
        lines: []
      }
    };

    console.log(newCurrent);

    this.dbRef.child('current').set(newCurrent);

  }

  get currentState() {
    let players = this.players;
    if ( players.length == 0 ) {
      return Room.EMPTY;
    }
    else if ( players.length == 1 ) {
      return Room.WAITING;
    }
    else {
      return Room.ACTIVE;
    }
  }

  get currentPlayerState() {
    return this.current?.state;
  }

  isCurrentUserCurrentPlayer() {
    return this.current?.player?.id == this.currentUser.id;
  }

  setInteractedAt() {
    let lastInteractedAt = playingListRef.current.child(`${currentUser.id}/lastInteractedAt`);
    lastInteractedAt.set(+new Date());
  }
}

export default Room;