import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MechanicDashboard.css';

export default function MechanicDashboard() {
  const navigate = useNavigate();

  // Mechanic & Garage State
  const [mechanicName, setMechanicName] = useState('Aniket Salunke');
  const [shopName, setShopName] = useState('Sarthi Auto Care & Breakdown Garage');
  const [serviceLocation, setServiceLocation] = useState('Pune-Mumbai Highway, Ward 4');
  const [specialty, setSpecialty] = useState('Tyre Repair, Battery & Towing');
  const [isAvailable, setIsAvailable] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Nav & Tabs State
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'requests', 'earnings', 'inventory', 'profile'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Dynamic Financials & Job Stats (Starting at 0)
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  // Active Repair & Popups State
  const [showSosPopup, setShowSosPopup] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showShowroomModal, setShowShowroomModal] = useState(false);
  const [selectedShowroom, setSelectedShowroom] = useState(null);

  // Garage Spare Parts Inventory State
  const [inventory, setInventory] = useState([
    { id: 'tyre', name: 'Tubeless Tyre (185/65 R15)', count: 8 },
    { id: 'battery', name: '12V Exide Car Battery', count: 0 },
    { id: 'oil', name: 'Engine Oil / Coolant', count: 15 },
    { id: 'brake', name: 'Pneumatic Air Brake Valve', count: 2 }
  ]);

  // Incoming Emergency Breakdown Request
  const [incomingSOS, setIncomingSOS] = useState({
    customer: 'Rahul Sharma',
    issue: '💥 Tyre Burst / Puncture',
    vehicle: 'Swift Dzire (MH 12 AB 1234)',
    location: 'MG Road Highway Junction',
    distance: '2.1 km away',
    estimatedFare: 450,
    phone: '+91 98765 43210'
  });

  // Load Mechanic Profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mechanicProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setMechanicName(parsed.fullName);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.serviceLocation) setServiceLocation(parsed.serviceLocation);
        if (parsed.specialty) setSpecialty(parsed.specialty);
      }
      const savedPhoto = localStorage.getItem('mechanicPhoto');
      if (savedPhoto) setProfilePhoto(savedPhoto);
    } catch (e) {
      console.error("Error reading mechanic profile", e);
    }

    // Real-time listener for incoming Truck Driver Breakdown Requests
    const checkIncomingTruckBreakdown = () => {
      try {
        const savedBreakdown = localStorage.getItem('activeTruckBreakdown');
        const status = localStorage.getItem('activeTruckBreakdownStatus');
        if (savedBreakdown && status === 'pending') {
          const parsed = JSON.parse(savedBreakdown);
          setIncomingSOS({
            customer: parsed.driver || 'Vaishnav Musmade',
            issue: parsed.issue || '🛞 Rear Axle Tubeless Tyre Puncture',
            vehicle: parsed.truckNo || 'MH 12 Q 9876 (14-Wheeler Heavy Truck)',
            location: parsed.location || 'NH-48 Katraj Bypass',
            distance: '2.1 km away',
            estimatedFare: parsed.estimatedFare || 450,
            phone: '+91 98765 43210',
            photo: parsed.photo,
            partRequired: parsed.partCategory || 'Tubeless Tyre (185/65 R15)'
          });
          setShowSosPopup(true);
        }
      } catch (err) {}
    };

    checkIncomingTruckBreakdown();
    const interval = setInterval(checkIncomingTruckBreakdown, 1000);
    window.addEventListener('storage', checkIncomingTruckBreakdown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkIncomingTruckBreakdown);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result;
        setProfilePhoto(photoUrl);
        try {
          localStorage.setItem('mechanicPhoto', photoUrl);
        } catch (err) {}
        triggerToast('📸 Garage / Profile Photo Updated Successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAcceptSOS = () => {
    setShowSosPopup(false);
    setActiveJob({
      customer: incomingSOS.customer,
      issue: incomingSOS.issue,
      vehicle: incomingSOS.vehicle,
      location: incomingSOS.location,
      distance: incomingSOS.distance,
      fare: incomingSOS.estimatedFare,
      phone: incomingSOS.phone,
      status: 'En Route to Breakdown Spot'
    });
    setShowNavModal(true);
    triggerToast('✅ SOS Request Accepted! Route Navigation Loaded.');
  };

  const handleDeclineSOS = () => {
    setShowSosPopup(false);
    triggerToast('❌ SOS Request Declined.');
  };

  const handleCompleteJob = () => {
    if (!activeJob) return;
    const earned = activeJob.fare;
    setTodayEarnings(prev => prev + earned);
    setTotalRevenue(prev => prev + earned);
    setWalletBalance(prev => prev + earned);
    setCompletedJobsCount(prev => prev + 1);

    setActiveJob(null);
    setShowNavModal(false);
    triggerToast(`🎉 Repair Job Completed! ₹${earned} credited to your wallet.`);
  };

  return (
    <div className="mechanic-dashboard-wrapper">
      
      {/* TOAST MESSAGE */}
      {toastMessage && <div className="mechanic-toast">{toastMessage}</div>}

      {/* MOBILE OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>
      )}

      {/* SIDE NAVBAR */}
      <aside className={`mechanic-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        
        {/* HEADER BRAND */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/images/logo-removebg-preview.png" alt="SarthiMitra Logo" className="sidebar-logo-img" />
            {!isSidebarCollapsed && <span className="brand-title">Sarthi Mechanic</span>}
          </div>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            {isSidebarCollapsed ? '➔' : '◀'}
          </button>
        </div>

        {/* MECHANIC PROFILE MINI CARD */}
        <div className="sidebar-mechanic-card">
          <div className="sm-avatar clickable-avatar" onClick={triggerFileInput} title="Click to upload garage profile photo">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Garage" className="avatar-img-sm" />
            ) : (
              <span>🛠️</span>
            )}
            <div className="avatar-cam-badge">📷</div>
          </div>
          {!isSidebarCollapsed && (
            <div className="sm-info">
              <h4>{mechanicName}</h4>
              <div className="sm-shop">{shopName}</div>
              <div className="sm-status">⭐ 4.9 • {isAvailable ? '🟢 Online' : '⚫ Offline'}</div>
            </div>
          )}
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="sidebar-menu">
          <div className="menu-label">{!isSidebarCollapsed && 'NAVIGATION'}</div>

          <button className={`sidebar-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Dashboard</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">SOS Requests</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('earnings'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Revenue & Earnings</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => { setActiveTab('inventory'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Spare Parts & Inventory</span>}
          </button>

          <button className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}>
            <span className="sidebar-icon"></span>
            {!isSidebarCollapsed && <span className="sidebar-text">Garage Profile</span>}
          </button>
        </nav>

        {/* FOOTER */}
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

      {/* MAIN CONTENT AREA */}
      <div className="mechanic-main-container">

        {/* FLOATING SOS BREAKDOWN REQUEST POPUP */}
        {showSosPopup && (
          <div className="sos-popup-overlay">
            <div className="sos-popup-card">
              <div className="sos-popup-badge">🚨 TRUCK BREAKDOWN SOS REQUEST</div>
              
              <div className="sos-popup-header">
                <div className="customer-avatar-box">🚚</div>
                <div>
                  <h4>{incomingSOS.customer}</h4>
                  <div className="cust-vehicle">{incomingSOS.vehicle}</div>
                </div>
                <div className="sos-fare-pill">₹{incomingSOS.estimatedFare}</div>
              </div>

              {/* Uploaded Damage Photo Display */}
              {incomingSOS.photo && (
                <div style={{ textAlign: 'center', marginBottom: '1rem', background: '#0f172a', padding: '0.5rem', borderRadius: '14px', border: '1px solid #334155' }}>
                  <img src={incomingSOS.photo} alt="Uploaded Truck Damage" style={{ maxHeight: '140px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.3rem', fontWeight: '700' }}>📷 Photo Uploaded by Driver</div>
                </div>
              )}

              <div className="sos-issue-box">
                <strong>Issue Reported:</strong>
                <p>{incomingSOS.issue}</p>
                <small style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginTop: '0.25rem' }}>
                  Required Part: <strong>{incomingSOS.partRequired}</strong>
                </small>
              </div>

              {/* INVENTORY STOCK CHECK DISPLAY */}
              {(() => {
                const stockInfo = checkPartInStock(incomingSOS.partRequired);
                return (
                  <div style={{
                    background: stockInfo.inStock ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                    border: stockInfo.inStock ? '1px solid #22c55e' : '1px solid #f97316',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: stockInfo.inStock ? '#4ade80' : '#fb923c' }}>
                      {stockInfo.inStock 
                        ? `✅ Part IN STOCK in Garage: ${stockInfo.name || incomingSOS.partRequired} (${stockInfo.count} available)`
                        : `⚠️ Part OUT OF STOCK in Garage: ${stockInfo.name || incomingSOS.partRequired}`
                      }
                    </div>
                  </div>
                );
              })()}

              <div className="sos-location-box">
                📍 Breakdown Location: <strong>{incomingSOS.location}</strong> ({incomingSOS.distance})
              </div>

              <div className="sos-popup-actions" style={{ flexDirection: 'column', gap: '0.65rem' }}>
                {(() => {
                  const stockInfo = checkPartInStock(incomingSOS.partRequired);
                  return stockInfo.inStock ? (
                    <button className="btn-accept-sos" style={{ width: '100%' }} onClick={handleAcceptSOSDirect}>
                      ✅ Accept & Proceed Directly to Truck Driver
                    </button>
                  ) : (
                    <button className="btn-accept-sos" style={{ width: '100%', background: '#f97316', color: '#ffffff' }} onClick={handleOpenShowroomProcurement}>
                      🏬 Part Out of Stock! Procure from Nearby Showroom
                    </button>
                  );
                })()}

                <button className="btn-decline-sos" style={{ width: '100%' }} onClick={handleDeclineSOS}>
                  Decline SOS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOP HEADER BAR */}
        <header className="mechanic-header">
          <div className="mh-left">
            <button className="hamburger-mobile-btn" onClick={() => setIsMobileSidebarOpen(true)}>☰</button>
            <div>
              <h2>Welcome, {mechanicName}</h2>
              <p className="mh-sub">{shopName} • {serviceLocation}</p>
            </div>
          </div>

          <div className="mh-right">
            <div className={`status-toggle-pill ${isAvailable ? 'online' : 'offline'}`} onClick={() => setIsAvailable(!isAvailable)}>
              <span className="dot"></span>
              <span>{isAvailable ? 'AVAILABLE FOR SOS' : 'OFF DUTY'}</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY BASED ON TAB */}
        <main className="mechanic-body">

          {/* ==================== TAB 1: HOME ==================== */}
          {activeTab === 'home' && (
            <div className="tab-pane home-pane">
              
              {/* TOP METRICS SUMMARY */}
              <div className="mechanic-hero-metrics">
                <div className="m-metric-card">
                  <span className="m-lbl">Today's Revenue</span>
                  <h1>₹{todayEarnings}</h1>
                  <small>+ ₹0 Pending</small>
                </div>
                <div className="m-metric-card">
                  <span className="m-lbl">Completed Repairs</span>
                  <h1>{completedJobsCount} Jobs</h1>
                  <small>100% Satisfaction</small>
                </div>
                <div className="m-metric-card">
                  <span className="m-lbl">Service Rating</span>
                  <h1>4.9 ⭐</h1>
                  <small>Top Mechanic</small>
                </div>
                <div className="m-metric-card">
                  <span className="m-lbl">Specialty Services</span>
                  <strong className="specialty-txt">{specialty}</strong>
                </div>
              </div>

              {/* ACTIVE REPAIR JOB CARD */}
              <div className="active-job-card-section">
                <h3>🛠️ Active Repair Job Status</h3>
                {activeJob ? (
                  <div className="active-job-box">
                    <div className="aj-header">
                      <div>
                        <h4>{activeJob.customer} • {activeJob.issue}</h4>
                        <p>{activeJob.vehicle} • 📍 {activeJob.location}</p>
                      </div>
                      <span className="aj-badge">IN PROGRESS</span>
                    </div>

                    <div className="aj-actions">
                      <button className="btn-open-nav-map" onClick={() => setShowNavModal(true)}>
                        🗺️ Open Live Google Map
                      </button>
                      <button className="btn-finish-job" onClick={handleCompleteJob}>
                        ✅ Complete Job & Collect ₹{activeJob.fare}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-active-job">
                    <p>No active repair job in progress.</p>
                    <button className="btn-trigger-test-sos" onClick={() => setShowSosPopup(true)}>
                      ⚡ Simulate Breakdown SOS Request
                    </button>
                  </div>
                )}
              </div>

              {/* QUICK REPAIR SERVICES OFFERED */}
              <div className="services-grid-section">
                <h3>⚙️ Quick Emergency Services</h3>
                <div className="services-grid">
                  <div className="service-pill">💥 Tyre Burst & Puncture Repair</div>
                  <div className="service-pill">🔋 Battery Jumpstart & Replacement</div>
                  <div className="service-pill">🛢️ Engine Oil & Coolant Refill</div>
                  <div className="service-pill">🛻 Flatbed Towing Service</div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: REQUESTS ==================== */}
          {activeTab === 'requests' && (
            <div className="tab-pane requests-pane">
              <h2>🚨 Emergency Breakdown SOS Requests</h2>
              <p>View all live breakdown requests in your service area</p>

              <div className="requests-list">
                <div className="request-card-item">
                  <div className="rci-header">
                    <div>
                      <strong>Rahul Sharma • Swift Dzire</strong>
                      <div className="rci-issue">💥 Tyre Burst at MG Road Junction</div>
                    </div>
                    <div className="rci-fare">₹450</div>
                  </div>
                  <div className="rci-meta">
                    <span>📏 2.1 km away</span>
                    <span>🕒 5 mins ago</span>
                    <span>📞 +91 98765 43210</span>
                  </div>
                  <div className="rci-footer">
                    <button className="btn-accept-job-list" onClick={handleAcceptSOS}>Accept Job</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: EARNINGS ==================== */}
          {activeTab === 'earnings' && (
            <div className="tab-pane earnings-pane">
              <h2>💰 Revenue & Payouts</h2>
              <div className="revenue-banner">
                <div>
                  <span>Total Accumulated Revenue</span>
                  <h1>₹{totalRevenue}</h1>
                </div>
                <button className="btn-withdraw-rev" onClick={() => setShowWalletModal(true)}>
                  💸 Withdraw Funds
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: INVENTORY ==================== */}
          {activeTab === 'inventory' && (
            <div className="tab-pane inventory-pane">
              <h2>📦 Spare Parts & Inventory</h2>
              <p>Manage in-stock tyres, tubes, batteries, and lubricants</p>

              <div className="inventory-grid">
                <div className="inv-card">
                  <strong>🛞 Tubeless Tyres (185/65 R15)</strong>
                  <p>In Stock: 8 units</p>
                </div>
                <div className="inv-card">
                  <strong>🔋 12V Exide Car Batteries</strong>
                  <p>In Stock: 4 units</p>
                </div>
                <div className="inv-card">
                  <strong>🛢️ Castrol 20W-40 Engine Oil</strong>
                  <p>In Stock: 15 Litres</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: PROFILE ==================== */}
          {activeTab === 'profile' && (
            <div className="tab-pane profile-pane">
              <div className="profile-hero-card">
                <div className="profile-avatar-large clickable-avatar" onClick={triggerFileInput} title="Click to upload profile photo">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Garage" className="avatar-img-lg" />
                  ) : (
                    <span>🛠️</span>
                  )}
                  <div className="avatar-upload-overlay">
                    <span>📷</span>
                    <small>Change Photo</small>
                  </div>
                </div>
                <h2>{mechanicName}</h2>
                <button className="btn-upload-photo-pill" onClick={triggerFileInput}>
                  📷 Upload / Change Garage Photo
                </button>
                <p>{shopName}</p>
                <div className="profile-tags">
                  <span>⭐ 4.9 Rating</span>
                  <span>🔧 {specialty}</span>
                  <span>📍 {serviceLocation}</span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* HIDDEN FILE INPUT */}
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />

      {/* EMERGENCY SOS REQUEST POPUP MODAL */}
      {showSosPopup && (
        <div className="mechanic-modal-overlay">
          <div className="sos-popup-card">
            <div className="sos-badge">🚨 EMERGENCY SOS BREAKDOWN REQUEST</div>
            <h3 className="sos-title">{incomingSOS.issue}</h3>
            
            <div className="sos-details">
              <div className="sos-detail-row">
                <span className="label">Customer:</span>
                <span className="value"><strong>{incomingSOS.customer}</strong></span>
              </div>
              <div className="sos-detail-row">
                <span className="label">Vehicle:</span>
                <span className="value">{incomingSOS.vehicle}</span>
              </div>
              <div className="sos-detail-row">
                <span className="label">Location:</span>
                <span className="value">📍 {incomingSOS.location} ({incomingSOS.distance})</span>
              </div>
              <div className="sos-detail-row">
                <span className="label">Estimated Earnings:</span>
                <span className="value fare-badge">₹{incomingSOS.estimatedFare}</span>
              </div>
            </div>

            {incomingSOS.photo && (
              <div style={{ margin: '0.85rem 0', textAlign: 'center' }}>
                <img src={incomingSOS.photo} alt="Breakdown Damage" style={{ maxHeight: '140px', borderRadius: '12px', objectFit: 'cover' }} />
              </div>
            )}

            <div className="sos-actions">
              <button className="btn-accept-sos" onClick={handleAcceptSOS}>
                ✅ Accept Repair Job (₹{incomingSOS.estimatedFare})
              </button>
              <button className="btn-decline-sos" onClick={handleDeclineSOS}>
                ❌ Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE GOOGLE MAP MODAL */}
      {showNavModal && (
        <div className="mechanic-modal-overlay">
          <div className="mechanic-modal-card">
            <div className="modal-header">
              <h3>🗺️ Customer Breakdown Location Map</h3>
              <button className="close-btn" onClick={() => setShowNavModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <iframe
                title="Mechanic Google Maps Location"
                width="100%"
                height="260"
                style={{ border: 0, borderRadius: '16px', marginBottom: '1rem' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent((activeJob ? activeJob.location : 'MG Road Junction') + ', Pune')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>

              <div className="nav-customer-bar">
                <div>
                  <strong>{activeJob ? activeJob.customer : 'Rahul Sharma'}</strong>
                  <p>{activeJob ? activeJob.issue : 'Tyre Burst'}</p>
                </div>
                <a href={`tel:${activeJob ? activeJob.phone : '+919876543210'}`} className="btn-call-cust">
                  📞 Call Customer
                </a>
              </div>

              <button className="btn-finish-job-modal" onClick={handleCompleteJob}>
                ✅ Complete Repair & Collect ₹{activeJob ? activeJob.fare : 450}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALLET MODAL */}
      {showWalletModal && (
        <div className="mechanic-modal-overlay">
          <div className="mechanic-modal-card">
            <div className="modal-header">
              <h3>💰 Garage Wallet & Payouts</h3>
              <button className="close-btn" onClick={() => setShowWalletModal(false)}>✕</button>
            </div>
            <div className="modal-body text-center">
              <div className="wallet-balance-box">
                <span>Available Balance</span>
                <h2>₹{walletBalance}</h2>
              </div>
              <button className="btn-confirm-payout" onClick={() => { setShowWalletModal(false); triggerToast('🎉 Withdrawal Request Sent to Bank!'); }} disabled={walletBalance === 0}>
                {walletBalance === 0 ? 'No Funds Available' : 'Withdraw to Bank Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
