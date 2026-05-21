'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../utils/supabase/client'

export default function CheckoutPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // NEW: Card Details State
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getBooking() {
      const { data } = await supabase.from('bookings').select('*, packages(title, price_usd)').eq('id', id).single()
      setBooking(data)
    }
    getBooking()
  }, [id])

  const handleFakePayment = async (e: React.FormEvent) => {
    e.preventDefault() // Stop page refresh
    
    if (cardNumber.length < 16) {
        alert("Please enter a valid card number")
        return
    }

    setLoading(true)
    const { error } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'PAID',
        transaction_id: 'AB-' + Math.random().toString(36).toUpperCase().substring(2, 10)
      })
      .eq('id', id)

    if (!error) {
      setShowSuccess(true)
    }
    setLoading(false)
  }

  if (!booking) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black">SYNCING GATEWAY...</div>

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative font-sans">
      
      {/* SUCCESS MODAL (STAYS THE SAME) */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-slate-900 border border-emerald-500/20 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-3xl font-black mb-2 uppercase">Payment Received</h3>
            <p className="text-slate-400 mb-8 text-sm">Your Hajj/Umrah seat is now locked. Check your dashboard for the Receipt ID.</p>
            <button onClick={() => router.push('/dashboard')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Return to Dashboard</button>
          </div>
        </div>
      )}

      <div className={`max-w-xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 transition-all ${showSuccess ? 'opacity-0 scale-95' : ''}`}>
        
        {/* LEFT SIDE: SUMMARY */}
        <div className="space-y-6">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Secure<br/>Check-out</h1>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Selected Package</p>
                <p className="text-xl font-bold mb-1">{booking.packages.title}</p>
                <p className="text-emerald-500 font-black text-2xl">${booking.packages.price_usd}</p>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold px-2">
                All transactions are encrypted with 256-bit SSL security. Authorized by AB Convenience Group.
            </div>
        </div>

        {/* RIGHT SIDE: PAYMENT FORM */}
        <form onSubmit={handleFakePayment} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-4">
            <div>
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Cardholder Name</label>
                <input 
                    required placeholder="Bilal Tahir" 
                    className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    value={cardName} onChange={(e) => setCardName(e.target.value)}
                />
            </div>

            <div>
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Card Number</label>
                <input 
                    required placeholder="0000 0000 0000 0000" 
                    maxLength={16}
                    className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-mono"
                    value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Expiry</label>
                    <input 
                        required placeholder="MM/YY" 
                        className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        value={expiry} onChange={(e) => setExpiry(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">CVV</label>
                    <input 
                        required placeholder="***" 
                        maxLength={3}
                        className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        value={cvv} onChange={(e) => setCvv(e.target.value)}
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-xl shadow-emerald-900/20"
            >
                {loading ? 'Authorizing...' : 'Confirm & Pay'}
            </button>
        </form>

      </div>
    </main>
  )
}