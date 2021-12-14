// components/BoardModal.js
import Link from 'next/link';
import AuthContext from '../store/auth-context';
import classes from './BoardModal.module.scss';
import Button from 'react-bootstrap/Button';
import React, { useContext, useState, useEffect } from 'react';

const BoardModal = ({ children, room }) => {
  return (
    <div className={ classes.modalClass }>
      {children}
    </div>
  );
};

export default BoardModal;