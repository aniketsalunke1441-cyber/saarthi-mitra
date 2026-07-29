import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PassengerDashboard.css';

export default function PassengerDashboard() {
  const navigate = useNavigate();

  // Passenger Profile State
  const [passengerName, setPassengerName] = useState('Rahul');
  const [gender, setGender] = useState('female'); // 'male' or 'female'
  const [emergencyContact1, setEmergencyContact1] = useState('+91 98765 43210');
  const [emergencyContact2, setEmergencyContact2] = useState('+91 91234 56789');

  // Booking State
  const [pickup, setPickup] = useState('MG Road, Main Market');
  const [drop, setDrop] = useState('Pune International Airport');
  const [selectedCab, setSelectedCab] = useState('sedan'); // 'hatchback', 'sedan', 'suv'
  const [bookingStatus, setBookingStatus] = useState('idle'); // 'idle', 'searching', 'confirmed', 'completed'
  const [toastMessage, setToastMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  // Active Ride Info
  const [assignedDriver, setAssignedDriver] = useState(null);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('passengerProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setPassengerName(parsed.fullName);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.emergencyContact1) setEmergencyContact1(parsed.emergencyContact1);
        if (parsed.emergencyContact2) setEmergencyContact2(parsed.emergencyContact2);
      }
    } catch (e) {
      console.error("Error reading passenger profile", e);
    }
  }, []);

  // Listen for driver acceptance / cancellation in real time
  useEffect(() => {
    const checkStatus = () => {
      try {
        const status = localStorage.getItem('activeRideBookingStatus');
        if (status === 'accepted') {
          setAssignedDriver({
            name: 'Krishna Gadhe',
            rating: '4.9 ⭐',
            trips: '1,250 Trips',
            vehicle: 'Swift Dzire (White)',
            plate: 'MH 12 AB 1234',
            otp: '4621',
            fare: selectedCab === 'hatchback' ? 120 : selectedCab === 'sedan' ? 180 : 280,
            eta: '3 mins away',
            phone: '+91 98765 12345'
          });
          setBookingStatus('confirmed');
        } else if (status === 'declined' || status === 'cancelled') {
          setBookingStatus('idle');
          setAssignedDriver(null);
        }
      } catch (e) {}
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    window.addEventListener('storage', checkStatus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkStatus);
    };
  }, [selectedCab]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBookRide = (e) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim()) {
      triggerToast('⚠️ Please enter both Pickup and Drop locations!');
      return;
    }

    const calculatedFare = selectedCab === 'hatchback' ? 120 : selectedCab === 'sedan' ? 180 : 280;
    const ridePayload = {
      passenger: passengerName,
      rating: '4.8 ⭐',
      otp: '4621',
      pickup: pickup,
      drop: drop,
      distance: '8.2 km',
      fare: calculatedFare,
      eta: '12 min',
      status: 'pending'
    };

    try {
      localStorage.setItem('activeRideBooking', JSON.stringify(ridePayload));
      localStorage.setItem('activeRideBookingStatus', 'pending');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    setBookingStatus('searching');
    triggerToast('🔍 Ride Request Sent to Driver Dashboard!');
  };

  const handleCancelRide = () => {
    setBookingStatus('idle');
    setAssignedDriver(null);
    try {
      localStorage.setItem('activeRideBookingStatus', 'cancelled');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}
    triggerToast('❌ Ride Booking Cancelled.');
  };

  const handleTriggerSOS = () => {
    setShowSosModal(true);
  };

  return (
    <div className="passenger-app-container">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="passenger-toast">
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER & NAVBAR */}
      <header className="passenger-header">
        <div className="ph-left">
          <img src="/images/logo-removebg-preview.png" alt="SarthiMitra Logo" className="ph-logo" />
          <div>
            <h2 className="ph-title">SarthiMitra Cab</h2>
            <span className="ph-sub">Passenger Portal</span>
          </div>
        </div>

        <div className="ph-right">
          <div className={`gender-badge-pill ${gender}`}>
            <span>{gender === 'female' ? 'Female' : 'Male'}</span>
          </div>
          
          <button className="ph-profile-btn" onClick={() => setShowProfileModal(true)}>
            👤 {passengerName}
          </button>
        </div>
      </header>

      {/* SAFETY NOTICE BANNER FOR FEMALE / EMERGENCY BANNER */}
      {gender === 'female' ? (
        <div className="women-safety-banner">
          <div className="ws-left">
            <span className="ws-icon">🛡️</span>
            <div>
              <strong>Women Safety Protection Enabled</strong>
              <small>2 Registered Emergency Contacts Active ({emergencyContact1}, {emergencyContact2})</small>
            </div>
          </div>
          <button className="btn-sos-trigger" onClick={handleTriggerSOS}>
            🚨 EMERGENCY SOS
          </button>
        </div>
      ) : (
        <div className="safety-banner-male">
          <div className="ws-left">
            <span className="ws-icon">🛡️</span>
            <div>
              <strong>Safety Tracking Enabled</strong>
              <small>Emergency Contact Active ({emergencyContact1})</small>
            </div>
          </div>
          <button className="btn-sos-trigger" onClick={handleTriggerSOS}>
            🚨 SOS
          </button>
        </div>
      )}

      {/* MAIN LAYOUT GRID */}
      <div className="passenger-content-grid">

        {/* LEFT COLUMN: BOOKING CARD & CAB SELECTION */}
        <div className="passenger-card booking-card">
          <h3>🚖 Where to?</h3>
          <p className="card-subtext">Book a safe cab in seconds with verified drivers</p>

          <form onSubmit={handleBookRide}>
            
            {/* PICKUP & DROP INPUTS */}
            <div className="route-input-group">
              <div className="input-field-wrap">
                <span className="field-icon green">📍</span>
                <input
                  type="text"
                  placeholder="Enter Pickup Location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
                <button type="button" className="btn-gps" onClick={() => { setPickup('Current GPS Location (MG Road)'); triggerToast('📍 GPS Location Detected!'); }}>
                  GPS
                </button>
              </div>

              <div className="route-line-connector"></div>

              <div className="input-field-wrap">
                <span className="field-icon red">🏁</span>
                <input
                  type="text"
                  placeholder="Enter Destination / Drop Location"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                />
              </div>
            </div>

            {/* QUICK DESTINATION CHIPS */}
            <div className="quick-chips-row">
              <button type="button" onClick={() => setDrop('Pune International Airport')}>✈️ Airport</button>
              <button type="button" onClick={() => setDrop('Pune Railway Station')}>🚉 Station</button>
              <button type="button" onClick={() => setDrop('Phoenix Marketcity Mall')}>🛍️ Phoenix Mall</button>
              <button type="button" onClick={() => setDrop('Hinjawadi IT Park')}>🏢 IT Park</button>
            </div>

            {/* CAB TYPE SELECTION */}
            <h4 className="section-title">Select Cab Option</h4>
            <div className="cab-options-grid">
              
              <div
                className={`cab-type-card ${selectedCab === 'hatchback' ? 'selected' : ''}`}
                onClick={() => setSelectedCab('hatchback')}
              >
                <div className="ct-icon">🚖</div>
                <div className="ct-details">
                  <strong>Mini Hatchback</strong>
                  <small>Comfy 4 seater • 3 min away</small>
                </div>
                <div className="ct-price">₹120</div>
              </div>

              <div
                className={`cab-type-card ${selectedCab === 'sedan' ? 'selected' : ''}`}
                onClick={() => setSelectedCab('sedan')}
              >
                <div className="ct-icon">🚗</div>
                <div className="ct-details">
                  <strong>Comfort Sedan</strong>
                  <small>AC Sedan • Top Rated Drivers</small>
                </div>
                <div className="ct-price">₹180</div>
              </div>

              <div
                className={`cab-type-card ${selectedCab === 'suv' ? 'selected' : ''}`}
                onClick={() => setSelectedCab('suv')}
              >
                <div className="ct-icon">🚙</div>
                <div className="ct-details">
                  <strong>Premium SUV</strong>
                  <small>Spacious 6 seater • Extra luggage</small>
                </div>
                <div className="ct-price">₹280</div>
              </div>

            </div>

            {/* BOOK BUTTON */}
            {bookingStatus === 'idle' && (
              <button type="submit" className="btn-confirm-booking">
                🚖 Book {selectedCab.toUpperCase()} Now
              </button>
            )}

            {bookingStatus === 'searching' && (
              <button type="button" className="btn-confirm-booking searching" disabled>
                <span className="spinner">⌛</span> Searching Nearby Drivers...
              </button>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE RIDE TRACKING & MAP */}
        <div className="passenger-card tracking-card">
          <h3>🗺️ Live Ride Status & Map</h3>
          
          {bookingStatus === 'confirmed' && assignedDriver ? (
            <div className="live-ride-confirmed-pane">
              
              {/* DRIVER INFO CARD */}
              <div className="driver-assigned-card">
                <div className="dac-left">
                  <div className="driver-avatar-circle">👨‍✈️</div>
                  <div>
                    <h4>{assignedDriver.name}</h4>
                    <span className="dac-rating">{assignedDriver.rating} • {assignedDriver.trips}</span>
                    <div className="dac-vehicle">{assignedDriver.vehicle} • <strong>{assignedDriver.plate}</strong></div>
                  </div>
                </div>

                <div className="dac-otp-box">
                  <small>Share OTP with Driver</small>
                  <strong>{assignedDriver.otp}</strong>
                </div>
              </div>

              {/* LIVE GOOGLE MAP EMBED */}
              <div className="live-map-embed-box">
                <iframe
                  title="Passenger Live Google Map"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: '16px', marginBottom: '0.75rem' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(pickup + ', Pune')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>

              {/* RIDE ACTIONS */}
              <div className="confirmed-ride-actions">
                <a href={`tel:${assignedDriver.phone}`} className="btn-call-driver">
                  📞 Call Driver ({assignedDriver.phone})
                </a>
                <button className="btn-cancel-ride" onClick={handleCancelRide}>
                  Cancel Booking
                </button>
              </div>

            </div>
          ) : (
            <div className="no-active-booking-pane">
              <div className="map-placeholder-box">
                <iframe
                  title="Passenger Default Location Map"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: '16px' }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Pune,Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
              <p className="no-ride-text">Enter pickup & destination above to view live ride options and driver location.</p>
            </div>
          )}

          {/* RECENT RIDES LIST */}
          <div className="recent-rides-section">
            <h4>📜 Recent Trips</h4>
            <div className="recent-ride-item">
              <div>
                <strong>MG Road ➔ Pune Station</strong>
                <small>Yesterday, 4:30 PM • Sedan</small>
              </div>
              <span className="rr-fare">₹140</span>
            </div>
            <div className="recent-ride-item">
              <div>
                <strong>Airport ➔ Phoenix Mall</strong>
                <small>25 Jul, 10:15 AM • SUV</small>
              </div>
              <span className="rr-fare">₹260</span>
            </div>
          </div>

        </div>

      </div>

      {/* PROFILE & EMERGENCY CONTACTS MODAL */}
      {showProfileModal && (
        <div className="cab-modal-overlay">
          <div className="cab-modal-card">
            <div className="modal-header">
              <h3>👤 Passenger Profile & Safety Contacts</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="profile-info-box">
                <div className="pib-avatar">{gender === 'female' ? '' : ''}</div>
                <h4>{passengerName}</h4>
                <span className="pib-gender-tag">{gender === 'female' ? 'Female Passenger' : 'Male Passenger'}</span>
              </div>

              <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Registered Emergency Contacts:</h4>
              <div className="emergency-contacts-list">
                <div className="ec-item">
                  <span>Contact 1 (Primary):</span>
                  <strong>{emergencyContact1 || 'Not set'}</strong>
                </div>
                {gender === 'female' ? (
                  <div className="ec-item female-highlight">
                    <span>Contact 2 (Women Safety Required):</span>
                    <strong>{emergencyContact2 || 'Not set'}</strong>
                  </div>
                ) : (
                  <div className="ec-item muted">
                    <span>Contact 2:</span>
                    <small>Optional for Male Passengers</small>
                  </div>
                )}
              </div>

              <button className="btn-close-profile-modal" onClick={() => setShowProfileModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS EMERGENCY MODAL */}
      {showSosModal && (
        <div className="cab-modal-overlay">
          <div className="cab-modal-card sos-modal-card">
            <div className="modal-header">
              <h3 style={{ color: '#dc2626' }}>🚨 EMERGENCY SOS ALERT</h3>
              <button className="close-btn" onClick={() => setShowSosModal(false)}>✕</button>
            </div>
            <div className="modal-body text-center">
              <div className="sos-alert-pulse-ring">🚨</div>
              <h2>Alerting Safety Network!</h2>
              <p>Live GPS Location & SOS notification being dispatched to:</p>
              <div className="sos-contacts-box">
                <div>📞 Contact 1: <strong>{emergencyContact1}</strong></div>
                {gender === 'female' && <div>📞 Contact 2: <strong>{emergencyContact2}</strong></div>}
                <div>🚓 Police Helpline: <strong>112</strong></div>
              </div>
              <button className="btn-cancel-sos" onClick={() => { setShowSosModal(false); triggerToast('✅ SOS Alert Cancelled'); }}>
                Cancel SOS Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
