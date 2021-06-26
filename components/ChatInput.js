// components/ChatInput.js
import Link from 'next/link';

import classes from './ChatInput.module.scss';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, InputGroup, FormControl } from 'react-bootstrap';

function ChatInput(props) {

  const [ message, setMessage ] = useState('');

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if ( props.onMessageSubmit ) {
      props.onMessageSubmit(message);
    }
    setMessage("");
  };

  return (
    <div className={classes.ChatInput}>
      <Form onSubmit={submitHandler}>
        <InputGroup size="sm" className="">
          <FormControl
          value={message}
            onChange={messageChangeHandler}
            placeholder="Type your guess"
            aria-label="Type your guess"
          />
          <InputGroup.Append>
            <Button type="submit" variant="primary">Guess</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
}

export default ChatInput;