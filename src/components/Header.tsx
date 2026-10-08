import React, { useState } from 'react';
import { 
  MapPin, 
  ShoppingBag, 
  Clock, 
  ChevronDown, 
  Globe, 
  ShieldCheck, 
  Search,
  Check,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { CITIES } from '../data/servicesData';
import { CartItem, BookingRecord } from '../types/service';
import { User } from '../firebase';

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  lang: 'en' | 'hi';
  onLangToggle: () => void;
  cart: CartItem[];
  onOpenCart: () => void;
  bookings: BookingRecord[];
  onOpenTracking: (bookingId?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onCityChange,
  lang,
  onLangToggle,
  cart,
  onOpenCart,
  bookings,
  onOpenTracking,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  user,
  onSignIn,
  onSignOut,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeBookingsCount = bookings.filter(b => b.status !== 'completed').length;
  const currentCityObj = CITIES.find(c => c.name === currentCity) || CITIES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-neutral-800 transition-colors">
                US
              </div>
              <span>UrbanSeva</span>
            </a>

            {/* City Selector Pill-free Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors py-1.5 px-2 rounded-md hover:bg-neutral-100"
                aria-expanded={isCityDropdownOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-semibold text-neutral-900">
                  {lang === 'hi' ? currentCityObj.hindi : currentCityObj.name}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs text-neutral-400 font-medium">
                    {lang === 'hi' ? 'अपना शहर चुनें' : 'Select Service City'}
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        onCityChange(city.name);
                        setIsCityDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>{city.name} <span className="text-neutral-400 text-xs">({city.hindi})</span></span>
                      {currentCity === city.name && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Clean 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600">
            <button 
              type="button" 
              onClick={() => onSelectCategory('all')} 
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'hi' ? 'सभी सेवाएं' : 'All Services'}
            </button>
            <button 
              type="button" 
              onClick={() => onSelectCategory('ac_repair')} 
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'hi' ? 'एसी रिपेयर' : 'AC Repair'}
            </button>
            <button 
              type="button" 
              onClick={() => onSelectCategory('electrician')} 
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'hi' ? 'इलेक्ट्रिशियन' : 'Electrician'}
            </button>
            <button 
              type="button" 
              onClick={() => onSelectCategory('mechanic_plumber')} 
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'hi' ? 'प्लंबर व मैकेनिक' : 'Plumber & Mechanic'}
            </button>
            <button 
              type="button" 
              onClick={() => onSelectCategory('home_cleaner')} 
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'hi' ? 'होम क्लीनिंग' : 'Cleaning'}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Language switch */}
            <button
              type="button"
              onClick={onLangToggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Live Tracking / Bookings button */}
            <button
              type="button"
              onClick={() => onOpenTracking()}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              <span>{lang === 'hi' ? 'लाइव ट्रैकिंग' : 'Track Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Google Sign-in / User Profile */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 text-xs font-medium text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                  <span className="max-w-[70px] truncate font-semibold">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-neutral-100">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {user.displayName || 'UrbanSeva Customer'}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 rounded-lg border border-neutral-300 transition-colors whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-neutral-600" />
                <span>{lang === 'hi' ? 'साइन इन' : 'Sign In'}</span>
              </button>
            )}

            {/* Cart trigger button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'कार्ट' : 'Cart'}</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-white text-neutral-900 rounded-full tabular-nums">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
