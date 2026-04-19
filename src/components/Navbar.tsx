import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OrderModal from './OrderModal';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const toggleLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all h-20 flex items-center">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#853114]">
            {i18n.language === 'ar' ? 'هنا اليمن' : 'Hana Al-Yemen'}
          </Link>

          {/* Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-[#853114] font-medium transition-colors">{t('nav.home')}</Link>
            <Link to="/menu" className="text-gray-700 hover:text-[#853114] font-medium transition-colors">{t('nav.menu')}</Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <select 
              value={i18n.language} 
              dir="ltr"
              onChange={toggleLanguage}
              className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#853114] cursor-pointer"
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="nl">NL</option>
            </select>

            <button 
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-[#853114] hover:bg-[#6c2810] text-white px-4 md:px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">{t('order.pickup_btn')}</span>
            </button>
          </div>
        </div>
      </nav>

      {isOrderModalOpen && (
        <OrderModal onClose={() => setIsOrderModalOpen(false)} />
      )}
    </>
  );
}
