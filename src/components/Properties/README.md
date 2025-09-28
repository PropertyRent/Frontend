# Properties Feature

This directory contains the Properties page implementation with filtering and sorting capabilities.

## Components

### Properties Page (`/src/pages/Properties.jsx`)
- Main properties listing page
- Displays all available properties in a grid layout
- Includes filtering sidebar and sorting options
- Responsive design for desktop and mobile

### PropertyCard (`/src/components/Properties/PropertyCard.jsx`)
- Individual property card component
- Displays property image, details, and amenities
- Includes favorite functionality
- Action buttons for viewing details and contacting

### PropertyFilters (`/src/components/Properties/PropertyFilters.jsx`)
- Comprehensive filtering component
- Price range slider
- Bedrooms, bathrooms, and property type filters
- Availability status filter
- Sort options (desktop) and reset functionality

### PropertyDetail (`/src/pages/PropertyDetail.jsx`)
- Detailed property view page
- Image gallery with navigation
- Complete property information
- Contact agent section
- Responsive layout

## Features

### Filtering Options
- **Price Range**: Adjustable slider from $0 to $5000/month
- **Bedrooms**: Any, 1, 2, 3, 4+ bedrooms
- **Bathrooms**: Any, 1, 2, 3+ bathrooms
- **Property Type**: Any, Apartment, House, Condo, Studio, Penthouse
- **Availability**: All, Available Only, Unavailable Only

### Sorting Options
- Price: Low to High / High to Low
- Bedrooms: Low to High / High to Low
- Area: Small to Large / Large to Small

### Additional Features
- Responsive design for all screen sizes
- Favorite properties functionality
- Property availability status
- Image galleries with navigation
- Contact agent information
- Smooth animations and transitions

## Theme Integration

The Properties feature uses the existing project theme:
- **Primary Color**: `--color-primary` (Fresh water blue)
- **Secondary Color**: `--color-secondary` (Sky blue)
- **Background**: `--color-bg` (Cloud white)
- **Text Colors**: Various shades of brown (`--color-darkest`, `--color-dark`, etc.)
- **Accent Colors**: Light brown and medium brown for highlights

## Navigation

The Properties page is accessible through:
1. Main navigation menu under "Properties" → "All Properties"
2. Footer "Quick Links" → "Properties"
3. Direct URL: `/properties`
4. Individual property details: `/properties/:id`

## Mock Data

Currently uses mock data for demonstration. In a real application, this would be replaced with API calls to fetch property data from a backend service.