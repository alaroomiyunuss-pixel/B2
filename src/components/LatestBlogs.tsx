import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db, isMock } from '../firebase/config';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

export default function LatestBlogs() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if(isMock) throw new Error("Mock");
        const q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(3));
        const snap = await getDocs(q);
        const fetched: any[] = [];
        snap.forEach(d => fetched.push({ id: d.id, ...d.data() }));
        if(fetched.length === 0) throw new Error("Mock");
        setBlogs(fetched);
      } catch(err) {
        setBlogs([
          { id: '1', title: { ar: 'سر بهارات المندي', en: 'The Secret of Mandi Spices', nl: 'Het Geheim van Mandi Kruiden' }, excerpt: { ar: 'تعرف على الخلطة السرية...', en: 'Discover the secret blend...', nl: 'Ontdek de geheime mix...' }, date: '2026-04-10', imageUrl: 'https://images.unsplash.com/photo-1596683786278-6590f074d2ac' },
          { id: '2', title: { ar: 'كيف تصنع الفحسة', en: 'How to make Fahsa', nl: 'Hoe maak je Fahsa' }, excerpt: { ar: 'خطوات بسيطة لصنع أشهر طبق يمني.', en: 'Simple steps to make the most famous Yemeni dish.', nl: 'Eenvoudige stappen om het beroemdste Jemenitische gerecht te maken.' }, date: '2026-04-12', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554' },
          { id: '3', title: { ar: 'أجواء مطعمنا', en: 'Our Restaurant Vibes', nl: 'Onze Restaurant Sfeer' }, excerpt: { ar: 'تجربة ثقافية متكاملة...', en: 'A complete cultural experience...', nl: 'Een complete culturele ervaring...' }, date: '2026-04-15', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' }
        ]);
      }
    };
    fetchBlogs();
  }, []);

  const titles = {
    ar: "أحدث المدونات",
    en: "Latest Blogs",
    nl: "Nieuwste Blogs"
  };

  if(blogs.length === 0) return null;

  return (
    <section className="py-20 bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-4xl font-bold text-[#853114]">
            {titles[i18n.language as keyof typeof titles] || titles.en}
          </h2>
          <Link to="/blogs" className="flex items-center gap-2 text-[#C5A059] font-bold hover:text-[#853114] transition-colors">
            {isRtl ? "عرض الكل" : "View All"} 
            {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link to={`/blogs`} key={blog.id} className="group flex flex-col bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block">
              <div className="h-48 overflow-hidden relative">
                <img src={`${blog.imageUrl}?q=80&w=600&auto=format&fit=crop`} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#853114] flex items-center gap-1">
                   <Calendar size={12} /> {blog.date}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#853114] transition-colors line-clamp-2">
                  {blog.title[i18n.language as keyof typeof blog.title] || blog.title.en}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                  {blog.excerpt[i18n.language as keyof typeof blog.excerpt] || blog.excerpt.en}
                </p>
                <div className="text-[#C5A059] font-bold text-sm flex items-center gap-1 mt-auto">
                  {isRtl ? "اقرأ المزيد" : "Read More"} 
                  {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
