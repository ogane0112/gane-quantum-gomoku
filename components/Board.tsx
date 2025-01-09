import React from 'react';

type CellState = null | 'X' | 'O' | 'X-90' | 'X-70' | 'X-50' | 'X-30' | 'X-10' | 'O-90' | 'O-70' | 'O-50' | 'O-30' | 'O-10';

interface BoardProps {
  board: CellState[][];
  onCellClick: (row: number, col: number) => void;
}

export function Board({ board, onCellClick }: BoardProps) {
  return (
    <div className="grid grid-cols-8 gap-px bg-yellow-600 p-px">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className="w-12 h-12 bg-yellow-100 flex items-center justify-center text-sm font-bold"
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {renderCell(cell)}
          </button>
        ))
      )}
    </div>
  );
}

function renderCell(cell: CellState) {
  if (!cell) return null;
  
  const [player, probability] = cell.split('-');
  const isBlack = player === 'X';
  
  if (probability) {
    const bgColor = isBlack ? 'bg-gray-800' : 'bg-white';
    const textColor = isBlack ? 'text-white' : 'text-black';
    const borderColor = isBlack ? 'border-white' : 'border-black';
    
    return (
      <div className={`w-10 h-10 rounded-full ${bgColor} ${textColor} border-2 ${borderColor} flex items-center justify-center text-xs`}>
        {probability}%
      </div>
    );
  } else {
    return (
      <div className={`w-10 h-10 rounded-full ${isBlack ? 'bg-black' : 'bg-white border-2 border-black'}`} />
    );
  }
}

