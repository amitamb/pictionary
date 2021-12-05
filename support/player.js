import db from './firebase';
import { DateTime } from 'luxon';

class Player {
  constructor(room, playerObj, playerRef) {
    // this.playerObj = playerObj;

    this.room = room;
    this.id = playerObj.id;
    this.username = playerObj.username;
    this.currentPoints = playerObj.currentPoints;
    this.lastInteractedAt = playerObj.lastInteractedAt;
    this.lastHeartBeatAt = playerObj.lastHeartBeatAt;

    // this.playerRef =
  }

  get dbRef() {
    return db.ref(`rooms/room_${this.room.id}/playing/${this.id}`);
  };

  isAlive() {
    if ( !this.lastHeartBeatAt || !this.lastInteractedAt ) {
      return false;
    }
  
    let lastHeartBeatAt = Math.max(this.lastHeartBeatAt, this.lastInteractedAt);
    lastHeartBeatAt = DateTime.fromMillis(lastHeartBeatAt);
    lastHeartBeatAt = lastHeartBeatAt.plus({ seconds: 90 });
  
    if ( lastHeartBeatAt < DateTime.now() ) {
      return false;
    }
  
    return true;
  }

  sendAliveSignal() {
  }

}

export default Player;