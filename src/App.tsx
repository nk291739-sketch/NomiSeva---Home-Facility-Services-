import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingDrawer } from './components/BookingDrawer';
import { RealTimeTracker } from './components/RealTimeTracker';
import { ActiveBookingsModal } from './components/ActiveBookingsModal';
import { Footer } from './components/Footer';
import { 
  SERVICES_CATALOG, 
  INITIAL_SAMPLE_BOOKING,
  CATEGORIES_LIST,
  CITIES 
} from './data/servicesData';
import { 
  ServiceItem, 
  CartItem, 
  BookingRecord, 
  ServiceCategory 
} from './types/service';
import { 
  ShieldCheck, 
  Navigation, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  ShoppingBag
} from 'lucide-react';

export default function App() {
  // Localization & Region
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [currentCity, setCurrentCity] = useState<string>('Delhi NCR');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('urban_seva_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookings State (Pre-populated with 1 active live booking for instant demo delight!)
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('urban_seva_bookings');
      return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_BOOKING];
    } catch {
      return [INITIAL_SAMPLE_BOOKING];
    }
  });

  // Active Modals & Views
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingsListOpen, setIsBookingsListOpen] = useState(false);
  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);
  
  // Real-Time Tracking modal
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('urban_seva_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('urban_seva_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // Cart Handlers
  const handleAddToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === serviceId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((item) => item.service.id !== serviceId);
      }
      return prev.map((item) =>
        item.service.id === serviceId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => setCart([]);

  // Booking completion
  const handleBookingSuccess = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTrackingBookingId(newBooking.id);
  };

  const handleUpdateBooking = (updated: BookingRecord) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  };

  // Quick emergency 30-min booking action
  const handleQuickBookEmergency = () => {
    const urgentService = SERVICES_CATALOG.find((s) => s.id === 'elec-mcb-fuse') || SERVICES_CATALOG[0];
    handleAddToCart(urgentService);
    setIsCartOpen(true);
  };

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = s.name.toLowerCase().includes(q);
      const inHindi = s.hindiName.toLowerCase().includes(q);
      const inDesc = s.description.toLowerCase().includes(q);
      const inCat = s.category.toLowerCase().includes(q);

      return inName || inHindi || inDesc || inCat;
    });
  }, [selectedCategory, searchQuery]);

  // Selected Booking for Tracking
  const trackingBooking = useMemo(() => {
    if (!activeTrackingBookingId) return null;
    return bookings.find((b) => b.id === activeTrackingBookingId) || null;
  }, [activeTrackingBookingId, bookings]);

  // Current active live booking for top banner
  const activeLiveBooking = bookings.find((b) => b.status !== 'completed');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      
      {/* 1. Header (Top Bar Contract: 3 Zones) */}
      <Header
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        lang={lang}
        onLangToggle={() => setLang(lang === 'en' ? 'hi' : 'en')}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        bookings={bookings}
        onOpenTracking={(id) => {
          if (id) {
            setActiveTrackingBookingId(id);
          } else if (activeLiveBooking) {
            setActiveTrackingBookingId(activeLiveBooking.id);
          } else if (bookings.length > 0) {
            setActiveTrackingBookingId(bookings[0].id);
          } else {
            setIsBookingsListOpen(true);
          }
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Ongoing Live Tracking Banner (If an active booking exists) */}
      {activeLiveBooking && (
        <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-900 py-2.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">
                {lang === 'hi' ? 'सक्रिय बुकिंग प्रगति पर है:' : 'Active Service On The Way:'}
              </span>
              <span className="text-emerald-300 font-mono">#{activeLiveBooking.id}</span>
              <span className="hidden sm:inline text-neutral-400">·</span>
              <span className="hidden sm:inline text-emerald-100">
                {activeLiveBooking.technician.name} ({activeLiveBooking.etaMinutes} mins away)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTrackingBookingId(activeLiveBooking.id)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-md transition-colors flex items-center gap-1 text-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'लाइव मैप देखें' : 'View Live Map & Pro'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero Section with Search, Metrics, and Instant Dispatch Bento */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        lang={lang}
        onQuickBookEmergency={handleQuickBookEmergency}
      />

      {/* 4. Category Filter Navigation Bar */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        lang={lang}
      />

      {/* 5. Main Services Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Section Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              {selectedCategory === 'all' && (lang === 'hi' ? 'सभी लोकप्रिय सेवाएं' : 'All Recommended Home Services')}
              {selectedCategory === 'ac_repair' && (lang === 'hi' ? 'एसी सर्विस व रिपेयरिंग' : 'Air Conditioner Service & Repair')}
              {selectedCategory === 'electrician' && (lang === 'hi' ? 'इलेक्ट्रिशियन और वायरिंग सेवाएं' : 'Electrician & Switchboard Services')}
              {selectedCategory === 'mechanic_plumber' && (lang === 'hi' ? 'प्लंबर, मैकेनिक व हैंडीमैन' : 'Plumber, Mechanic & Handyman')}
              {selectedCategory === 'home_cleaner' && (lang === 'hi' ? 'होम डीप क्लीनिंग व सोफा वॉश' : 'Full Home Deep Cleaning & Washing')}
              {selectedCategory === 'facility_maintenance' && (lang === 'hi' ? 'घर की अन्य सुविधाएं व मेंटेनेंस' : 'Facility Care & Home Maintenance')}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span>{filteredServices.length} {lang === 'hi' ? 'सेवाएं उपलब्ध' : 'verified services available'}</span>
              <span>·</span>
              <span>{lang === 'hi' ? 'फिक्स रेट्स' : 'Standard Transparent Rates'}</span>
              <span>·</span>
              <span>{lang === 'hi' ? '30 मिनट में प्रो' : '30-Min Arrival in'} {currentCity}</span>
            </div>
          </div>

          {searchQuery && (
            <div className="text-xs text-neutral-600 flex items-center gap-2">
              <span>Showing search matches for "{searchQuery}"</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-neutral-900 font-bold underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Services Cards Grid (3 Columns on Desktop as per E-commerce guidelines) */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {lang === 'hi' ? 'कोई सेवा नहीं मिली' : 'No services found matching your query'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try searching for "Fan", "AC", "Plumber", "Drain", or choose "All Services" from the filter tabs above.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {lang === 'hi' ? 'सभी सेवाएं दिखाएं' : 'Show All Services'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => {
              const inCart = cart.find((item) => item.service.id === service.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  quantityInCart={qty}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onViewDetails={setSelectedDetailService}
                  lang={lang}
                />
              );
            })}
          </div>
        )}

        {/* Service Assurance Showcase Block */}
        <div className="mt-14 rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                {lang === 'hi' ? '30 दिन की बिना सवाल वारंटी' : '30-Day Free Re-work Warranty'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If the repair or cleaning doesn't meet your expectations within 30 days, we revisit and resolve it completely free.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                {lang === 'hi' ? 'लाइव मैप पर टेक्नीशियन को ट्रैक करें' : 'Live Real-Time GPS Tracking'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Track your partner's live route on map, exact arrival ETA, and access direct calling and secure doorstep OTP.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                {lang === 'hi' ? 'ओरिजिनल पार्ट्स व फिक्स रेट्स' : 'Transparent Pricing & Spares'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Clear itemized rate cards with zero hidden surprises. Every replacement part comes with an authentic manufacturer receipt.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 6. Footer */}
      <Footer
        lang={lang}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
      />

      {/* 7. Floating Bottom Bar on Mobile (Within 15% Viewport Cap) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-neutral-900 text-white rounded-xl p-3 shadow-xl flex items-center justify-between border border-neutral-800">
          <div>
            <div className="text-xs font-bold tabular-nums">
              {cart.reduce((s, i) => s + i.quantity, 0)} {lang === 'hi' ? 'सेवाएं चुनी गईं' : 'items added'} · ₹{cart.reduce((s, i) => s + (i.service.price * i.quantity), 0)}
            </div>
            <div className="text-[10px] text-neutral-400">Doorstep delivery available today</div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
          >
            <span>{lang === 'hi' ? 'कार्ट देखें' : 'View Cart'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODALS & DRAWERS */}

      {/* Service Detail Modal */}
      {selectedDetailService && (
        <ServiceDetailModal
          service={selectedDetailService}
          onClose={() => setSelectedDetailService(null)}
          quantityInCart={
            cart.find((c) => c.service.id === selectedDetailService.id)?.quantity || 0
          }
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          lang={lang}
        />
      )}

      {/* Booking Checkout Drawer */}
      <BookingDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentCity={currentCity}
        onBookingSuccess={handleBookingSuccess}
        lang={lang}
      />

      {/* Real-Time Live Tracking Modal */}
      {trackingBooking && (
        <RealTimeTracker
          booking={trackingBooking}
          onClose={() => setActiveTrackingBookingId(null)}
          onUpdateBooking={handleUpdateBooking}
          lang={lang}
        />
      )}

      {/* Active Bookings Switcher Modal */}
      <ActiveBookingsModal
        isOpen={isBookingsListOpen}
        onClose={() => setIsBookingsListOpen(false)}
        bookings={bookings}
        onSelectBooking={(id) => setActiveTrackingBookingId(id)}
        lang={lang}
      />

    </div>
  );
}
