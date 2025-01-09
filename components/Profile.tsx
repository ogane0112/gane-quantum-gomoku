'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export function Profile({ user }: { user: User }) {
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error) throw error
      if (data) setUsername(data.username)
    } catch (error) {
      console.error('Error loading user data!', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
    } catch (error) {
      console.error('Error updating user data!', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">プロフィール</h2>
      <input
        type="text"
        value={username || ''}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザー名"
        className="mb-2 px-4 py-2 border border-gray-300 rounded"
      />
      <button
        onClick={updateProfile}
        disabled={loading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'プロフィールを更新'}
      </button>
    </div>
  )
}

