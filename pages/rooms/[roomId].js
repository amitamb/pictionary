import Layout from "../../components/Layout";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CanvasDraw from "react-canvas-draw"
import ChatBox from "../../components/ChatBox";
import PlayersList from "../../components/PlayersList";
import AuthContext from '../../store/auth-context';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import db from '../../support/firebase';

import classes from "./[roomId].module.scss";

function Room({ room }) {

  const ctx = useContext(AuthContext);
  const [ players, setPlayers ] = useState(Object.values(room.playing || {}));

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
      console.log("Log the user in!!");
      // let playingListRef = db.ref(`rooms/room_${room.id}/playing`);
      // let newPlayingUserRef = playingListRef.push();
      let newPlayingUserRef = db.ref(`rooms/room_${room.id}/playing/${ctx.user.id}`);
      newPlayingUserRef.set({
        ...ctx.user,
        currentPoints: 0,
        lastInteractedAt: +new Date()
      });
    }
  }, []);

  useEffect(() => {
    
  }, []);

  return (
    <Layout>
      <Row>
        <Col xs={12} className={classes.roomInfo}>
          <span className='name'>{room.name}</span>
          <span className='playing'>{players.length} players playing</span>
        </Col>
        <Col xs={8}>
          <CanvasDraw canvasWidth={'100%'} canvasHeight={547.5} brushRadius={6} lazyRadius={0} />
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