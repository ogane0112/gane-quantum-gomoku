'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function CreateRoom() {
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  const createRoom = async () => {
    setCreating(true)
    const { data, error } = await supabase
      .from('games')
      .insert({ status: 'waiting' })
      .select()

    if (error) {
      console.error('Error creating room:', error)
      setCreating(false)
      return
    }

    if (data && data[0]) {
      router.push(`/online/game/${data[0].id}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">部屋を作成</h1>
      <button
        onClick={createRoom}
        disabled={creating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {creating ? '作成中...' : '部屋を作成'}
      </button>
    </div>
  )
}

