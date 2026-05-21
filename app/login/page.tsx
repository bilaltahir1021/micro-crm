'use client'
import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true)
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else {
      alert(type === 'login' ? "Logged in!" : "Account created!")
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-2 text-center">AB CONVENIENCE</h2>
        <p className="text-slate-400 mb-8 text-center">Sign in to manage your bookings.</p>
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => handleAuth('login')}
            disabled={loading}
            className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-slate-200 transition disabled:opacity-50"
          >
            {loading ? '...' : 'Sign In'}
          </button>
          <button 
            onClick={() => handleAuth('signup')}
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-500 transition disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}