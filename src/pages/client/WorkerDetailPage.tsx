import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import useWorkerStore from '../../store/workerStore';
// import useLocationStore from '../../store/locationStore';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { WorkerProfile } from '../../types';

const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWorkerById } = useWorkerStore();
//   const { userLocation } = useLocationStore();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      if (id) {
        const workerData = await getWorkerById(id);
        setWorker(workerData);
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id, getWorkerById]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!worker) {
    return (
      <div className="container-custom py-8">
        <div className="bg-error-50 text-error-700 p-4 rounded-lg">
          Worker not found
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Worker Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <img
                src={worker.profileImage || 'https://via.placeholder.com/128'}
                alt={worker.name}
                className="w-32 h-32 rounded-full object-cover mr-6"
              />
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">{worker.name}</h1>
                  {worker.verifiedWorker && (
                    <CheckCircle size={20} className="text-success-500 ml-2" />
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star size={20} className="text-warning-500" fill="#FDB528" />
                    <span className="ml-1 font-semibold text-lg">{worker.rating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-neutral-300">•</span>
                  <span className="text-neutral-600">
                    {worker.reviews.length} reviews
                  </span>
                </div>
                <div className="mt-4">
                  {worker.skills.map(skill => (
                    <span
                      key={skill.id}
                      className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Availability */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Experience & Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Experience</h3>
                <div className="flex items-center text-neutral-700">
                  <Clock size={20} className="mr-2 text-primary-500" />
                  <span>{worker.experience} years of experience</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Working Hours</h3>
                <div className="space-y-2">
                  {worker.availability.weekdays.map(day => (
                    day.available && (
                      <div key={day.day} className="flex items-center text-neutral-700">
                        <Calendar size={20} className="mr-2 text-primary-500" />
                        <span className="capitalize">{day.day}:</span>
                        <span className="ml-2">
                          {day.slots.map(slot => `${slot.start} - ${slot.end}`).join(', ')}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Service Area</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              {worker.serviceArea.center && (
                <MapContainer
                  center={[worker.serviceArea.center.latitude, worker.serviceArea.center.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[worker.serviceArea.center.latitude, worker.serviceArea.center.longitude]}
                  >
                    <Popup>
                      Service area center
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
            <div className="mt-4 flex items-center text-neutral-700">
              <MapPin size={20} className="mr-2 text-primary-500" />
              {worker.serviceArea.type === 'radius' ? (
                <span>Serves within {worker.serviceArea.radiusKm} km radius</span>
              ) : (
                <span>Serves in pincodes: {worker.serviceArea.pincodes?.join(', ')}</span>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {worker.reviews.length > 0 ? (
              <div className="space-y-4">
                {worker.reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= review.rating ? 'text-warning-500' : 'text-neutral-300'}
                            fill={star <= review.rating ? '#FDB528' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-neutral-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-neutral-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Book {worker.name}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-neutral-600">Base Rate</span>
                <span className="text-2xl font-semibold">₹500/hr</span>
              </div>
              <Link to={`/client/book/${worker.id}`} className="block">
                <Button variant="primary" size="lg" fullWidth>
                  Book Now
                </Button>
              </Link>
              <Link to={`/client/messages/${worker.id}`} className="block">
                <Button variant="outline" size="lg" fullWidth leftIcon={<MessageSquare size={20} />}>
                  Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailPage;