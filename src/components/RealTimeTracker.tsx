import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Play,
  RotateCcw,
  Send,
  Download,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { BookingRecord, TrackingStatus, ChatMessage } from '../types/service';

interface RealTimeTrackerProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onUpdateBooking: (updated: BookingRecord) => void;
  lang: 'en' | 'hi';
}

const TRACKING_STEPS: { key: TrackingStatus; label: string; labelHi: string; desc: string }[] = [
  { 
    key: 'confirmed', 
    label: 'Booking Confirmed', 
    labelHi: 'बुकिंग कन्फर्म हो गई',
    desc: 'Order received & scheduled with central service center.' 
  },
  { 
    key: 'technician_assigned', 
    label: 'Technician Assigned', 
    labelHi: 'टेक्नीशियन नियुक्त हुआ',
    desc: 'Certified professional assigned with genuine toolkit.' 
  },
  { 
    key: 'on_the_way', 
    label: 'On The Way', 
    labelHi: 'रास्ते में है (ऑन द वे)',
    desc: 'Technician is en route on bike to your location.' 
  },
  { 
    key: 'reached', 
    label: 'Reached Doorstep', 
    labelHi: 'आपके घर पहुंच चुके हैं',
    desc: 'At location. Verify safety OTP before letting inside.' 
  },
  { 
    key: 'in_progress', 
    label: 'Service In Progress', 
    labelHi: 'काम शुरू हो चुका है',
    desc: 'Diagnostic check and precision service underway.' 
  },
  { 
    key: 'completed', 
    label: 'Job Completed', 
    labelHi: 'कार्य संपन्न व सत्यापित',
    desc: 'Service verified by customer. 30-day warranty active.' 
  },
];

export const RealTimeTracker: React.FC<RealTimeTrackerProps> = ({
  booking,
  onClose,
  onUpdateBooking,
  lang,
}) => {
  if (!booking) return null;

  // Active step index
  const currentStepIdx = TRACKING_STEPS.findIndex(s => s.key === booking.status);
  const activeIndex = currentStepIdx === -1 ? 0 : currentStepIdx;

  // Real-time animation / progress along route (0 to 100%)
  const [routeProgress, setRouteProgress] = useState<number>(() => {
    if (booking.status === 'confirmed') return 5;
    if (booking.status === 'technician_assigned') return 20;
    if (booking.status === 'on_the_way') return 55;
    if (booking.status === 'reached') return 95;
    if (booking.status === 'in_progress') return 100;
    return 100;
  });

  const [isSimulatingLiveMove, setIsSimulatingLiveMove] = useState(false);
  const [eta, setEta] = useState(booking.etaMinutes || 14);

  // Modals for Calling & Chat
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'technician',
      text: lang === 'hi' 
        ? 'नमस्ते सर! मैं अर्बनसेवा से आपका सर्विस पार्टनर हूँ। आवश्यक टूलकिट और स्पेयर पार्ट्स लेकर रवाना हो गया हूँ।'
        : 'Hello Sir! I am your UrbanSeva service partner. Carrying the genuine toolkit and sanitization gear.',
      timestamp: '10:18 AM'
    }
  ]);

  // Rating state for completed job
  const [userRating, setUserRating] = useState<number>(booking.customerRating || 5);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(!!booking.customerRating);

  // Live Auto-Movement simulation
  useEffect(() => {
    let interval: any;
    if (isSimulatingLiveMove && booking.status === 'on_the_way') {
      interval = setInterval(() => {
        setRouteProgress(prev => {
          if (prev >= 94) {
            // Arrived at doorstep
            onUpdateBooking({
              ...booking,
              status: 'reached',
              etaMinutes: 0,
            });
            setIsSimulatingLiveMove(false);
            return 98;
          }
          const next = prev + 5;
          setEta(Math.max(1, Math.round((100 - next) * 0.2)));
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingLiveMove, booking.status]);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isCallModalOpen) {
      timer = setInterval(() => setCallTimer(t => t + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(timer);
  }, [isCallModalOpen]);

  // Advance to next stage helper
  const handleAdvanceStage = () => {
    const nextIdx = Math.min(TRACKING_STEPS.length - 1, activeIndex + 1);
    const nextStatus = TRACKING_STEPS[nextIdx].key;
    
    let newProgress = 20;
    let newEta = 15;
    if (nextStatus === 'on_the_way') { newProgress = 50; newEta = 12; }
    if (nextStatus === 'reached') { newProgress = 96; newEta = 0; }
    if (nextStatus === 'in_progress') { newProgress = 100; newEta = 0; }
    if (nextStatus === 'completed') { newProgress = 100; newEta = 0; }

    setRouteProgress(newProgress);
    setEta(newEta);

    onUpdateBooking({
      ...booking,
      status: nextStatus,
      etaMinutes: newEta,
    });
  };

  const handleResetStage = () => {
    setRouteProgress(15);
    setEta(18);
    onUpdateBooking({
      ...booking,
      status: 'technician_assigned',
      etaMinutes: 18,
    });
  };

  const handleSendChatMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulated reply from technician after 1.2s
    setTimeout(() => {
      let replyText = 'जी सर, बिल्कुल! मैं सुरक्षा गाइडलाइन्स का पूरा ध्यान रखूँगा।';
      if (textToSend.includes('Gate') || textToSend.includes('गेट')) {
        replyText = 'ठीक है सर, मैं गेट नंबर 2 से एंट्री करके गार्ड को आपका फ्लैट नंबर बता दूँगा।';
      } else if (textToSend.includes('kahan') || textToSend.includes('कहाँ') || textToSend.includes('Where')) {
        replyText = 'सर मैं बस पास के सिग्नल पर हूँ, 5-7 मिनट में आपके फ्लैट पर पहुँच रहा हूँ।';
      } else {
        replyText = 'धन्यवाद सर, मैं रास्ते में हूँ और समय पर पहुँचूँगा!';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'technician',
          text: replyText,
          timestamp: 'Just now'
        }
      ]);
    }, 1200);
  };

  const handleToggleWorkTask = (taskIndex: number) => {
    const updatedChecklist = [...booking.workChecklist];
    updatedChecklist[taskIndex].completed = !updatedChecklist[taskIndex].completed;
    onUpdateBooking({
      ...booking,
      workChecklist: updatedChecklist,
    });
  };

  const handleSaveRating = () => {
    setRatingSubmitted(true);
    onUpdateBooking({
      ...booking,
      customerRating: userRating,
    });
  };

  // Map Waypoint calculation based on routeProgress (0-100)
  // Route goes from (start: 80% left, 25% top) through curves to (dest: 25% left, 75% top)
  const calculateMarkerPos = (pct: number) => {
    const t = pct / 100;
    // Bezier curve approximation
    const p0 = { x: 80, y: 22 };
    const p1 = { x: 45, y: 35 };
    const p2 = { x: 60, y: 70 };
    const p3 = { x: 28, y: 76 };

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const xt = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
    const yt = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

    return { x: xt, y: yt };
  };

  const markerPos = calculateMarkerPos(routeProgress);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        role="dialog"
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
              <Navigation className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  {lang === 'hi' ? 'लाइव टेक्नीशियन ट्रैकिंग' : 'Live Technician Tracking'}
                </h2>
                <span className="text-xs font-mono font-bold text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded">
                  #{booking.id}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {booking.items.map(i => i.service.name).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. INTERACTIVE LIVE MAP CANVAS */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-900 shadow-md">
            
            {/* Map Canvas Background (Simulated Vector Roads & Grid) */}
            <div className="h-64 sm:h-72 w-full relative bg-[#1e2430] overflow-hidden select-none">
              
              {/* Road Grid lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                  <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#roadGrid)" />
                
                {/* Simulated Main Roads */}
                <path d="M -20 180 Q 200 120 400 200 T 900 150" fill="none" stroke="#475569" strokeWidth="16" />
                <path d="M 320 -20 Q 340 180 320 320" fill="none" stroke="#475569" strokeWidth="14" />
                <path d="M 600 -20 L 580 320" fill="none" stroke="#334155" strokeWidth="10" />

                {/* Active GPS Route line */}
                <path 
                  d="M 640 60 Q 360 90 480 180 T 224 200" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Destination Marker (Customer Home) */}
              <div 
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                style={{ left: '28%', top: '76%' }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5 text-rose-500 fill-rose-500" />
                  </div>
                  <div className="absolute -inset-1 rounded-full border border-rose-500/40 animate-ping pointer-events-none" />
                </div>
                <div className="mt-1 px-2 py-0.5 bg-neutral-900/90 backdrop-blur-xs text-white text-[10px] font-bold rounded shadow-md border border-neutral-700 whitespace-nowrap">
                  Your Address: {booking.address.flatNo}
                </div>
              </div>

              {/* Moving Technician Vehicle Marker */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ease-out"
                style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-emerald-500 border-2 border-white shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform">
                    <Navigation className="w-5 h-5 transform -rotate-45" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-pulse pointer-events-none" />
                </div>
                <div className="mt-1 px-2.5 py-0.5 bg-emerald-950/95 text-emerald-300 text-[11px] font-bold rounded shadow-md border border-emerald-600/50 whitespace-nowrap">
                  {booking.technician.name} ({booking.technician.vehicleNumber})
                </div>
              </div>

              {/* Top Map Floating Badge: Live ETA & Distance */}
              <div className="absolute top-3 left-3 z-30 bg-neutral-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-neutral-700 shadow-lg flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider">
                    {booking.status === 'reached' 
                      ? 'Pro Arrived' 
                      : (booking.status === 'in_progress' ? 'Service Underway' : 'Live ETA')}
                  </div>
                  <div className="text-sm font-bold text-white tabular-nums">
                    {booking.status === 'reached' 
                      ? 'At Doorstep Now' 
                      : (booking.status === 'in_progress' ? 'Working in Flat' : `${eta} mins away (1.8 km)`)}
                  </div>
                </div>
              </div>

              {/* Bottom Right Map Simulation Tools */}
              <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
                {booking.status === 'on_the_way' && (
                  <button
                    type="button"
                    onClick={() => setIsSimulatingLiveMove(!isSimulatingLiveMove)}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isSimulatingLiveMove ? 'Pause GPS' : 'Auto-Move Bike'}</span>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleAdvanceStage}
                  disabled={booking.status === 'completed'}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetStage}
                  className="p-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700 transition-colors"
                  title="Reset demo stages"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Doorstep Verification Bar with Security OTP */}
            <div className="bg-neutral-950 px-4 py-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">
                  {lang === 'hi' 
                    ? 'दरवाजे पर वेरिफाई करने के लिए सुरक्षा कोड:' 
                    : 'Doorstep Security Verification OTP:'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-bold tracking-widest text-emerald-400 bg-neutral-900 px-3 py-1 rounded-md border border-emerald-500/30 tabular-nums">
                  {booking.otp}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {lang === 'hi' ? '(टेक्नीशियन को आगमन पर बताएं)' : '(Share only when pro arrives)'}
                </span>
              </div>
            </div>

          </div>

          {/* 2. TECHNICIAN PROFILE CARD & CONTACT ACTIONS */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={booking.technician.photoUrl}
                  alt={booking.technician.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                  <Check className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {booking.technician.name}
                  </h3>
                  <span className="text-[10px] font-bold text-neutral-800 bg-neutral-200/80 px-2 py-0.5 rounded">
                    Urban Verified Pro
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1 font-bold text-neutral-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{booking.technician.rating}</span>
                  </span>
                  <span>·</span>
                  <span>{booking.technician.completedJobs.toLocaleString()} jobs</span>
                  <span>·</span>
                  <span>{booking.technician.experienceYears} yrs exp</span>
                </div>

                <div className="text-[11px] text-neutral-500">
                  Riding {booking.technician.vehicle} · Reg: {booking.technician.vehicleNumber}
                </div>
              </div>
            </div>

            {/* Direct Calling & Chat Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-900 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-700" />
                <span>{lang === 'hi' ? 'कॉल करें' : 'Call Partner'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsChatModalOpen(true)}
                className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मैसेज करें' : 'Chat Live'}</span>
              </button>
            </div>

          </div>

          {/* 3. STEP PROGRESS TRACKER */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {lang === 'hi' ? 'सेवा की प्रगति स्थिति' : 'Live Booking Lifecycle'}
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {TRACKING_STEPS.map((st, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/10'
                        : isPassed
                        ? 'bg-emerald-50/70 text-emerald-950 border-emerald-200'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tabular-nums">
                        Step 0{idx + 1}
                      </span>
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ) : null}
                    </div>

                    <div className="text-xs font-bold leading-tight">
                      {lang === 'hi' ? st.labelHi : st.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. WORK IN PROGRESS CHECKLIST (If reached or in progress) */}
          {(booking.status === 'in_progress' || booking.status === 'reached' || booking.status === 'completed') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {lang === 'hi' ? 'लाइव कार्य चेकलिस्ट' : 'Live Job Execution Checklist'}
                  </h4>
                </div>
                <span className="text-xs text-neutral-500">
                  {booking.workChecklist.filter(c => c.completed).length} / {booking.workChecklist.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {booking.workChecklist.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleWorkTask(idx)}
                    className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 flex items-center justify-between transition-colors"
                  >
                    <span className={`text-xs ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-800 font-medium'}`}>
                      {item.task}
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300'
                    }`}>
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. JOB COMPLETED & INVOICE / RATING (When completed) */}
          {booking.status === 'completed' && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'hi' ? 'सेवा सफलतापूर्वक संपन्न!' : 'Job Completed Successfully!'}</span>
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your 30-Day Free Warranty coverage has been activated for this service.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => alert(`Downloading GST Tax Invoice for Booking ${booking.id}...`)}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-950 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>

              {/* Rate Pro section */}
              <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3">
                <div className="text-xs font-bold text-neutral-900">
                  {lang === 'hi' ? 'टेक्नीशियन को रेटिंग दें' : 'Rate Your Experience with'} {booking.technician.name}
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= userRating ? 'fill-amber-400' : 'text-neutral-300 fill-none'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">
                    {userRating}.0 / 5.0
                  </span>
                </div>

                {!ratingSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSaveRating}
                    className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    Submit Feedback
                  </button>
                ) : (
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Thank you! Your rating has been recorded.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. BOOKING SUMMARY MINI ACCORDION */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Scheduled Date & Time</span>
              <span className="font-semibold text-neutral-900">{booking.serviceDate}, {booking.timeSlot}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Service Location</span>
              <span className="font-semibold text-neutral-900">{booking.address.flatNo}, {booking.address.building}, {booking.address.city}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Payment Mode</span>
              <span className="font-semibold text-neutral-900 uppercase">{booking.paymentMethod} (₹{booking.finalAmount})</span>
            </div>
          </div>

        </div>

        {/* --- SIMULATED PHONE CALL MODAL --- */}
        {isCallModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 text-white rounded-3xl p-6 text-center space-y-6 shadow-2xl border border-neutral-800 animate-in zoom-in-95">
              
              <div className="space-y-2 pt-2">
                <img
                  src={booking.technician.photoUrl}
                  alt={booking.technician.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-500/40 shadow-lg"
                />
                <h3 className="text-base font-bold text-white">{booking.technician.name}</h3>
                <p className="text-xs text-neutral-400">UrbanSeva Verified Partner</p>
                <div className="text-xs font-mono text-emerald-400 tabular-nums">
                  Calling... 00:{callTimer < 10 ? `0${callTimer}` : callTimer}
                </div>
              </div>

              {/* Sound wave visual */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[12, 24, 18, 30, 15, 28, 10, 20].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-emerald-400 rounded-full animate-pulse" 
                    style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }} 
                  />
                ))}
              </div>

              <div className="text-xs text-neutral-400 bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/60">
                "Hello sir! I am arriving near your society main gate in 5 minutes."
              </div>

              <button
                type="button"
                onClick={() => setIsCallModalOpen(false)}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white mx-auto flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                title="End Call"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        )}

        {/* --- IN-APP CHAT MODAL --- */}
        {isChatModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl h-[520px] flex flex-col justify-between shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95">
              
              {/* Chat Header */}
              <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.technician.photoUrl}
                    alt={booking.technician.name}
                    className="w-9 h-9 rounded-full object-cover border border-white"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{booking.technician.name}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Online on duty</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        m.sender === 'user'
                          ? 'bg-neutral-900 text-white rounded-br-xs'
                          : 'bg-white text-neutral-800 border border-neutral-200 shadow-xs rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Reply Chips */}
              <div className="p-2 border-t border-neutral-200 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSendChatMessage('Gate No 2 se entry karna please')}
                  className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md shrink-0 transition-colors"
                >
                  Gate No 2 se aana
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage('Aap kahan tak pahuche?')}
                  className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md shrink-0 transition-colors"
                >
                  Kahan tak pahuche?
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage('Gate pahunch kar call kar dena')}
                  className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md shrink-0 transition-colors"
                >
                  Gate par call karein
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(chatInput)}
                  placeholder="Type a message to technician..."
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => handleSendChatMessage(chatInput)}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
