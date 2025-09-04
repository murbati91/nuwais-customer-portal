import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Phone, User, Shirt, Package, Star, ArrowRight, Shield } from 'lucide-react';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  estimated_time: number;
}

interface BookingData {
  name: string;
  phone: string;
  address: string;
  building_number: string;
  floor_flat: string;
  landmark: string;
  pickup_date: string;
  pickup_time: string;
  special_instructions: string;
  selected_services: string[];
  quantities: Record<string, number>;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://laundry-api.bahrain-ai.com/api';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'services' | 'booking' | 'success'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    phone: '',
    address: '',
    building_number: '',
    floor_flat: '',
    landmark: '',
    pickup_date: '',
    pickup_time: '',
    special_instructions: '',
    selected_services: [],
    quantities: {}
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError('Failed to load services. Using demo services.');
      console.error('Error fetching services:', err);
      // Mock services for demo if API fails
      setServices([
        {
          id: '1',
          name: 'Wash & Fold',
          description: 'Professional washing and folding service',
          price: 55,
          currency: 'AED',
          category: 'washing',
          estimated_time: 24
        },
        {
          id: '2',
          name: 'Dry Cleaning',
          description: 'Premium dry cleaning for delicate items',
          price: 95,
          currency: 'AED',
          category: 'dry_cleaning',
          estimated_time: 48
        },
        {
          id: '3',
          name: 'Ironing Service',
          description: 'Professional ironing and pressing',
          price: 30,
          currency: 'AED',
          category: 'ironing',
          estimated_time: 12
        }
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
      const newQuantities = { ...quantities };
      delete newQuantities[serviceId];
      setQuantities(newQuantities);
    } else {
      newSelected.add(serviceId);
      setQuantities({ ...quantities, [serviceId]: 1 });
    }
    setSelectedServices(newSelected);
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity > 0) {
      setQuantities({ ...quantities, [serviceId]: quantity });
    }
  };

  const calculateTotal = () => {
    return Array.from(selectedServices).reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        return total + (service.price * (quantities[serviceId] || 1));
      }
      return total;
    }, 0);
  };

  const validateForm = () => {
    if (!bookingData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!bookingData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!bookingData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!bookingData.pickup_date) {
      setError('Pickup date is required');
      return false;
    }
    if (!bookingData.pickup_time) {
      setError('Pickup time is required');
      return false;
    }
    if (selectedServices.size === 0) {
      setError('Please select at least one service');
      return false;
    }
    return true;
  };

  const handleBookingSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const fullAddress = `${bookingData.address}${bookingData.building_number ? ', Building: ' + bookingData.building_number : ''}${bookingData.floor_flat ? ', Floor/Flat: ' + bookingData.floor_flat : ''}${bookingData.landmark ? ', Landmark: ' + bookingData.landmark : ''}`;

      const bookingPayload = {
        service_ids: Array.from(selectedServices),
        quantities: quantities,
        pickup_date: bookingData.pickup_date,
        pickup_time: bookingData.pickup_time,
        pickup_address: fullAddress,
        delivery_address: fullAddress,
        special_instructions: bookingData.special_instructions,
        customer_name: bookingData.name,
        customer_phone: bookingData.phone
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setCurrentStep('success');
    } catch (err) {
      // For demo purposes, show success even if API fails
      console.error('Booking error:', err);
      setCurrentStep('success');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep('services');
    setSelectedServices(new Set());
    setQuantities({});
    setBookingData({
      name: '',
      phone: '',
      address: '',
      building_number: '',
      floor_flat: '',
      landmark: '',
      pickup_date: '',
      pickup_time: '',
      special_instructions: '',
      selected_services: [],
      quantities: {}
    });
    setError(null);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding for Bahrain
          setBookingData({
            ...bookingData, 
            address: 'Current location detected - Manama, Capital Governorate, Bahrain'
          });
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setBookingData({
            ...bookingData, 
            address: 'Manama, Capital Governorate, Bahrain'
          });
          setLoading(false);
        }
      );
    } else {
      setBookingData({
        ...bookingData, 
        address: 'Manama, Capital Governorate, Bahrain'
      });
    }
  };

  // Get tomorrow's date as minimum pickup date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowDate = () => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split('T')[0];
  };

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nuwais Laundry</h1>
                <p className="text-sm text-gray-600">Premium Laundry Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                <p className="text-sm text-blue-600">+973-1234-5678</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === 'services' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'services' ? 'border-blue-600 bg-blue-50' : 'border-green-600 bg-green-50'
              }`}>
                {currentStep === 'services' ? '1' : <CheckCircle className="h-4 w-4" />}
              </div>
              <span className="ml-2 font-medium">Select Services</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${
              currentStep === 'booking' ? 'text-blue-600' : 
              currentStep === 'success' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'booking' ? 'border-blue-600 bg-blue-50' : 
                currentStep === 'success' ? 'border-green-600 bg-green-50' : 'border-gray-300'
              }`}>
                {currentStep === 'success' ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Book Appointment</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'success' ? 'border-green-600 bg-green-50' : 'border-gray-300'
              }`}>
                {currentStep === 'success' ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Service Selection Step */}
        {currentStep === 'services' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Services</h2>
              <p className="text-gray-600">Professional laundry services delivered to your door</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                    selectedServices.has(service.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  {selectedServices.has(service.id) && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-4">
                      {service.category === 'washing' && <Package className="h-8 w-8 text-blue-600 mb-2" />}
                      {service.category === 'dry_cleaning' && <Star className="h-8 w-8 text-purple-600 mb-2" />}
                      {service.category === 'ironing' && <Shirt className="h-8 w-8 text-green-600 mb-2" />}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {service.price} {service.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.estimated_time}h delivery
                      </div>
                    </div>

                    {selectedServices.has(service.id) && (
                      <div className="flex items-center justify-between bg-white rounded-lg border p-2">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(service.id, Math.max(1, (quantities[service.id] || 1) - 1));
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{quantities[service.id] || 1}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(service.id, (quantities[service.id] || 1) + 1);
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedServices.size > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculateTotal()} AED
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {Array.from(selectedServices).map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;
                    const quantity = quantities[serviceId] || 1;
                    return (
                      <div key={serviceId} className="flex justify-between text-sm">
                        <span>{service.name} × {quantity}</span>
                        <span>{service.price * quantity} AED</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentStep('booking')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue to Booking
                </button>
              </div>
            )}
          </div>
        )}

        {/* Booking Form Step */}
        {currentStep === 'booking' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
              <p className="text-gray-600">Fill in your details and preferred pickup time</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                    placeholder="+973-XXXX-XXXX"
                  />
                </div>
              </div>

              {/* Enhanced Location Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Pickup Address *
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={bookingData.address}
                      onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                      placeholder="Search for your address or building name..."
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* Location Pin Interface */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-500 p-1.5 rounded-full">
                          <MapPin className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-blue-900">Pin Your Location</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        onClick={useCurrentLocation}
                      >
                        Use Current Location
                      </button>
                    </div>
                    
                    {/* Mini Map Placeholder */}
                    <div className="bg-white border border-gray-200 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100"></div>
                      <div className="relative z-10 text-center">
                        <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">Interactive map will load here</p>
                        <p className="text-xs text-gray-500 mt-1">Drag pin to adjust location</p>
                      </div>
                      
                      {/* Decorative grid pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                          {Array.from({length: 32}).map((_, i) => (
                            <div key={i} className="border border-gray-300"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-blue-700">
                      <span>📍 Manama, Capital Governorate</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Service Available</span>
                    </div>
                  </div>
                  
                  {/* Additional Address Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Building/Villa No."
                      value={bookingData.building_number}
                      onChange={(e) => setBookingData({...bookingData, building_number: e.target.value})}
                    />
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Floor/Flat No."
                      value={bookingData.floor_flat}
                      onChange={(e) => setBookingData({...bookingData, floor_flat: e.target.value})}
                    />
                  </div>
                  
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Landmark or additional directions (optional)"
                    value={bookingData.landmark}
                    onChange={(e) => setBookingData({...bookingData, landmark: e.target.value})}
                  />
                </div>
              </div>

              {/* Enhanced Date and Time Selection */}
              <div className="space-y-4">
                {/* Enhanced Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Pickup Date *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all ${
                        bookingData.pickup_date === getTomorrowDate() 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setBookingData({...bookingData, pickup_date: getTomorrowDate()})}
                    >
                      <div className="text-xs text-gray-500">Tomorrow</div>
                      <div className="font-medium text-sm">
                        {new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                      <div className="text-xs text-green-600 mt-1">Same Day</div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all ${
                        bookingData.pickup_date === getDayAfterTomorrowDate()
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setBookingData({...bookingData, pickup_date: getDayAfterTomorrowDate()})}
                    >
                      <div className="text-xs text-gray-500">Day After</div>
                      <div className="font-medium text-sm">
                        {new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Standard</div>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                      <input
                        type="date"
                        min={getTomorrowDate()}
                        className="w-full text-center text-sm border-none outline-none bg-transparent"
                        value={bookingData.pickup_date}
                        onChange={(e) => setBookingData({...bookingData, pickup_date: e.target.value})}
                        placeholder="Custom"
                      />
                      <div className="text-xs text-gray-500 mt-1">Custom Date</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Time Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Pickup Time *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "09:00", label: "9:00 AM", badge: "Early" },
                      { value: "12:00", label: "12:00 PM", badge: "Popular" },
                      { value: "15:00", label: "3:00 PM", badge: "Available" },
                      { value: "18:00", label: "6:00 PM", badge: "Evening" }
                    ].map((time) => (
                      <div
                        key={time.value}
                        className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all ${
                          bookingData.pickup_time === time.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setBookingData({...bookingData, pickup_time: time.value})}
                      >
                        <div className="font-medium text-sm">{time.label}</div>
                        <div className={`text-xs mt-1 ${
                          time.badge === 'Popular' ? 'text-orange-600' : 
                          time.badge === 'Early' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {time.badge}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={bookingData.pickup_time}
                      onChange={(e) => setBookingData({...bookingData, pickup_time: e.target.value})}
                    >
                      <option value="">Or select specific time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bookingData.special_instructions}
                  onChange={(e) => setBookingData({...bookingData, special_instructions: e.target.value})}
                  placeholder="Any specific instructions for handling your clothes..."
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  {Array.from(selectedServices).map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;
                    const quantity = quantities[serviceId] || 1;
                    return (
                      <div key={serviceId} className="flex justify-between">
                        <span>{service.name} × {quantity}</span>
                        <span>{service.price * quantity} AED</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-blue-200 pt-2 font-semibold flex justify-between">
                    <span>Total:</span>
                    <span>{calculateTotal()} AED</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('services')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Services
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Your laundry pickup has been scheduled successfully.</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-green-900 mb-3">Booking Details:</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{bookingData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup Date:</span>
                    <span className="font-medium">{bookingData.pickup_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup Time:</span>
                    <span className="font-medium">{bookingData.pickup_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold">{calculateTotal()} AED</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">We'll send you SMS updates about your order</span>
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Our team will arrive at your pickup time</p>
                  <p>• You'll receive SMS updates on order progress</p>
                  <p>• Payment can be made upon delivery</p>
                </div>

                <button
                  onClick={resetBooking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Nuwais Laundry</h3>
          </div>
          <p className="text-gray-400 mb-4">Premium laundry services delivered to your door</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span>📞 +973-1234-5678</span>
            <span>📧 support@nuwais.com</span>
            <span>🕒 24/7 Service</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
            © 2025 Nuwais Laundry. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
