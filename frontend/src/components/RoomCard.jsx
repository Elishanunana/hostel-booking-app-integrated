import React from 'react';

const RoomCard = ({ room, onBookNow, onViewDetails }) => {
  const { name, type, floor, price, availability, img, desc, availableBedspaces, totalBedspaces } = room;

  return (
    <div className="room-card" style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
      background: '#fff',
      marginBottom: '2rem'
    }}>
      <img 
        src={img} 
        alt={name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
      />
      <div style={{padding: '1.5rem'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem'}}>{name}</h3>
        <p style={{color: '#4b5563', marginBottom: '1rem'}}>{desc}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <span>Floor: {floor}</span>
          <span>₵{price.toLocaleString()}/year</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <span>Type: {type}</span>
          <span>Available: {availableBedspaces}/{totalBedspaces}</span>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button 
            className="btn" 
            onClick={() => onViewDetails(room)}
            style={{flex: 1}}
          >
            View Details
          </button>
          <button 
            className="btn" 
            onClick={() => onBookNow(room)}
            style={{flex: 1, background: availableBedspaces > 0 ? '#059669' : '#9ca3af'}}
            disabled={availableBedspaces === 0}
          >
            {availableBedspaces > 0 ? 'Book Now' : 'Fully Booked'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
