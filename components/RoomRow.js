// components/RoomRow.js
import styles from './RoomRow.module.scss'
import Button from 'react-bootstrap/Button';

const roomRowStyle = {
  display: "Block",
  color: "Blue"
};

const RoomRow = () => (
  <div className={styles.RoomRow}>
    <Button variant="primary"  >Join</Button>
    <span className="name">Room Name</span>
    <span className="playing">5 playing</span>
  </div>
);

export default RoomRow;