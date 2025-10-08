
# Property Management Frontend

A modern, full-featured property management system built with React and Vite. This application provides comprehensive tools for property owners, managers, and tenants to streamline property management operations.

##  Overview

This frontend application is part of a complete property management solution that enables:
- **Property Owners**: Manage properties, view analytics, handle applications
- **Property Managers**: Comprehensive dashboard for operations management
- **Tenants**: Property search, application submission, maintenance requests
- **Visitors**: Browse properties, schedule viewings, get information

## ✨ Features

###  Property Management
- **Property Listings**: Add, edit, and manage property details
- **Image Gallery**: Multiple property images with preview functionality
- **Property Search**: Advanced filtering by location, price, type, amenities
- **Property Details**: Comprehensive property information display
- **Status Management**: Track availability, rented, and maintenance status

###  Dashboard & Analytics
- **Overview Dashboard**: Real-time statistics and metrics
- **Property Analytics**: Visual charts and performance tracking
- **Recent Activities**: Latest property updates and activities
- **Revenue Tracking**: Income and expense monitoring

###  Application Management
- **Tenant Applications**: Complete application processing system
- **Application Review**: Detailed applicant information display
- **Status Tracking**: Pending, approved, rejected application states
- **Pre-screening**: Customizable screening questions

###  Maintenance & Services
- **Maintenance Requests**: Issue reporting and tracking system
- **Service Management**: Vendor coordination and scheduling
- **Request Status**: Open, in-progress, completed tracking
- **Cost Management**: Estimated and actual costs

###  User Management
- **Team Management**: Add and manage team members
- **Contact Management**: Customer relationship management
- **User Roles**: Different access levels and permissions
- **Profile Management**: User profile updates and settings

###  Communication
- **Integrated Chatbot**: AI-powered property assistance
- **Support Integration**: Third-party support system integration
- **Notifications**: Real-time updates and alerts
- **Meeting Scheduling**: Property viewing appointments

###  Notice & Communication
- **Notice Management**: Create and manage property notices
- **Email Verification**: Secure user verification system
- **Document Management**: Handle property-related documents

##  Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with modern features
- **Vite 7.1.7**: Fast build tool and development server
- **React Router DOM 7.9.2**: Client-side routing

### Styling & UI
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **React Icons 5.5.0**: Comprehensive icon library
- **React Hot Toast 2.6.0**: Beautiful notifications

### State Management
- **Context API**: Built-in React state management
- **Custom Stores**: Modular state management with AuthStore and PropertyStore

### HTTP Client
- **Axios 1.12.2**: Promise-based HTTP client

### Development Tools
- **ESLint 9.36.0**: Code linting and quality
- **TypeScript Types**: Type definitions for better development

##  Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Chatbot/         # AI chatbot components
│   ├── Dashboard/       # Admin dashboard components
│   ├── Home/            # Homepage components
│   ├── Properties/      # Property-related components
│   └── skeleton/        # Loading skeleton components
├── hooks/               # Custom React hooks
├── pages/               # Route components
├── services/            # API service layers
└── stores/              # State management (Context API)
```

### Key Components

####  **Dashboard Components**
- `DashboardOverview`: Main dashboard with analytics
- `PropertiesSection`: Property management interface
- `ApplicationManagement`: Tenant application handling
- `MaintenanceManagement`: Service request management
- `TeamManagement`: Staff and user management
- `ChatbotManagement`: AI chatbot configuration

####  **UI Components**
- `PropertyCard`: Property listing display
- `PropertyFilters`: Advanced search filters
- `ConfirmationModal`: User confirmation dialogs
- `ScheduleVisitModal`: Appointment scheduling
- `Navbar` & `Footer`: Layout components

####  **Service Layers**
- `chatbotService`: AI chatbot API integration
- `applicationService`: Application processing
- `contactService`: Contact management
- `maintenanceService`: Maintenance request handling
- `screeningService`: Pre-screening management

##  Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.docker .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_APP_URL=http://localhost:8001
   VITE_API_BASE_URL=http://localhost:8001/api
   VITE_CHATBOT_ENABLED=true
   VITE_CHATBOT_DEBUG=false
   VITE_DEV_MODE=true
   VITE_LOG_LEVEL=info
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

##  Docker Deployment

This project includes complete Docker support for easy deployment.

### Quick Start with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d --build

# Access the application at http://localhost
```

### Docker Files
- `Dockerfile`: Multi-stage build with Nginx
- `docker-compose.yml`: Complete orchestration setup
- `nginx.conf`: Production-ready Nginx configuration
- `.dockerignore`: Optimized build context

For detailed Docker deployment instructions, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md).

##  Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint code analysis

##  Key Features Deep Dive

### Property Management System
- **Multi-step Property Addition**: Comprehensive property onboarding
- **Image Management**: Upload, preview, and organize property photos
- **Advanced Search**: Filter by price, location, amenities, property type
- **Status Tracking**: Available, rented, maintenance states

### Application Processing
- **Multi-step Applications**: Structured tenant application flow
- **Document Handling**: Secure document upload and management
- **Screening Integration**: Customizable pre-screening questions
- **Status Management**: Application lifecycle tracking

### Dashboard Analytics
- **Real-time Metrics**: Property statistics and performance
- **Visual Charts**: Data visualization with custom components
- **Recent Activities**: Latest system activities tracking
- **Revenue Insights**: Financial performance monitoring

### Maintenance Management
- **Request Tracking**: Issue submission and status updates
- **Vendor Management**: Service provider coordination
- **Cost Estimation**: Budget planning and actual cost tracking
- **Priority Management**: Urgent vs routine maintenance

##  Configuration

### Environment Variables
```env
# API Configuration
VITE_APP_URL=              # Backend API URL
VITE_API_BASE_URL=         # API base endpoint


# Features
VITE_CHATBOT_ENABLED=      # Enable/disable chatbot
VITE_CHATBOT_DEBUG=        # Chatbot debug mode

# Development
VITE_DEV_MODE=            # Development mode flag
VITE_LOG_LEVEL=           # Logging level
```

### Build Configuration
- **Vite Config**: Optimized for React and Tailwind
- **ESLint Config**: Code quality and consistency
- **Tailwind Config**: Custom design system integration



##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Traditional server deployment
- [Docker Deployment](./DOCKER_DEPLOYMENT.md) - Containerized deployment
- [API Documentation](../Backend/README.md) - Backend API reference

##  Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation files


---
