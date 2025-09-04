# 🚀 Nuwais Customer Portal with Enhanced Location Pin

Professional laundry booking portal with Washmen-inspired location pin functionality and enhanced UX.

## 🌟 Features

- **📍 Location Pin Interface** - Interactive map with precise pickup locations
- **🎨 Professional UI/UX** - Washmen-inspired design patterns  
- **⚡ Smart Booking Flow** - Quick service selection and scheduling
- **📱 Mobile-First Design** - Optimized for all devices
- **✅ Real-time Validation** - Service area checking and form validation
- **🔧 TypeScript Ready** - Full type safety and modern development

## 🚀 Quick Start

```bash
# Navigate to project directory
cd C:\Users\Faisal\CascadeProjects\Nuwais2\customer-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Environment Variables

Production environment (set in Vercel):
```env
VITE_API_URL=https://laundry-api.bahrain-ai.com/api
VITE_APP_NAME=Nuwais Laundry  
VITE_CURRENCY=AED
```

## 🚀 Deploy to Vercel

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod

# Configure custom domain: nuwais.bahrain-ai.com
```

## 🔧 Backend Integration

Connects to your MongoDB-powered Flask API:
- Base URL: `https://laundry-api.bahrain-ai.com/api`
- Endpoints: `/services`, `/bookings`, `/health`
- Ready for real bookings!

## 🎨 Enhanced Features

### Location Pin Functionality:
- Interactive map interface with pin dropping
- "Use Current Location" button for geolocation
- Building/Villa and Floor/Flat number fields
- Service area validation for Bahrain
- Landmark directions for delivery precision

### Professional Date/Time Selection:
- Quick-select cards for Tomorrow/Day After
- Visual time slot selection with popularity indicators  
- Custom date picker for flexible scheduling
- Mobile-optimized touch interactions

### Washmen-Inspired Design:
- Gradient backgrounds and professional styling
- Card-based interactions with hover effects
- Color-coded service status indicators
- Mobile-first responsive design

Built with ❤️ for Nuwais Laundry - Ready to take real bookings!
