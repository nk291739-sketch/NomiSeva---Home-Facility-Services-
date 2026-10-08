import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Award, 
  Zap, 
  Wind, 
  Wrench, 
  Sparkles, 
  Home,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES_LIST } from '../data/servicesData';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  lang: 'en' | 'hi';
  onQuickBookEmergency: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  lang,
  onQuickBookEmergency,
}) => {
  const quickSearches = [
    { label: 'AC Jet Clean', labelHi: 'एसी सर्विस', cat: 'ac_repair' },
    { label: 'Fan Repair', labelHi: 'पंखा रिपेयर', cat: 'electrician' },
    { label: 'Tap Leak', labelHi: 'नल लीकेज', cat: 'mechanic_plumber' },
    { label: 'Deep Cleaning', labelHi: 'घर डीप क्लीनिंग', cat: 'home_cleaner' },
    { label: 'Pest Control', labelHi: 'पेस्ट कंट्रोल', cat: 'facility_maintenance' },
  ];

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200 pt-8 pb-12 lg:pt-12 lg:pb-16">
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Core Value Proposition & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Indicator - Unboxed Text with Separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'अर्बन कंपनी स्टैंडर्ड सर्विस' : 'Urban Standards Certified'}
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{lang === 'hi' ? '30 मिनट में प्रो आगमन' : '30-Min Pro Arrival'}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{lang === 'hi' ? '30 दिन की वारंटी' : '30-Day Free Warranty'}</span>
            </div>

            {/* Headline with text-wrap balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] text-balance">
              {lang === 'hi' ? (
                <>
                  घर की हर समस्या का समाधान, <span className="text-neutral-900 underline decoration-neutral-300 decoration-2 underline-offset-8">सत्यापित एक्सपर्ट्स</span> आपके द्वार
                </>
              ) : (
                <>
                  Expert Home & Facility Services, Delivered in <span className="text-neutral-900 underline decoration-neutral-300 decoration-2 underline-offset-8">30 Minutes</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed">
              {lang === 'hi'
                ? 'इलेक्ट्रिशियन, प्लंबर, मैकेनिक, एसी सर्विस और होम डीप क्लीनिंग के लिए भारत का सबसे भरोसेमंद प्लेटफॉर्म। रियल-टाइम लाइव ट्रैकिंग और फिक्स रेट्स।'
                : 'Book verified electricians, plumbers, mechanics, AC technicians, and deep cleaners with upfront pricing and real-time live map tracking.'}
            </p>

            {/* Universal Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'खोजें: एसी सर्विस, पंखा रिपेयर, नल लीकेज, सोफा क्लीनिंग...'
                      : 'Search for "AC servicing", "Fan fixing", "Tap leak", "Deep clean"...'
                  }
                  className="w-full pl-11 pr-28 py-3.5 text-sm bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="absolute right-3 px-2.5 py-1 text-[11px] font-medium text-neutral-400 bg-neutral-200/60 rounded">
                    Instant Search
                  </span>
                )}
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
                <span className="text-xs text-neutral-500 font-medium">
                  {lang === 'hi' ? 'लोकप्रिय:' : 'Popular:'}
                </span>
                {quickSearches.map((qs) => (
                  <button
                    key={qs.label}
                    type="button"
                    onClick={() => {
                      onSelectCategory(qs.cat);
                      onSearchChange(lang === 'hi' ? qs.labelHi : qs.label);
                    }}
                    className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors"
                  >
                    {lang === 'hi' ? qs.labelHi : qs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar (Claim adjacent to evidence) */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200/80 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">4.88 ★</div>
                <div className="text-xs text-neutral-500">{lang === 'hi' ? '12.4 लाख रेटिंग्स' : '1.2M+ Ratings'}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">15,000+</div>
                <div className="text-xs text-neutral-500">{lang === 'hi' ? 'सत्यापित प्रोफेशनल्स' : 'Verified Pros'}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">100%</div>
                <div className="text-xs text-neutral-500">{lang === 'hi' ? 'वारंटी सुरक्षा' : 'Damage Cover'}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Bento Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-neutral-900 text-white p-6 sm:p-7 shadow-xl overflow-hidden border border-neutral-800">
              
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative space-y-5">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                      {lang === 'hi' ? 'लाइव सेवा नेटवर्क' : 'Active On-Demand Fleet'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {lang === 'hi' ? 'औसत आगमन: 18 मिनट' : 'Avg Arrival: 18 mins'}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {lang === 'hi'
                      ? 'तत्काल रिपेयर चाहिए? हमारा फास्ट-ट्रैक पार्टनर भेजें'
                      : 'Urgent Breakdown? Instant Partner Dispatch Ready'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {lang === 'hi'
                      ? 'शॉर्ट सर्किट, टपकता पाइप, या एसी कूलिंग फेलियर? आपातकालीन बुकिंग पर नजदीकी टेक्नीशियन तुरंत रवाना होगा।'
                      : 'Electrical sparks, bursting pipe, or zero AC cooling? Our nearby certified mechanic or electrician will reach you immediately.'}
                  </p>
                </div>

                {/* Interactive Emergency Booking CTA */}
                <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {lang === 'hi' ? 'इमरजेंसी एक्सप्रेस सर्विस' : 'Emergency 30-Min Dispatch'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {lang === 'hi' ? 'बिना अतिरिक्त शुल्क · लाइव जीपीएस' : 'Standard Rates · Live GPS Track'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onQuickBookEmergency}
                    className="px-3.5 py-2 text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap shadow-sm shrink-0"
                  >
                    {lang === 'hi' ? 'अभी बुक करें' : 'Book Instant'}
                  </button>
                </div>

                {/* 4 Feature Points with Clean Icons */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'hi' ? 'पुलिस वेरिफाइड स्टाफ' : 'Police Background Checked'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'hi' ? 'समय पर न पहुंचे तो छूट' : 'On-Time Guarantee'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'hi' ? 'ओरिजिनल स्पेयर पार्ट्स' : '100% Genuine Spares'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'hi' ? 'जीरो मेस सफाई' : 'Zero-Mess Cleanup'}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
