'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuantumGoGomoku } from '../../../../hooks/useQuantumGoGomoku'
import { Board } from '../../../components/Board'
import { StoneSelector } from '../../../components/StoneSelector'
import { supabase } from '../../../../lib/supabaseClient'
import Link from 'next/link'

export default function OnlineGame() {
  const params = useParams()
  const gameId = params.id as string
  const [playerColor, setPlayerColor] = useState<'X' | 'O' | null>(null)

  const { 
    board, 
    currentPlayer, 
    selectedStone, 
    setSelectedStone, 
    placeStone, 
    stoneCounts,
    hasAvailableStones,
    winner
  } = useQuantumGoGomoku(gameId, true)

  useEffect(() => {
    const fetchPlayerColor = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (error) {
        console.error('Error fetching game:', error)
        return
      }

      if (data.status === 'waiting') {
        setPlayerColor('X')
      } else if (data.status === 'playing') {
        setPlayerColor('O')
      }
    }

    fetchPlayerColor()
  }, [gameId])

  const canPlay = currentPlayer === playerColor

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">量子囲碁五目並べ (8x8) - オンライン</h1>
      <p className="mb-2">ゲームID: {gameId}</p>
      {playerColor && <p className="mb-2">あなたの色: {playerColor === 'X' ? '黒' : '白'}</p>}
      {!winner && (
        <div className="mb-4">
          <p className="text-xl">現在のプレイヤー: {currentPlayer === 'X' ? '黒' : '白'}</p>
          {!canPlay && <p className="text-red-500">相手の番です。お待ちください。</p>}
          {canPlay && !hasAvailableStones(currentPlayer) && (
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
        disabled={!canPlay || !!winner}
      />
      <Board board={board} onCellClick={(row, col) => canPlay && placeStone(row, col)} />
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
      <Link href="/" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        ホームに戻る
      </Link>
    </div>
  )
}

