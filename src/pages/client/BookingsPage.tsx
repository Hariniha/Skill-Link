import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, MapPin, MessageSquare, Star, Check, X } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Booking } from '../../types';

const BookingsPage: React.FC = () => {
  const { bookings, fetchBookings, loading } = useBookingStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'upcoming':
        return ['pending', 'confirmed'].includes(booking.status);
      case 'completed':
        return booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return false;
    }
  });

  if (loading && !bookings.length) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link to="/client/search">
          <Button variant="primary">Book New Service</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking: Booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{booking.service}</h3>
                  <div className="flex items-center text-neutral-600 text-sm mt-1">
                    <CalendarClock size={16} className="mr-1" />
                    {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                    <span className="mx-1">•</span>
                    <Clock size={16} className="mr-1" />
                    {booking.scheduledTime.start} - {booking.scheduledTime.end}
                  </div>
                  <div className="flex items-start mt-2 text-sm text-neutral-600">
                    <MapPin size={16} className="mr-1 mt-1 flex-shrink-0" />
                    <span>
                      {booking.location.name}, {booking.location.addressLine1},
                      {booking.location.addressLine2 && ` ${booking.location.addressLine2},`}
                      {' '}{booking.location.city}, {booking.location.state} {booking.location.pincode}
                    </span>
                  </div>
                </div>
                <div>
                  {booking.status === 'pending' && (
                    <span className="badge-warning">Pending</span>
                  )}
                  {booking.status === 'confirmed' && (
                    <span className="badge-success">Confirmed</span>
                  )}
                  {booking.status === 'completed' && (
                    <span className="badge-primary">Completed</span>
                  )}
                  {booking.status === 'cancelled' && (
                    <span className="badge-error">Cancelled</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-3">
                  <Link to={`/client/messages/${booking.workerId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<MessageSquare size={16} />}
                    >
                      Message
                    </Button>
                  </Link>
                  {booking.status === 'completed' && !booking.review && (
                    <Link to={`/client/review/${booking.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Star size={16} />}
                      >
                        Leave Review
                      </Button>
                    </Link>
                  )}
                </div>
                {booking.status === 'pending' && (
                  <Button
                    variant="error"
                    size="sm"
                    leftIcon={<X size={16} />}
                  >
                    Cancel
                  </Button>
                )}
                {booking.status === 'completed' && booking.payment?.status === 'completed' && (
                  <Link to={`/client/receipt/${booking.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Check size={16} />}
                    >
                      View Receipt
                    </Button>
                  </Link>
                )}
              </div>

              {/* Review Section */}
              {booking.review && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= booking.review!.rating ? 'text-warning-500' : 'text-neutral-300'}
                          fill={star <= booking.review!.rating ? '#FDB528' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-neutral-600">
                      {new Date(booking.review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {booking.review.comment && (
                    <p className="text-neutral-700 text-sm">{booking.review.comment}</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CalendarClock size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-600 mb-4">No {activeTab} bookings found</p>
            <Link to="/client/search">
              <Button variant="primary">Book a Service</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;