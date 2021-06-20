// components/RoomRow.js
import Link from 'next/link';

import styles from './RoomRow.module.scss';
import Button from 'react-bootstrap/Button';

const roomRowStyle = {
  display: "Block",
  color: "Blue"
};

const RoomRow = (props) => (
  <div className={styles.RoomRow}>
    <Link href={"/rooms/"+props.room.id}><Button variant="primary"  >Join</Button></Link>
    <span className="name">{props.room.name}</span>
    <span className="playing">5 playing</span>
  </div>
);

export default RoomRow;