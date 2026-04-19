import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db, isMock } from '../firebase/config';

export default function Gallery() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        if(isMock) throw new Error("Mock");
        const snap = await getDocs(collection(db, 'gallery_images'));
        const imgs: string[] = [];
        snap.forEach(d => imgs.push(d.data().url));
        if(imgs.length < 4) throw new Error("Mock");
        setImages(imgs);
      } catch(err) {
        setImages([
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
          "https://images.unsplash.com/photo-1547592180-85f173990554",
          "https://images.unsplash.com/photo-1588168333986-5078d3ae3976",
          "https://images.unsplash.com/photo-1633504581786-316c8002b1b9"
        ]);
      }
    };
    fetchGallery();
  }, []);

  const titles = {
    ar: "معرض الصور",
    en: "Our Gallery",
    nl: "Onze Galerij"
  };

  if (images.length < 4) return null;

  return (
    <section className="py-20 bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold text-[#853114] mb-12 text-center">
          {titles[i18n.language as keyof typeof titles] || titles.en}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[600px]">
          <motion.div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-sm h-64 md:h-auto" whileHover={{ scale: 1.01 }}>
             <img src={`${images[0]}?q=80&w=1000&auto=format&fit=crop`} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div className="rounded-3xl overflow-hidden shadow-sm h-48 md:h-auto" whileHover={{ scale: 1.02 }}>
             <img src={`${images[1]}?q=80&w=500&auto=format&fit=crop`} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div className="rounded-3xl overflow-hidden shadow-sm h-48 md:h-auto" whileHover={{ scale: 1.02 }}>
             <img src={`${images[2]}?q=80&w=500&auto=format&fit=crop`} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div className="md:col-span-2 rounded-3xl overflow-hidden shadow-sm h-48 md:h-auto" whileHover={{ scale: 1.01 }}>
             <img src={`${images[3]}?q=80&w=1000&auto=format&fit=crop`} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
