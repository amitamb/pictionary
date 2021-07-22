// components/ChatMessage.js
import Link from 'next/link';

import classes from './ChatMessage.module.scss';
import Button from 'react-bootstrap/Button';

function ChatMessage({ message }) {
  return (
    <div className={classes.ChatMessage}>
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

export default ChatMessage;