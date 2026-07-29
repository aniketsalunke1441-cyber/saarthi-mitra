import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CabDriverDashboard.css';

export default function CabDriverDashboard() {
  const navigate = useNavigate();

  // Driver state
  const [driverName, setDriverName] = useState('Krishna');
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'trips', 'earnings', 'messages', 'profile'
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = React.useRef(null);
  
  // Side Navbar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dynamic Driver Earnings & Performance State (Starting with 0)
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [completedTripsCount, setCompletedTripsCount] = useState(0);
  const [onlineTimeStr, setOnlineTimeStr] = useState('0h 15m');
  const [totalDistanceStr, setTotalDistanceStr] = useState('0 km');
  const [tripsList, setTripsList] = useState([]);
  const [walletTxList, setWalletTxList] = useState([]);

  // Popups & Modals State
  const [showRidePopup, setShowRidePopup] = useState(true); // Floating popup
  const [activeRide, setActiveRide] = useState(null); // When ride accepted
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [profileModalView, setProfileModalView] = useState(null); // 'personal', 'vehicle', 'license', 'docs', 'settings', 'support'
  const [toastMessage, setToastMessage] = useState('');

  // Trips Tab state
  const [tripFilter, setTripFilter] = useState('completed'); // 'current', 'completed', 'cancelled'

  // Chat state
  const [messagesTab, setMessagesTab] = useState('notifications'); // 'notifications', 'chat'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'passenger', text: 'Hi Krishna, I am standing near Gate 2 at MG Road.', time: '10:12 AM' },
    { id: 2, sender: 'driver', text: 'On my way! Arriving in 2 mins.', time: '10:13 AM' }
  ]);

  // Incoming Ride Request State (Synced with Passenger Dashboard)
  const [passengerBookingReq, setPassengerBookingReq] = useState({
    passenger: 'Rahul Sharma',
    rating: '4.8 ⭐',
    otp: '4621',
    pickup: 'MG Road, Main Market',
    drop: 'Pune International Airport',
    distance: '8.4 km',
    fare: 420,
    eta: '12 min',
    status: 'pending'
  });

  // Load driver profile & listen for incoming passenger ride requests
  useEffect(() => {
    try {
      const saved = localStorage.getItem('driverProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setDriverName(parsed.fullName);
      }
      const savedPhoto = localStorage.getItem('cabDriverPhoto');
      if (savedPhoto) setProfilePhoto(savedPhoto);
    } catch (e) {
      console.error("Error reading profile", e);
    }

    const checkIncomingRide = () => {
      try {
        const savedBooking = localStorage.getItem('activeRideBooking');
        const bookingStatus = localStorage.getItem('activeRideBookingStatus');
        if (savedBooking && bookingStatus === 'pending') {
          const parsed = JSON.parse(savedBooking);
          setPassengerBookingReq(parsed);
          setShowRidePopup(true);
        }
      } catch (err) {}
    };

    checkIncomingRide();
    const interval = setInterval(checkIncomingRide, 1000);
    window.addEventListener('storage', checkIncomingRide);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkIncomingRide);
    };
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result;
        setProfilePhoto(photoUrl);
        try {
          localStorage.setItem('cabDriverPhoto', photoUrl);
        } catch (err) {}
        triggerToast('📸 Profile Photo Updated Successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Ride Request Handlers
  const handleAcceptRide = () => {
    setShowRidePopup(false);
    const acceptedRide = {
      passenger: passengerBookingReq.passenger || 'Rahul Sharma',
      rating: passengerBookingReq.rating || '4.8 ⭐',
      otp: passengerBookingReq.otp || '4621',
      pickup: passengerBookingReq.pickup || 'MG Road, Main Market',
      drop: passengerBookingReq.drop || 'Pune International Airport',
      distance: passengerBookingReq.distance || '8.4 km',
      fare: passengerBookingReq.fare || 420,
      eta: passengerBookingReq.eta || '2 min away',
      status: 'Navigating to Pickup'
    };
    setActiveRide(acceptedRide);
    try {
      localStorage.setItem('activeRideBookingStatus', 'accepted');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}
    setShowNavigationModal(true); // Auto-open live customer map location!
    triggerToast(`✅ Ride Accepted for ${acceptedRide.passenger}! Route Navigation Loaded.`);
  };

  const handleDeclineRide = () => {
    setShowRidePopup(false);
    try {
      localStorage.setItem('activeRideBookingStatus', 'declined');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}
    triggerToast('❌ Ride Declined. Searching for next request...');
  };

  const handleCompleteActiveRide = () => {
    if (!activeRide) return;
    const earnedFare = activeRide.fare;
    setTodayEarnings(prev => prev + earnedFare);
    setTotalEarnings(prev => prev + earnedFare);
    setWalletBalance(prev => prev + earnedFare);
    setCompletedTripsCount(prev => prev + 1);
    setTotalDistanceStr(activeRide.distance);

    const newRecord = {
      id: `TR-${Math.floor(9000 + Math.random() * 999)}`,
      type: `${activeRide.drop.includes('Airport') ? 'Airport Ride' : 'City Ride'}`,
      fare: earnedFare,
      status: 'completed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      pickup: activeRide.pickup,
      drop: activeRide.drop,
      distance: activeRide.distance,
      duration: '22 min',
      passenger: activeRide.passenger
    };
    setTripsList(prev => [newRecord, ...prev]);

    setWalletTxList(prev => [
      { id: Date.now(), title: `Ride ${newRecord.id} Fare`, time: `${newRecord.time} • UPI Credit`, amount: `+ ₹${earnedFare}`, type: 'green' },
      ...prev
    ]);

    setActiveRide(null);
    triggerToast(`🎉 Ride Completed! ₹${earnedFare} added to your earnings.`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'driver',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  // Mock Data
  const tripsData = [
    { id: 'TR-9041', type: 'Airport Ride', fare: 420, status: 'completed', time: '11:45 AM', date: 'Today', pickup: 'MG Road', drop: 'Airport', distance: '8.4 km', duration: '22 min', passenger: 'Rahul Sharma' },
    { id: 'TR-8920', type: 'City Center Express', fare: 180, status: 'completed', time: '09:15 AM', date: 'Today', pickup: 'Katraj', drop: 'Deccan Gymkhana', distance: '5.2 km', duration: '14 min', passenger: 'Priya Verma' },
    { id: 'TR-8812', type: 'Tech Park Pick-up', fare: 310, status: 'cancelled', time: 'Yesterday', date: 'Yesterday', pickup: 'Hinjewadi Phase 1', drop: 'Viman Nagar', distance: '14.1 km', duration: '0 min', passenger: 'Amit Kulkarni' },
    { id: 'TR-8790', type: 'Expressway Route', fare: 950, status: 'completed', time: 'Yesterday', date: 'Yesterday', pickup: 'Kothrud', drop: 'Navi Mumbai Toll', distance: '110 km', duration: '1.5 hrs', passenger: 'Sunil Rao' }
  ];

  const notificationsList = [
    { id: 1, title: ' Ride Completed', desc: 'Airport dropoff completed successfully. ₹420 added.', time: '11:45 AM', type: 'success' },
    { id: 2, title: ' Bonus Earned', desc: 'Peak Hour Incentive ₹500 credited to your wallet!', time: '10:30 AM', type: 'bonus' },
    { id: 3, title: ' Payment Received', desc: 'Direct UPI payout of ₹1,850 completed.', time: '09:00 AM', type: 'wallet' },
    { id: 4, title: ' Documents Expiring', desc: 'Commercial Vehicle Insurance expires in 12 days.', time: 'Yesterday', type: 'warning' },
    { id: 5, title: ' New Update', desc: 'SarthiMitra Cab App v3.2 is live with route optimization.', time: '2 days ago', type: 'info' }
  ];

  return (
    <div className={`cab-app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="cab-toast-bar">
          {toastMessage}
        </div>
      )}

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileSidebarOpen(false)}></div>
      )}

      {/* SIDE NAVIGATION BAR */}
      <aside className={`cab-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        
        {/* SIDEBAR HEADER */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/images/logo-removebg-preview.png" alt="SarthiMitra Logo" className="sidebar-logo-img" style={{ width: '52px', height: '52px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
            {!isSidebarCollapsed && <span className="brand-title">SarthiMitra Cab</span>}
          </div>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            {isSidebarCollapsed ? '➔' : '☰'}
          </button>
        </div>

        {/* DRIVER MINI CARD WITH PHOTO UPLOAD */}
        <div className="sidebar-driver-card">
          <div className="sd-avatar clickable-avatar" onClick={triggerFileInput} title="Click to change profile photo">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="avatar-img-sm" />
            ) : (
              <span>👨‍✈️</span>
            )}
            <div className="avatar-cam-badge">📷</div>
          </div>
          {!isSidebarCollapsed && (
            <div className="sd-info">
              <h4>{driverName}</h4>
              <div className="sd-rating">⭐ 4.9 • {isOnline ? '🟢 Online' : '⚫ Offline'}</div>
            </div>
          )}
        </div>

        {/* SIDEBAR NAVIGATION ITEMS (HOME, TRIPS, EARNINGS, MESSAGES, PROFILE) */}
        <nav className="sidebar-menu">
          <div className="menu-label">{!isSidebarCollapsed && 'NAVIGATION'}</div>
          
          <button className={`sidebar-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Home</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => { setActiveTab('trips'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Trips</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('earnings'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Earnings</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => { setActiveTab('messages'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Messages</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Profile</span>}
          </button>
        </nav>

        {/* SIDEBAR FOOTER & QUICK ACTIONS */}
        <div className="sidebar-footer">
          {!isSidebarCollapsed && (
            <button className="sidebar-wallet-btn" onClick={() => { setShowWalletModal(true); setIsMobileSidebarOpen(false); }}>
              <span> Wallet</span>
              <strong>₹{walletBalance}</strong>
            </button>
          )}
          <button className="sidebar-logout-btn" onClick={() => navigate('/')}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Logout</span>}
          </button>
        </div>

      </aside>

      {/* MAIN CONTAINER */}
      <div className="cab-dashboard-container">

        {/* FLOATING RIDE REQUEST POPUP */}
        {showRidePopup && (
          <div className="ride-popup-overlay">
            <div className="ride-popup-card">
              <div className="ride-popup-badge">⚡ NEW PASSENGER RIDE REQUEST</div>
              <div className="ride-popup-header">
                <div className="passenger-avatar-box">
                  <span>👤</span>
                </div>
                <div className="passenger-info">
                  <h4>{passengerBookingReq.passenger}</h4>
                  <div className="passenger-rating">{passengerBookingReq.rating || '⭐ 4.8'} • Passenger</div>
                </div>
                <div className="fare-badge">₹{passengerBookingReq.fare}</div>
              </div>

              <div className="route-timeline">
                <div className="timeline-item pickup">
                  <span className="dot green"></span>
                  <div>
                    <small>PICKUP ({passengerBookingReq.eta || '12 min ETA'})</small>
                    <p>{passengerBookingReq.pickup}</p>
                  </div>
                </div>
                <div className="timeline-connector"></div>
                <div className="timeline-item drop">
                  <span className="dot red"></span>
                  <div>
                    <small>DROP ({passengerBookingReq.distance || '8.2 km'})</small>
                    <p>{passengerBookingReq.drop}</p>
                  </div>
                </div>
              </div>

              <div className="ride-popup-actions">
                <button className="btn-decline" onClick={handleDeclineRide}>
                  Decline
                </button>
                <button className="btn-accept" onClick={handleAcceptRide}>
                  Accept Ride
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOP HEADER */}
        <header className="cab-header">
          <div className="header-left">
            <button className="hamburger-mobile-btn" onClick={() => setIsMobileSidebarOpen(true)}>
              ☰
            </button>
            <div className="driver-greeting">
              <h2> Good Morning, {driverName}</h2>
              <div className="header-rating-badge">
                <span>⭐ 4.9 Rating</span>
                <span className="divider">•</span>
                <span className="trips-count">1,250 Trips</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            {/* ONLINE TOGGLE */}
            <div className={`online-switch ${isOnline ? 'active' : ''}`} onClick={() => setIsOnline(!isOnline)}>
              <div className="switch-dot"></div>
              <span className="switch-text">{isOnline ? '🟢 ONLINE' : '⚫ OFFLINE'}</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT BASED ON ACTIVE TAB */}
        <main className="cab-main-content">
          
          {/* ==================== TAB 1: HOME ==================== */}
          {activeTab === 'home' && (
            <div className="tab-pane home-pane">
              
              {/* TOP METRICS SUMMARY */}
              <div className="today-earnings-card">
                <div className="earnings-hero">
                  <span className="hero-label"> Today's Earnings</span>
                  <h1 className="hero-amount">₹{todayEarnings}</h1>
                  <span className="pending-badge">+ ₹{pendingEarnings} Pending</span>
                </div>
                
                <div className="quick-stats-row">
                  <div className="stat-pill">
                    <span className="icon"></span>
                    <div>
                      <strong>{completedTripsCount} Trips</strong>
                      <small>Completed</small>
                    </div>
                  </div>
                  <div className="stat-pill">
                    <span className="icon">⏱</span>
                    <div>
                      <strong>{onlineTimeStr}</strong>
                      <small>Online Time</small>
                    </div>
                  </div>
                  <div className="stat-pill">
                    <span className="icon">📍</span>
                    <div>
                      <strong>{totalDistanceStr}</strong>
                      <small>Total Distance</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="quick-actions-bar">
                <button className="qa-btn" onClick={() => setActiveTab('trips')}>
                  <span className="qa-icon">📍</span>
                  <span>My Trips</span>
                </button>
                <button className="qa-btn" onClick={() => setShowWalletModal(true)}>
                  <span className="qa-icon">💰</span>
                  <span>Wallet</span>
                </button>
                <button className="qa-btn" onClick={() => setActiveTab('earnings')}>
                  <span className="qa-icon">📈</span>
                  <span>Earnings</span>
                </button>
                <button className="qa-btn" onClick={() => setActiveTab('trips')}>
                  <span className="qa-icon">📜</span>
                  <span>Ride History</span>
                </button>
              </div>

              {/* FOUR EQUAL HOME CARDS GRID */}
              <div className="home-cards-grid">
                
                {/* CARD 1: ONLINE STATUS */}
                <div className={`home-card status-card ${isOnline ? 'online' : 'offline'}`}>
                  <div className="card-top">
                    <h3>Online Status</h3>
                    <span className="status-indicator">{isOnline ? '🟢 LIVE' : '⚫ IDLE'}</span>
                  </div>
                  <div className="card-body">
                    <div className="big-toggle-box" onClick={() => setIsOnline(!isOnline)}>
                      <div className="status-icon-lg">{isOnline ? '🟢' : '⚫'}</div>
                      <div className="status-title-lg">{isOnline ? 'ONLINE' : 'OFFLINE'}</div>
                    </div>
                    <p className="status-subtext">
                      {isOnline ? 'You are receiving ride requests in Pune area.' : 'You are currently offline. Tap above to go online.'}
                    </p>
                    {!isOnline && (
                      <button className="btn-go-online" onClick={() => setIsOnline(true)}>
                        Go Online
                      </button>
                    )}
                  </div>
                </div>

                {/* CARD 2: TODAY'S EARNINGS & GOAL */}
                <div className="home-card goal-card">
                  <div className="card-top">
                    <h3>Today's Income</h3>
                    <span className="goal-badge">Goal ₹2,500</span>
                  </div>
                  <div className="card-body">
                    <div className="goal-amount-box">
                      <span className="currency">₹</span>
                      <span className="val">{todayEarnings}</span>
                      <span className="sub">/ ₹2,500</span>
                    </div>
                    <div className="goal-progress-container">
                      <div className="progress-bar-wrap">
                        <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((todayEarnings / 2500) * 100))}%` }}></div>
                      </div>
                      <div className="progress-labels">
                        <span>{Math.min(100, Math.round((todayEarnings / 2500) * 100))}% Achieved</span>
                        <span>₹{Math.max(0, 2500 - todayEarnings)} Remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: TODAY'S PERFORMANCE (4 Equal Metrics) */}
                <div className="home-card perf-card">
                  <div className="card-top">
                    <h3>Today's Performance</h3>
                    <span className="perf-tag">{completedTripsCount > 0 ? 'Active' : 'New Driver'}</span>
                  </div>
                  <div className="perf-metrics-grid">
                    <div className="metric-item">
                      <span className="metric-val">{completedTripsCount}</span>
                      <span className="metric-lbl">Completed Trips</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val green">{completedTripsCount > 0 ? '100%' : '100%'}</span>
                      <span className="metric-lbl">Acceptance Rate</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val orange">0%</span>
                      <span className="metric-lbl">Cancellation</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val yellow">5.0 ⭐</span>
                      <span className="metric-lbl">Rating</span>
                    </div>
                  </div>
                </div>

                {/* CARD 4: ACTIVE RIDE & LIVE CUSTOMER MAP */}
                <div className="home-card active-ride-card">
                  <div className="card-top">
                    <h3>Active Ride Location</h3>
                    <span className="live-pulse">{activeRide ? '🔴 LIVE NAVIGATION' : '⚫ NO ACTIVE RIDE'}</span>
                  </div>
                  <div className="card-body">
                    {activeRide ? (
                      <div className="active-ride-details">
                        <div className="passenger-row">
                          <div>
                            <strong>{activeRide.passenger}</strong>
                            <span className="otp-pill">OTP: {activeRide.otp}</span>
                          </div>
                          <span className="eta-badge">{activeRide.eta}</span>
                        </div>
                        
                        {/* LIVE GOOGLE MAPS PREVIEW CONTAINER */}
                        <div className="google-map-mini-box">
                          <iframe
                            title="Google Maps Pickup Location"
                            width="100%"
                            height="160"
                            style={{ border: 0, borderRadius: '14px', marginBottom: '0.5rem' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeRide ? activeRide.pickup + ', Pune' : 'MG Road, Pune')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                          <div className="map-overlay-text">
                            <div>📍 Pickup: <strong>{activeRide.pickup}</strong></div>
                            <div>🏁 Drop: <strong>{activeRide.drop}</strong></div>
                          </div>
                        </div>

                        <div className="active-actions">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide ? activeRide.pickup + ', Pune' : 'MG Road, Pune')}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-navigate gmaps-btn"
                          >
                            🗺️ Google Maps App
                          </a>
                          <button className="btn-finish" onClick={handleCompleteActiveRide}>
                            ✅ Complete Ride
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="no-active-ride">
                        <p>No active ride in progress.</p>
                        <button className="btn-test-popup" onClick={() => setShowRidePopup(true)}>
                          ⚡ Simulate New Ride Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* INCENTIVES & WEEKLY BONUS SECTION */}
              <div className="incentive-banner-card">
                <div className="inc-content">
                  <div className="inc-icon">🎁</div>
                  <div className="inc-text">
                    <h4>Weekly Bonus Goal</h4>
                    <p>Complete 8 more rides to earn <strong>₹1,000 Extra Bonus!</strong></p>
                  </div>
                </div>
                <div className="inc-progress-side">
                  <div className="inc-val">12 / 20 Rides</div>
                  <div className="progress-bar-wrap inc-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              {/* TODAY'S SCHEDULE & RECENT ACTIVITY */}
              <div className="two-col-row">
                <div className="section-block">
                  <h3>📅 Today's Schedule</h3>
                  <div className="schedule-list">
                    <div className="schedule-item done">
                      <div className="time">10:00 AM</div>
                      <div className="info">Airport Ride (MG Road → Airport)</div>
                      <div className="status-check">✅</div>
                    </div>
                    <div className="schedule-item pending">
                      <div className="time">12:30 PM</div>
                      <div className="info">City Ride (Kothrud → Station)</div>
                      <div className="status-check">🚗</div>
                    </div>
                  </div>
                </div>

                <div className="section-block">
                  <h3>⚡ Recent Activity</h3>
                  <div className="activity-list">
                    <div className="act-item">
                      <span className="act-icon green">🚖</span>
                      <div>
                        <strong>Trip Completed</strong>
                        <small>Airport Dropoff • ₹420</small>
                      </div>
                      <span className="act-time">11:45 AM</span>
                    </div>
                    <div className="act-item">
                      <span className="act-icon blue">💳</span>
                      <div>
                        <strong>Payment Received</strong>
                        <small>UPI Transfer • ₹1,850</small>
                      </div>
                      <span className="act-time">09:00 AM</span>
                    </div>
                    <div className="act-item">
                      <span className="act-icon purple">🎉</span>
                      <div>
                        <strong>New Bonus Added</strong>
                        <small>Peak Hour Target • ₹500</small>
                      </div>
                      <span className="act-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: TRIPS ==================== */}
          {activeTab === 'trips' && (
            <div className="tab-pane trips-pane">
              <div className="pane-header">
                <h2>🚖 Ride History & Trips</h2>
                <p>View all current, completed, and cancelled cab trips</p>
              </div>

              {/* TRIP SUB TABS */}
              <div className="trips-subtabs">
                <button className={`subtab ${tripFilter === 'current' ? 'active' : ''}`} onClick={() => setTripFilter('current')}>
                  Current Ride
                </button>
                <button className={`subtab ${tripFilter === 'completed' ? 'active' : ''}`} onClick={() => setTripFilter('completed')}>
                  Completed ({tripsData.filter(t => t.status === 'completed').length})
                </button>
                <button className={`subtab ${tripFilter === 'cancelled' ? 'active' : ''}`} onClick={() => setTripFilter('cancelled')}>
                  Cancelled ({tripsData.filter(t => t.status === 'cancelled').length})
                </button>
              </div>

              {/* TRIPS LIST */}
              <div className="trips-list">
                {tripFilter === 'current' && (
                  activeRide ? (
                    <div className="trip-card active">
                      <div className="tc-header">
                        <span className="tc-title">{activeRide.pickup} → {activeRide.drop}</span>
                        <span className="tc-fare">₹{activeRide.fare}</span>
                      </div>
                      <div className="tc-body">
                        <div>Passenger: <strong>{activeRide.passenger}</strong></div>
                        <div>Status: <span className="tag green">IN PROGRESS</span></div>
                        <div>ETA: {activeRide.eta}</div>
                      </div>
                      <div className="tc-footer">
                        <button className="btn-tc-action" onClick={() => setShowNavigationModal(true)}>🗺️ Navigate Map</button>
                        <button className="btn-tc-action primary" onClick={handleCompleteActiveRide}>✅ Complete Ride</button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-trips">No active ride right now. Select Completed or Cancelled tabs above.</div>
                  )
                )}

                {(tripFilter === 'completed' || tripFilter === 'cancelled') && (
                  tripsData.filter(t => t.status === tripFilter).map(trip => (
                    <div key={trip.id} className="trip-card">
                      <div className="tc-header">
                        <div>
                          <span className="tc-id">{trip.id}</span>
                          <h4 className="tc-title">{trip.type}</h4>
                        </div>
                        <div className="tc-fare">₹{trip.fare}</div>
                      </div>
                      <div className="tc-body">
                        <div className="tc-route">
                          <span>📍 {trip.pickup}</span>
                          <span className="arr">➔</span>
                          <span>🏁 {trip.drop}</span>
                        </div>
                        <div className="tc-meta">
                          <span>🕒 {trip.time} ({trip.date})</span>
                          <span>📏 {trip.distance}</span>
                          <span className={`tag ${trip.status}`}>{trip.status.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="tc-footer">
                        <button className="btn-tc-details" onClick={() => setSelectedTripDetails(trip)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: EARNINGS ==================== */}
          {activeTab === 'earnings' && (
            <div className="tab-pane earnings-pane">
              <div className="pane-header">
                <h2>💰 Driver Earnings</h2>
                <p>Track your daily, weekly, and monthly payouts</p>
              </div>

              {/* TOP HERO TOTAL EARNINGS */}
              <div className="total-earnings-banner">
                <div className="te-left">
                  <span>Total Accumulated Earnings</span>
                  <h1>₹{totalEarnings}</h1>
                </div>
                <button className="btn-withdraw-hero" onClick={() => setShowWithdrawModal(true)}>
                  💸 Withdraw Funds
                </button>
              </div>

              {/* 4 TIMEFRAME CARDS */}
              <div className="timeframe-cards-grid">
                <div className="tf-card active">
                  <span className="tf-label">Today</span>
                  <h3 className="tf-val">₹{todayEarnings}</h3>
                  <small className="tf-sub">{completedTripsCount} Trips</small>
                </div>
                <div className="tf-card">
                  <span className="tf-label">Yesterday</span>
                  <h3 className="tf-val">₹0</h3>
                  <small className="tf-sub">0 Trips</small>
                </div>
                <div className="tf-card">
                  <span className="tf-label">This Week</span>
                  <h3 className="tf-val">₹{totalEarnings}</h3>
                  <small className="tf-sub">{completedTripsCount} Trips</small>
                </div>
                <div className="tf-card">
                  <span className="tf-label">This Month</span>
                  <h3 className="tf-val">₹{totalEarnings}</h3>
                  <small className="tf-sub">{completedTripsCount} Trips</small>
                </div>
              </div>

              {/* INCOME CHART VISUALIZATION */}
              <div className="income-chart-card">
                <h3>📊 Income Chart (Weekly Breakdown)</h3>
                <div className="chart-bars-list">
                  <div className="chart-bar-row">
                    <span className="day-name">Mon</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '40%' }}></div>
                    </div>
                    <span className="bar-val">₹1,200</span>
                  </div>

                  <div className="chart-bar-row">
                    <span className="day-name">Tue</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '65%' }}></div>
                    </div>
                    <span className="bar-val">₹2,100</span>
                  </div>

                  <div className="chart-bar-row">
                    <span className="day-name">Wed</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '90%' }}></div>
                    </div>
                    <span className="bar-val">₹3,400</span>
                  </div>

                  <div className="chart-bar-row">
                    <span className="day-name">Thu</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '55%' }}></div>
                    </div>
                    <span className="bar-val">₹1,850</span>
                  </div>

                  <div className="chart-bar-row">
                    <span className="day-name">Fri</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '78%' }}></div>
                    </div>
                    <span className="bar-val">₹2,870</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: MESSAGES & NOTIFICATIONS ==================== */}
          {activeTab === 'messages' && (
            <div className="tab-pane messages-pane">
              <div className="pane-header">
                <h2>💬 Messages & Alerts</h2>
                <p>In-app notifications and passenger communications</p>
              </div>

              <div className="msg-toggle-bar">
                <button className={`msg-toggle-btn ${messagesTab === 'notifications' ? 'active' : ''}`} onClick={() => setMessagesTab('notifications')}>
                  🔔 Notifications (5)
                </button>
                <button className={`msg-toggle-btn ${messagesTab === 'chat' ? 'active' : ''}`} onClick={() => setMessagesTab('chat')}>
                  💬 Passenger Chat
                </button>
              </div>

              {messagesTab === 'notifications' ? (
                <div className="notifications-list">
                  {notificationsList.map(n => (
                    <div key={n.id} className={`noti-card ${n.type}`}>
                      <div className="noti-header">
                        <h4>{n.title}</h4>
                        <span className="noti-time">{n.time}</span>
                      </div>
                      <p>{n.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chat-box-container">
                  <div className="chat-header">
                    <div className="chat-user">
                      <span>👤</span>
                      <div>
                        <strong>Rahul Sharma (Passenger)</strong>
                        <small>Trip TR-9041 • Active Route</small>
                      </div>
                    </div>
                    <a href="tel:+919876543210" className="call-passenger-btn">📞 Call</a>
                  </div>

                  <div className="chat-messages-scroll">
                    {chatMessages.map(m => (
                      <div key={m.id} className={`chat-bubble ${m.sender}`}>
                        <div className="bubble-text">{m.text}</div>
                        <div className="bubble-time">{m.time}</div>
                      </div>
                    ))}
                  </div>

                  <form className="chat-input-bar" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message to passenger..."
                    />
                    <button type="submit" className="chat-send-btn">Send ➔</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: PROFILE ==================== */}
          {activeTab === 'profile' && (
            <div className="tab-pane profile-pane">
              
              {/* LARGE DRIVER PROFILE HEADER WITH PHOTO UPLOAD */}
              <div className="profile-hero-card">
                <div className="profile-avatar-large clickable-avatar" onClick={triggerFileInput} title="Click to upload profile photo">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="avatar-img-lg" />
                  ) : (
                    <span>👨‍✈️</span>
                  )}
                  <div className="avatar-upload-overlay">
                    <span>📷</span>
                    <small>Change Photo</small>
                  </div>
                </div>
                <h2 className="profile-name">{driverName}</h2>
                <button className="btn-upload-photo-pill" onClick={triggerFileInput}>
                  📷 Upload / Change Profile Photo
                </button>
                <div className="profile-tags">
                  <span className="tag-rating">⭐ 4.9 Rating</span>
                  <span className="tag-trips">🚖 1,250 Trips Completed</span>
                  <span className="tag-vehicle">Sedan • MH 12 AB 1234</span>
                </div>
              </div>

              {/* PROFILE OPTIONS LIST */}
              <div className="profile-options-list">
                
                <div className="po-item" onClick={() => setProfileModalView('personal')}>
                  <div className="po-left">
                    <span className="po-icon">👤</span>
                    <div>
                      <strong>Personal Info</strong>
                      <small>Name, Phone Number, Emergency Contacts</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item" onClick={() => setProfileModalView('vehicle')}>
                  <div className="po-left">
                    <span className="po-icon">🚗</span>
                    <div>
                      <strong>Vehicle Details</strong>
                      <small>Maruti Dzire • White Sedan • Commercial</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item" onClick={() => setProfileModalView('license')}>
                  <div className="po-left">
                    <span className="po-icon">🪪</span>
                    <div>
                      <strong>Driving License</strong>
                      <small>MH12 20230001234 • Verified ✅</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item" onClick={() => setProfileModalView('docs')}>
                  <div className="po-left">
                    <span className="po-icon">📁</span>
                    <div>
                      <strong>Documents & Badges</strong>
                      <small>RC, Insurance, Fitness, PUC, Permit</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item" onClick={() => setProfileModalView('settings')}>
                  <div className="po-left">
                    <span className="po-icon">⚙️</span>
                    <div>
                      <strong>App Settings</strong>
                      <small>Sound Alerts, Auto Accept, Navigation Preferences</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item" onClick={() => setProfileModalView('support')}>
                  <div className="po-left">
                    <span className="po-icon">🎧</span>
                    <div>
                      <strong>Driver Support & Helpline</strong>
                      <small>24x7 Emergency Helpline, SOS, FAQ</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

                <div className="po-item logout" onClick={() => navigate('/')}>
                  <div className="po-left">
                    <span className="po-icon">🚪</span>
                    <div>
                      <strong>Logout</strong>
                      <small>Sign out of Cab Driver Account</small>
                    </div>
                  </div>
                  <span className="po-arrow">➔</span>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* ==================== WALLET MODAL ==================== */}
        {showWalletModal && (
          <div className="cab-modal-overlay">
            <div className="cab-modal-card">
              <div className="modal-header">
                <h3>💰 My Driver Wallet</h3>
                <button className="close-btn" onClick={() => setShowWalletModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="wallet-balance-box">
                  <span>Wallet Balance</span>
                  <h2>₹{walletBalance}</h2>
                  <button className="btn-withdraw-action" onClick={() => { setShowWalletModal(false); setShowWithdrawModal(true); }} disabled={walletBalance === 0}>
                    {walletBalance === 0 ? 'No Funds to Withdraw' : 'Withdraw to Bank'}
                  </button>
                </div>

                <h4>Transaction History</h4>
                <div className="wallet-tx-list">
                  {walletTxList.length > 0 ? (
                    walletTxList.map(tx => (
                      <div key={tx.id} className={`tx-item ${tx.type}`}>
                        <div>
                          <strong>{tx.title}</strong>
                          <small>{tx.time}</small>
                        </div>
                        <span className="tx-amt">{tx.amount}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                      No transactions yet. Complete rides to earn wallet funds!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== WITHDRAW MODAL ==================== */}
        {showWithdrawModal && (
          <div className="cab-modal-overlay">
            <div className="cab-modal-card">
              <div className="modal-header">
                <h3>💸 Instant Bank Withdrawal</h3>
                <button className="close-btn" onClick={() => setShowWithdrawModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <p>Available Balance: <strong>₹3,240</strong></p>
                <div className="input-group-modal">
                  <label>Enter Amount to Transfer (₹)</label>
                  <input type="number" defaultValue="3240" min="100" max="3240" className="modal-input" />
                </div>
                <div className="input-group-modal">
                  <label>Destination Account</label>
                  <select className="modal-input">
                    <option>State Bank of India (A/C: **** 4892)</option>
                    <option>Google Pay / PhonePe UPI (krishna@upi)</option>
                  </select>
                </div>
                <button className="btn-confirm-payout" onClick={() => {
                  setShowWithdrawModal(false);
                  triggerToast('🎉 ₹3,240 Payout Initiated! Reaches bank in 5 minutes.');
                }}>
                  Confirm Instant Payout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== NAVIGATION SIMULATION MODAL ==================== */}
        {showNavigationModal && (
          <div className="cab-modal-overlay">
            <div className="cab-modal-card nav-modal">
              <div className="modal-header">
                <h3>🗺️ Customer Pickup Location & Navigation</h3>
                <button className="close-btn" onClick={() => setShowNavigationModal(false)}>✕</button>
              </div>
              <div className="modal-body text-center">
                
                {/* LIVE GOOGLE MAPS EMBEDDED DISPLAY */}
                <div className="gmaps-modal-container">
                  <div className="map-hdr-banner">
                    <span>🔴 GOOGLE MAPS LIVE NAVIGATION</span>
                    <span>ETA: 2 MINS</span>
                  </div>

                  <iframe
                    title="Google Maps Live Navigation Modal"
                    width="100%"
                    height="260"
                    style={{ border: 0, borderRadius: '16px', marginBottom: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(activeRide ? activeRide.pickup + ', Pune' : 'MG Road, Pune')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide ? activeRide.pickup + ', Pune' : 'MG Road, Pune')}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gmaps-full-nav"
                  >
                    🗺️ Open Turn-by-Turn in Google Maps App ➔
                  </a>
                </div>

                {/* TURN BY TURN NAV BANNER */}
                <div className="nav-info-banner">
                  <div className="nav-step">⬅️ Turn Left in 150m towards MG Road Gate 2</div>
                  <div className="nav-meta">Customer Rahul Sharma is waiting at Gate 2</div>
                </div>

                {/* PASSENGER QUICK CONTACT BAR */}
                {activeRide && (
                  <div className="nav-customer-bar">
                    <div className="nc-info">
                      <strong>Rahul Sharma</strong>
                      <span className="otp-pill">Ask OTP: {activeRide.otp}</span>
                    </div>
                    <div className="nc-actions">
                      <a href="tel:+919876543210" className="btn-nc-call">📞 Call</a>
                      <button className="btn-nc-chat" onClick={() => { setShowNavigationModal(false); setActiveTab('messages'); setMessagesTab('chat'); }}>💬 Chat</button>
                    </div>
                  </div>
                )}

                <div className="nav-modal-footer-btns">
                  <button className="btn-complete-ride-nav" onClick={() => { setShowNavigationModal(false); handleCompleteActiveRide(); }}>
                    ✅ Arrived & Complete Ride (₹420)
                  </button>
                  <button className="btn-close-nav" onClick={() => setShowNavigationModal(false)}>
                    Return to Dashboard
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==================== TRIP DETAILS MODAL ==================== */}
        {selectedTripDetails && (
          <div className="cab-modal-overlay">
            <div className="cab-modal-card">
              <div className="modal-header">
                <h3>📜 Trip Details ({selectedTripDetails.id})</h3>
                <button className="close-btn" onClick={() => setSelectedTripDetails(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="td-fare-box">
                  <span>Total Fare Collected</span>
                  <h2>₹{selectedTripDetails.fare}</h2>
                </div>
                <div className="td-info-list">
                  <div>Passenger: <strong>{selectedTripDetails.passenger}</strong></div>
                  <div>Pickup: <strong>{selectedTripDetails.pickup}</strong></div>
                  <div>Drop: <strong>{selectedTripDetails.drop}</strong></div>
                  <div>Distance: <strong>{selectedTripDetails.distance}</strong></div>
                  <div>Duration: <strong>{selectedTripDetails.duration}</strong></div>
                  <div>Payment Method: <strong>Online UPI</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PROFILE MODAL VIEWS ==================== */}
        {profileModalView && (
          <div className="cab-modal-overlay">
            <div className="cab-modal-card">
              <div className="modal-header">
                <h3>
                  {profileModalView === 'personal' && '👤 Personal Information'}
                  {profileModalView === 'vehicle' && '🚗 Vehicle Details'}
                  {profileModalView === 'license' && '🪪 Driving License'}
                  {profileModalView === 'docs' && '📁 Documents & Badges'}
                  {profileModalView === 'settings' && '⚙️ App Settings'}
                  {profileModalView === 'support' && '🎧 24x7 Driver Support'}
                </h3>
                <button className="close-btn" onClick={() => setProfileModalView(null)}>✕</button>
              </div>
              <div className="modal-body">
                {profileModalView === 'personal' && (
                  <div className="profile-detail-box">
                    <p><strong>Full Name:</strong> {driverName}</p>
                    <p><strong>Phone Number:</strong> +91 9876543210</p>
                    <p><strong>Emergency Contact:</strong> +91 9011223344</p>
                    <p><strong>Registered City:</strong> Pune, Maharashtra</p>
                  </div>
                )}
                {profileModalView === 'vehicle' && (
                  <div className="profile-detail-box">
                    <p><strong>Vehicle Model:</strong> Maruti Suzuki Dzire (Tour S)</p>
                    <p><strong>Vehicle Number:</strong> MH 12 AB 1234</p>
                    <p><strong>Fuel Type:</strong> CNG + Petrol</p>
                    <p><strong>Air Conditioning:</strong> Yes (AC Sedan)</p>
                  </div>
                )}
                {profileModalView === 'license' && (
                  <div className="profile-detail-box">
                    <p><strong>DL Number:</strong> MH12 20230001234</p>
                    <p><strong>Badge Type:</strong> Commercial Transport</p>
                    <p><strong>Expiry Date:</strong> 14 Nov 2031</p>
                    <p><strong>Verification Status:</strong> <span className="tag green">VERIFIED ✅</span></p>
                  </div>
                )}
                {profileModalView === 'docs' && (
                  <div className="profile-detail-box">
                    <p>📄 <strong>Registration Certificate (RC):</strong> Verified ✅</p>
                    <p>📄 <strong>Commercial Insurance:</strong> Valid till Dec 2026</p>
                    <p>📄 <strong>PUC Certificate:</strong> Valid till Oct 2026</p>
                    <p>📄 <strong>State Tourist Permit:</strong> Active</p>
                  </div>
                )}
                {profileModalView === 'settings' && (
                  <div className="profile-detail-box">
                    <p>🔔 <strong>Sound Alerts:</strong> Loud</p>
                    <p>⚡ <strong>Auto Accept Rides:</strong> Disabled</p>
                    <p>🗺️ <strong>Map Provider:</strong> Google Maps</p>
                    <p>🌐 <strong>App Language:</strong> English (IN)</p>
                  </div>
                )}
                {profileModalView === 'support' && (
                  <div className="profile-detail-box">
                    <p>📞 <strong>24x7 Driver Helpline:</strong> 1800-123-9000</p>
                    <p>🚨 <strong>Emergency Police SOS:</strong> 112</p>
                    <p>💬 <strong>WhatsApp Support:</strong> +91 98765 00000</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BOTTOM NAVIGATION (5 TABS ONLY) ==================== */}
        <nav className="cab-bottom-nav">
          <button className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>

          <button className={`nav-tab ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')}>
            <span className="nav-icon">🚖</span>
            <span className="nav-label">Trips</span>
          </button>

          <button className={`nav-tab ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
            <span className="nav-icon">💰</span>
            <span className="nav-label">Earnings</span>
          </button>

          <button className={`nav-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <span className="nav-icon">💬</span>
            <span className="nav-label">Messages</span>
          </button>

          <button className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </nav>

      </div>
      {/* HIDDEN FILE INPUT FOR PHOTO UPLOAD */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

    </div>
  );
}
