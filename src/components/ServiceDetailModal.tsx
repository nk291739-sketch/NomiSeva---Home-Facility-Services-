import React from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Clock, 
  Star, 
  Plus, 
  Minus,
  Sparkles,
  Zap,
  Wrench,
  Wind
} from 'lucide-react';
import { ServiceItem } from '../types/service';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (service: ServiceItem) => void;
  onRemoveFromCart: (serviceId: string) => void;
  lang: 'en' | 'hi';
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  lang,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 leading-tight">
              {service.name}
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              {service.hindiName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-neutral-900 tabular-nums">
                  {service.rating} / 5.0
                </div>
                <div className="text-[10px] text-neutral-500">
                  {service.reviewCount.toLocaleString()} {lang === 'hi' ? 'समीक्षाएं' : 'reviews'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
              <Clock className="w-4 h-4 text-neutral-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-neutral-900 tabular-nums">
                  {service.durationMinutes} mins
                </div>
                <div className="text-[10px] text-neutral-500">
                  {lang === 'hi' ? 'अनुमानित समय' : 'Estimated Time'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-neutral-900 tabular-nums">
                  {service.warrantyDays} Days
                </div>
                <div className="text-[10px] text-neutral-500">
                  {lang === 'hi' ? 'वारंटी सुरक्षा' : 'Free Warranty'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {lang === 'hi' ? 'विवरण' : 'Overview'}
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Inclusions & Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* What's Included */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'क्या शामिल है' : 'What is included'}</span>
              </div>
              <ul className="space-y-2">
                {service.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Excluded */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <XCircle className="w-4 h-4 text-neutral-400" />
                <span>{lang === 'hi' ? 'क्या शामिल नहीं है' : 'What is excluded'}</span>
              </div>
              <ul className="space-y-2">
                {service.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Safety & Protocol Assurances */}
          <div className="bg-neutral-900 text-white rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UrbanSeva Safety & Trust Protocol</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every partner arrives in clean uniform with standard ID badge, masks, insulated diagnostic equipment, and carries genuine spare parts with company receipts.
            </p>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-neutral-900 tabular-nums">
                ₹{service.price}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-xs text-neutral-400 line-through tabular-nums">
                  ₹{service.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-500">Inclusive of all taxes & doorstep fee</span>
          </div>

          <div className="flex items-center gap-3">
            {quantityInCart > 0 ? (
              <div className="flex items-center bg-neutral-900 text-white rounded-lg px-3 py-2 gap-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => onRemoveFromCart(service.id)}
                  className="p-1 hover:text-neutral-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold tabular-nums min-w-4 text-center">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onAddToCart(service)}
                  className="p-1 hover:text-neutral-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAddToCart(service)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
