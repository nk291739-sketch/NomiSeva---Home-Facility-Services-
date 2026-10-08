import React from 'react';
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Info,
  Check,
  Zap,
  Wind,
  Wrench,
  Sparkles,
  Droplets,
  Flame,
  Hammer
} from 'lucide-react';
import { ServiceItem } from '../types/service';

interface ServiceCardProps {
  service: ServiceItem;
  quantityInCart: number;
  onAddToCart: (service: ServiceItem) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onViewDetails: (service: ServiceItem) => void;
  lang: 'en' | 'hi';
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onViewDetails,
  lang,
}) => {
  // SVG Category Visual Illustration fallback container with sleek aesthetic
  const renderVisualIllustration = () => {
    switch (service.category) {
      case 'ac_repair':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-sky-900 to-neutral-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Wind className="w-7 h-7 text-sky-300" />
            </div>
            <span className="text-xs font-semibold text-sky-200 tracking-wide uppercase">
              {lang === 'hi' ? 'एसी कूलिंग व मेंटेनेंस' : 'HVAC Precision Care'}
            </span>
          </div>
        );
      case 'electrician':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-amber-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Zap className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-semibold text-amber-200 tracking-wide uppercase">
              {lang === 'hi' ? 'प्रमाणित इलेक्ट्रिशियन' : 'Certified Electrician'}
            </span>
          </div>
        );
      case 'mechanic_plumber':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-teal-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7 text-teal-300" />
            </div>
            <span className="text-xs font-semibold text-teal-200 tracking-wide uppercase">
              {lang === 'hi' ? 'प्लंबर व मैकेनिक' : 'Plumbing & Mechanical'}
            </span>
          </div>
        );
      case 'home_cleaner':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-emerald-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7 text-emerald-300" />
            </div>
            <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">
              {lang === 'hi' ? 'डीप होम क्लीनिंग' : 'Intensive Deep Clean'}
            </span>
          </div>
        );
      case 'facility_maintenance':
      default:
        return (
          <div className="w-full h-44 bg-gradient-to-br from-indigo-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Hammer className="w-7 h-7 text-indigo-300" />
            </div>
            <span className="text-xs font-semibold text-indigo-200 tracking-wide uppercase">
              {lang === 'hi' ? 'घर की अन्य सुविधाएं' : 'Facility Care'}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
      
      {/* Top Media Anchor */}
      <div className="relative">
        {renderVisualIllustration()}

        {/* Clean subtle top-right badge if popular */}
        {service.tag && (
          <span className="absolute top-3 right-3 text-[11px] font-bold tracking-tight text-neutral-900 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded shadow-xs">
            {service.tag}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Metadata Row: Rating · Reviews · Time */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1 font-bold text-neutral-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{service.rating.toFixed(2)}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">({service.reviewCount.toLocaleString()})</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span className="tabular-nums">{service.durationMinutes} mins</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors">
            {service.name}
          </h3>

          {/* Hindi subtext for accessibility */}
          <p className="text-xs font-medium text-neutral-500">
            {service.hindiName}
          </p>

          {/* Description snippet */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-1">
            {lang === 'hi' ? service.shortDescHindi : service.description}
          </p>
        </div>

        {/* Key Features Bullet points */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
          {service.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>

        {/* Bottom Action & Price Row */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
          
          {/* Price with tabular numerals */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                ₹{service.price}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-xs text-neutral-400 line-through tabular-nums">
                  ₹{service.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{service.warrantyDays}-day warranty</span>
            </div>
          </div>

          {/* Buttons: Details & Add */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(service)}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="View Inclusions & Details"
            >
              <Info className="w-4 h-4" />
            </button>

            {quantityInCart > 0 ? (
              <div className="flex items-center bg-neutral-900 text-white rounded-lg px-2 py-1 gap-2 shadow-xs">
                <button
                  type="button"
                  onClick={() => onRemoveFromCart(service.id)}
                  className="p-1 hover:text-neutral-300 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold tabular-nums px-1">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onAddToCart(service)}
                  className="p-1 hover:text-neutral-300 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAddToCart(service)}
                className="px-3.5 py-1.5 text-xs font-bold text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 rounded-lg transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-500" />
                <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
