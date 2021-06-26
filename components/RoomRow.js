// components/RoomRow.js
import Link from 'next/link';

import styles from './RoomRow.module.scss';
import Button from 'react-bootstrap/Button';

const roomRowStyle = {
  display: "Block",
  color: "Blue"
};

const RoomRow = ({ room }) => (
  <div className={styles.RoomRow}>
    <Link href={"/rooms/"+room.id}><Button variant="primary"  >Join</Button></Link>
    <span className="name">{room.name}</span>
    <span className="playing">{Object.values(room.playing || {}).length} playing</span>
  </div>
);

export default RoomRow;