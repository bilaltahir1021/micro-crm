'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import Link from 'next/link'
import PipelineBoard from '@/components/PipelineBoard'

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getMyBookings() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            created_at,
            packages (
              title,
              price_usd
            )
          `)
          .eq('user_id', user.id)

        if (data) setBookings(data)
      }
      setLoading(false)
    }
    getMyBookings()
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <PipelineBoard />

      <section className="border-t border-white/[0.06] bg-[#0f172a] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <Link href="/" className="text-emerald-500 font-bold hover:underline">
              ← Back to Home
            </Link>
            <h2 className="text-3xl font-black">MY BOOKINGS</h2>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading your journeys...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-xl">{b.packages?.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                          b.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {b.status || 'UNPAID'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {b.status !== 'PAID' ? (
                      <Link href={`/pay/${b.id}`}>
                        <button className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black hover:bg-emerald-500 hover:text-white transition-all text-sm">
                          Pay Now
                        </button>
                      </Link>
                    ) : (
                      <p className="text-emerald-500 font-black text-sm">✓ Confirmed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
              <p className="text-slate-500">You haven&apos;t booked anything yet.</p>
              <Link href="/">
                <button className="mt-4 text-emerald-500 font-bold">Browse Packages</button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
