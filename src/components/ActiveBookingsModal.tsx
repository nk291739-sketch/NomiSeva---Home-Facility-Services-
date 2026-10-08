import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Navigation, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { BookingRecord } from '../types/service';

interface ActiveBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onSelectBooking: (bookingId: string) => void;
  lang: 'en' | 'hi';
}

export const ActiveBookingsModal: React.FC<ActiveBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {lang === 'hi' ? 'आपकी बुकिंग्स' : 'My Bookings'}
            </h2>
            <p className="text-xs text-neutral-500">
              {bookings.length} {lang === 'hi' ? 'बुकिंग्स दर्ज हैं' : 'bookings recorded'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No bookings found yet. Book any service to track live!
            </div>
          ) : (
            bookings.map((b) => {
              const isLive = b.status !== 'completed';
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBooking(b.id);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50/50 cursor-pointer transition-all shadow-xs space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        #{b.id}
                      </span>
                      {isLive ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Tracking
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-neutral-900 tabular-nums">
                      ₹{b.finalAmount}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1 group-hover:text-neutral-700">
                      {b.items.map(i => i.service.name).join(' + ')}
                    </h4>
                    <p className="text-[11px] text-neutral-500 pt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{b.serviceDate}, {b.timeSlot}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-600">
                      Pro: <strong className="text-neutral-900">{b.technician.name}</strong>
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Live Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
