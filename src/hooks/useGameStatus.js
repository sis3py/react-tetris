import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = rowsCleared => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);

  const linePoints = [40, 100, 300, 1200];

  const calculateScore = useCallback(() => {
    // Check if any score yet
    if (rowsCleared > 0) {
      setScore(
        previousScore =>
          previousScore + linePoints[rowsCleared - 1] * (level + 1)
      );

      setRows(previousRows => previousRows + rowsCleared);
    }
  }, [level, linePoints, rowsCleared]);

  // Automatically recalculate the score when needed
  useEffect(() => {
    calculateScore();
  }, [calculateScore, rowsCleared, score]);

  return [score, setScore, rows, setRows, level, setLevel];
};
