import Layout from "../../components/Layout";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CanvasDraw from "react-canvas-draw"
// import ChatBox from "../../components/ChatBox";
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

function Room({ room }) {

  console.log(room);

  const ctx = useContext(AuthContext);
  const [ players, setPlayers ] = useState(Object.values(room.playing || {}));
  const [ current, setCurrent ] = useState(room.current || {});

  const currentRef = useRef(db.ref(`rooms/room_${room.id}/current`));

  room.playing = room.playing || {};

  useEffect(() => {

    let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
    playingListRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setPlayers(Object.values(data || {}));
    });

    // Set current user as logged in
    // check if user already logged in
    let foundLoggedIn = !!room.playing[ctx.user.id];
    if (!foundLoggedIn) {
      let newPlayingUserRef = db.ref(`rooms/room_${room.id}/playing/${ctx.user.id}`);
      newPlayingUserRef.set({
        ...ctx.user,
        currentPoints: 0,
        lastInteractedAt: +new Date()
      });
    }

    
  }, [room.id]);

  useEffect(() => {

    let currentRef1 = db.ref(`rooms/room_${room.id}/current`);
    currentRef1.on('value', (snapshot) => {
      const data = snapshot.val();
      // setPlayers(Object.values(data || {}));
      setCurrent(data);
      console.log("value");
      console.log(data);
    });

    // currentRef.current = db.ref(`rooms/room_${room.id}/current`);
    // currentRef.current.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   // setPlayers(Object.values(data || {}));
    //   setCurrent(data);
    // });

    // currentRef.current.on('child_changed', (snapshot) => {
    //   const data = snapshot.val();
    //   // setPlayers(Object.values(data || {}));
    //   setCurrent(data);
    // });
  
  }, [room.id]);

  useEffect(() => {

    if ( !current?.player && players.length > 0 ) {
      // if nobody is playing
      // get first active player from the players list
      // TODO: Get first active

      // players[0]
      // current.player = ctx.user.id;
      // current.startedAt =  +new Date();

      let firstActivePlayer = players[0];

      let newCurrent = {
        ...current,
        player: firstActivePlayer,
        startedAt: +new Date(),
        board: {
          lines: []
        }
      };

      setCurrent(newCurrent);

      // let currentRef = db.ref(`rooms/room_${room.id}/current`);
      currentRef.current.set(newCurrent);
    }
    
  }, [current?.player, players]);

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

  console.log("Current");
  console.log(current);

  return (
    <Layout>
      <Row>
        <Col xs={12} className={classes.roomInfo}>
          <span className='name'>{room.name}</span>
          <span className='playing'>{players.length} players playing</span>
        </Col>
        <Col xs={8}>
          {/* <CanvasDraw canvasWidth={'100%'} canvasHeight={547.5} brushRadius={6} lazyRadius={0} /> */}
          <DrawingBoard canDraw={current?.player?.id == ctx.user.id} board={current?.board} onChange={handleBoardChange} />
        </Col>
        <Col>
          <div className="d-flex flex-column" style={{ height: '100%' }}>
            <div className={classes.PlayersListContainer}>
              <PlayersList players={players}></PlayersList>
            </div>
            <div className={classes.ChatBoxContainer}>
              <ChatBox room={room}></ChatBox>
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