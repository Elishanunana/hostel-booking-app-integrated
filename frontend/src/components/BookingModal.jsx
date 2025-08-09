import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { transformBookingData, validateBookingDates, calculateBookingTotal, transformErrorMessage } from '../utils/dataTransformers';

const BookingModal = ({ show, room, user, onClose, onSuccess }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (room && checkInDate && checkOutDate) {
      const total = calculateBookingTotal(room.price_per_night, checkInDate, checkOutDate);
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [room, checkInDate, checkOutDate]);

  if (!show || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate dates
      const validationErrors = validateBookingDates(checkInDate, checkOutDate);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('. '));
      }

      if (!user) {
        throw new Error('Please log in to make a booking');
      }

      const bookingData = transformBookingData({
        checkInDate,
        checkOutDate
      }, room.id);

      const response = await ApiService.createBooking(bookingData);
      
      if (response) {
        onSuccess(response);
        onClose();
        // Reset form
        setCheckInDate('');
        setCheckOutDate('');
        setTotalAmount(0);
      }
    } catch (err) {
      setError(transformErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCheckInDate('');
    setCheckOutDate('');
    setTotalAmount(0);
    setError('');
    onClose();
  };

  // Calculate minimum dates
  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkInDate || today;

  return (
    <div className="booking-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#2d3748'
        }}>
          Book {room.name}
        </h2>

        {/* Room Summary */}
        <div style={{
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            marginBottom: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            color: '#2d3748'
          }}>
            Room Details
          </h3>
          <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.9rem', color: '#4a5568' }}>
            <p><strong>Room:</strong> {room.name}</p>
            <p><strong>Location:</strong> {room.location || 'Not specified'}</p>
            <p><strong>Max Occupancy:</strong> {room.max_occupancy} person(s)</p>
            <p><strong>Price per night:</strong> ₵{parseFloat(room.price_per_night || 0).toLocaleString()}</p>
            {room.facilities && room.facilities.length > 0 && (
              <p><strong>Facilities:</strong> {room.facilities.join(', ')}</p>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: '#2d3748'
            }}>
              Check-in Date:
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={today}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                background: isLoading ? '#f7fafc' : '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: '#2d3748'
            }}>
              Check-out Date:
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={minCheckOut}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                background: isLoading ? '#f7fafc' : '#fff'
              }}
            />
          </div>

          {/* Total Amount Display */}
          {totalAmount > 0 && (
            <div style={{
              background: '#ebf5ff',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, color: '#2d3748' }}>Total Amount:</span>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  color: '#2563eb' 
                }}>
                  ₵{totalAmount.toLocaleString()}
                </span>
              </div>
              {checkInDate && checkOutDate && (
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#4a5568', 
                  marginTop: '0.25rem' 
                }}>
                  {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} night(s) 
                  × ₵{parseFloat(room.price_per_night || 0).toLocaleString()}/night
                </div>
              )}
            </div>
          )}

          {!user && (
            <div style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #fde68a'
            }}>
              Please log in to make a booking
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#4a5568',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !user || !checkInDate || !checkOutDate}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                background: (isLoading || !user || !checkInDate || !checkOutDate) ? '#94a3b8' : '#2563eb',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: (isLoading || !user || !checkInDate || !checkOutDate) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>

        {/* Booking Terms */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: '#4a5568',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Booking Terms:</h4>
          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
            <li>Booking is subject to availability and confirmation</li>
            <li>Payment is required to confirm your booking</li>
            <li>Cancellation policy applies as per hostel terms</li>
            <li>Check-in time: 2:00 PM, Check-out time: 12:00 PM</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;