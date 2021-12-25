import { useContext, useState, useEffect, useRef } from 'react';
import RoomClass from '../../support/room';
import Player from '../../support/player';
import db from '../../support/firebase';
import useInterval from './useInterval';
import Room from '../../support/room';

const useRoom = (roomObj, currentUser) => {

  const roomRef = useRef(db.ref(`rooms/room_${roomObj.id}`));
  const currentRef = useRef(db.ref(`rooms/room_${roomObj.id}/current`));
  const playingListRef = useRef(db.ref(`rooms/room_${roomObj.id}/playing`));

  const [ roomState, setRoomState ] = useState(roomObj);

  let room = new RoomClass(roomState, currentUser, roomRef);
  let players = room.players;
  let current = room.current;

  useEffect(() => {

    // let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
    roomRef.current.on('value', (snapshot) => {

      // if ( window.__set_by_firebase ) {
      //   let diff = (+new Date()) - window.__set_by_firebase;
      //   console.log("Received in app in ", diff);
      //   window.__set_by_firebase = null;
      // }

      const data = snapshot.val();
      setRoomState(data);
    });
  
  }, [roomState.id]);

  useEffect(() => {
    room.cleanup();
  }, []);

  useEffect(() => {

    // Set current user as logged in
    // check if user already logged in
    if ( !room.isCurrentUserLoggedIn() ) {
      room.loginCurrentUser();
    }
    
  }, [roomState.playing]); // TODO: Check this

  useEffect(() => {

    // Set current user as logged in
    // check if user already logged in
    if ( room.pendingTime < 0 ) {
      room.selectNextPlayer();
    }
    
  }, [roomState.pendingTime]); // TODO: Check this

  useInterval(() => {  
  
    if ( room.isCurrentUserCurrentPlayer() ) {

      
      // room.pendingTime = pendingTime;
      
      setRoomState({
        ...roomState,
        pendingTime: room.getPendingTime()
      })

    }

  }, 500);

  useInterval(() => {

    if ( !room.isCurrentUserLoggedIn() ) {
      room.loginCurrentUser();
    }
    else {
      let lastHeartBeatAt = playingListRef.current.child(`${currentUser.id}/lastHeartBeatAt`);
      lastHeartBeatAt.set(+new Date());
    }

    room.cleanPlayersList();

  }, 30000);

  // Handle user/timed actions by current user

  const handleHeartBeat = () => {

  };

  const handleSelectedPlayerEvents = (event) => {

    switch(event.type) {
      case Room.SELECTED:
        console.log("User selected a word.");
        break;
      case Room.SELECT_TIMEOUT:
        console.log("Select timed out.");
        break;
      case Room.COMPLETED:
        console.log("Completed drawing phase as all users guessed");
        break;
      case Room.DRAW_TIMEOUT:
        console.log("Draw timeout");
        break;
      default:
        // code block
    }

  };

  const handleMessageSent = (messageData) => {
    // let messageText = messageData.data;
    let lastInteractedAt = playingListRef.current.child(`${currentUser.id}/lastInteractedAt`);
    lastInteractedAt.set(+new Date());

    if ( !room.isCurrentUserCurrentPlayer() && !room.hasGuessedByUser(currentUser.id) ) {
      if ( room.tryWordGuessed(messageData?.data?.text) ) {
        
        if ( room.hasGuesedByAll() ) {
          room.selectNextPlayer()
        }

      }
    }
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

    // window.__set_by_firebase = +new Date();
    // console.log("Set by firebase");

    currentRef.current.child('board/lines').set(newLines);
  }

  const handleWordSelect = (selecedWord) => {


    if ( room.isCurrentUserCurrentPlayer() ) {

      let newCurrent = {
        ...current,
        state: "drawing",
        lastStateChangeAt: +new Date(),
        selectedWord: selecedWord,
        guessedBy: [],
        board: {
          lines: []
        }
      };

      currentRef?.current?.set(newCurrent);

      // console.log("handleWordSelect");s

    }

  }

  return [room, players, current, handleWordSelect, handleBoardChange, handleMessageSent, handleSelectedPlayerEvents];
}

export default useRoom;