import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import OrderOptions from '../components/OrderOptions';
import BookingModal from '../components/BookingModal';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import LatestBlogs from '../components/LatestBlogs';
import MenuPdfButton from '../components/MenuPdfButton';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  return (
    <>
      <section className="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop" alt="Yemeni Food" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16 flex-1 flex flex-col justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
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
            className="text-xl md:text-3xl font-medium text-gray-200 mb-12"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <MenuPdfButton />
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 -mt-20 px-4 mb-20">
         <OrderOptions onOpenBooking={() => setIsBookingOpen(true)} />
      </section>

      <Gallery />
      <Testimonials />
      <LatestBlogs />

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
