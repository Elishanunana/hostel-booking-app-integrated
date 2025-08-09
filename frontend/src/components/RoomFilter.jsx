import React from 'react';

const RoomFilter = ({ 
  roomType,
  roomFloor,
  roomPrice,
  roomAvailability,
  roomSearch,
  onFilterChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="room-filter" style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <select 
          value={roomType}
          onChange={(e) => onFilterChange('roomType', e.target.value)}
          style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0'}}
        >
          <option value="">All Room Types</option>
          <option value="1in1">1 in 1</option>
          <option value="2in1">2 in 1</option>
          <option value="3in1">3 in 1</option>
          <option value="4in1">4 in 1</option>
        </select>

        <select 
          value={roomFloor}
          onChange={(e) => onFilterChange('roomFloor', e.target.value)}
          style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0'}}
        >
          <option value="">All Floors</option>
          <option value="first">First Floor</option>
          <option value="second">Second Floor</option>
          <option value="third">Third Floor</option>
          <option value="fourth">Fourth Floor</option>
        </select>

        <select 
          value={roomPrice}
          onChange={(e) => onFilterChange('roomPrice', e.target.value)}
          style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0'}}
        >
          <option value="">All Prices</option>
          <option value="5000">₵5,000 and above</option>
          <option value="7500">₵7,500 and above</option>
          <option value="10000">₵10,000 and above</option>
          <option value="12500">₵12,500 and above</option>
        </select>

        <select 
          value={roomAvailability}
          onChange={(e) => onFilterChange('roomAvailability', e.target.value)}
          style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0'}}
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <input
          type="text"
          placeholder="Search rooms..."
          value={roomSearch}
          onChange={(e) => onFilterChange('roomSearch', e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            width: '100%'
          }}
        />
      </div>

      <button
        type="submit"
        className="btn"
        style={{
          width: '100%',
          background: '#2563eb',
          color: '#fff',
          padding: '0.75rem'
        }}
      >
        Apply Filters
      </button>
    </form>
  );
};

export default RoomFilter;
