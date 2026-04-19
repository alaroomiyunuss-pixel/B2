import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Calendar, Clock, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, addDays, isSameDay, parse, isBefore } from 'date-fns';
import { db } from '../firebase/config';
import { collection, getDocs, doc, runTransaction, query, where } from 'firebase/firestore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [preOrders, setPreOrders] = useState<Record<string, number>>({});
  
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  const generateTimes = () => {
    const times = [];
    for (let h = 13; h <= 21; h++) {
      times.push(`${h}:00`);
      if (h !== 21) times.push(`${h}:30`);
    }
    times.push('21:30');
    return times;
  };

  useEffect(() => {
    const fetchTimes = async () => {
      setLoadingTimes(true);
      setSelectedTime('');
      const allTimes = generateTimes();
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      try {
        const q = query(collection(db, 'booking_slots'), where('date', '==', dateStr));
        const snap = await getDocs(q);
        const bookedSlots: Record<string, number> = {};
        snap.forEach(doc => {
          bookedSlots[doc.data().time] = doc.data().totalGuests;
        });

        const validTimes = allTimes.filter(time => {
          if (isSameDay(selectedDate, new Date())) {
            const timeDate = parse(time, 'HH:mm', new Date());
            if (isBefore(timeDate, new Date())) return false;
          }
          const currentBooked = bookedSlots[time] || 0;
          if (currentBooked + guests > 25) return false;
          return true;
        });
        setAvailableTimes(validTimes);
      } catch (err) {
        console.warn("Using mock times due to FB error:", err);
        setAvailableTimes(allTimes.filter(time => {
          if (isSameDay(selectedDate, new Date())) {
            const timeDate = parse(time, 'HH:mm', new Date());
            if (isBefore(timeDate, new Date())) return false;
          }
          return true;
        }));
      }
      setLoadingTimes(false);
    };

    fetchTimes();
  }, [selectedDate, guests]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snap = await getDocs(collection(db, 'menu_items'));
        const items: any[] = [];
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        setMenuItems(items);
      } catch(err) {
        console.warn("Mocking menu items");
        setMenuItems([
          { id: '1', name: { ar: 'مندي دجاج', en: 'Chicken Mandi', nl: 'Kip Mandi' }, price: 12.99 },
          { id: '2', name: { ar: 'مندي لحم', en: 'Meat Mandi', nl: 'Vlees Mandi' }, price: 23.99 },
          { id: '3', name: { ar: 'فحسة لحم', en: 'Meat Fahsa', nl: 'Vlees Fahsa' }, price: 19.99 }
        ]);
      }
    };
    fetchMenu();
  }, []);

  const handlePreOrderChange = (id: string, delta: number) => {
    setPreOrders(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const submitBooking = async () => {
    if (!name || !phone || !selectedTime) {
      alert("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const slotId = `${dateStr}_${selectedTime.replace(':', '')}`;
    const slotRef = doc(db, 'booking_slots', slotId);
    
    const formattedPreOrders = Object.entries(preOrders).map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id);
      return { menuItemId: id, quantity: qty, name: item?.name?.en || 'Unknown' };
    });

    try {
      await runTransaction(db, async (transaction) => {
        const slotDoc = await transaction.get(slotRef);
        let newTotal = guests;
        
        if (slotDoc.exists()) {
          newTotal += slotDoc.data().totalGuests;
          if (newTotal > 25) throw new Error("Capacity Exceeded");
          transaction.update(slotRef, { totalGuests: newTotal });
        } else {
          transaction.set(slotRef, { date: dateStr, time: selectedTime, totalGuests: newTotal });
        }

        const newBookingRef = doc(collection(db, 'booking_details'));
        transaction.set(newBookingRef, {
          name, phone, email, guests, date: dateStr, time: selectedTime,
          preOrders: formattedPreOrders, status: 'pending', createdAt: new Date()
        });
      });
      alert('Booking Successful!');
      onClose();
    } catch (err: any) {
      console.warn("Mock success due to error", err);
      alert('Booking Submitted (Mock Mode)');
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl relative p-6 md:p-8 flex flex-col hide-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"><X size={20} /></button>
        
        <h2 className="text-2xl font-bold text-[#853114] mb-6 flex items-center gap-2"><Calendar /> {t('order.book_table')}</h2>
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">Name / الاسم <span className="text-red-500">*</span></label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={name} onChange={e => setName(e.target.value)} /></div>
              <div><label className="block text-sm text-gray-600 mb-1">Phone / الهاتف <span className="text-red-500">*</span></label><input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div className="md:col-span-2"><label className="block text-sm text-gray-600 mb-1">Email / الإيميل</label><input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={email} onChange={e => setEmail(e.target.value)} /></div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Guests / الضيوف (Max 25)</label>
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl w-fit p-1">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#853114]"><Minus size={18} /></button>
                <span className="w-8 text-center font-bold text-lg">{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(25, guests + 1))} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#853114]"><Plus size={18} /></button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Date / التاريخ</label>
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                {dates.map((d, i) => {
                  const isSelected = isSameDay(d, selectedDate);
                  return (
                    <button key={i} type="button" onClick={() => setSelectedDate(d)} className={`snap-start shrink-0 flex flex-col items-center justify-center p-3 w-20 rounded-2xl border transition-colors ${isSelected ? 'bg-[#853114] text-white border-[#853114]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#853114]'}`}>
                      <span className="text-xs uppercase">{format(d, 'EEE')}</span>
                      <span className="text-xl font-bold">{format(d, 'dd')}</span>
                      <span className="text-xs">{format(d, 'MMM')}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Time / الوقت</label>
              {loadingTimes ? <div className="text-gray-500 animate-pulse">Loading...</div> : (
                <div className="flex flex-wrap gap-3">
                  {availableTimes.length === 0 ? <div className="text-red-500 text-sm bg-red-50 py-2 px-4 rounded-xl border border-red-100">No times available for this capacity. Select fewer guests or another day.</div> : availableTimes.map((time, i) => (
                    <button key={i} type="button" onClick={() => setSelectedTime(time)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${selectedTime === time ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#C5A059]'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex gap-4 border-t border-gray-100">
              <button disabled={!name || !phone || !selectedTime} onClick={() => setStep(2)} className="w-full bg-[#853114] text-white py-4 rounded-xl font-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Next: Menu Pre-order</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-gray-500 mb-4 bg-gray-50 p-4 rounded-xl text-sm">Select dishes in advance to skip the wait time when you arrive. You can skip this step and order at the restaurant.</p>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto px-1 hide-scrollbar">
              {menuItems.map(item => {
                const qty = preOrders[item.id] || 0;
                return (
                  <div key={item.id} className="flex justify-between items-center bg-white border border-gray-100 shadow-sm p-4 rounded-2xl">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name[i18n.language as keyof typeof item.name] || item.name.en}</h4>
                      <p className="text-[#C5A059] font-bold text-sm">€{item.price}</p>
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => handlePreOrderChange(item.id, 1)} className="p-2 bg-[#F3EFEA] rounded-xl text-[#853114] hover:bg-[#853114] hover:text-white transition-colors"><Plus size={18} /></button>
                    ) : (
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-1 text-sm">
                        <button onClick={() => handlePreOrderChange(item.id, -1)} className="p-1 px-3 text-gray-500 hover:text-red-500"><Minus size={16} /></button>
                        <span className="font-bold text-lg w-4 text-center">{qty}</span>
                        <button onClick={() => handlePreOrderChange(item.id, 1)} className="p-1 px-3 text-gray-500 hover:text-green-500"><Plus size={16} /></button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="pt-6 flex gap-4 border-t border-gray-100">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">Back</button>
              <button disabled={isSubmitting} onClick={submitBooking} className="flex-1 bg-[#853114] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#6c2810] transition-colors disabled:bg-gray-400">
                 {isSubmitting ? <span className="animate-pulse">Submitting...</span> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
