import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin, Calendar, Upload, ArrowRight, Plus, X, Check } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import type { Skill, ServiceArea, WeekdayAvailability, TimeSlot } from '../../../types';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading, error } = useAuthStore();
  const [step, setStep] = useState(1);
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [experience, setExperience] = useState<number>(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills] = useState<Skill[]>([
    { id: 'skill1', name: 'Electrician' },
    { id: 'skill2', name: 'Plumber' },
    { id: 'skill3', name: 'Carpenter' },
    { id: 'skill4', name: 'Painter' },
    { id: 'skill5', name: 'Mason' },
    { id: 'skill6', name: 'Cleaner' },
    { id: 'skill7', name: 'Gardener' },
    { id: 'skill8', name: 'AC Technician' },
    { id: 'skill9', name: 'Appliance Repair' },
    { id: 'skill10', name: 'Locksmith' },
  ]);
  
  const [availability, setAvailability] = useState<WeekdayAvailability[]>([
    { day: 'monday', available: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'tuesday', available: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'wednesday', available: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'thursday', available: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'friday', available: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'saturday', available: false, slots: [] },
    { day: 'sunday', available: false, slots: [] },
  ]);
  
  const [serviceAreaType, setServiceAreaType] = useState<'pincode' | 'radius'>('radius');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [newPincode, setNewPincode] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [centerCoordinates, setCenterCoordinates] = useState<{latitude: number, longitude: number}>({
    latitude: 12.9716,
    longitude: 77.5946
  });
  
  const [governmentId, setGovernmentId] = useState<File | null>(null);

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !name.trim()) {
      return; // Don't proceed if name is empty
    }
    
    if (step === 2 && selectedSkills.length === 0) {
      return; // Don't proceed if no skills selected
    }
    
    setStep(step + 1);
  };

  // Handle back step
  const handleBackStep = () => {
    setStep(step - 1);
  };

  // Handle skill selection
  const handleSkillSelect = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // Handle availability toggle
  const handleAvailabilityToggle = (dayIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex] = {
      ...updatedAvailability[dayIndex],
      available: !updatedAvailability[dayIndex].available
    };
    
    // If toggling from unavailable to available, add a default slot
    if (!updatedAvailability[dayIndex].available && updatedAvailability[dayIndex].slots.length === 0) {
      updatedAvailability[dayIndex].slots = [{ start: '09:00', end: '17:00' }];
    }
    
    setAvailability(updatedAvailability);
  };

  // Handle time slot change
  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots[slotIndex] = {
      ...updatedAvailability[dayIndex].slots[slotIndex],
      [field]: value
    };
    setAvailability(updatedAvailability);
  };

  // Add new time slot
  const handleAddTimeSlot = (dayIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.push({ start: '09:00', end: '17:00' });
    setAvailability(updatedAvailability);
  };

  // Remove time slot
  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  // Handle pincode add
  const handleAddPincode = () => {
    if (newPincode && !pincodes.includes(newPincode)) {
      setPincodes([...pincodes, newPincode]);
      setNewPincode('');
    }
  };

  // Handle pincode remove
  const handleRemovePincode = (pincode: string) => {
    setPincodes(pincodes.filter(p => p !== pincode));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGovernmentId(e.target.files[0]);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || selectedSkills.length === 0) return;
    
    try {
      // Map selected skills to skill objects
      const selectedSkillObjects = availableSkills.filter(skill => 
        selectedSkills.includes(skill.id)
      );
      
      // Create service area object
      const serviceArea: ServiceArea = serviceAreaType === 'pincode' 
        ? { type: 'pincode', pincodes } 
        : { 
            type: 'radius', 
            center: centerCoordinates, 
            radiusKm 
          };
      
      await completeProfile({
        name,
        skills: selectedSkillObjects,
        experience,
        availability: { weekdays: availability },
        serviceArea,
        verifiedWorker: false, // Workers need to be verified by admin
        rating: 0,
        reviews: []
      });
      
      navigate('/worker/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                step >= stepNumber ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-neutral-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card fade-in p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Complete Your Worker Profile</h1>
      
      {/* Progress steps */}
      {renderStepIndicator()}
      
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
            
            <div className="mb-6">
              <label htmlFor="experience" className="block text-neutral-700 font-medium mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={18} className="text-neutral-500" />
                </div>
                <input
                  type="number"
                  id="experience"
                  min="0"
                  max="50"
                  placeholder="Years of professional experience"
                  value={experience}
                  onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
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
        
        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="fade-in">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Select Your Skills</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Choose the services you can provide to clients. You can select multiple skills.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {availableSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSkillSelect(skill.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      selectedSkills.includes(skill.id) 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                        selectedSkills.includes(skill.id) ? 'bg-primary-500 text-white' : 'bg-neutral-200'
                      }`}>
                        {selectedSkills.includes(skill.id) && <Check size={12} />}
                      </div>
                      {skill.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="btn-outline w-1/2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary w-1/2"
                disabled={selectedSkills.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="fade-in">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Set Your Availability</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Specify the days and times you're available to work.
              </p>
              
              <div className="space-y-4">
                {availability.map((day, dayIndex) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={day.available}
                            onChange={() => handleAvailabilityToggle(dayIndex)}
                          />
                          <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          <span className="ml-3 capitalize">{day.day}</span>
                        </label>
                      </div>
                    </div>
                    
                    {day.available && (
                      <div className="space-y-3">
                        {day.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center space-x-2">
                            <div className="flex-1">
                              <label className="block text-neutral-700 text-sm font-medium mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'start', e.target.value)}
                                className="input text-sm"
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-neutral-700 text-sm font-medium mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'end', e.target.value)}
                                className="input text-sm"
                                required
                              />
                            </div>
                            <div className="flex items-end pb-1">
                              {day.slots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                  className="text-error-600 hover:text-error-700 p-2"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => handleAddTimeSlot(dayIndex)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          <Plus size={16} className="mr-1" />
                          Add Time Slot
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="btn-outline w-1/2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary w-1/2"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Service Area & Verification */}
        {step === 4 && (
          <div className="fade-in">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Service Area</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Define the area where you can provide services.
              </p>
              
              <div className="flex mb-4">
                <button
                  type="button"
                  onClick={() => setServiceAreaType('radius')}
                  className={`flex-1 py-2 px-4 ${
                    serviceAreaType === 'radius' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-neutral-100 text-neutral-700'
                  } rounded-l-md transition-colors`}
                >
                  Radius
                </button>
                <button
                  type="button"
                  onClick={() => setServiceAreaType('pincode')}
                  className={`flex-1 py-2 px-4 ${
                    serviceAreaType === 'pincode' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-neutral-100 text-neutral-700'
                  } rounded-r-md transition-colors`}
                >
                  Pincodes
                </button>
              </div>
              
              {serviceAreaType === 'radius' ? (
                <div className="mb-4">
                  <label className="block text-neutral-700 font-medium mb-2">
                    Service Radius (km)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-neutral-600">1 km</span>
                    <span className="text-primary-600 font-medium">{radiusKm} km</span>
                    <span className="text-sm text-neutral-600">50 km</span>
                  </div>
                  
                  <div className="mt-4 bg-neutral-100 rounded-lg p-4 text-center text-neutral-700">
                    <MapPin size={20} className="text-primary-500 inline-block mr-2" />
                    Using your current location as center
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-neutral-700 font-medium mb-2">
                    Add Pincodes
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="input flex-1 mr-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddPincode}
                      className="btn-primary py-2"
                      disabled={!newPincode}
                    >
                      Add
                    </button>
                  </div>
                  
                  {pincodes.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {pincodes.map((pincode) => (
                        <div 
                          key={pincode}
                          className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full flex items-center"
                        >
                          {pincode}
                          <button
                            type="button"
                            onClick={() => handleRemovePincode(pincode)}
                            className="ml-2 text-primary-700 hover:text-primary-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-sm mt-2">
                      No pincodes added yet. Add at least one pincode.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">ID Verification</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Upload a government-issued ID for verification. This helps build trust with clients.
              </p>
              
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="government-id"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="government-id"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload size={36} className="text-neutral-400 mb-2" />
                  <p className="text-neutral-700 font-medium mb-1">
                    {governmentId ? governmentId.name : 'Upload Your ID'}
                  </p>
                  <p className="text-neutral-500 text-sm">
                    Drag & drop or click to browse. Supports JPG, PNG, PDF
                  </p>
                </label>
              </div>
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
                disabled={loading || (serviceAreaType === 'pincode' && pincodes.length === 0)}
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