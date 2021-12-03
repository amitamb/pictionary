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

import useRoom from '../../support/hooks/UseRoom';

const DrawingBoard = dynamic(() => import('../../components/DrawingBoard'), { ssr: false });
const ChatBox = dynamic(() => import("../../components/ChatBox"), { ssr: false });

const isPlayerAlive = (player) => {
  if ( !player.lastHeartBeatAt || !player.lastInteractedAt ) {
    return false;
  }
  let lastHeartBeatAt = Math.max(player.lastHeartBeatAt, player.lastInteractedAt);
  lastHeartBeatAt = DateTime.fromMillis(lastHeartBeatAt);
  lastHeartBeatAt.plus({ seconds: 60 });
  if ( lastHeartBeatAt < DateTime.now() ) {
    return false;
  }
};

const isPlayerActive = (player) => {
  if ( !player.lastHeartBeatAt || !player.lastInteractedAt ) {
    return false;
  }
  if ( !isPlayerAlive(player) ) {
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
  const [room, players, current, handleBoardChange, handleMessageSent] = useRoom(roomObj, ctx.user);

  const playingListRef = useRef(db.ref(`rooms/room_${room.id}/playing`));
  const currentRef = useRef(db.ref(`rooms/room_${room.id}/current`));

  useEffect(() => {

    // // let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
    // playingListRef.current.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   setPlayers(Object.values(data || {}));
    // });
  
  }, [roomObj.id]);

  useEffect(() => {

    // currentRef.current.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   setCurrent(data);
    // });
  
  }, [roomObj.id]);


  const cleanPlayersList = () => {
    // kick out dead/kickable players
    players.forEach((player) => {
      if ( player.id !== ctx.user.id && !isPlayerAlive(player) ) {
        console.log("Removing player " + player.id);
        // playingListRef.current.child(`${player.id}`).remove();
      }
    });
  };

  useEffect(() => {

    // clear current player if only one/no player remains
    if ( current?.player && players.length <= 1 ) {

      let newCurrent = {
        player: null,
        startedAt: null,
        board: {
          lines: []
        }
      };

      // setCurrent(newCurrent);

      currentRef?.current?.set(newCurrent);
    }
    else if ( !current?.player && players.length > 1 ) {
      // if nobody is playing currently
      // get first active player from the players list
      let firstActivePlayer = players.find(isPlayerActive);

      // cleanPlayersList();

      if (!firstActivePlayer) {
        firstActivePlayer = ctx.user;
      }

      let newCurrent = {
        ...current,
        player: firstActivePlayer,
        startedAt: +new Date(),
        board: {
          lines: []
        }
      };

      // setCurrent(newCurrent);

      // let currentRef = db.ref(`rooms/room_${room.id}/current`);
      currentRef?.current?.set(newCurrent);
    }
    
  }, [current?.player, players.length]);

  useEffect(() => {
    let heartbeatIntervalId = setInterval(() => {

      // console.log("Using ctx");
      // console.log(ctx);
      // console.log(ctx.user.id);

      let lastHeartBeatAt = playingListRef.current.child(`${ctx.user.id}/lastHeartBeatAt`);
      lastHeartBeatAt.set(+new Date());
      cleanPlayersList();
    }, 30000);

    cleanPlayersList();

    // Send heartbeatsat regular intervals
    return () =>{
      clearInterval(heartbeatIntervalId);
    };
  }, [roomObj.id]);

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
        </Col>
        <Col xs={8}>
          <DrawingBoard canDraw={current?.player?.id == ctx.user.id} board={current?.board} onChange={handleBoardChange} />
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