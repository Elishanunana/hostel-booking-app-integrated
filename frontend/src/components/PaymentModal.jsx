import React from 'react';

const PaymentModal = ({ 
  show,
  room,
  selectedPayment,
  onPaymentSelect,
  onSubmit,
  onClose,
  isProcessing,
  bookingStatus
}) => {
  if (!show || !room) return null;

  const paymentMethods = [
    { id: 'momo', name: 'Mobile Money', icon: '📱' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' }
  ];

  return (
    <div className="payment-modal" style={{
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
        <h2 style={{marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600}}>Payment Details</h2>
        
        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500}}>Room Summary</h3>
          <p><strong>Room:</strong> {room.name}</p>
          <p><strong>Price:</strong> ₵{room.price.toLocaleString()}/year</p>
          <p><strong>Available Spaces:</strong> {room.availableBedspaces}/{room.totalBedspaces}</p>
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500}}>Select Payment Method</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => onPaymentSelect(method.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedPayment === method.id ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  background: selectedPayment === method.id ? '#ebf5ff' : '#fff',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span style={{fontSize: '1.5rem'}}>{method.icon}</span>
                <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {bookingStatus.message && (
          <div style={{
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            background: bookingStatus.status === 'success' ? '#dcfce7' : '#fee2e2',
            color: bookingStatus.status === 'success' ? '#166534' : '#991b1b'
          }}>
            {bookingStatus.message}
          </div>
        )}

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button 
            className="btn"
            onClick={onSubmit}
            disabled={!selectedPayment || isProcessing}
            style={{
              background: '#2563eb',
              opacity: !selectedPayment || isProcessing ? 0.5 : 1
            }}
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
          <button 
            className="btn"
            onClick={onClose}
            disabled={isProcessing}
            style={{background: '#f3f4f6', color: '#333'}}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
