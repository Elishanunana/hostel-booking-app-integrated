// Transform backend room data to frontend format
export const transformRoomData = (backendRoom) => {
  return {
    id: backendRoom.id,
    name: `${backendRoom.hostel_name} - Room ${backendRoom.room_number}`,
    type: determineRoomType(backendRoom.max_occupancy),
    floor: extractFloorFromLocation(backendRoom.location) || 'N/A',
    price: calculateAnnualPrice(backendRoom.price_per_night),
    availability: backendRoom.is_available ? 'available' : 'unavailable',
    img: backendRoom.image || '/assets/default-room.jpg',
    images: [backendRoom.image || '/assets/default-room.jpg'],
    desc: backendRoom.description || 'No description available',
    totalBedspaces: backendRoom.max_occupancy,
    availableBedspaces: backendRoom.is_available ? backendRoom.max_occupancy : 0,
    location: backendRoom.location || '',
    facilities: backendRoom.facilities || [],
    hostel_name: backendRoom.hostel_name,
    room_number: backendRoom.room_number,
    price_per_night: backendRoom.price_per_night,
    max_occupancy: backendRoom.max_occupancy,
    is_available: backendRoom.is_available
  };
};

// Transform array of backend rooms to frontend format
export const transformRoomsData = (backendRooms) => {
  if (!Array.isArray(backendRooms)) {
    return [];
  }
  return backendRooms.map(transformRoomData);
};

// Transform frontend booking data to backend format
export const transformBookingData = (frontendBooking, roomId) => {
  return {
    room_id: roomId,
    check_in_date: frontendBooking.checkInDate,
    check_out_date: frontendBooking.checkOutDate,
  };
};

// Transform backend booking data to frontend format
export const transformBackendBookingData = (backendBooking) => {
  return {
    id: backendBooking.id,
    room: backendBooking.room ? transformRoomData(backendBooking.room) : null,
    roomName: backendBooking.room ? `${backendBooking.room.hostel_name} - Room ${backendBooking.room.room_number}` : 'Unknown Room',
    checkInDate: backendBooking.check_in_date,
    checkOutDate: backendBooking.check_out_date,
    totalAmount: backendBooking.total_amount,
    status: backendBooking.booking_status,
    statusDisplay: backendBooking.booking_status_display || capitalizeFirst(backendBooking.booking_status),
    createdAt: backendBooking.created_at,
    studentInfo: backendBooking.student_info,
    // Legacy format for compatibility
    year: extractAcademicYear(backendBooking.check_in_date, backendBooking.check_out_date),
    price: backendBooking.total_amount,
    bedspace: `Bed 1 of ${backendBooking.room?.max_occupancy || 1}`
  };
};

// Transform backend user data to frontend format
export const transformUserData = (backendUser) => {
  return {
    id: backendUser.id,
    username: backendUser.username,
    email: backendUser.email,
    role: backendUser.role,
    joinedDate: extractDateFromTimestamp(backendUser.date_joined) || new Date().toISOString().split('T')[0],
    bookings: [] // Will be populated separately
  };
};

// Transform frontend auth data to backend format
export const transformAuthData = (frontendAuth, isLogin = true) => {
  if (isLogin) {
    return {
      username: frontendAuth.username || frontendAuth.email,
      email: frontendAuth.email,
      password: frontendAuth.password
    };
  } else {
    // Registration
    return {
      username: frontendAuth.username,
      email: frontendAuth.email,
      password: frontendAuth.password,
      role: 'student'
    };
  }
};

// Helper functions
const determineRoomType = (maxOccupancy) => {
  return `${maxOccupancy}in1`;
};

const calculateAnnualPrice = (pricePerNight) => {
  // Assuming academic year is ~300 days (10 months)
  return Math.round(parseFloat(pricePerNight) * 300);
};

const extractFloorFromLocation = (location) => {
  if (!location) return null;
  
  const floorKeywords = {
    'ground': 'ground',
    'first': 'first',
    'second': 'second',
    'third': 'third',
    'fourth': 'fourth',
    'fifth': 'fifth',
    'basement': 'basement',
    '1st': 'first',
    '2nd': 'second',
    '3rd': 'third',
    '4th': 'fourth',
    '5th': 'fifth'
  };
  
  const lowerLocation = location.toLowerCase();
  for (const [keyword, floor] of Object.entries(floorKeywords)) {
    if (lowerLocation.includes(keyword)) {
      return floor;
    }
  }
  
  return null;
};

const extractAcademicYear = (checkInDate, checkOutDate) => {
  if (!checkInDate) return new Date().getFullYear() + '/' + (new Date().getFullYear() + 1);
  
  const year = new Date(checkInDate).getFullYear();
  return `${year}/${year + 1}`;
};

const extractDateFromTimestamp = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString().split('T')[0];
};

const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Filter transformation utilities
export const transformFrontendFilters = (frontendFilters) => {
  const backendFilters = {};
  
  // Map frontend filter names to backend parameter names
  if (frontendFilters.roomType) {
    // Convert room type to max_occupancy for filtering
    const occupancy = parseInt(frontendFilters.roomType.replace('in1', ''));
    if (!isNaN(occupancy)) {
      backendFilters.max_occupancy = occupancy;
    }
  }
  
  if (frontendFilters.roomPrice) {
    // Convert annual price to daily price for filtering
    const annualPrice = parseInt(frontendFilters.roomPrice);
    if (!isNaN(annualPrice)) {
      backendFilters.price_min = Math.round(annualPrice / 300);
    }
  }
  
  if (frontendFilters.roomAvailability) {
    backendFilters.is_available = frontendFilters.roomAvailability === 'available';
  }
  
  if (frontendFilters.roomSearch) {
    backendFilters.search = frontendFilters.roomSearch;
  }
  
  if (frontendFilters.location) {
    backendFilters.location = frontendFilters.location;
  }
  
  return backendFilters;
};

// Price calculation utilities
export const calculateBookingTotal = (pricePerNight, checkInDate, checkOutDate) => {
  if (!pricePerNight || !checkInDate || !checkOutDate) return 0;
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  return Math.round(parseFloat(pricePerNight) * Math.max(days, 1));
};

// Validation utilities
export const validateBookingDates = (checkInDate, checkOutDate) => {
  const errors = [];
  
  if (!checkInDate) {
    errors.push('Check-in date is required');
  }
  
  if (!checkOutDate) {
    errors.push('Check-out date is required');
  }
  
  if (checkInDate && checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      errors.push('Check-in date cannot be in the past');
    }
    
    if (checkOut <= checkIn) {
      errors.push('Check-out date must be after check-in date');
    }
    
    // Maximum booking duration (e.g., 1 year)
    const maxDays = 365;
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (days > maxDays) {
      errors.push(`Booking duration cannot exceed ${maxDays} days`);
    }
  }
  
  return errors;
};

// Error message transformation
export const transformErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'object') {
    // Handle Django validation errors
    const messages = [];
    for (const [field, fieldErrors] of Object.entries(error)) {
      if (Array.isArray(fieldErrors)) {
        messages.push(...fieldErrors);
      } else if (typeof fieldErrors === 'string') {
        messages.push(fieldErrors);
      }
    }
    return messages.join('. ');
  }
  
  return 'An unexpected error occurred';
};