// components/PlayersList.js
import Link from 'next/link';

import styles from './PlayersList.module.scss';
import Button from 'react-bootstrap/Button';
import { Component } from 'react';

const chatBoxStyle = {
  display: "Block",
  background: "#ddd",
};

const PlayersList = (props) => {
  return (
    <>
      {props.players.map((player) => {
        return <div>
          {player.username}
        </div>
      })}
    </>
  );
};

export default PlayersList;