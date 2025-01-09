import React from 'react';
import { useQuantumGomoku } from './hooks/useQuantumGomoku';
import { Board } from './components/Board';

export default function QuantumGomoku() {
  const { board, currentPlayer, placeStone, checkWinner } = useQuantumGomoku();

  const winner = checkWinner();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">量子五目並べ</h1>
      <div className="mb-4">
        <p className="text-xl">現在のプレイヤー: {currentPlayer}</p>
      </div>
      <Board board={board} onCellClick={placeStone} />
      {winner && (
        <div className="mt-4 text-2xl font-bold">
          勝者: {winner}
        </div>
      )}
    </div>
  );
}

