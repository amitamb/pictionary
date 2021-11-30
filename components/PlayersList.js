// components/PlayersList.js
import Link from 'next/link';

import classes from './PlayersList.module.scss';
import Button from 'react-bootstrap/Button';
import PlayerRow from './PlayerRow';
import { Component } from 'react';

const chatBoxStyle = {
  display: "Block",
  background: "#ddd",
};

const PlayersList = (props) => {

  // console.log(props.players);

  return (
    <div className={classes.PlayersList}>
      {props.players.map((player) => {
        return <PlayerRow key={player.id} player={player} />
      })}
    </div>
  );
};

export default PlayersList;