import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import OrderOptions from '../components/OrderOptions';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  return (
    <>
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop" alt="Yemeni Food" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16" dir={isRtl ? 'rtl' : 'ltr'}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl font-medium text-gray-200"
          >
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="relative z-20 -mt-20 px-4 mb-20">
         <OrderOptions onOpenBooking={() => setIsBookingOpen(true)} />
      </section>

      <section className="py-20 bg-gray-50 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: isRtl ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold text-[#853114] mb-6">{t('about.story')}</h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">{t('about.desc')}</p>
              
              <div className="flex gap-4">
                 <span className="px-6 py-2 bg-[#F3EFEA] text-[#853114] font-bold rounded-full text-sm md:text-base">{t('about.halal')}</span>
                 <span className="px-6 py-2 bg-[#F3EFEA] text-[#853114] font-bold rounded-full text-sm md:text-base">{t('about.fresh')}</span>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop" alt="Traditional Yemeni Dish" className="rounded-3xl shadow-2xl object-cover h-[400px] md:h-[500px] w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
