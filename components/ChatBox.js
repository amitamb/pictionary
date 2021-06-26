// components/ChatBox.js
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import AuthContext from '../store/auth-context';
import classes from './ChatBox.module.scss';
import Button from 'react-bootstrap/Button';
import { useContext, useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

const ChatBox = ({ room }) => {

  const ctx = useContext(AuthContext);
  const [ messages, setMessages ] = useState(room.messages || []);

  useEffect(() => {

  }, []);

  const messageSubmitHandler = (messageText) => {
    let newMessage ={
      from: ctx.user.username,
      id: uuidv4(),
      text: messageText
    }
    let newMessages = [...messages, newMessage];
    setMessages(newMessages);
    console.log(newMessages);
  };

  return (
    <div className={classes.ChatBox}>
      <div className={classes.MessagesContainer}>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onMessageSubmit={messageSubmitHandler} />
    </div>
  );
}

export default ChatBox;