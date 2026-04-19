import React, { useState } from 'react';
import { X } from 'lucide-react';
import OrderOptions from './OrderOptions';
import BookingModal from './BookingModal';

export default function OrderModal({ onClose }: { onClose: () => void }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (isBookingOpen) {
    return <BookingModal isOpen={true} onClose={() => { setIsBookingOpen(false); onClose(); }} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl relative p-6 pt-12 md:p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-900 transition-colors z-10"
        >
          <X size={24} />
        </button>
        <OrderOptions onOpenBooking={() => setIsBookingOpen(true)} onCloseModal={onClose} />
      </div>
    </div>
  );
}
