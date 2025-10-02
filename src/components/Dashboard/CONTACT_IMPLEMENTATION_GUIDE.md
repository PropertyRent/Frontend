# Contact System Frontend Implementation

## Overview
This document outlines the frontend implementation of the contact management system that integrates with the PropertyRent backend API.

## Backend API Analysis

### Models
- **ContactUs Model**: Contains fields for id, full_name, email, message, status, admin_reply, admin_reply_date, created_at, updated_at
- **ContactStatus Enum**: PENDING, REPLIED, RESOLVED

### API Endpoints
1. `POST /contact` - Public endpoint for submitting contact forms
2. `GET /contacts` - Admin endpoint with filtering and pagination
3. `GET /contacts/{id}` - Get specific contact message
4. `POST /contacts/{id}/reply` - Admin reply to contact
5. `PUT /contacts/{id}/status` - Update contact status
6. `DELETE /contacts/{id}` - Delete contact message

### Email Notifications
- Confirmation email to user upon submission
- Notification to admin for new messages
- Reply notification to user when admin responds

## Frontend Implementation

### 1. Contact Service (`contactService.js`)
**Purpose**: API client for contact-related operations

**Key Features**:
- Axios-based HTTP client with interceptors
- Error handling and response formatting
- Authentication token management
- Methods for all CRUD operations
- Statistics calculation for dashboard

**Methods**:
- `submitContact(contactData)` - Public contact form submission
- `getAllContacts(params)` - Get contacts with filtering/pagination
- `getContactById(contactId)` - Get single contact
- `replyToContact(contactId, message)` - Send admin reply
- `updateContactStatus(contactId, status)` - Update contact status
- `deleteContact(contactId)` - Delete contact
- `getContactStats()` - Get contact statistics

### 2. Updated Contact Page (`Contact.jsx`)
**Purpose**: Public contact form for visitors

**Key Features**:
- Form validation (name, email, message)
- Integration with backend API
- Success/error notifications using react-hot-toast
- Responsive design with Tailwind CSS
- Email validation

**Changes Made**:
- Removed subject field to match backend schema
- Added API integration with ContactService
- Added loading states and error handling
- Added success feedback to users

### 3. Contact Management Component (`ContactManagement.jsx`)
**Purpose**: Admin interface for managing contact messages

**Key Features**:
- **Statistics Dashboard**: Shows total, pending, replied, resolved counts
- **Advanced Filtering**: Search by name/email, filter by status
- **Pagination**: Handle large datasets efficiently
- **Contact List**: Scrollable list with preview information
- **Contact Details**: Full message view with admin actions
- **Reply Modal**: Send replies directly to users
- **Status Management**: Update contact status (pending → replied → resolved)
- **Delete Functionality**: Remove contact messages
- **Real-time Updates**: Refresh data after actions

**UI Components**:
- Statistics cards with icons
- Filterable contact list
- Detail view panel
- Modal for replying
- Pagination controls
- Status badges with colors

### 4. Contact Section Component (`ContactSection.jsx`)
**Purpose**: Dashboard widget showing contact overview

**Key Features**:
- Contact statistics summary
- Recent messages preview
- Response rate calculation
- Quick navigation to full management
- Loading states and empty states

## File Structure
```
Frontend/src/
├── services/
│   └── contactService.js          # API client
├── pages/
│   └── Contact.jsx               # Public contact form (updated)
└── components/Dashboard/
    ├── ContactManagement.jsx     # Full admin interface
    └── ContactSection.jsx        # Dashboard widget
```

## Integration Points

### 1. Dashboard Integration
Add ContactSection to your main dashboard:
```jsx
import ContactSection from './components/Dashboard/ContactSection';

// In your dashboard component
<ContactSection onNavigateToContacts={() => setActiveTab('contacts')} />
```

### 2. Admin Route Integration
Add ContactManagement to your admin routes:
```jsx
import ContactManagement from './components/Dashboard/ContactManagement';

// In your routing configuration
{activeTab === 'contacts' && <ContactManagement />}
```

### 3. Navigation Integration
Update your dashboard sidebar to include contacts:
```jsx
const sidebarItems = [
  // ... other items
  {
    id: 'contacts',
    label: 'Contact Messages',
    icon: FiMail,
    component: ContactManagement
  }
];
```

## Features Implemented

### Public Features
- ✅ Contact form submission
- ✅ Form validation
- ✅ Success/error feedback
- ✅ Responsive design

### Admin Features
- ✅ View all contact messages
- ✅ Filter by status (pending, replied, resolved)
- ✅ Search by name or email
- ✅ Pagination for large datasets
- ✅ View detailed contact information
- ✅ Reply to contact messages
- ✅ Update contact status
- ✅ Delete contact messages
- ✅ Statistics dashboard
- ✅ Recent messages preview

### Technical Features
- ✅ API error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Real-time data updates
- ✅ Responsive design
- ✅ Accessibility considerations

## Email Flow
1. **User submits contact form** → Confirmation email sent to user
2. **Admin receives notification** → Email with contact details
3. **Admin replies via dashboard** → Reply email sent to user
4. **Status updates** → Tracked in database

## Status Workflow
1. **PENDING** - New contact message received
2. **REPLIED** - Admin has responded to the message
3. **RESOLVED** - Issue has been fully addressed

## Security Notes
- Admin endpoints require authentication tokens
- Input validation on both frontend and backend
- XSS protection through proper text encoding
- CSRF protection via headers

## Usage Instructions

### For Users
1. Visit the Contact page
2. Fill out the form (name, email, message)
3. Submit and receive confirmation

### For Admins
1. Access the admin dashboard
2. Navigate to "Contact Messages"
3. View statistics and recent messages
4. Filter/search for specific contacts
5. Click on a contact to view details
6. Reply to messages or update status
7. Use bulk actions for management

## Responsive Design
- Mobile-first approach
- Collapsible sidebar on small screens
- Adaptive grid layouts
- Touch-friendly interface
- Proper text scaling

This implementation provides a complete contact management system that matches the backend API structure and provides an excellent user experience for both visitors and administrators.