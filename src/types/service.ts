export type ServiceCategory = 
  | 'all'
  | 'electrician'
  | 'mechanic_plumber'
  | 'ac_repair'
  | 'home_cleaner'
  | 'facility_maintenance';

export interface ServiceItem {
  id: string;
  name: string;
  hindiName: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  durationMinutes: number;
  description: string;
  shortDescHindi: string;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  warrantyDays: number;
  popular?: boolean;
  tag?: string;
  iconName: string;
}

export type TrackingStatus = 
  | 'confirmed'
  | 'technician_assigned'
  | 'on_the_way'
  | 'reached'
  | 'in_progress'
  | 'completed';

export interface TechnicianInfo {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  rating: number;
  completedJobs: number;
  experienceYears: number;
  verifiedBadges: string[];
  vehicle: string;
  vehicleNumber: string;
  currentLat: number;
  currentLng: number;
}

export interface BookingAddress {
  flatNo: string;
  building: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  phoneNumber: string;
  customerName: string;
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
  selectedAddons?: string[];
}

export interface BookingRecord {
  id: string;
  userId?: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  serviceDate: string;
  timeSlot: string;
  address: BookingAddress;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid';
  status: TrackingStatus;
  technician: TechnicianInfo;
  otp: string;
  etaMinutes: number;
  currentStepIndex: number;
  workChecklist: { task: string; completed: boolean }[];
  customerRating?: number;
  customerFeedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'technician' | 'system';
  text: string;
  timestamp: string;
}
