import React, { useState, useEffect } from 'react';
import AnimalsList from "../data/animals";
import { v4 as uuidv4 } from 'uuid';

const AuthContext = React.createContext({
  user: {
    username: ''
  },
  onUsernameChange: (username) => {}
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateUsername(){
  let i = getRandomInt(AnimalsList.length - 1);
  let animal = AnimalsList[i];
  let j = getRandomInt(9);
  return "Guest-" + animal + "-" + j;
}

export const AuthContextProvider = (props) => {
  let userObj;
  if (typeof(localStorage) !== "undefined") {
    userObj = JSON.parse(localStorage['__user'] || 'null');
  }
  if (!userObj) {
    userObj = { username: ''}
  }
  const [user, setUser] = useState(userObj);

  useEffect(() => {
    let userObj = JSON.parse(localStorage['__user'] || 'null');
    if ( !userObj ) {
      // generate username
      let username = generateUsername();
      userObj = {
        id: uuidv4(),
        username
      };
      localStorage['__user'] = JSON.stringify((userObj));
    }
    setUser(userObj);

  }, []);

  const usernameChangeHandler = (username) => {
    let userObj = JSON.parse(localStorage['__user']);
    userObj.username = username;
    localStorage['__user'] = JSON.stringify(userObj);
    setUser(userObj);
  };

  const getUsername = () => {

  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        getUsername: getUsername,
        onUsernameChange: usernameChangeHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;