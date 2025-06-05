import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Clock, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import useWorkerStore from '../../store/workerStore';
import useLocationStore from '../../store/locationStore';
import type { WorkerProfile } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SearchWorkersPage: React.FC = () => {
  const { workers, loading, error, fetchWorkers, searchWorkers } = useWorkerStore();
  const { userLocation, getUserLocation } = useLocationStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 50,
    verifiedOnly: false,
    availableNow: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWorkers();
    getUserLocation();
  }, [fetchWorkers, getUserLocation]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchWorkers({
        query: searchQuery,
        skill: selectedSkill === 'All Skills' ? '' : selectedSkill,
        ...filters
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSkill, filters, searchWorkers]);

  const calculateDistance = (workerLocation: { latitude: number; longitude: number }) => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (workerLocation.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (workerLocation.longitude - userLocation.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(workerLocation.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  };

  const skills = [
    'All Skills',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Mason',
    'Cleaner',
    'AC Technician',
    'Appliance Repair',
    'Locksmith'
  ];

  if (loading && !workers.length) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-custom">
          <div className="bg-error-50 text-error-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-custom">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="input min-w-[150px]"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <button 
                className="btn-outline flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} className="mr-2" />
                Filters
              </button>
              <div className="bg-neutral-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
                <button
                  className={`px-3 py-1 rounded ${viewMode === 'map' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                    className="input w-full"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Maximum Distance
                  </label>
                  <select
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                    className="input w-full"
                  >
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={20}>Within 20 km</option>
                    <option value={50}>Within 50 km</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    <span className="ml-3">Verified Workers Only</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availableNow}
                      onChange={(e) => setFilters({ ...filters, availableNow: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    <span className="ml-3">Available Now</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && workers.length > 0 && (
          <div className="flex justify-center mb-4">
            <Loader2 className="animate-spin text-primary-500" size={24} />
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: WorkerProfile) => {
              const distance = calculateDistance(worker.serviceArea.center || { latitude: 0, longitude: 0 });
              
              return (
                <div key={worker.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start">
                      <img
                        src={worker.profileImage || 'https://via.placeholder.com/64'}
                        alt={worker.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{worker.name}</h3>
                          {worker.verifiedWorker && (
                            <CheckCircle size={16} className="text-success-500 ml-2" />
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <Star size={16} className="text-warning-500" fill="#FDB528" />
                            <span className="ml-1 font-medium">{worker.rating.toFixed(1)}</span>
                          </div>
                          <span className="mx-1 text-neutral-300">•</span>
                          <span className="text-neutral-600 text-sm">
                            {worker.reviews.length} reviews
                          </span>
                        </div>
                        <div className="mt-2">
                          {worker.skills.map(skill => (
                            <span
                              key={skill.id}
                              className="inline-block bg-primary-50 text-primary-700 text-sm px-2 py-1 rounded-full mr-2"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-neutral-600">
                        <Clock size={16} className="mr-2" />
                        <span>{worker.experience} years experience</span>
                      </div>
                      <div className="flex items-center text-neutral-600">
                        <MapPin size={16} className="mr-2" />
                        <span>
                          {distance ? `${distance.toFixed(1)} km away` : 'Distance not available'}
                        </span>
                      </div>
                      <div className="flex items-center text-neutral-600">
                        <Calendar size={16} className="mr-2" />
                        <span>Available today</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        ₹500/hr
                      </div>
                      <div className="space-x-2">
                        <Link
                          to={`/client/worker/${worker.id}`}
                          className="btn-outline py-2 px-4"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/client/book/${worker.id}`}
                          className="btn-primary py-2 px-4"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '600px' }}>
            {userLocation ? (
              <MapContainer
                center={[userLocation.latitude, userLocation.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {workers.map((worker: WorkerProfile) => {
                  const location = worker.serviceArea.center;
                  if (!location) return null;

                  return (
                    <Marker
                      key={worker.id}
                      position={[location.latitude, location.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="flex items-center mb-2">
                            <img
                              src={worker.profileImage || 'https://via.placeholder.com/40'}
                              alt={worker.name}
                              className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                            <div>
                              <h4 className="font-semibold">{worker.name}</h4>
                              <div className="flex items-center">
                                <Star size={12} className="text-warning-500" fill="#FDB528" />
                                <span className="ml-1 text-sm">{worker.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm mb-2">
                            {worker.skills.map(skill => skill.name).join(', ')}
                          </div>
                          <Link
                            to={`/client/worker/${worker.id}`}
                            className="btn-primary py-1 px-3 text-sm w-full text-center block"
                          >
                            View Profile
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>Please enable location access to view the map</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWorkersPage;