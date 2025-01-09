import React from 'react';

type StoneType = 'normal' | 'quantum-90' | 'quantum-70' | 'quantum-50' | 'quantum-30' | 'quantum-10';

interface StoneCounts {
  normal: number;
  'quantum-90': number;
  'quantum-70': number;
  'quantum-50': number;
  'quantum-30': number;
  'quantum-10': number;
}

interface StoneSelectorProps {
  selectedStone: StoneType;
  onSelectStone: (stone: StoneType) => void;
  stoneCounts: StoneCounts;
  disabled: boolean;
}

export function StoneSelector({ selectedStone, onSelectStone, stoneCounts, disabled }: StoneSelectorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <StoneButton type="normal" label="通常" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts.normal} disabled={disabled} />
      <StoneButton type="quantum-90" label="90%" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts['quantum-90']} disabled={disabled} />
      <StoneButton type="quantum-70" label="70%" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts['quantum-70']} disabled={disabled} />
      <StoneButton type="quantum-50" label="50%" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts['quantum-50']} disabled={disabled} />
      <StoneButton type="quantum-30" label="30%" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts['quantum-30']} disabled={disabled} />
      <StoneButton type="quantum-10" label="10%" selected={selectedStone} onSelect={onSelectStone} count={stoneCounts['quantum-10']} disabled={disabled} />
    </div>
  );
}

interface StoneButtonProps {
  type: StoneType;
  label: string;
  selected: StoneType;
  onSelect: (stone: StoneType) => void;
  count: number;
  disabled: boolean;
}

function StoneButton({ type, label, selected, onSelect, count, disabled }: StoneButtonProps) {
  const isSelected = type === selected;
  const isDisabled = count === 0 || disabled;

  return (
    <button
      className={`px-3 py-2 rounded ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-300'}`}
      onClick={() => onSelect(type)}
      disabled={isDisabled}
    >
      {label} ({count})
    </button>
  );
}

