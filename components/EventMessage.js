// components/EventMessage.js
import Link from 'next/link';

import classes from './EventMessage.module.scss';
import Button from 'react-bootstrap/Button';

function EventMessage({ message }) {
  return (
    <div className={classes.EventMessage}>
      <span className="from">
        {message.from} :
      </span>
      &nbsp;
      <span className="text">
        {message.text}
      </span>
    </div>
  );
}

export default EventMessage;