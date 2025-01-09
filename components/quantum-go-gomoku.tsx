import React from 'react';
import { useQuantumGoGomoku } from '@/hooks/useQuantumGoGomoku';
import { Board } from '@/components/Board';
import { StoneSelector } from '@/components/StoneSelector';
import { StoneCounter } from '@/components/StoneCounter';

export default function QuantumGoGomoku() {
  const { 
    board, 
    currentPlayer, 
    selectedStone, 
    setSelectedStone, 
    placeStone, 
    stoneCounts,
    hasAvailableStones,
    winner
  } = useQuantumGoGomoku();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">量子囲碁五目並べ (8x8)</h1>
      {!winner && (
        <div className="mb-4">
          <p className="text-xl">現在のプレイヤー: {currentPlayer === 'X' ? '黒' : '白'}</p>
          {!hasAvailableStones(currentPlayer) && (
            <p className="text-red-500">コマがありません。相手の番になります。</p>
          )}
        </div>
      )}
      {winner && (
        <div className="mb-4 text-2xl font-bold">
          結果: {winner === 'X' ? '黒の勝ち' : winner === 'O' ? '白の勝ち' : '引き分け'}
        </div>
      )}
      <StoneSelector 
        selectedStone={selectedStone} 
        onSelectStone={setSelectedStone} 
        stoneCounts={stoneCounts[currentPlayer]}
        disabled={!!winner}
      />
      <StoneCounter stoneCounts={stoneCounts} currentPlayer={currentPlayer} />
      <Board board={board} onCellClick={placeStone} />
      <div className="mt-4">
        <p>コマの種類:</p>
        <ul>
          <li>通常のコマ: 確実に配置 (5個)</li>
          <li>90%の確率で自分のコマになるコマ (2個)</li>
          <li>70%の確率で自分のコマになるコマ (2個)</li>
          <li>50%の確率で自分のコマになるコマ (2個)</li>
          <li>30%の確率で自分のコマになるコマ (2個)</li>
          <li>10%の確率で自分のコマになるコマ (2個)</li>
        </ul>
      </div>
    </div>
  );
}

