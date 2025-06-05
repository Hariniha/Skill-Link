import { create } from 'zustand';
import type { AuthState, LoginCredentials, OtpVerification, User } from '../types';

// Mock user data for demo purposes
const mockUsers = {
  client: {
    id: 'client123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91987654321',
    role: 'client',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: new Date(),
    verified: true,
    address: [
      {
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
    ],
  },
  worker: {
    id: 'worker456',
    name: 'Mike Smith',
    email: 'mike@example.com',
    phone: '+91876543210',
    role: 'worker',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    createdAt: new Date(),
    verified: true,
    skills: [{ id: 'skill1', name: 'Electrician' }],
    experience: 5,
    availability: {
      weekdays: [
        {
          day: 'monday',
          available: true,
          slots: [{ start: '09:00', end: '17:00' }],
        },
        {
          day: 'tuesday',
          available: true,
          slots: [{ start: '09:00', end: '17:00' }],
        },
        {
          day: 'wednesday',
          available: true,
          slots: [{ start: '09:00', end: '17:00' }],
        },
        {
          day: 'thursday',
          available: true,
          slots: [{ start: '09:00', end: '17:00' }],
        },
        {
          day: 'friday',
          available: true,
          slots: [{ start: '09:00', end: '17:00' }],
        },
        {
          day: 'saturday',
          available: false,
          slots: [],
        },
        {
          day: 'sunday',
          available: false,
          slots: [],
        },
      ],
    },
    serviceArea: {
      type: 'radius',
      center: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      radiusKm: 10,
    },
    verifiedWorker: true,
    rating: 4.8,
    reviews: [],
  },
};

interface AuthStore extends AuthState {
  selectedRole: 'client' | 'worker' | null;
  setSelectedRole: (role: 'client' | 'worker' | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyOtp: (verification: OtpVerification) => Promise<void>;
  logout: () => void;
  completeProfile: (userData: Partial<User>) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  selectedRole: null,

  setSelectedRole: (role) => set({ selectedRole: role }),

  login: async (credentials) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, this would make an API request to send OTP
      set({ 
        loading: false,
        // Don't set user yet, just keep track of the login attempt
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Login failed. Please try again.' 
      });
    }
  },

  verifyOtp: async (verification) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const role = useAuthStore.getState().selectedRole;
      
      if (!role) {
        throw new Error('Role not selected');
      }
      
      // Simulate successful verification
      // In a real app, we would verify the OTP with the backend
      const mockUser = mockUsers[role] as User;
      
      set({ 
        loading: false,
        user: mockUser,
        isAuthenticated: true
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'OTP verification failed. Please try again.' 
      });
    }
  },

  completeProfile: async (userData) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update user data
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = { ...currentUser, ...userData };
      
      set({ 
        loading: false,
        user: updatedUser
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Profile update failed. Please try again.' 
      });
    }
  },

  logout: () => {
    // Clear user data
    set({ 
      user: null,
      isAuthenticated: false,
      selectedRole: null
    });
  }
}));

export default useAuthStore;