import React from 'react';

const ProfileModal = ({ show, user, onClose, onViewHistory }) => {
  if (!show || !user) return null;

  return (
    <div className="profile-modal" style={{
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
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{marginBottom: '2rem', textAlign: 'center'}}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2.5rem',
            color: '#6b7280'
          }}>
            <i className="ri-user-line"></i>
          </div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>{user.username}</h2>
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500}}>Profile Information</h3>
          <p><strong>Student ID:</strong> {user.studentId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.joinedDate}</p>
          <p><strong>Bookings:</strong> {user.bookings?.length || 0}</p>
        </div>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button 
            className="btn"
            onClick={onViewHistory}
            style={{background: '#2563eb'}}
          >
            View Booking History
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

export default ProfileModal;
