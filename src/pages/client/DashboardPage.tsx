import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, Check, X, MessageSquare, Star, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, fetchBookings, loading } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter bookings for upcoming ones
  const upcomingBookings = bookings.filter(booking => 
    (booking.status === 'confirmed' || booking.status === 'pending') && 
    new Date(booking.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  // Filter bookings for recent ones
  const recentBookings = bookings.filter(booking => 
    booking.status === 'completed'
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);

  return (
    <div className="container-custom py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg p-6 mb-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mb-4">Find skilled professionals for your needs or manage your existing bookings.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/client/search" className="btn bg-white text-primary-600 hover:bg-primary-50">
            Find Workers
          </Link>
          <Link to="/client/bookings" className="btn bg-primary-400 text-white hover:bg-primary-300">
            View My Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <Link to="/client/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-neutral-500">Loading bookings...</div>
            ) : upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.service}</h3>
                        <div className="flex items-center text-neutral-500 text-sm mt-1">
                          <CalendarClock size={16} className="mr-1" />
                          {new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          <span className="mx-1">•</span>
                          <Clock size={16} className="mr-1" />
                          {booking.scheduledTime.start} - {booking.scheduledTime.end}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Location:</span> {booking.location.name}, {booking.location.addressLine1}, {booking.location.city}
                        </div>
                      </div>
                      <div>
                        {booking.status === 'pending' ? (
                          <span className="badge-warning">Pending</span>
                        ) : (
                          <span className="badge-success">Confirmed</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex mt-4 space-x-3">
                      <Link 
                        to={`/client/messages/${booking.workerId}`} 
                        className="btn-outline py-1 px-3 text-sm flex items-center"
                      >
                        <MessageSquare size={16} className="mr-1" />
                        Message
                      </Link>
                      
                      {booking.status === 'pending' && (
                        <button className="btn-error py-1 px-3 text-sm flex items-center">
                          <X size={16} className="mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <CalendarClock size={48} className="mx-auto mb-4 text-neutral-300" />
                <p>You don't have any upcoming bookings</p>
                <Link to="/client/search" className="btn-primary mt-4">
                  Find Workers
                </Link>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Services</h2>
              <Link to="/client/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View History
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4 text-neutral-500">Loading history...</div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{booking.service}</h3>
                        <div className="flex items-center text-neutral-500 text-sm mt-1">
                          <CalendarClock size={16} className="mr-1" />
                          {new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className="badge-success flex items-center">
                        <Check size={14} className="mr-1" /> Completed
                      </span>
                    </div>
                    
                    {booking.review ? (
                      <div className="mt-3 bg-neutral-50 p-3 rounded-md">
                        <div className="flex items-center mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                className={`${star <= booking.review!.rating ? 'text-warning-500' : 'text-neutral-300'}`} 
                                fill={star <= booking.review!.rating ? '#FDB528' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium">{booking.review.rating}.0</span>
                        </div>
                        {booking.review.comment && (
                          <p className="text-sm text-neutral-600">{booking.review.comment}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <Link to={`/client/review/${booking.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Leave a review
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                <p>No completed services yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/client/search" className="flex items-center p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <CalendarClock size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Book a Service</h3>
                  <p className="text-sm text-neutral-500">Find skilled workers near you</p>
                </div>
              </Link>
              
              <Link to="/client/messages" className="flex items-center p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">My Messages</h3>
                  <p className="text-sm text-neutral-500">Chat with service providers</p>
                </div>
              </Link>
              
              <Link to="/client/bookings" className="flex items-center p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <Clock size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Booking History</h3>
                  <p className="text-sm text-neutral-500">View past and upcoming bookings</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Popular Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Electricians', path: '/client/search?skill=electrician' },
                { name: 'Plumbers', path: '/client/search?skill=plumber' },
                { name: 'Carpenters', path: '/client/search?skill=carpenter' },
                { name: 'Painters', path: '/client/search?skill=painter' },
                { name: 'Cleaners', path: '/client/search?skill=cleaner' },
                { name: 'AC Repair', path: '/client/search?skill=ac-technician' },
              ].map((service, index) => (
                <Link 
                  key={index}
                  to={service.path}
                  className="bg-neutral-50 hover:bg-primary-50 p-3 rounded-md text-center transition-colors"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;