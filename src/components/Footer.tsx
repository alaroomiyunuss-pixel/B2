import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t, i18n } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto text-sm md:text-base">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-start" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <div>
             <h3 className="text-2xl font-bold text-[#853114] mb-4">هنا اليمن</h3>
             <p className="text-gray-500 mb-2">{t('footer.location')}</p>
             <p className="text-gray-500">{t('footer.call')}: +31638775118</p>
          </div>
          <div className="md:text-end rtl:md:text-start">
             <div className="flex flex-col gap-2">
                <Link to="/" className="text-gray-600 hover:text-[#853114] inline-block">{t('nav.home')}</Link>
                <Link to="/menu" className="text-gray-600 hover:text-[#853114] inline-block">{t('nav.menu')}</Link>
             </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-100 text-gray-400">
           {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
