import Layout from "../../components/Layout";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DateTime } from 'luxon';
import PlayersList from "../../components/PlayersList";
import AuthContext from '../../store/auth-context';
import { useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import db from '../../support/firebase';
import classes from "./[roomId].module.scss";
import dynamic from 'next/dynamic';
import RoomClass from '../../support/room';
import Player from '../../support/player';

import useRoom from '../../support/hooks/useRoom';
import useInterval from '../../support/hooks/useInterval';

const BoardContainer = dynamic(() => import('../../components/BoardContainer'), { ssr: false });
const DrawingBoard = dynamic(() => import('../../components/DrawingBoard'), { ssr: false });
const ChatBox = dynamic(() => import("../../components/ChatBox"), { ssr: false });

const isPlayerActive = (player) => {
  if ( !player.lastHeartBeatAt || !player.lastInteractedAt ) {
    return false;
  }
  if ( !player.isAlive() ) {
    return false;
  }
  let lastInteractedAt = DateTime.fromMillis(player.lastInteractedAt);
  lastInteractedAt.plus({ minutes: 3 });
  if ( lastInteractedAt < DateTime.now() ) {
    return false;
  }
  return true;
};

function Room({ roomObj }) {

  const ctx = useContext(AuthContext);
  // const [ roomState, setRoomState ] = useState(roomObj);
  const [room, players, current, handleWordSelect, handleBoardChange, handleMessageSent] = useRoom(roomObj, ctx.user);

  const playingListRef = useRef(db.ref(`rooms/room_${room.id}/playing`));
  const currentRef = useRef(db.ref(`rooms/room_${room.id}/current`));

  useEffect(() => {

    // clear current player if only one/no player remains
    if ( current?.player && players.length <= 1 ) {

      let newCurrent = {
        player: null,
        state: null,
        lastStateChangeAt: null,
        selectedWord: null,
        startedAt: null,
        board: {
          lines: []
        }
      };

      currentRef?.current?.set(newCurrent);

    }
    else if ( !current?.player && players.length > 1 ) {

      // // if nobody is playing currently
      // // get first active player from the players list
      // let firstActivePlayer = players.find(isPlayerActive);

      // if (!firstActivePlayer) {
      //   firstActivePlayer = ctx.user;
      // }

      // let newCurrent = {
      //   ...current,
      //   player: firstActivePlayer,
      //   state: "selecting",
      //   lastStateChangeAt: +new Date(),
      //   selectedWord: null,
      //   startedAt: +new Date(),
      //   board: {
      //     lines: []
      //   }
      // };

      // // let currentRef = db.ref(`rooms/room_${room.id}/current`);
      // currentRef?.current?.set(newCurrent);

      room.selectNextPlayer();

    }
    
  }, [current?.player, players.length]);

  useEffect(() => {
    // let heartbeatIntervalId = setInterval(() => {

    //   // console.log("Using ctx");
    //   // console.log(ctx);
    //   // console.log(ctx.user.id);

    //   let lastHeartBeatAt = playingListRef.current.child(`${ctx.user.id}/lastHeartBeatAt`);
    //   lastHeartBeatAt.set(+new Date());
    //   cleanPlayersList();
    // }, 30000);

    room.cleanPlayersList();

    // Send heartbeatsat regular intervals
    // return () =>{
    //   clearInterval(heartbeatIntervalId);
    // };
  }, [roomObj.id]);

  const pendingTimeSpan = () => {

    if ( room.isCurrentUserCurrentPlayer() ) {
      let secondPending = Math.floor(room.pendingTime / 1000);
      return (
        <span className={classes.pendingSeconds}>
          {secondPending} seconds remaining
        </span>
      );
    }
    else {
      return null;
    }

  };

  return (
    <Layout>
      <Row>
        <Col xs={12} className={classes.roomInfo}>
          <span className='name'>{room.name}</span>
          <span>&nbsp;{current?.player?.username}</span>
          <span className='playing'>
            { players.length <= 1 && <span>Not enough players</span> }
            { players.length > 1 && <span>{players.length} players playing</span> }
          </span>
          {pendingTimeSpan()}
        </Col>
        <Col xs={8}>
          <BoardContainer room={room} currentUser={ctx.user} onWordSelect={handleWordSelect} onBoardChange={handleBoardChange} />
          {/* <DrawingBoard canDraw={current?.player?.id == ctx.user.id} board={current?.board} onChange={handleBoardChange} /> */}
        </Col>
        <Col>
          <div className="d-flex flex-column" style={{ height: '100%' }}>
            <div className={classes.PlayersListContainer}>
              <PlayersList players={players}></PlayersList>
            </div>
            <div className={classes.ChatBoxContainer}>
              <ChatBox room={room} onMessageSent={handleMessageSent}></ChatBox>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  )
}

// This gets called on every request
export async function getServerSideProps({ query }) {

  const { roomId } = query;

  const response=db.ref().child('rooms').child('room_'+roomId);
  const data=await response.get();

  console.log(data.val());
  let roomObj = data.val();

  // Pass data to the page via props
  return { props: { roomObj } }
}


export default Room;