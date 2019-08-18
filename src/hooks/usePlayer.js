import { useState, useCallback } from 'react';
import { randomTetromino, TETROMINOS } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../logic/gameLogic';

export const usePlayer = () => {
  // Empty player's initial tetromino
  const initialPlayer = {
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false
  };

  const [player, setPlayer] = useState(initialPlayer);

  // Rotate a tetromino to the given direction
  const rotate = (tetromino, direction) => {
    // Transpose : make the rows to become cols
    const rotatedTetromino = tetromino.map((_, index) =>
      tetromino.map(col => col[index])
    );

    // Reverse each row to get a rotated tetromino
    if (direction > 0) {
      // Clockwise
      return rotatedTetromino.map(row => row.reverse());
    } else {
      // Counterclockwise
      return rotatedTetromino.reverse();
    }
  };

  const rotatePlayer = (stage, direction) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);

    const position = clonedPlayer.position.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -direction); // Rotate back
        clonedPlayer.position.x = position;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayer = ({ x, y, collided }) => {
    setPlayer(previousState => ({
      ...previousState,
      pos: {
        x: (previousState.position.x += x),
        y: (previousState.position.y += y)
      },
      collided
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      position: {
        x: STAGE_WIDTH / 2 - 2,
        y: 0
      },
      tetromino: randomTetromino().shape,
      collided: false
    });
  }, []);

  return [player, updatePlayer, resetPlayer, rotatePlayer];
};
