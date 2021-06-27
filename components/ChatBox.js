// components/ChatBox.js
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import AuthContext from '../store/auth-context';
import classes from './ChatBox.module.scss';
import Button from 'react-bootstrap/Button';
import React, { useContext, useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

import { useChannel } from "../hooks/AblyReactEffect";

const ChatBox = ({ room }) => {

  const ctx = useContext(AuthContext);
  const [ messages, setMessages ] = useState(room.messages || []);

  useEffect(() => {

  }, []);

  const [channel, ably] = useChannel(room.id, (messagePayload) => {
    // Here we're computing the state that'll be drawn into the message history
    // We do that by slicing the last 199 messages from the receivedMessages buffer

    const history = messages.slice(-199);
    setMessages([...history, messagePayload.data]);

    // Then finally, we take the message history, and combine it with the new message
    // This means we'll always have up to 199 message + 1 new message, stored using the
    // setMessages react useState hook
  });

  const messageSubmitHandler = (messageText) => {
    let newMessage ={
      from: ctx.user.username,
      // id: uuidv4(),
      text: messageText
    }
    // let newMessages = [...messages, newMessage];
    // setMessages(newMessages);

    channel.publish({ name: "chat-message", data: newMessage });

    // console.log(newMessages);
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