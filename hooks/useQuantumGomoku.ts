import { useState, useCallback } from 'react';

type CellState = null | 'X' | 'O' | 'X/O';
type BoardState = CellState[][];

const BOARD_SIZE = 15;

export function useQuantumGomoku() {
  const [board, setBoard] = useState<BoardState>(() =>
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

  const placeStone = useCallback((row: number, col: number) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      if (newBoard[row][col] === null) {
        newBoard[row][col] = 'X/O';
      } else if (newBoard[row][col] === 'X/O') {
        newBoard[row][col] = currentPlayer;
        setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
      }
      return newBoard;
    });
  }, [currentPlayer]);

  const checkWinner = useCallback(() => {
    // 簡略化のため、勝利条件チェックは省略しています
    return null;
  }, [board]);

  return { board, currentPlayer, placeStone, checkWinner };
}

