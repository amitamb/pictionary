// components/WordSelector.js
import Link from 'next/link';
import AuthContext from '../store/auth-context';
import classes from './WordSelector.module.scss';
import Button from 'react-bootstrap/Button';
import React, { useContext, useState, useEffect } from 'react';

const WordSelector = ({ children, room, onSelect }) => {

  let words = ["Crocodile", "Rat", "Boat"];

  return (
    <>
      <div>
        <h4 className="text-center">Select the word.</h4>

        <br />
        { words.map( (word) => {
          return <Button key={word} className={classes.selectButton} onClick={() => onSelect(word)} >{word}</Button>
        })}
      </div>
    </>
  );
};

export default WordSelector;