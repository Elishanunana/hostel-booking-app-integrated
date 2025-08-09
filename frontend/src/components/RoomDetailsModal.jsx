import React from 'react';

const RoomDetailsModal = ({ show, room, onClose, onBookNow }) => {
  if (!show || !room) return null;

  return (
    <div className="room-details-modal" style={{
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
        <h2 style={{marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600}}>{room.name}</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
          {room.images && room.images.map((img, index) => (
            <img 
              key={index}
              src={img}
              alt={`${room.name} view ${index + 1}`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500}}>Room Details</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
            <div>
              <p><strong>Type:</strong> {room.type}</p>
              <p><strong>Floor:</strong> {room.floor}</p>
            </div>
            <div>
              <p><strong>Price:</strong> ₵{room.price.toLocaleString()}/year</p>
              <p><strong>Available Spaces:</strong> {room.availableBedspaces}/{room.totalBedspaces}</p>
            </div>
          </div>
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500}}>Description</h3>
          <p style={{color: '#4b5563', lineHeight: '1.6'}}>{room.desc}</p>
        </div>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button 
            className="btn"
            onClick={() => onBookNow(room)}
            style={{background: room.availableBedspaces > 0 ? '#059669' : '#9ca3af'}}
            disabled={room.availableBedspaces === 0}
          >
            {room.availableBedspaces > 0 ? 'Book Now' : 'Fully Booked'}
          </button>
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

export default RoomDetailsModal;
