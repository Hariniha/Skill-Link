import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText, ArrowRight } from 'lucide-react';
import useWorkerStore from '../../store/workerStore';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { WorkerProfile, Address, TimeSlot } from '../../types';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getWorkerById } = useWorkerStore();
  const { initiateBooking, setBookingDateTime, setBookingLocation, addBookingNotes, loading } = useBookingStore();

//   createBooking

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchWorker = async () => {
      if (id) {
        const workerData = await getWorkerById(id);
        if (workerData) {
          setWorker(workerData);
          initiateBooking(id, workerData.skills[0].name);
        }
      }
    };
    fetchWorker();
  }, [id, getWorkerById, initiateBooking]);

  if (!worker || !user) {
    return <LoadingSpinner fullScreen />;
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTimeSlot) {
      setBookingDateTime(selectedDate, selectedTimeSlot);
      setStep(2);
    } else if (step === 2 && selectedAddress) {
      setBookingLocation(selectedAddress);
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedAddress) return;

    try {
      addBookingNotes(notes);
    //   const booking = await createBooking({
    //     workerId: worker.id,
    //     service: worker.skills[0].name,
    //     scheduledDate: selectedDate,
    //     scheduledTime: selectedTimeSlot,
    //     location: selectedAddress,
    //     notes: notes.trim() || undefined
    //   });
      
      navigate(`/client/bookings`);
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  const isWeekdayAvailable = (date: Date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return worker.availability.weekdays.find(day => day.day === weekday)?.available || false;
  };

 const getAvailableTimeSlots = () => {
  const weekday = selectedDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase(); // Gets 'monday', 'tuesday', etc.

  const dayAvailability = worker.availability.weekdays.find(day => day.day === weekday);
  return dayAvailability?.available ? dayAvailability.slots : [];
};

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <img
              src={worker.profileImage || 'https://via.placeholder.com/64'}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold">Book {worker.name}</h1>
              <p className="text-neutral-600">{worker.skills.map(skill => skill.name).join(', ')}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
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
              <div className={`w-16 h-1 ${
                step >= 3 ? 'bg-primary-500' : 'bg-neutral-200'
              }`}></div>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                step >= 3 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="fade-in">
              <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isAvailable = isWeekdayAvailable(date);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => isAvailable && handleDateSelect(date)}
                        className={`p-3 rounded-lg text-center ${
                          selectedDate && date.toDateString() === selectedDate.toDateString()
                            ? 'bg-primary-500 text-white'
                            : isAvailable
                            ? 'bg-neutral-100 hover:bg-primary-50'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                        disabled={!isAvailable}
                      >
                        <div className="text-sm mb-1">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="font-semibold">
                          {date.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-neutral-700 font-medium mb-2">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {getAvailableTimeSlots().map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeSlotSelect(slot)}
                        className={`p-3 rounded-lg text-center ${
                          selectedTimeSlot === slot
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 hover:bg-primary-50'
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Location Selection */}
          {step === 2 && (
            <div className="fade-in">
              <h2 className="text-lg font-semibold mb-4">Select Location</h2>
              
              <div className="space-y-3">
                {(user as any).address.map((address: Address) => (
                  <button
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`w-full p-4 rounded-lg text-left border-2 transition-colors ${
                      selectedAddress === address
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <MapPin size={20} className="text-primary-500 mt-1 mr-3" />
                      <div>
                        <div className="font-medium">{address.name}</div>
                        <div className="text-neutral-600 text-sm">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </div>
                        <div className="text-neutral-600 text-sm">
                          {address.city}, {address.state} {address.pincode}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Additional Notes */}
          {step === 3 && (
            <div className="fade-in">
              <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
              
              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">
                  Add any specific instructions (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Specific issues to look at, parking instructions, etc."
                  className="input min-h-[120px]"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-primary-500 mr-2" />
                    <span>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-primary-500 mr-2" />
                    <span>{selectedTimeSlot?.start} - {selectedTimeSlot?.end}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-primary-500 mr-2" />
                    <span>{selectedAddress?.name}</span>
                  </div>
                  {notes && (
                    <div className="flex items-center">
                      <FileText size={16} className="text-primary-500 mr-2" />
                      <span>Additional notes added</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={
                  (step === 1 && (!selectedDate || !selectedTimeSlot)) ||
                  (step === 2 && !selectedAddress)
                }
                className="ml-auto"
              >
                Continue
                <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={loading}
                className="ml-auto"
              >
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;