import Layout from "../../components/Layout";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import CanvasDraw from "react-canvas-draw"
import { DateTime } from 'luxon';
import PlayersList from "../../components/PlayersList";
import AuthContext from '../../store/auth-context';
import { useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import db from '../../support/firebase';

import classes from "./[roomId].module.scss";

import dynamic from 'next/dynamic';

import DrawingBoard from '../../components/DrawingBoard';

// const DrawingBoard = dynamic(() => import("../../components/DrawingBoard"), { ssr: false });
const ChatBox = dynamic(() => import("../../components/ChatBox"), { ssr: false });

const isPlayerAlive = (player) => {
  if ( !player.lastHearthBeatAt || !player.lastInteractedAt ) {
    return false;
  }
  let lastHearthBeatAt = Math.max(player.lastHearthBeatAt, player.lastInteractedAt);
  lastHearthBeatAt = DateTime.fromMillis(lastHearthBeatAt);
  lastHearthBeatAt.plus({ seconds: 60 });
  if ( lastHearthBeatAt < DateTime.now() ) {
    return false;
  }
};

const isPlayerKickable = (player) => {
  if ( !player.lastHearthBeatAt || !player.lastInteractedAt ) {
    return false;
  }
  if ( !isPlayerAlive(player) ) {
    return false;
  }
  let lastInteractedAt = DateTime.fromMillis(player.lastInteractedAt);
  lastInteractedAt.plus({ minutes: 4 });
  if ( lastInteractedAt < DateTime.now() ) {
    return false;
  }
  return true;
};

const isPlayerActive = (player) => {
  if ( !player.lastHearthBeatAt || !player.lastInteractedAt ) {
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

const getPlayerState = (player) => {
  if ( !player.lastHearthBeatAt || !player.lastInteractedAt ) {
    return 'dead';
  }
  if ( isPlayerAlive(player) ) {
    return 'dead';
  }
  if ( isPlayerKickable(player) ) {
    return 'kicked';
  }
  if ( isPlayerKickable(player) ) {
    return 'kicked';
  }
};

function Room({ room }) {

  const ctx = useContext(AuthContext);
  const [ players, setPlayers ] = useState(Object.values(room.playing || {}));
  const [ current, setCurrent ] = useState(room.current || {});

  const playingListRef = useRef(db.ref(`rooms/room_${room.id}/playing`));
  const currentRef = useRef(db.ref(`rooms/room_${room.id}/current`));

  room.playing = room.playing || {};

  useEffect(() => {

    // let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
    playingListRef.current.on('value', (snapshot) => {
      const data = snapshot.val();
      setPlayers(Object.values(data || {}));
    });
  
  }, [room.id]);

  useEffect(() => {

    // Set current user as logged in
    // check if user already logged in
    let foundLoggedIn = !!players.find(player => player.id === ctx.user.id);
    if (!foundLoggedIn) {
      let newPlayingUserRef = db.ref(`rooms/room_${room.id}/playing/${ctx.user.id}`);
      newPlayingUserRef.set({
        ...ctx.user,
        currentPoints: 0,
        lastInteractedAt: +new Date(),
        lastHearthBeatAt: +new Date(),
      });
    }
    
  }, [players]);

  useEffect(() => {

    currentRef.current.on('value', (snapshot) => {
      const data = snapshot.val();
      setCurrent(data);
    });
  
  }, [room.id]);


  const cleanPlayersList = () => {
    // kick out dead/kickable players
    players.forEach((player) => {
      if ( player.id !== ctx.user.id && !isPlayerKickable(player) ) {
        playingListRef.current.child(`${player.id}`).remove();
      }
    });
  };

  const handleCurrentPlayerState = () => {

    const graceSeconds = 5;

    // kick out dead/kickable players
    players.forEach((player) => {
      
      if ( player.id !== current.player.id ) {
        // playingListRef.current.child(`${player.id}`).remove();
        // if ( current.player. )
        
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

      let lastHearthBeatAt = playingListRef.current.child(`${ctx.user.id}/lastHearthBeatAt`);
      lastHearthBeatAt.set(+new Date());
      cleanPlayersList();
    }, 30000);

    cleanPlayersList();

    // Send heartbeatsat regular intervals
    return () =>{
      clearInterval(heartbeatIntervalId);
    };
  }, []);

  const handleBoardChange = (newLines) => {
    // console.log(currentRef.current);
    setCurrent({
      ...current,
      board: {
        lines: newLines
      }
    });
    currentRef.current.child('board/lines').set(newLines);
  }

  const handleMessageSent = (messageData) => {
    // let messageText = messageData.data;
    let lastInteractedAt = playingListRef.current.child(`${ctx.user.id}/lastInteractedAt`);
    lastInteractedAt.set(+new Date());
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
  let room = data.val();

  // Pass data to the page via props
  return { props: { room } }
}


export default Room;