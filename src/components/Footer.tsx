import React from 'react';
import { ShieldCheck, PhoneCall, Award, Clock } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'hi';
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSelectCategory }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      
      {/* 4 Trust Pillars */}
      <div className="border-b border-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-xs">
                  {lang === 'hi' ? '30 दिन की सर्विस वारंटी' : '30-Day Free Warranty'}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Any rework required within 30 days is completely free with zero questions asked.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-xs">
                  {lang === 'hi' ? 'सत्यापित प्रोफेशन्स' : '100% Background Checked'}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Police verified, identity checked, and trained in standard safety and hygiene.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-xs">
                  {lang === 'hi' ? 'समय पर पहुंचने की गारंटी' : 'On-Time Doorstep Delivery'}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Live real-time GPS tracking so you always know when your partner arrives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-xs">
                  {lang === 'hi' ? '24x7 ग्राहक सहायता' : '24x7 Customer Helpline'}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Call toll-free 1800-419-7382 or chat with support anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white text-neutral-900 flex items-center justify-center font-bold text-xs">
                US
              </div>
              <span>UrbanSeva</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              {lang === 'hi'
                ? 'भारत का सबसे भरोसेमंद होम व फैसिलिटी सर्विसेज प्लेटफॉर्म। इलेक्ट्रिशियन, प्लंबर, मैकेनिक, एसी रिपेयर और डीप क्लीनिंग।'
                : 'India\'s trusted on-demand home & facility service platform with upfront transparent pricing and live GPS tracking.'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">Home Services</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button type="button" onClick={() => onSelectCategory('ac_repair')} className="hover:text-white transition-colors">
                  AC Deep Jet & Gas Refill
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('electrician')} className="hover:text-white transition-colors">
                  Electrician & Fan Wiring
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('mechanic_plumber')} className="hover:text-white transition-colors">
                  Plumber, Tap & Geyser Repair
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('home_cleaner')} className="hover:text-white transition-colors">
                  Full Home Deep Cleaning
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('facility_maintenance')} className="hover:text-white transition-colors">
                  Pest Control & Painting
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">Popular Cities</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>Delhi NCR · Gurugram · Noida</li>
              <li>Mumbai · Navi Mumbai · Thane</li>
              <li>Bengaluru · Whitefield · Koramangala</li>
              <li>Hyderabad · Hitec City · Gachibowli</li>
              <li>Pune · Ahmedabad · Jaipur</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">Safety & Compliance</h5>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              All UrbanSeva partners are trained in electrical safety standards, certified by Skill India (NSDC), and carry sanitized diagnostic tools.
            </p>
            <div className="pt-2 text-[10px] text-neutral-500 font-mono">
              ISO 9001:2015 Certified Service Standards
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} UrbanSeva Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-400">Safety Standards</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
