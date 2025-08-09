import React from 'react';

const BookingHistoryModal = ({ show, bookings = [], onClose }) => {
  if (!show) return null;

  return (
    <div className="booking-history-modal" style={{
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
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600}}>Booking History</h2>
        
        {bookings.length === 0 ? (
          <p style={{textAlign: 'center', color: '#6b7280', marginBottom: '2rem'}}>
            No booking history found.
          </p>
        ) : (
          <div style={{marginBottom: '2rem'}}>
            {bookings.map((booking, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                  <div>
                    <p><strong>Room:</strong> {booking.room}</p>
                    <p><strong>Academic Year:</strong> {booking.year}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong> 
                      <span style={{
                        color: booking.status === 'Confirmed' ? '#059669' : '#2563eb',
                        marginLeft: '0.5rem'
                      }}>
                        {booking.status}
                      </span>
                    </p>
                    <p><strong>Price:</strong> ₵{booking.price.toLocaleString()}</p>
                  </div>
                  {booking.bedspace && (
                    <p><strong>Bed Space:</strong> {booking.bedspace}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button 
            className="btn"
            onClick={onClose}
            style={{background: '#f3f4f6', color: '#333'}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryModal;
