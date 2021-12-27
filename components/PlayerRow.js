// components/PlayersList.js
import classes from './PlayerRow.module.scss';

const PlayerRow = ({ player }) => {
  return (
    <div className={classes.PlayerRow}>
      <span className="name">
        {player.username}
      </span>
      <span className="points">
        {player.currentPoints || 0}
      </span>
      <span className="status">
        {player.status}
      </span>
    </div>
  );
};

export default PlayerRow;