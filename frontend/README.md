# Hostel Booking Frontend Application

This is the frontend application for the Hostel Booking system. The application is built with vanilla JavaScript and provides functionality for viewing and booking hostel rooms.

## Features

- Room listing with detailed view for each room type
- Bedspace availability tracking
- Booking interface for rooms
- Contact form
- About section
- Image gallery

## API Integration Points

### 1. Get Room Availability
- **Endpoint**: `GET /api/rooms`
- **Expected Response**:
```json
{
  "rooms": [
    {
      "id": "1",
      "type": "1 in 1",
      "availableBedspaces": 10,
      "price": "150000"
    },
    // ... other room types
  ]
}
```

### 2. Book Room
- **Endpoint**: `POST /api/bookings`
- **Request Body**:
```json
{
  "roomType": "1 in 1",
  "numberOfBedspaces": 1,
  "studentName": "string",
  "studentEmail": "string",
  "phoneNumber": "string"
}
```
- **Expected Response**:
```json
{
  "bookingId": "string",
  "status": "success",
  "message": "Booking confirmed"
}
```

### 3. Contact Form
- **Endpoint**: `POST /api/contact`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## Setup Instructions

1. Clone the repository
2. Open `index.html` in your browser
3. For development, you can use a local server:
   ```bash
   npx http-server
   ```

## Backend Integration Notes

1. Update the API endpoints in `script.js` to match your backend URLs
2. Implement error handling for failed API requests
3. Add authentication if required
4. Test all endpoints with proper error scenarios

## File Structure

- `index.html` - Main application file
- `script.js` - Application logic and API integrations
- `style.css` - Styling
- `assets/` - Images and media files

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
