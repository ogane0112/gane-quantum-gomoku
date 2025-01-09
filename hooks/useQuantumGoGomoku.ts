import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type CellState = null | 'X' | 'O' | 'X-90' | 'X-70' | 'X-50' | 'X-30' | 'X-10' | 'O-90' | 'O-70' | 'O-50' | 'O-30' | 'O-10'
type BoardState = CellState[][]
type StoneType = 'normal' | 'quantum-90' | 'quantum-70' | 'quantum-50' | 'quantum-30' | 'quantum-10'

const BOARD_SIZE = 8

interface StoneCounts {
  normal: number
  'quantum-90': number
  'quantum-70': number
  'quantum-50': number
  'quantum-30': number
  'quantum-10': number
}

const INITIAL_STONE_COUNTS: StoneCounts = {
  normal: 5,
  'quantum-90': 2,
  'quantum-70': 2,
  'quantum-50': 2,
  'quantum-30': 2,
  'quantum-10': 2,
}

export function useQuantumGoGomoku(gameId: string | null, isOnline: boolean) {
  const [board, setBoard] = useState<BoardState>(() =>
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [selectedStone, setSelectedStone] = useState<StoneType>('normal')
  const [stoneCounts, setStoneCounts] = useState<{X: StoneCounts, O: StoneCounts}>({
    X: {...INITIAL_STONE_COUNTS},
    O: {...INITIAL_STONE_COUNTS}
  })
  const [winner, setWinner] = useState<'X' | 'O' | '引き分け' | null>(null)

  const hasAvailableStones = useCallback((player: 'X' | 'O') => {
    return Object.values(stoneCounts[player]).some(count => count > 0)
  }, [stoneCounts])

  const switchPlayer = useCallback(() => {
    setCurrentPlayer(prev => {
      const next = prev === 'X' ? 'O' : 'X'
      if (!hasAvailableStones(next)) {
        return prev === 'X' ? 'O' : 'X'
      }
      return next
    })
  }, [hasAvailableStones])

  const checkWinner = useCallback((board: BoardState, row: number, col: number) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ]
    const currentColor = board[row][col]
    if (!currentColor || typeof currentColor !== 'string' || currentColor.length > 1) return null

    for (const [dx, dy] of directions) {
      let count = 1
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx
        const newCol = col + i * dy
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break
        if (board[newRow][newCol] === currentColor) {
          count++
        } else {
          break
        }
      }
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dx
        const newCol = col - i * dy
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break
        if (board[newRow][newCol] === currentColor) {
          count++
        } else {
          break
        }
      }
      if (count >= 5) {
        return currentColor as 'X' | 'O'
      }
    }
    return null
  }, [])

  const determineStoneColor = useCallback((stoneType: StoneType, currentPlayer: 'X' | 'O') => {
    const probability = parseInt(stoneType.split('-')[1]) / 100
    return Math.random() < probability ? currentPlayer : (currentPlayer === 'X' ? 'O' : 'X')
  }, [])

  const placeStone = useCallback(async (row: number, col: number) => {
    if (winner || !hasAvailableStones(currentPlayer)) {
      return
    }

    const newBoard = [...board.map(row => [...row])]
    if (newBoard[row][col] === null && stoneCounts[currentPlayer][selectedStone] > 0) {
      const determinedColor = selectedStone === 'normal' ? currentPlayer : determineStoneColor(selectedStone, currentPlayer)
      newBoard[row][col] = determinedColor

      const newStoneCounts = {
        ...stoneCounts,
        [currentPlayer]: {
          ...stoneCounts[currentPlayer],
          [selectedStone]: stoneCounts[currentPlayer][selectedStone] - 1
        }
      }

      const newWinner = checkWinner(newBoard, row, col)

      if (isOnline && gameId) {
        const { error } = await supabase
          .from('games')
          .update({
            board: newBoard,
            current_player: newWinner ? currentPlayer : (currentPlayer === 'X' ? 'O' : 'X'),
            stone_counts: newStoneCounts,
            winner: newWinner
          })
          .eq('id', gameId)

        if (error) {
          console.error('Error updating game state:', error)
          return
        }
      } else {
        setBoard(newBoard)
        setStoneCounts(newStoneCounts)
        if (newWinner) {
          setWinner(newWinner)
        } else {
          switchPlayer()
        }
      }
    }
  }, [board, currentPlayer, selectedStone, stoneCounts, hasAvailableStones, switchPlayer, checkWinner, determineStoneColor, winner, isOnline, gameId])

  useEffect(() => {
    if (isOnline && gameId) {
      const fetchGameState = async () => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single()

        if (error) {
          console.error('Error fetching game state:', error)
          return
        }

        setBoard(data.board)
        setCurrentPlayer(data.current_player)
        setStoneCounts(data.stone_counts)
        setWinner(data.winner)
      }

      fetchGameState()

      const channel = supabase
        .channel(`game:${gameId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (payload) => {
          const { board, current_player, stone_counts, winner } = payload.new
          setBoard(board)
          setCurrentPlayer(current_player)
          setStoneCounts(stone_counts)
          setWinner(winner)
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [isOnline, gameId])

  useEffect(() => {
    if (!hasAvailableStones('X') && !hasAvailableStones('O') && !winner) {
      setWinner('引き分け')
    }
  }, [stoneCounts, hasAvailableStones, winner])

  return { 
    board, 
    currentPlayer, 
    selectedStone, 
    setSelectedStone, 
    placeStone, 
    stoneCounts,
    hasAvailableStones,
    winner
  }
}

