import React from 'react';

type StoneType = 'normal' | 'quantum-90' | 'quantum-70' | 'quantum-50';

interface StoneCounts {
  normal: number;
  'quantum-90': number;
  'quantum-70': number;
  'quantum-50': number;
}

interface StoneCounterProps {
  stoneCounts: {
    X: StoneCounts;
    O: StoneCounts;
  };
  currentPlayer: 'X' | 'O';
}

export function StoneCounter({ stoneCounts, currentPlayer }: StoneCounterProps) {
  return (
    <div className="flex justify-between w-full max-w-md mb-4">
      <div className={`flex flex-col items-center ${currentPlayer === 'X' ? 'bg-gray-200' : ''} p-2 rounded`}>
        <div className="font-bold mb-2">黒</div>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="font-bold">通常</div>
            <div>{stoneCounts.X.normal}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-900">90%</div>
            <div>{stoneCounts.X['quantum-90']}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-900">70%</div>
            <div>{stoneCounts.X['quantum-70']}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-900">50%</div>
            <div>{stoneCounts.X['quantum-50']}</div>
          </div>
        </div>
      </div>
      <div className={`flex flex-col items-center ${currentPlayer === 'O' ? 'bg-gray-200' : ''} p-2 rounded`}>
        <div className="font-bold mb-2">白</div>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="font-bold">通常</div>
            <div>{stoneCounts.O.normal}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600">90%</div>
            <div>{stoneCounts.O['quantum-90']}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-600">70%</div>
            <div>{stoneCounts.O['quantum-70']}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">50%</div>
            <div>{stoneCounts.O['quantum-50']}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

