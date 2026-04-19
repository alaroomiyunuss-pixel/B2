import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Utensils, ShoppingBag } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snap = await getDocs(collection(db, 'menu_items'));
        const fetchedItems: any[] = [];
        snap.forEach(doc => fetchedItems.push({ id: doc.id, ...doc.data() }));
        if(fetchedItems.length === 0) throw new Error("empty");
        setItems(fetchedItems);
      } catch(err) {
        console.warn("Using mock menu");
        setItems([
          { id: '1', name: { ar: 'مندي دجاج', en: 'Chicken Mandi', nl: 'Kip Mandi' }, desc: { ar: 'دجاج محمر مع أرز مندي', en: 'Roasted chicken with mandi rice', nl: 'Geroosterde kip met mandi rijst' }, price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=800&auto=format&fit=crop' },
          { id: '2', name: { ar: 'مندي لحم', en: 'Meat Mandi', nl: 'Vlees Mandi' }, desc: { ar: 'لحم طازج مع الرز', en: 'Fresh meat with rice', nl: 'Vers vlees met rijst' }, price: 23.99, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop' },
          { id: '3', name: { ar: 'عقدة دجاج', en: 'Chicken Oqdah', nl: 'Kip Oqdah' }, desc: { ar: 'دجاج مطهو مع الخضار', en: 'Chicken cooked with vegetables', nl: 'Kip gekookt met groenten' }, price: 17.99, imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b281f6?q=80&w=800&auto=format&fit=crop' },
          { id: '4', name: { ar: 'فحسة لحم', en: 'Meat Fahsa', nl: 'Vlees Fahsa' }, desc: { ar: 'لحم مطهو ببطء', en: 'Slow cooked meat in clay pot', nl: 'Langzaam gegaard vlees in aarden pot' }, price: 19.99, imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop' },
        ]);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold text-[#853114] mb-12 text-center">{t('nav.menu')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-60">
                <img src={item.imageUrl || 'https://via.placeholder.com/800x600'} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#853114] font-black px-4 py-2 rounded-2xl shadow-sm text-lg">
                  €{item.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.name[i18n.language as keyof typeof item.name] || item.name.en}
                </h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">
                  {item.desc ? (item.desc[i18n.language as keyof typeof item.desc] || item.desc.en) : ''}
                </p>
                
                <div className="flex gap-4 border-t border-gray-100 pt-6">
                  <button onClick={() => setIsBookingOpen(true)} title={t('order.book_table')} className="flex-1 flex justify-center items-center py-3 bg-[#F3EFEA] text-[#853114] rounded-2xl hover:bg-[#853114] hover:text-white transition-colors">
                    <Utensils size={20} />
                  </button>
                  <a href="#" className="flex-1 flex justify-center items-center py-3 bg-[#FF8000] text-white rounded-2xl hover:bg-[#e67300] transition-colors" title="Thuisbezorgd">
                    <ShoppingBag size={20} />
                  </a>
                  <button disabled className="flex-1 flex justify-center items-center py-3 bg-gray-100 text-gray-400 rounded-2xl cursor-not-allowed" title="UberEats (Soon)">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
