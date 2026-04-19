import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), limit(3));
        const snap = await getDocs(q);
        const fetched: any[] = [];
        snap.forEach(d => fetched.push({ id: d.id, ...d.data() }));
        if(fetched.length === 0) throw new Error("Mock");
        setReviews(fetched);
      } catch(err) {
        setReviews([
          { id: '1', name: 'أحمد صالح', rating: 5, comment: 'أفضل مندي تذوقته في هولندا! اللحم يذوب في الفم والخدمة ممتازة.' },
          { id: '2', name: 'Sarah J.', rating: 5, comment: 'Absolutely delicious authentic Yemeni food. The Fahsa was amazing!' },
          { id: '3', name: 'Mark Van Der Berg', rating: 4, comment: 'Heerlijk eten en grote porties. De sfeer in het restaurant is geweldig.' }
        ]);
      }
    };
    fetchReviews();
  }, []);

  const titles = {
    ar: "آراء عملائنا",
    en: "Customer Reviews",
    nl: "Klantbeoordelingen"
  };

  return (
    <section className="py-20 bg-[#F3EFEA]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold text-[#853114] mb-16 text-center">
          {titles[i18n.language as keyof typeof titles] || titles.en}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm relative overflow-hidden"
            >
              <Quote size={80} className="absolute -top-4 -right-4 text-gray-50 opacity-50 rotate-180 z-0" />
              <div className="relative z-10">
                <div className="flex gap-1 mb-4 text-[#C5A059]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} fill={idx < rev.rating ? 'currentColor' : 'none'} size={20} />
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 h-24 overflow-hidden">"{rev.comment}"</p>
                <div className="font-bold text-[#853114]">{rev.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
