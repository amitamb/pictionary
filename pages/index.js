import Head from 'next/head'
import Image from 'next/image'
import Layout from "../components/Layout";
import RoomRow from "../components/RoomRow";
import RoomsList from "../data/rooms";
import styles from '../styles/Home.module.css'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react';
import db from '../support/firebase';

function Home({ rooms }) {

  const fetchRooms = async () => {
    
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Layout>
      <Row className="justify-content-md-center mt-4">
        <Col xs={12} sm={6}>
          <Row className="mb-3">
            <Col xs={6}>
              <Button variant="primary" size="lg" block>
                Quick Join
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" size="lg" block>
              Create Room
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="text-center">
                Join any of the following public rooms
              </h3>
              {rooms.map(room => (
                <RoomRow key={room.id} room={room}></RoomRow>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  const response=db.ref().child('rooms');
  const data=await response.get();

  // console.log(data.val());

  let roomsObj = data.val();
  let rooms = [];

  for ( let id in roomsObj ) {
    rooms.push(roomsObj[id]);
  }

  // Pass data to the page via props
  return { props: { rooms: rooms } }
}

export default Home;