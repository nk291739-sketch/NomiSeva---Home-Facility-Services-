import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Phone,
  User,
  Home
} from 'lucide-react';
import { CartItem, BookingAddress, BookingRecord } from '../types/service';
import { TIME_SLOTS, MOCK_TECHNICIANS } from '../data/servicesData';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (service: any) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onClearCart: () => void;
  currentCity: string;
  onBookingSuccess: (newBooking: BookingRecord) => void;
  lang: 'en' | 'hi';
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  currentCity,
  onBookingSuccess,
  lang,
}) => {
  const [step, setStep] = useState<'cart' | 'slot' | 'address' | 'payment'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('WELCOME100');
  
  // Date & Slot state
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow' | 'Day After'>('Today');
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);

  // Address state
  const [address, setAddress] = useState<BookingAddress>({
    customerName: 'Naveen Kumar',
    phoneNumber: '+91 98711 22334',
    flatNo: 'Apt 402, Tower B',
    building: 'Palm Heights Residences',
    landmark: 'Near Central City Mall',
    area: 'Sector 62',
    city: currentCity,
    pincode: '201309',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const discount = appliedCoupon === 'WELCOME100' ? Math.min(100, subtotal > 100 ? 100 : 0) : 0;
  const doorstepFee = subtotal > 0 ? 49 : 0;
  const totalAmount = Math.max(0, subtotal - discount + doorstepFee);

  const handleApplyCoupon = (code: string) => {
    if (code.trim().toUpperCase() === 'WELCOME100') {
      setAppliedCoupon('WELCOME100');
    } else if (code.trim().toUpperCase() === 'URBAN20') {
      setAppliedCoupon('URBAN20');
    }
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const randomId = `UB-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const assignedTech = MOCK_TECHNICIANS[Math.floor(Math.random() * MOCK_TECHNICIANS.length)];

      const newBooking: BookingRecord = {
        id: randomId,
        createdAt: 'Just now',
        items: [...cart],
        totalAmount: subtotal + doorstepFee,
        discount,
        finalAmount: totalAmount,
        serviceDate: selectedDate,
        timeSlot: selectedSlot,
        address: { ...address, city: currentCity },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'technician_assigned',
        technician: assignedTech,
        otp: randomOtp,
        etaMinutes: 22,
        currentStepIndex: 1,
        workChecklist: [
          { task: 'Technician identity check & shoe covers', completed: false },
          { task: 'Diagnostic assessment & customer briefing', completed: false },
          { task: 'Primary repair / deep cleaning service execution', completed: false },
          { task: 'Post-service testing & customer inspection', completed: false },
          { task: 'Digital invoice generation & payment signoff', completed: false },
        ],
      };

      onBookingSuccess(newBooking);
      onClearCart();
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {step === 'cart' && (lang === 'hi' ? 'आपकी सेवा सूची' : 'Service Cart')}
              {step === 'slot' && (lang === 'hi' ? 'तारीख व समय चुनें' : 'Select Date & Time')}
              {step === 'address' && (lang === 'hi' ? 'सेवा का पता' : 'Service Address')}
              {step === 'payment' && (lang === 'hi' ? 'भुगतान विधि' : 'Payment Method')}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-0.5">
              <span className={step === 'cart' ? 'font-bold text-neutral-900' : ''}>1. Items</span>
              <span>·</span>
              <span className={step === 'slot' ? 'font-bold text-neutral-900' : ''}>2. Slot</span>
              <span>·</span>
              <span className={step === 'address' ? 'font-bold text-neutral-900' : ''}>3. Address</span>
              <span>·</span>
              <span className={step === 'payment' ? 'font-bold text-neutral-900' : ''}>4. Payment</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {lang === 'hi' ? 'आपकी कार्ट खाली है' : 'Your cart is empty'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    {lang === 'hi' 
                      ? 'कृपया होम स्क्रीन से एसी, इलेक्ट्रिशियन या प्लंबर सर्विस जोड़ें।' 
                      : 'Explore services from home and add them to proceed.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Item List */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item.service.id} 
                        className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                            {item.service.name}
                          </h4>
                          <div className="text-[11px] text-neutral-500">
                            ₹{item.service.price} × {item.quantity}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium pt-0.5">
                            {item.service.warrantyDays}-day warranty included
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center bg-neutral-100 rounded-lg p-1 gap-2">
                          <button
                            type="button"
                            onClick={() => onRemoveFromCart(item.service.id)}
                            className="p-1 hover:text-neutral-900 text-neutral-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold tabular-nums min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item.service)}
                            className="p-1 hover:text-neutral-900 text-neutral-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Box */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-neutral-700" />
                      <span className="text-xs font-bold text-neutral-900">
                        {lang === 'hi' ? 'कूपन कोड' : 'Coupons & Offers'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="WELCOME100"
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponCode || 'WELCOME100')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 font-medium pt-1">
                        <span>Coupon '{appliedCoupon}' applied (-₹100)</span>
                        <button
                          type="button"
                          onClick={() => setAppliedCoupon(null)}
                          className="text-neutral-400 hover:text-neutral-700 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bill Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Service Item Total</span>
                      <span className="tabular-nums font-semibold text-neutral-900">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Coupon Savings</span>
                        <span className="tabular-nums">-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Standard Doorstep & Safety Charge</span>
                      <span className="tabular-nums font-semibold text-neutral-900">₹{doorstepFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                      <span>Total Amount to Pay</span>
                      <span className="tabular-nums text-base">₹{totalAmount}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: SELECT DATE & TIME SLOT */}
          {step === 'slot' && (
            <div className="space-y-6">
              
              {/* Date Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-600" />
                  <span>{lang === 'hi' ? 'सेवा की तारीख' : 'Select Service Day'}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Today', 'Tomorrow', 'Day After'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedDate === d
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <div>{d}</div>
                      <div className="text-[10px] opacity-80 font-normal">
                        {d === 'Today' ? 'Fast-Track' : 'Standard'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span>{lang === 'hi' ? 'उपयुक्त समय स्लॉट' : 'Available Time Slots'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 text-xs font-medium rounded-xl border text-left transition-all ${
                        selectedSlot === slot
                          ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <div className="tabular-nums">{slot}</div>
                      <div className="text-[10px] text-emerald-600 opacity-90 mt-0.5">
                        {selectedSlot === slot ? 'Selected' : 'Available'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                <span className="font-bold text-neutral-900">On-Time Arrival: </span>
                Our technician will reach within 15 minutes of the selected window or ₹50 is refunded to your wallet.
              </div>

            </div>
          )}

          {/* STEP 3: ADDRESS DETAILS */}
          {step === 'address' && (
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Customer Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={address.customerName}
                    onChange={(e) => setAddress({ ...address, customerName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Naveen Kumar"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Mobile Phone (For OTP & Pro call)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Flat / House / Floor No.</label>
                  <input
                    type="text"
                    value={address.flatNo}
                    onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Flat 402, Block B"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Society / Building</label>
                  <input
                    type="text"
                    value={address.building}
                    onChange={(e) => setAddress({ ...address, building: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Palm Heights"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Landmark & Locality</label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="Near City Mall, Sector 62"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">City</label>
                  <input
                    type="text"
                    value={currentCity}
                    disabled
                    className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-600 font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Pincode</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 tabular-nums"
                    placeholder="201309"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: PAYMENT SELECTION */}
          {step === 'payment' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-neutral-900">
                {lang === 'hi' ? 'सुरक्षित भुगतान विधि चुनें' : 'Select Payment Option'}
              </label>

              {/* COD / Pay After Service */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{lang === 'hi' ? 'सेवा के बाद भुगतान (Pay After Service)' : 'Cash / UPI After Service'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Pay technician directly after complete job inspection & satisfaction.
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                }`}>
                  {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Instant UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-900">
                    Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Fast 1-click contactless payment with guaranteed refund protection.
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                }`}>
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Credit / Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-900">
                    Credit / Debit Card (Visa, MasterCard, RuPay)
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Secure 256-bit encrypted checkout.
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                }`}>
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Order Final Summary Recap */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 mt-4">
                <div className="text-xs font-bold text-neutral-900">Booking Summary</div>
                <div className="text-xs text-neutral-600 flex justify-between">
                  <span>Slot:</span>
                  <span className="font-semibold text-neutral-900">{selectedDate}, {selectedSlot}</span>
                </div>
                <div className="text-xs text-neutral-600 flex justify-between">
                  <span>Address:</span>
                  <span className="font-semibold text-neutral-900 truncate max-w-[200px]">{address.flatNo}, {address.building}</span>
                </div>
                <div className="text-xs text-neutral-600 flex justify-between border-t border-neutral-200 pt-1.5">
                  <span>Total Payable:</span>
                  <span className="font-bold text-neutral-900 text-sm tabular-nums">₹{totalAmount}</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Drawer Action Bar */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-3">
            {step !== 'cart' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'payment') setStep('address');
                  else if (step === 'address') setStep('slot');
                  else if (step === 'slot') setStep('cart');
                }}
                className="px-3.5 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Back
              </button>
            )}

            <div className="flex-1 flex justify-end">
              {step === 'cart' && (
                <button
                  type="button"
                  onClick={() => setStep('slot')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Select Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'slot' && (
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Add Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'address' && (
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'payment' && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-400 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Assigning Nearby Pro...</span>
                  ) : (
                    <>
                      <span>{lang === 'hi' ? 'बुकिंग कन्फर्म करें' : 'Confirm & Track Live'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
