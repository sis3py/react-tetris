import React from 'react';
import StyledDisplay from './styles/StyledDisplay';

const Display = ({ isGameOver, text }) => {
  return <StyledDisplay isGameOver={isGameOver}>{text}</StyledDisplay>;
};

export default Display;
