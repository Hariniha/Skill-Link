import { create } from 'zustand';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationState {
  userLocation: Location | null;
  loading: boolean;
  error: string | null;
}

interface LocationStore extends LocationState {
  getUserLocation: () => Promise<void>;
  setUserLocation: (location: Location) => void;
}

const useLocationStore = create<LocationStore>((set) => ({
  userLocation: null,
  loading: false,
  error: null,

  getUserLocation: async () => {
    set({ loading: true, error: null });
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      set({ 
        loading: false,
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to get location. Please enable location access.' 
      });
    }
  },

  setUserLocation: (location: Location) => {
    set({ userLocation: location });
  },
}));

export default useLocationStore;