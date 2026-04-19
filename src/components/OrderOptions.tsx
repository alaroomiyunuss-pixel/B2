import React from 'react';
import { Utensils, ShoppingBag, Truck, Calendar, MessageCircle, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface OrderOptionsProps {
  onOpenBooking: () => void;
  onCloseModal?: () => void;
}

export default function OrderOptions({ onOpenBooking, onCloseModal }: OrderOptionsProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Card 1: Booking */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
        <div className="w-16 h-16 bg-[#F3EFEA] rounded-2xl flex items-center justify-center text-[#853114] mb-6">
          <Utensils size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('order.book_table')}</h3>
        <p className="text-gray-500 mb-8 flex-grow">{t('order.book_desc')}</p>
        <div className="w-full space-y-3">
          <button onClick={onOpenBooking} className="w-full bg-[#853114] hover:bg-[#6c2810] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
            <Calendar size={20} /> {t('order.book_btn')}
          </button>
          <div className="flex gap-3">
            <a href="https://wa.me/31612345678" target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 border border-gray-100 hover:bg-green-50 transition-colors">
              <MessageCircle size={18} className="text-green-500" /> {t('order.whatsapp')}
            </a>
            <a href="tel:+31612345678" className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 border border-gray-100 hover:bg-blue-50 transition-colors">
              <Phone size={18} className="text-blue-500" /> {t('order.call')}
            </a>
          </div>
        </div>
      </div>

      {/* Card 2: Pickup */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
        <div className="w-16 h-16 bg-[#F3EFEA] rounded-2xl flex items-center justify-center text-[#853114] mb-6">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('order.pickup')}</h3>
        <p className="text-gray-500 mb-8 flex-grow">{t('order.pickup_desc')}</p>
        <div className="w-full space-y-3">
          <Link to="/menu" onClick={onCloseModal} className="w-full bg-[#853114] hover:bg-[#6c2810] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
            <Globe size={20} /> {t('order.pickup_btn')}
          </Link>
          <div className="flex gap-3">
            <a href="https://wa.me/31612345678" target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 border border-gray-100 hover:bg-green-50 transition-colors">
              <MessageCircle size={18} className="text-green-500" /> {t('order.whatsapp')}
            </a>
            <a href="tel:+31612345678" className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 border border-gray-100 hover:bg-blue-50 transition-colors">
              <Phone size={18} className="text-blue-500" /> {t('order.call')}
            </a>
          </div>
        </div>
      </div>

      {/* Card 3: Delivery */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
        <div className="w-16 h-16 bg-[#F3EFEA] rounded-2xl flex items-center justify-center text-[#853114] mb-6">
          <Truck size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('order.delivery')}</h3>
        <p className="text-gray-500 mb-8 flex-grow">{t('order.delivery_desc')}</p>
        <div className="w-full space-y-3">
          <button className="w-full bg-[#FF8000] hover:bg-[#e67300] text-white py-3 rounded-xl font-bold transition-colors text-center">{t('order.delivery_thuisbezorgd')}</button>
          <button className="relative w-full bg-gray-50 text-gray-400 py-3 rounded-xl font-bold flex justify-center items-center gap-2 cursor-not-allowed border border-gray-200">
            <span className="text-xl tracking-tighter font-black">Uber <span className="font-normal">Eats</span></span>
            <span className="absolute left-4 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md">{t('order.soon')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
