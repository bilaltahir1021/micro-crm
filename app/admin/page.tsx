'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

export default function AdminPanel() {
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  
  // Form State
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newImg, setNewImg] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchEverything()
  }, [])

  async function fetchEverything() {
    const { data: bookings } = await supabase.from('bookings').select('*, packages(title)')
    const { data: pkgs } = await supabase.from('packages').select('*')
    if (bookings) setAllBookings(bookings)
    if (pkgs) setPackages(pkgs)
  }

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Log what we are sending
    console.log("Publishing:", { newTitle, newPrice, newImg });
  
    const { error } = await supabase
      .from('packages')
      .insert([{ 
        title: newTitle, 
        price_usd: parseFloat(newPrice), 
        image_url: newImg 
      }]);
  
    if (error) {
      // 2. Alert the specific error
      console.error("Supabase Error:", error);
      alert("Publish Failed: " + error.message);
    } else {
      // 3. Success!
      alert("Success! " + newTitle + " is now live.");
      setNewTitle(''); setNewPrice(''); setNewImg('');
      setShowForm(false);
      fetchEverything(); // Refresh the list
    }
  };

  const handleDeletePackage = async (id: string) => {
    if(confirm("Are you sure? This will remove the package from the store.")){
      const { error } = await supabase.from('packages').delete().eq('id', id)
      if (!error) fetchEverything()
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-10 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-emerald-500">AB CONTROL ROOM</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 px-6 py-2 rounded-xl font-bold">
            {showForm ? 'Close' : '+ New Package'}
          </button>
        </header>

        {showForm && (
          <form onSubmit={handleAddPackage} className="mb-10 p-8 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Title" className="bg-slate-800 p-4 rounded-xl" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} required />
            <input placeholder="Price" type="number" className="bg-slate-800 p-4 rounded-xl" value={newPrice} onChange={(e)=>setNewPrice(e.target.value)} required />
            <input placeholder="Image URL (Unsplash Link)" className="bg-slate-800 p-4 rounded-xl" value={newImg} onChange={(e)=>setNewImg(e.target.value)} />
            <button className="md:col-span-3 bg-white text-black py-4 rounded-xl font-black hover:bg-emerald-400 transition">PUBLISH SERVICE</button>
          </form>
        )}

        {/* INVENTORY LIST */}
        <h2 className="text-xl font-bold mb-4 text-slate-400 uppercase tracking-widest">Active Inventory</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {packages.map(p => (
            <div key={p.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="text-emerald-500 font-mono">${p.price_usd}</p>
              </div>
              <button onClick={() => handleDeletePackage(p.id)} className="text-red-500 text-xs font-bold hover:bg-red-500/10 p-2 rounded-lg transition">DELETE</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}