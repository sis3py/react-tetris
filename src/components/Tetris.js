import React, { useState } from 'react';
import useInterval from '@use-it/interval';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import StyledTetrisWrapper from './styles/StyledTetrisWrapper';
import StyledTetris from './styles/StyledTetris';
import { createStage, checkCollision } from '../logic/gameLogic';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const [player, updatePlayer, resetPlayer, rotatePlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  const startGame = () => {
    // make sure all the variables are reset if previous games
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setIsGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(1);
  };

  // Calculate drop speed based on the current level
  const getDropSpeed = () => 1000 / (level + 1) + 200;

  // Check if the current level has to be incremented, based on the current level and the number of cleared rows
  const hasToIncrementLevel = () => rows > (level + 1) * 10;

  // Move the current player's tetromino
  const movePlayer = direction => {
    if (!checkCollision(player, stage, { x: direction, y: 0 })) {
      updatePlayer({ x: direction, y: 0 });
    }
  };

  // Drop the current player's tetromino
  const drop = () => {
    if (hasToIncrementLevel()) {
      // Increase level
      setLevel(previousLevel => previousLevel + 1);
      // Increase speed
      setDropTime(getDropSpeed());
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayer({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.position.y < 1) {
        setIsGameOver(true);
        setDropTime(null);
      }
      updatePlayer({ x: 0, y: 0, collided: true });
    }
  };

  // Handle a manual drop
  const dropPlayer = () => {
    // we need to disable the automatic drop during a manual drop
    setDropTime(null);

    // Drop the tetromino
    drop();
  };

  // Handle a key pressed by the user
  const handleUserKeyPressed = ({ keyCode }) => {
    if (!isGameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        rotatePlayer(stage, 1);
      }
    }
  };

  // Handle a key released by the user
  const handleUserKeyReleased = ({ keyCode }) => {
    if (!isGameOver && keyCode === 40) {
      // If the released key was the down arrow, we need to reactivate the automatic drop
      setDropTime(getDropSpeed());
    }
  };

  // Auto drop tetromino
  useInterval(() => drop(), dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={handleUserKeyPressed}
      onKeyUp={handleUserKeyReleased}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {isGameOver ? (
            <Display isGameOver={isGameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score : ${score}`} />
              <Display text={`Rows : ${rows}`} />
              <Display text={`Level : ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
