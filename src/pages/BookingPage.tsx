// pages/BookingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Book Your Service</h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete booking system coming soon! For now, please contact us directly.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us to Book</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Phone:</strong> +971-1234-5678
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> support@nuwais.com
              </p>
              <p className="text-gray-600">
                <strong>WhatsApp:</strong> +971-1234-5678
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                to="/services"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;