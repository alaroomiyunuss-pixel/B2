import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings'|'menu'|'gallery'|'blogs'|'reviews'|'settings'>('bookings');
  
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [bookings, setBookings] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState('');

  // Form States
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newBlog, setNewBlog] = useState({ titleAr:'', titleEn:'', exAr:'', exEn:'', img:'', date:'' });
  const [newReview, setNewReview] = useState({ name:'', rating:5, comment:'' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if(u) {
        fetchAllData();
      }
    });
    return () => unsub();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch Bookings
      const bSnap = await getDocs(collection(db, 'booking_details'));
      setBookings(bSnap.docs.map(d => ({id: d.id, ...d.data()})));
      // Fetch Menu
      const mSnap = await getDocs(collection(db, 'menu_items'));
      setMenuItems(mSnap.docs.map(d => ({id: d.id, ...d.data()})));
      // Fetch Gallery
      const gSnap = await getDocs(collection(db, 'gallery_images'));
      setGalleryImages(gSnap.docs.map(d => ({id: d.id, ...d.data()})));
      // Fetch Blogs
      const blSnap = await getDocs(collection(db, 'blogs'));
      setBlogs(blSnap.docs.map(d => ({id: d.id, ...d.data()})));
      // Fetch Reviews
      const rSnap = await getDocs(collection(db, 'reviews'));
      setReviews(rSnap.docs.map(d => ({id: d.id, ...d.data()})));
      // Fetch Settings
      const sDoc = await getDoc(doc(db, 'site_settings', 'general'));
      if(sDoc.exists()) setPdfUrl(sDoc.data().menuPdfUrl || '');
    } catch(err) { console.error("Data fetch error", err); }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } catch(err) { alert("Login failed."); }
  };

  // Status updates
  const updateBookingStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'booking_details', id), { status });
    fetchAllData();
  };

  // Add Actions
  const addGalleryImage = async () => {
    if(!newItemUrl) return;
    await addDoc(collection(db, 'gallery_images'), { url: newItemUrl });
    setNewItemUrl(''); fetchAllData();
  };
  const deleteGalleryImage = async (id:string) => {
    await deleteDoc(doc(db, 'gallery_images', id)); fetchAllData();
  };

  const savePdfUrl = async () => {
    await setDoc(doc(db, 'site_settings', 'general'), { menuPdfUrl: pdfUrl }, { merge: true });
    alert("PDF URL Saved!");
  };

  const addBlog = async () => {
    await addDoc(collection(db, 'blogs'), {
      title: { ar: newBlog.titleAr, en: newBlog.titleEn },
      excerpt: { ar: newBlog.exAr, en: newBlog.exEn },
      imageUrl: newBlog.img,
      date: newBlog.date || new Date().toISOString().split('T')[0]
    });
    setNewBlog({titleAr:'',titleEn:'',exAr:'',exEn:'',img:'',date:''});
    fetchAllData();
  };

  const addReview = async () => {
    await addDoc(collection(db, 'reviews'), { ...newReview });
    setNewReview({name:'', rating:5, comment:''});
    fetchAllData();
  };

  const tabs = ['bookings', 'menu', 'gallery', 'blogs', 'reviews', 'settings'];

  if(loading) return <div className="pt-32 text-center text-gray-500">Loading...</div>;

  if(!user) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100">
           <h2 className="text-2xl font-bold text-[#853114] mb-6">CMS Dashboard Login</h2>
           <button onClick={handleLogin} className="bg-[#853114] text-white px-8 py-3 rounded-xl font-bold">Sign In using Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20" dir="ltr">
      <div className="container mx-auto px-4">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">CMS Control Panel</h1>
             <p className="text-sm text-gray-500">Logged in as {user.email}</p>
           </div>
           <button onClick={() => signOut(auth)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">Logout</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           {tabs.map(t => (
             <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 rounded-xl font-bold capitalize transition-colors ${activeTab === t ? 'bg-[#853114] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
               {t}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-x-auto min-h-[400px]">
          
          {activeTab === 'bookings' && (
             <div>
               <h2 className="text-xl font-bold mb-6">Bookings Manager</h2>
               <table className="w-full text-left">
                  <thead><tr className="border-b text-gray-500"><th className="pb-3">Name</th><th className="pb-3">Contact</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b last:border-0"><td className="py-3 font-bold">{b.name}</td><td className="py-3">{b.phone}</td><td className="py-3">{b.date} {b.time}</td>
                      <td className="py-3"><span className="px-2 bg-gray-100 rounded text-xs">{b.status}</span></td>
                      <td className="py-3">
                        {b.status === 'pending' && (
                          <div className="flex gap-2">
                             <button onClick={()=>updateBookingStatus(b.id, 'confirmed')} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Accept</button>
                             <button onClick={()=>updateBookingStatus(b.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Reject</button>
                          </div>
                        )}
                      </td></tr>
                    ))}
                  </tbody>
               </table>
             </div>
          )}

          {activeTab === 'menu' && (
             <div>
               <h2 className="text-xl font-bold mb-6">Menu Manager</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {menuItems.map(item => (
                   <div key={item.id} className="border border-gray-100 p-4 rounded-2xl flex gap-4 items-center">
                     <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                     <div>
                       <h4 className="font-bold whitespace-nowrap overflow-hidden text-ellipsis w-24">{item.name?.en || 'Dish'}</h4>
                       <p className="text-[#853114] text-sm">€{item.price}</p>
                     </div>
                   </div>
                 ))}
               </div>
               {menuItems.length === 0 && <p className="text-gray-500">No dishes found. Add them manually in Firestore.</p>}
             </div>
          )}

          {activeTab === 'gallery' && (
             <div>
               <h2 className="text-xl font-bold mb-6">Gallery Images</h2>
               <div className="flex gap-4 mb-8">
                 <input type="text" placeholder="Image URL (https://...)" value={newItemUrl} onChange={e=>setNewItemUrl(e.target.value)} className="border p-2 rounded-xl flex-1 focus:outline-none focus:border-[#853114]" />
                 <button onClick={addGalleryImage} className="bg-[#853114] text-white px-6 py-2 rounded-xl font-bold">Add Image</button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {galleryImages.map(img => (
                   <div key={img.id} className="relative group">
                     <img src={img.url} className="w-full h-32 object-cover rounded-xl" />
                     <button onClick={() => deleteGalleryImage(img.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 text-xs">Delete</button>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'blogs' && (
             <div>
               <h2 className="text-xl font-bold mb-6">Manage Blogs</h2>
               <div className="bg-gray-50 p-4 rounded-2xl mb-8 grid grid-cols-2 gap-4">
                  <input placeholder="Title (EN)" value={newBlog.titleEn} onChange={e=>setNewBlog(prev=>({...prev, titleEn: e.target.value}))} className="border p-2 rounded-xl" />
                  <input placeholder="Title (AR)" value={newBlog.titleAr} onChange={e=>setNewBlog(prev=>({...prev, titleAr: e.target.value}))} className="border p-2 rounded-xl" dir="rtl" />
                  <input placeholder="Excerpt (EN)" value={newBlog.exEn} onChange={e=>setNewBlog(prev=>({...prev, exEn: e.target.value}))} className="border p-2 rounded-xl" />
                  <input placeholder="Excerpt (AR)" value={newBlog.exAr} onChange={e=>setNewBlog(prev=>({...prev, exAr: e.target.value}))} className="border p-2 rounded-xl" dir="rtl" />
                  <input placeholder="Image URL" value={newBlog.img} onChange={e=>setNewBlog(prev=>({...prev, img: e.target.value}))} className="border p-2 rounded-xl" />
                  <input type="date" value={newBlog.date} onChange={e=>setNewBlog(prev=>({...prev, date: e.target.value}))} className="border p-2 rounded-xl" />
                  <button onClick={addBlog} className="col-span-2 bg-[#853114] text-white py-2 rounded-xl font-bold">Publish Blog</button>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {blogs.map(b => (
                   <div key={b.id} className="flex gap-4 items-center border p-4 rounded-xl">
                      <img src={b.imageUrl} className="w-16 h-16 object-cover rounded" />
                      <div><p className="font-bold">{b.title.en}</p><p className="text-sm text-gray-500">{b.date}</p></div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'reviews' && (
             <div>
               <h2 className="text-xl font-bold mb-6">Manage Reviews</h2>
               <div className="flex gap-4 mb-8">
                 <input placeholder="Customer Name" value={newReview.name} onChange={e=>setNewReview(prev=>({...prev, name: e.target.value}))} className="border p-2 rounded-xl" />
                 <input type="number" min="1" max="5" placeholder="Rating" value={newReview.rating} onChange={e=>setNewReview(prev=>({...prev, rating: Number(e.target.value)}))} className="border p-2 rounded-xl w-24" />
                 <input placeholder="Comment" value={newReview.comment} onChange={e=>setNewReview(prev=>({...prev, comment: e.target.value}))} className="border p-2 rounded-xl flex-1" />
                 <button onClick={addReview} className="bg-[#853114] text-white px-6 rounded-xl font-bold">Add</button>
               </div>
               <div className="space-y-4">
                 {reviews.map(r => (
                   <div key={r.id} className="border p-4 rounded-xl">
                      <div className="font-bold flex justify-between">{r.name} <span>{"⭐".repeat(r.rating)}</span></div>
                      <p className="text-gray-600 mt-2">{r.comment}</p>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="max-w-lg">
               <h2 className="text-xl font-bold mb-6">Global Settings</h2>
               <div className="mb-6">
                 <label className="block text-sm text-gray-600 mb-2">Menu PDF URL</label>
                 <div className="flex gap-4">
                   <input value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} placeholder="https://..." className="flex-1 border p-3 rounded-xl focus:outline-none focus:border-[#853114]" />
                   <button onClick={savePdfUrl} className="bg-black text-white px-6 rounded-xl font-bold">Save</button>
                 </div>
                 <p className="text-xs text-gray-400 mt-2">Upload your PDF to Firebase Storage manually or use any direct link like Google Drive / Dropbox, then paste the URL here. The site will instantly update.</p>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
