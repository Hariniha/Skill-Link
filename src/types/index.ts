// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'worker';
  profileImage?: string;
  createdAt: Date;
  verified: boolean;
}

export interface ClientProfile extends User {
  role: 'client';
  address: Address[];
}

export interface WorkerProfile extends User {
  role: 'worker';
  skills: Skill[];
  experience: number;
  availability: Availability;
  serviceArea: ServiceArea;
  governmentId?: string;
  verifiedWorker: boolean;
  rating: number;
  reviews: Review[];
}

// Common Types
export interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Skill {
  id: string;
  name: string;
}

export interface Availability {
  weekdays: WeekdayAvailability[];
}

export interface WeekdayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  available: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface ServiceArea {
  type: 'pincode' | 'radius';
  pincodes?: string[];
  center?: {
    latitude: number;
    longitude: number;
  };
  radiusKm?: number;
}

// Booking Types
export interface Booking {
  id: string;
  clientId: string;
  workerId: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: Date;
  scheduledTime: TimeSlot;
  location: Address;
  notes?: string;
  payment?: Payment;
  review?: Review;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'upi' | 'card' | 'cash' | 'razorpay' | 'stripe';
  transactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  workerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'image' | 'location';
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phone?: string;
  email?: string;
  role: 'client' | 'worker';
}

export interface OtpVerification {
  phone?: string;
  email?: string;
  otp: string;
}