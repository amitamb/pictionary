// components/BoardContainer.js
import Link from 'next/link';
import AuthContext from '../store/auth-context';
import classes from './BoardContainer.module.scss';
import Button from 'react-bootstrap/Button';
import React, { useContext, useState, useEffect } from 'react';

import DrawingBoard from './DrawingBoard';
import BoardModal from './BoardModal';
import WordSelector from './WordSelector';
import Room from '../support/room';


const BoardContainer = ({ room, currentUser, onWordSelect, onBoardChange }) => {
  
  let current = room.current;

  let roomState = room.currentState;

  let showDrawingBoard = (roomState == Room.ACTIVE);

  return (
    <>
      { roomState == Room.ACTIVE && current?.state == "selecting" && room.isCurrentUserCurrentPlayer() && <BoardModal>
          <WordSelector onSelect={onWordSelect} />
        </BoardModal>
      }

      { roomState == Room.ACTIVE && current?.state == "selecting" && !room.isCurrentUserCurrentPlayer() && <BoardModal>
          <h4>Please wait while {current?.player?.username} selects a word.</h4>
        </BoardModal>
      }

      { roomState == Room.ACTIVE && current?.state == "drawing" &&
        <DrawingBoard canDraw={room.isCurrentUserCurrentPlayer()} board={current?.board} onChange={onBoardChange} /> }

      { roomState == Room.WAITING && <BoardModal>
          <h4>Please wait for others to join.</h4>
        </BoardModal>
      }

      { roomState == Room.EMPTY && <BoardModal>
          <h4>Hmm. No one playing here.</h4>
        </BoardModal>
      }
    </>
  )

};

export default BoardContainer;

// ( roomState == Room.EMPTY && <DrawingBoard canDraw={room.current?.player.id == currentUser.id} board={room.current?.board} onChange={onChange} /> )

// if ( showDrawingBoard ) {
//   <DrawingBoard canDraw={current?.player?.id == currentUser.id} board={current?.board} onChange={onChange} />
// }