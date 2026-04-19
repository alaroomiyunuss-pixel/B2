import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'menu' | 'blogs'>('bookings');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if(u) {
        fetchBookings();
        fetchMenu();
      }
    });
    return () => unsub();
  }, []);

  const fetchBookings = async () => {
    try {
      const snap = await getDocs(collection(db, 'booking_details'));
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setBookings(arr.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch(err) { console.warn("Failed to fetch bookings", err); }
  };

  const fetchMenu = async () => {
    try {
      const snap = await getDocs(collection(db, 'menu_items'));
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setItems(arr);
    } catch(err) { console.warn("Failed to fetch menu", err); }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch(err) { console.error("Login failed", err); alert("Login failed. Check your Firebase Config."); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'booking_details', id), { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch(err) { alert("Failed to update status"); }
  };

  const loadDefaultDishes = async () => {
    const defaults = [
      { id: '1', name: { ar: 'مندي دجاج', en: 'Chicken Mandi', nl: 'Kip Mandi' }, desc: { ar: '', en: '', nl: '' }, price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=800' },
      { id: '2', name: { ar: 'مندي لحم', en: 'Meat Mandi', nl: 'Vlees Mandi' }, desc: { ar: '', en: '', nl: '' }, price: 23.99, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800' },
      { id: '3', name: { ar: 'عقدة دجاج', en: 'Chicken Oqdah', nl: 'Kip Oqdah' }, desc: { ar: '', en: '', nl: '' }, price: 17.99, imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b281f6?q=80&w=800' },
      { id: '4', name: { ar: 'فحسة لحم', en: 'Fahsa', nl: 'Fahsa' }, desc: { ar: '', en: '', nl: '' }, price: 19.99, imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800' },
    ];
    
    try {
      for(const item of defaults) {
        await setDoc(doc(db, 'menu_items', item.id), item);
      }
      alert('Default dishes loaded!');
      fetchMenu();
    } catch(err) {
      alert("Failed. Have you set up Firestore?");
    }
  };

  if(loading) return <div className="pt-32 text-center text-gray-500">Loading...</div>;

  if(!user) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100">
           <h2 className="text-2xl font-bold text-[#853114] mb-6">Admin Login</h2>
           <button onClick={handleLogin} className="bg-[#853114] text-white px-8 py-3 rounded-xl font-bold">Sign In with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20" dir="ltr">
      <div className="container mx-auto px-4">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
             <p className="text-sm text-gray-500">Logged in as {user.email}</p>
           </div>
           <button onClick={() => signOut(auth)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">Logout</button>
        </div>

        <div className="flex gap-4 mb-8">
           {['bookings', 'menu', 'blogs'].map(t => (
             <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-xl font-bold capitalize ${activeTab === t ? 'bg-[#853114] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
               {t}
             </button>
           ))}
        </div>

        {activeTab === 'bookings' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
             <h2 className="text-xl font-bold mb-6">All Bookings</h2>
             {bookings.length === 0 ? <p className="text-gray-500">No bookings found</p> : (
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b text-gray-500">
                     <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Contact</th><th className="pb-3 pr-4">Date/Time</th><th className="pb-3 pr-4">Guests</th><th className="pb-3 pr-4">Pre-orders</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {bookings.map(b => (
                     <tr key={b.id} className="border-b last:border-b-0">
                       <td className="py-4 pr-4 font-bold">{b.name}</td>
                       <td className="py-4 pr-4 text-sm">{b.phone}<br/>{b.email}</td>
                       <td className="py-4 pr-4">{b.date}<br/>{b.time}</td>
                       <td className="py-4 pr-4">{b.guests}</td>
                       <td className="py-4 pr-4 text-sm text-gray-500">
                         {b.preOrders?.map((po:any, i:number) => <div key={i}>{po.qty}x {po.name}</div>)}
                       </td>
                       <td className="py-4 pr-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {b.status}
                         </span>
                       </td>
                       <td className="py-4 flex gap-2">
                         {b.status === 'pending' && (
                           <>
                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="px-3 py-1 bg-green-500 text-white rounded text-sm mb-1">Accept</button>
                            <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                           </>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
        )}

        {activeTab === 'menu' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Menu Manager</h2>
                <button onClick={loadDefaultDishes} className="bg-[#853114] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">Load Default Dishes</button>
             </div>
             
             {items.length === 0 ? <p className="text-gray-500">No menu items found. Click load defaults.</p> : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {items.map(item => (
                   <div key={item.id} className="border border-gray-100 p-4 rounded-2xl flex gap-4 items-center">
                     <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                     <div>
                       <h4 className="font-bold">{item.name.en}</h4>
                       <p className="text-[#853114] text-sm">€{item.price}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        )}

        {activeTab === 'blogs' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-48 text-gray-500">
             Blog Management (Coming Soon)
           </div>
        )}
      </div>
    </div>
  );
}
