import { useContext, useState, useEffect, useRef } from 'react';
import RoomClass from '../../support/room';
import Player from '../../support/player';
import db from '../../support/firebase';

const useRoom = (roomObj, currentUser) => {

  const [ roomState, setRoomState ] = useState(roomObj);

  let room = new RoomClass(roomState, currentUser.id);
  let players = Object.values(room.playing || {});
  let current = room.current;

  const roomRef = useRef(db.ref(`rooms/room_${room.id}`));
  const currentRef = useRef(db.ref(`rooms/room_${room.id}/current`));

  useEffect(() => {

    // let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
    roomRef.current.on('value', (snapshot) => {
      const data = snapshot.val();
      setRoomState(data);
    });
  
  }, [roomObj.id]);

  useEffect(() => {

    console.log("Running here!!");
    console.log("currentUser " + currentUser)

    // Set current user as logged in
    // check if user already logged in
    // let foundLoggedIn = !!players.find(player => player.id === ctx.user.id);
    let foundLoggedIn = room.isCurrentUserLoggedIn();

    console.log(foundLoggedIn);

    if (!foundLoggedIn) {
      let newPlayingUserRef = db.ref(`rooms/room_${room.id}/playing/${currentUser.id}`);
      newPlayingUserRef.set({
        ...currentUser,
        currentPoints: 0,
        lastInteractedAt: +new Date(),
        lastHeartBeatAt: +new Date(),
      });
    }
    
  }, [roomObj.playing]);

  const handleMessageSent = (messageData) => {
    // let messageText = messageData.data;
    let lastInteractedAt = playingListRef.current.child(`${ctx.user.id}/lastInteractedAt`);
    lastInteractedAt.set(+new Date());
  };

  const handleBoardChange = (newLines) => {
    // console.log(currentRef.current);
    // setCurrent({
    //   ...current,
    //   board: {
    //     lines: newLines
    //   }
    // });

    // setRoomState({

    // })

    currentRef.current.child('board/lines').set(newLines);
  }

  return [room, players, current, handleBoardChange, handleMessageSent];
}

export default useRoom;