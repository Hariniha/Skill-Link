import { create } from 'zustand';
import type { Booking, Address, TimeSlot } from '../types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Partial<Booking> | null;
  loading: boolean;
  error: string | null;
}

interface BookingStore extends BookingState {
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<Booking | null>;
  createBooking: (booking: Partial<Booking>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<Booking>;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
  initiateBooking: (workerId: string, service: string) => void;
  setBookingDateTime: (date: Date, timeSlot: TimeSlot) => void;
  setBookingLocation: (location: Address) => void;
  addBookingNotes: (notes: string) => void;
  clearCurrentBooking: () => void;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: 'booking1',
    clientId: 'client123',
    workerId: 'worker456',
    service: 'Electrical Repair',
    status: 'confirmed',
    scheduledDate: new Date(Date.now() + 86400000), // tomorrow
    scheduledTime: { start: '10:00', end: '12:00' },
    location: {
      id: 'addr1',
      name: 'Home',
      addressLine1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
    },
    createdAt: new Date(Date.now() - 86400000), // yesterday
    updatedAt: new Date(),
  },
  {
    id: 'booking2',
    clientId: 'client123',
    workerId: 'worker789',
    service: 'Plumbing',
    status: 'completed',
    scheduledDate: new Date(Date.now() - 172800000), // 2 days ago
    scheduledTime: { start: '14:00', end: '16:00' },
    location: {
      id: 'addr1',
      name: 'Home',
      addressLine1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
    },
    payment: {
      id: 'payment1',
      bookingId: 'booking2',
      amount: 1200,
      status: 'completed',
      method: 'upi',
      transactionId: 'txn123456',
      receiptUrl: '/receipt/txn123456',
      createdAt: new Date(Date.now() - 172000000),
    },
    review: {
      id: 'review1',
      bookingId: 'booking2',
      clientId: 'client123',
      workerId: 'worker789',
      rating: 4,
      comment: 'Good service, arrived on time',
      createdAt: new Date(Date.now() - 171000000),
    },
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    updatedAt: new Date(Date.now() - 172000000),
  },
];

const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      set({ 
        loading: false,
        bookings: mockBookings,
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to fetch bookings. Please try again.' 
      });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const booking = mockBookings.find(b => b.id === id) || null;
      
      set({ loading: false });
      
      return booking;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to fetch booking. Please try again.' 
      });
      return null;
    }
  },

  createBooking: async (booking: Partial<Booking>) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newBooking: Booking = {
        id: `booking${Date.now()}`,
        clientId: 'client123',
        workerId: booking.workerId || '',
        service: booking.service || '',
        status: 'pending',
        scheduledDate: booking.scheduledDate || new Date(),
        scheduledTime: booking.scheduledTime || { start: '09:00', end: '11:00' },
        location: booking.location!,
        notes: booking.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set(state => ({ 
        loading: false,
        bookings: [...state.bookings, newBooking],
        currentBooking: null,
      }));
      
      return newBooking;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to create booking. Please try again.' 
      });
      throw error;
    }
  },

  updateBookingStatus: async (id: string, status: Booking['status']) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const bookings = get().bookings;
      const bookingIndex = bookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      const updatedBooking = {
        ...bookings[bookingIndex],
        status,
        updatedAt: new Date()
      };
      
      const updatedBookings = [...bookings];
      updatedBookings[bookingIndex] = updatedBooking;
      
      set({ 
        loading: false,
        bookings: updatedBookings,
      });
      
      return updatedBooking;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to update booking. Please try again.' 
      });
      throw error;
    }
  },

  setCurrentBooking: (booking) => {
    set({ currentBooking: booking });
  },

  initiateBooking: (workerId, service) => {
    set({
      currentBooking: {
        workerId,
        service,
        status: 'pending',
      }
    });
  },

  setBookingDateTime: (date, timeSlot) => {
    set(state => ({
      currentBooking: {
        ...state.currentBooking!,
        scheduledDate: date,
        scheduledTime: timeSlot,
      }
    }));
  },

  setBookingLocation: (location) => {
    set(state => ({
      currentBooking: {
        ...state.currentBooking!,
        location,
      }
    }));
  },

  addBookingNotes: (notes) => {
    set(state => ({
      currentBooking: {
        ...state.currentBooking!,
        notes,
      }
    }));
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  }
}));

export default useBookingStore;