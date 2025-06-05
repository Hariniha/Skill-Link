
import { create } from 'zustand';
import type { WorkerProfile } from '../types';

interface WorkerState {
  workers: WorkerProfile[];
  loading: boolean;
  error: string | null;
}

interface SearchParams {
  query?: string;
  skill?: string;
  minRating?: number;
  maxDistance?: number;
  verifiedOnly?: boolean;
  availableNow?: boolean;
}

interface WorkerStore extends WorkerState {
  fetchWorkers: () => Promise<void>;
  searchWorkers: (params: SearchParams) => Promise<void>;
  getWorkerById: (id: string) => Promise<WorkerProfile | null>;
}

// Mock worker data
const mockWorkers: WorkerProfile[] = [
  {
    id: 'w1',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+919876543210',
    role: 'worker',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: new Date(),
    verified: true,
    skills: [{ id: 'skill1', name: 'Electrician' }],
    experience: 8,
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
  {
    id: 'w2',
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+919876543211',
    role: 'worker',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: new Date(),
    verified: true,
    skills: [{ id: 'skill2', name: 'Plumber' }],
    experience: 6,
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
        latitude: 12.9516,
        longitude: 77.5846,
      },
      radiusKm: 10,
    },
    verifiedWorker: true,
    rating: 4.9,
    reviews: [],
  },
];

const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: [],
  loading: false,
  error: null,

  fetchWorkers: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      set({ 
        loading: false,
        workers: mockWorkers,
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to fetch workers. Please try again.' 
      });
    }
  },

  searchWorkers: async (params: SearchParams) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filteredWorkers = [...mockWorkers];
      
      // Apply filters
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredWorkers = filteredWorkers.filter(worker => 
          worker.name.toLowerCase().includes(query) ||
          worker.skills.some(skill => skill.name.toLowerCase().includes(query))
        );
      }
      
      if (params.skill) {
        filteredWorkers = filteredWorkers.filter(worker =>
          worker.skills.some(skill => skill.name === params.skill)
        );
      }
      
      if (params.minRating) {
        filteredWorkers = filteredWorkers.filter(worker =>
          worker.rating >= params.minRating!
        );
      }
      
      if (params.verifiedOnly) {
        filteredWorkers = filteredWorkers.filter(worker =>
          worker.verifiedWorker
        );
      }
      
      set({ 
        loading: false,
        workers: filteredWorkers,
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to search workers. Please try again.' 
      });
    }
  },

  getWorkerById: async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const worker = mockWorkers.find(w => w.id === id) || null;
      return worker;
    } catch (error) {
      return null;
    }
  },
}));

export default useWorkerStore;