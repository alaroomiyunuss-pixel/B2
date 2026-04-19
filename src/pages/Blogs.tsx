import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isMock } from '../firebase/config';
import { Calendar } from 'lucide-react';

export default function Blogs() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if(isMock) throw new Error("Mock");
        const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        const fetched: any[] = [];
        snap.forEach(d => fetched.push({ id: d.id, ...d.data() }));
        if(fetched.length === 0) throw new Error("Mock");
        setBlogs(fetched);
      } catch(err) {
        setBlogs([
          { id: '1', title: { ar: 'سر بهارات المندي', en: 'The Secret of Mandi Spices', nl: 'Het Geheim van Mandi Kruiden' }, excerpt: { ar: 'تعرف على الخلطة السرية...', en: 'Discover the secret blend...', nl: 'Ontdek...' }, date: '2026-04-10', imageUrl: 'https://images.unsplash.com/photo-1596683786278-6590f074d2ac' },
          { id: '2', title: { ar: 'كيف تصنع الفحسة', en: 'How to make Fahsa', nl: 'Hoe maak je Fahsa' }, excerpt: { ar: 'خطوات بسيطة...', en: 'Simple steps...', nl: 'Eenvoudige stappen...' }, date: '2026-04-12', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554' },
          { id: '3', title: { ar: 'أجواء مطعمنا', en: 'Our Restaurant Vibes', nl: 'Onze Restaurant Sfeer' }, excerpt: { ar: 'تجربة ثقافية...', en: 'A cultural experience...', nl: 'Een culturele...' }, date: '2026-04-15', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' }
        ]);
      }
    };
    fetchBlogs();
  }, []);

  const titles = {
    ar: "مدونات المستكشف",
    en: "Explore Blogs",
    nl: "Ontdek Blogs"
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold text-[#853114] mb-12 text-center">{titles[i18n.language as keyof typeof titles] || titles.en}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="h-56 relative">
                <img src={`${blog.imageUrl}?q=80&w=600&auto=format&fit=crop`} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#853114] flex items-center gap-1">
                   <Calendar size={12} /> {blog.date}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{blog.title[i18n.language as keyof typeof blog.title] || blog.title.en}</h3>
                <p className="text-gray-500 mb-4">{blog.excerpt[i18n.language as keyof typeof blog.excerpt] || blog.excerpt.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
