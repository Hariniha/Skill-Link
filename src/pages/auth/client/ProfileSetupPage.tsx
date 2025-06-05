import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import type { Address } from '../../../types';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading, error } = useAuthStore();
  const [step, setStep] = useState(1);
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [addresses, setAddresses] = useState<Partial<Address>[]>([{
    name: 'Home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  }]);

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !name.trim()) {
      return; // Don't proceed if name is empty
    }
    setStep(step + 1);
  };

  // Handle back step
  const handleBackStep = () => {
    setStep(step - 1);
  };

  // Handle address change
  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    const updatedAddresses = [...addresses];
    
    if (field === 'addressLine1' || field === 'addressLine2' || field === 'city' || 
        field === 'state' || field === 'pincode' || field === 'name') {
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value
      };
    }
    
    setAddresses(updatedAddresses);
  };

  // Handle address name change
  const handleAddressNameChange = (index: number, value: string) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      name: value
    };
    setAddresses(updatedAddresses);
  };

  // Add new address
  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        name: `Address ${addresses.length + 1}`,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    ]);
  };

  // Remove address
  const handleRemoveAddress = (index: number) => {
    if (addresses.length === 1) return; // Don't remove the last address
    
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    
    // If we removed the default address, make the first one default
    if (addresses[index].isDefault) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
  };

  // Set default address
  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = addresses.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    setAddresses(updatedAddresses);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) return;
    
    const isAddressValid = addresses.every(
      addr => addr.addressLine1 && addr.city && addr.state && addr.pincode
    );
    
    if (!isAddressValid) return;
    
    try {
      // Add IDs to addresses
      const addressesWithIds = addresses.map((addr, index) => ({
        ...addr,
        id: `addr-${Date.now()}-${index}`
      }));
      
      await completeProfile({
        name,
        address: addressesWithIds as Address[]
      });
      
      navigate('/client/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="card fade-in p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
      
      {/* Progress steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
            step >= 1 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${
            step >= 2 ? 'bg-primary-500' : 'bg-neutral-200'
          }`}></div>
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
            step >= 2 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
          }`}>
            2
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="fade-in">
            <div className="mb-6">
              <label htmlFor="name\" className="block text-neutral-700 font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  required
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary w-full flex items-center justify-center"
              disabled={!name.trim()}
            >
              Continue
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        )}
        
        {/* Step 2: Address Information */}
        {step === 2 && (
          <div className="fade-in">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Your Addresses</h2>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  + Add Address
                </button>
              </div>
              
              {addresses.map((address, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => handleAddressNameChange(index, e.target.value)}
                        className="font-medium text-neutral-800 border-none p-0 focus:ring-0"
                        placeholder="Address Label"
                      />
                    </div>
                    <div className="flex items-center">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(index)}
                          className="text-sm text-primary-600 hover:text-primary-700 mr-3"
                        >
                          Set as Default
                        </button>
                      )}
                      {address.isDefault && (
                        <span className="text-sm text-success-600 bg-success-50 px-2 py-1 rounded-full mr-3">
                          Default
                        </span>
                      )}
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(index)}
                          className="text-sm text-error-600 hover:text-error-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 text-sm font-medium mb-1">
                        Address Line 1
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-neutral-500" />
                        </div>
                        <input
                          type="text"
                          value={address.addressLine1}
                          onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                          className="input pl-10 text-sm"
                          placeholder="Street address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-neutral-700 text-sm font-medium mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.addressLine2}
                        onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                        className="input text-sm"
                        placeholder="Apartment, suite, unit, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neutral-700 text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                        className="input text-sm"
                        placeholder="City"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neutral-700 text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                        className="input text-sm"
                        placeholder="State"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neutral-700 text-sm font-medium mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                        className="input text-sm"
                        placeholder="Pincode"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="btn-outline w-1/2"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary w-1/2 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small\" color="#ffffff" />
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSetupPage;