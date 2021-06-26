// components/ChatBox.js
import Link from 'next/link';

import styles from './ChatBox.module.scss';
import Button from 'react-bootstrap/Button';
import { Component } from 'react';

const chatBoxStyle = {
  display: "Block",
  background: "#ddd",
};

// const RoomRow = (props) => (
//   <div className={styles.chatBoxStyle}>
//     Show Chats here
//   </div>
// );

class RoomRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.chatBoxStyle}>
        Show Chats here
      </div>
    );
  }
}

export default RoomRow;