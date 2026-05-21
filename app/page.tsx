'use client'
import { useEffect, useState } from 'react'
import { createClient } from './utils/supabase/client'
import Link from 'next/link'

export default function Home() {
  const [packages, setPackages] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getData() {
      // 1. Fetch Packages
      const { data: pkgData } = await supabase.from('packages').select('*')
      if (pkgData) setPackages(pkgData)
      
      // 2. Fetch User Session
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleBook = async (packageId: string) => {
    if (!user) {
      alert("Please sign in to book a package!")
      return
    }

    const { error } = await supabase
      .from('bookings')
      .insert([{ 
        user_id: user.id, 
        package_id: packageId, 
        status: 'pending' 
      }])

    if (error) {
      alert("Booking failed: " + error.message)
    } else {
      alert("Success! Your booking request has been sent to AB Convenience.")
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-800 p-6 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-emerald-500 tracking-tighter">
            AB CONVENIENCE
          </h1>
          
          <div className="flex items-center space-x-6">
            {user ? (
              /* CLEAN VERSION: One set of buttons for logged-in users */
              <div className="flex items-center space-x-5">
                <Link 
                  href="/dashboard" 
                  className="text-emerald-400 text-sm font-bold hover:text-emerald-300 transition border-b-2 border-emerald-500/30 pb-1"
                >
                  My Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-xs font-bold bg-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-red-900/30 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Button for logged-out users */
              <Link href="/login">
                <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-6xl font-black tracking-tight leading-tight">
          Reliable. Fast. <br />
          <span className="text-emerald-500 text-5xl">AB Convenience.</span>
        </h2>
        <p className="text-slate-400 mt-6 text-xl max-w-2xl mx-auto font-medium">
          Premium pilgrimage and travel solutions for the modern traveler.
        </p>
      </section>

      {/* --- PACKAGES GRID --- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h3 className="text-2xl font-bold mb-10 border-l-4 border-emerald-500 pl-4">Available Packages</h3>
        <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
  <div key={pkg.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all group">
    
    {/* NEW IMAGE HEADER */}
    <div className="h-44 w-full bg-slate-800 overflow-hidden relative">
      {pkg.image_url ? (
        <img 
          src={pkg.image_url} 
          alt={pkg.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Premium Service</span>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <span className="bg-emerald-500 text-[10px] font-black px-2 py-1 rounded text-white uppercase">Featured</span>
      </div>
    </div>

    {/* CONTENT */}
    <div className="p-8">
      <h4 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{pkg.title}</h4>
      <p className="text-3xl font-black mt-2 text-white">${pkg.price_usd}</p>
      <button 
        onClick={() => handleBook(pkg.id)}
        className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20"
      >
        Book Now
      </button>
    </div>
  </div>
))}
          {packages.length === 0 && (
            <p className="col-span-full text-center text-slate-500 italic">No packages available right now.</p>
          )}
        </div>
      </section>
    </main>
  )
}