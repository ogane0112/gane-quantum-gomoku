'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const [joining, setJoining] = useState(false)
  const router = useRouter()

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoining(true)

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !data) {
      console.error('Error joining room:', error)
      setJoining(false)
      return
    }

    if (data.status !== 'waiting') {
      alert('この部屋は満員か、既にゲームが始まっています。')
      setJoining(false)
      return
    }

    await supabase
      .from('games')
      .update({ status: 'playing' })
      .eq('id', roomId)

    router.push(`/online/game/${roomId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">部屋に入室</h1>
      <form onSubmit={joinRoom} className="flex flex-col items-center">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="部屋IDを入力"
          className="mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          disabled={joining || !roomId}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {joining ? '入室中...' : '入室'}
        </button>
      </form>
    </div>
  )
}

