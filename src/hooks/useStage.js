import { useState, useEffect } from 'react';
import { createStage } from '../logic/gameLogic';

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = newStage =>
      newStage.reduce((ack, row) => {
        if (!row.find(cell => cell[0] === 0)) {
          setRowsCleared(previousValue => previousValue + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        } else {
          ack.push(row);
        }

        return ack;
      }, []);

    const updateStage = previousStage => {
      // Flush the stage
      const newStage = previousStage.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

      // Draw  the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            newStage[y + player.position.y][x + player.position.x] = [
              cell,
              `${player.collided ? 'merged' : 'clear'}`
            ];
          }
        });
      });

      // Check if collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage(previousStage => updateStage(previousStage));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};
