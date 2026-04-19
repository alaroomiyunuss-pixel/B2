import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useTranslation } from 'react-i18next';

export default function MenuPdfButton() {
  const { t, i18n } = useTranslation();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const d = await getDoc(doc(db, 'site_settings', 'general'));
        if (d.exists() && d.data().menuPdfUrl) {
          setPdfUrl(d.data().menuPdfUrl);
        } else {
          setPdfUrl('#'); // Default or placeholder
        }
      } catch (err) {
        setPdfUrl('#');
      }
    };
    fetchPdf();
  }, []);

  const downloadText = {
    ar: "تحميل المنيو (PDF)",
    en: "Download Menu (PDF)",
    nl: "Inladen Menu (PDF)"
  };

  if (!pdfUrl) return null;

  return (
    <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#C5A059] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#a68241] transition-all hover:scale-105 duration-300 z-50">
      <Download size={24} />
      <span>{downloadText[i18n.language as keyof typeof downloadText] || downloadText.en}</span>
    </a>
  );
}
