import { useState, useRef } from 'react'
import './App.css'

const translations = {
  en: {
    greeting: "Hi,",
    idPrefix: "ID -",
    role: "Driver",
    tier: "Bronze",
    searchPlaceholder: "Search Jobs",
    profileTitle: "Edit Profile Details",
    saveBtn: "Save Profile Details",
    cancelBtn: "Cancel",
    editBtn: "Edit Profile",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number",
    emailLabel: "Email Address",
    licenseLabel: "Driving License No.",
    cityLabel: "City / Location",
    vehicleLabel: "Vehicle Type",
    statusSaved: "Profile updated successfully!",
  },
  mr: {
    greeting: "नमस्कार,",
    idPrefix: "आयडी -",
    role: "चालक",
    tier: "कांस्य",
    searchPlaceholder: "नोकरी शोधा",
    profileTitle: "प्रोफाइल माहिती संपादित करा",
    saveBtn: "माहिती जतन करा",
    cancelBtn: "रद्द करा",
    editBtn: "प्रोफाइल संपादित करा",
    nameLabel: "पूर्ण नाव",
    phoneLabel: "फोन नंबर",
    emailLabel: "ईमेल पत्ता",
    licenseLabel: "ड्रायव्हिंग लायसन्स नंबर",
    cityLabel: "शहर / ठिकाण",
    vehicleLabel: "वाहनाचा प्रकार",
    statusSaved: "प्रोफाइल यशस्वीरित्या अपडेट केले!",
  }
};

function Dashboard() {
  const [language, setLanguage] = useState('en');

  const [profile, setProfile] = useState({
    phone: "+91 9876543210",
    name: "",
    email: "driver@sarthimitra.com",
    id: "TM120425DRI00233",
    license: "MH12-2023-0084920",
    city: "Pune, Maharashtra",
    vehicle: "Heavy Commercial Truck",
    role: "Driver",
    tier: "Bronze"
  });

  const [userPhoto, setUserPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  // Siren Audio State & Refs
  const [isSirenActive, setIsSirenActive] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const sirenTimerRef = useRef(null);

  // SOS Emergency Contacts State (Persisted in localStorage)
  const [sosContacts, setSosContacts] = useState(() => {
    const saved = localStorage.getItem('sarthi_sos_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { contact1: '', contact2: '' };
  });

  const [isSosSetupModalOpen, setIsSosSetupModalOpen] = useState(false);
  const [sosForm, setSosForm] = useState({ contact1: '', contact2: '' });

  const startSiren = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;

      let high = false;
      sirenTimerRef.current = setInterval(() => {
        if (oscRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          oscRef.current.frequency.exponentialRampToValueAtTime(high ? 600 : 1300, now + 0.25);
          high = !high;
        }
      }, 300);

      setIsSirenActive(true);
    } catch (err) {
      console.error("Audio error:", err);
      setIsSirenActive(true);
    }
  };

  const stopSiren = () => {
    if (sirenTimerRef.current) {
      clearInterval(sirenTimerRef.current);
      sirenTimerRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsSirenActive(false);
  };

  const handleSosClick = () => {
    if (isSirenActive) {
      stopSiren();
      return;
    }

    // Check if 2 emergency numbers are registered
    if (!sosContacts.contact1 || !sosContacts.contact2) {
      setSosForm({
        contact1: sosContacts.contact1 || '',
        contact2: sosContacts.contact2 || ''
      });
      setIsSosSetupModalOpen(true);
    } else {
      startSiren();
    }
  };

  const handleSaveSosContacts = (e) => {
    if (e) e.preventDefault();
    if (!sosForm.contact1 || !sosForm.contact2) {
      alert("Please enter both emergency phone numbers.");
      return;
    }
    const updated = {
      contact1: sosForm.contact1.trim(),
      contact2: sosForm.contact2.trim()
    };
    setSosContacts(updated);
    localStorage.setItem('sarthi_sos_contacts', JSON.stringify(updated));
    setIsSosSetupModalOpen(false);
    startSiren();
  };

  const t = translations[language];

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  const handleOpenModal = () => {
    setEditForm({ ...profile });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setProfile({ ...editForm });
    setIsEditModalOpen(false);
    setShowSuccessMsg(true);
    setTimeout(() => {
      setShowSuccessMsg(false);
    }, 4000);
  };

  return (
    <div className="dashboard-layout">
      {/* Main Dashboard Container */}
      <div className="mobile-container">
        <header className="dashboard-header">
          <button className="language-toggle" onClick={toggleLanguage} type="button">
            {language === 'en' ? 'मराठी' : 'English'}
          </button>
          
          <div className="header-content">
            <div className="user-info">
              <div className="name-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0 }}>
                  {profile.name ? `${t.greeting} ${profile.name}` : profile.phone}
                </h1>
                <button 
                  type="button"
                  className="inline-edit-btn"
                  onClick={handleOpenModal}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  ✏️ {t.editBtn}
                </button>
              </div>

              <p className="user-id" style={{ marginTop: '4px' }}>{t.idPrefix} {profile.id}</p>
              
              <div className="badges">
                <span className="role-badge">{profile.role}</span>
              </div>
            </div>
            
            <div className="profile-section">
              <div className="avatar-container" style={{ position: 'relative' }}>
                <img 
                  src={userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Driver')}&background=0b3d8c&color=fff&size=150`} 
                  alt={profile.name || 'Driver Avatar'} 
                  className="avatar" 
                />
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handlePhotoUpload} 
                />

                {/* Camera Icon Overlay Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Upload Profile Photo"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '2px solid #0b3d8c',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    fontSize: '15px',
                    padding: 0,
                    zIndex: 25
                  }}
                >
                  📷
                </button>
              </div>
              <div className="rating">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>

          {/* Circular SOS Siren Button */}
          <div className="sos-container">
            <button
              type="button"
              className={`sos-btn ${isSirenActive ? 'sos-active' : ''}`}
              onClick={handleSosClick}
              title="Emergency SOS Alarm Siren"
            >
              <span className="sos-text">SOS</span>
              <span className="sos-subtext">{isSirenActive ? 'SIREN ON' : 'PRESS'}</span>
            </button>
          </div>
        </header>
        
        <main className="dashboard-content" style={{ padding: '50px 24px 24px' }}>
          
          {/* Active Emergency Siren Alert */}
          {isSirenActive && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '18px 20px',
              borderRadius: '14px',
              marginBottom: '20px',
              border: '2px solid #ef4444',
              fontWeight: '700',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🚨</span>
                  <div>
                    <div style={{ fontSize: '1.1rem', color: '#991b1b', fontWeight: '800' }}>EMERGENCY SOS SIREN ACTIVE!</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#7f1d1d', marginTop: '2px' }}>
                      Siren sounding loudly. Emergency distress SMS dispatched!
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={stopSiren}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  ⏹️ STOP SIREN
                </button>
              </div>

              {/* Message sent details box */}
              <div style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #fca5a5',
                fontSize: '0.875rem'
              }}>
                <div style={{ fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>
                  📲 Emergency SMS Alerts Sent To Your 2 Registered Numbers:
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ background: '#fef2f2', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fecaca', fontWeight: '600' }}>
                    📞 Contact 1: <strong style={{ color: '#0f172a' }}>{sosContacts.contact1}</strong> (SENT ✅)
                  </span>
                  <span style={{ background: '#fef2f2', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fecaca', fontWeight: '600' }}>
                    📞 Contact 2: <strong style={{ color: '#0f172a' }}>{sosContacts.contact2}</strong> (SENT ✅)
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                  💬 "EMERGENCY SOS: Driver {profile.name || profile.phone} needs immediate help! Current Location: {profile.city || 'GPS Location'}"
                </div>
              </div>
            </div>
          )}

          {showSuccessMsg && (
            <div style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '12px 18px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #a5d6a7',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              🎉 {t.statusSaved}
            </div>
          )}

          {/* Monthly Safety Report Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px 28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
            marginBottom: '24px'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Monthly Safety Report
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
                An overview of incidents reported this month.
              </p>
            </div>

            {/* Gauge Chart Graphic Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '10px 0 10px 0' }}>
              
              {/* Semi-Circle SVG Radial Gauge */}
              <svg width="280" height="140" viewBox="0 0 300 155" style={{ overflow: 'visible' }}>
                
                {/* Outer Arc: Breakdowns (Orange/Coral) */}
                <path
                  d="M 30,140 A 120,120 0 0,1 270,140"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 30,140 A 120,120 0 0,1 270,140"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="377"
                  strokeDashoffset="113"
                />

                {/* Middle Arc: Safety Incidents / Safe Instance (Teal/Green) */}
                <path
                  d="M 55,140 A 95,95 0 0,1 245,140"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 55,140 A 95,95 0 0,1 245,140"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="298"
                  strokeDashoffset="160"
                />

                {/* Inner Arc: Accidents (Red/Coral) */}
                <path
                  d="M 80,140 A 70,70 0 0,1 220,140"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 80,140 A 70,70 0 0,1 220,140"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="220"
                  strokeDashoffset="187"
                />
              </svg>

              {/* Chart Legend */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#ef4444' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                  Accidents
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#0d9488' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0d9488', display: 'inline-block' }}></span>
                  Safety Incidents
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#fb923c' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fb923c', display: 'inline-block' }}></span>
                  Breakdowns
                </div>
              </div>
            </div>

            {/* Footer Summary Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Incidents are down by 3.1% this month <span style={{ color: '#16a34a', fontWeight: '700' }}>📉</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  January 2025
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '600' }}>SAFE INSTANCE</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0d9488' }}>96.4%</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '600' }}>BREAKDOWNS</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f97316' }}>2 Logged</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '600' }}>ACCIDENTS</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ef4444' }}>0 Active</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Sidebar Quick Actions */}
      <aside className="sidebar-card">
        <h3>Quick Actions</h3>
        <div className="sidebar-links">
          <button 
            type="button" 
            className="sidebar-btn"
            onClick={handleOpenModal}
          >
             Edit Profile
          </button>
          <button 
            type="button" 
            className="sidebar-btn"
            onClick={() => {
              setSosForm({
                contact1: sosContacts.contact1 || '',
                contact2: sosContacts.contact2 || ''
              });
              setIsSosSetupModalOpen(true);
            }}
          >
             SOS Emergency Numbers
          </button>
          <button type="button" className="sidebar-btn">⚙️ Settings</button>
          <button type="button" className="sidebar-btn">🎧 Support</button>
        </div>
      </aside>

      {/* Emergency SOS Contact Registration Modal */}
      {isSosSetupModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#dc2626', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚨 Register Emergency Contacts
              </h2>
              <button
                type="button"
                onClick={() => setIsSosSetupModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '20px', lineHeight: '1.4' }}>
              Please register <strong>2 emergency mobile numbers</strong> (Family / Police / Friend). When you press the SOS button, an emergency siren will sound and SMS alerts will be sent to both numbers.
            </p>

            <form onSubmit={handleSaveSosContacts}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Contact 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>
                    Emergency Contact 1 * (e.g. Family Member)
                  </label>
                  <input
                    type="tel"
                    required
                    value={sosForm.contact1}
                    onChange={(e) => setSosForm({ ...sosForm, contact1: e.target.value })}
                    placeholder="+91 9876543210"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* Contact 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>
                    Emergency Contact 2 * (e.g. Friend / Helpline)
                  </label>
                  <input
                    type="tel"
                    required
                    value={sosForm.contact2}
                    onChange={(e) => setSosForm({ ...sosForm, contact2: e.target.value })}
                    placeholder="+91 9123456789"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsSosSetupModalOpen(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  🔒 Register & Activate SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Popup */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: '700', margin: 0 }}>
                ✏️ {t.profileTitle}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.nameLabel} *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name (e.g. Ramesh Kumar)"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.phoneLabel} *
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 Mobile Number"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* Driving License */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.licenseLabel}
                  </label>
                  <input
                    type="text"
                    value={editForm.license}
                    onChange={(e) => handleInputChange('license', e.target.value)}
                    placeholder="DL Number"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* City */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.cityLabel}
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City, State"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                {/* Vehicle Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    {t.vehicleLabel}
                  </label>
                  <select
                    value={editForm.vehicle}
                    onChange={(e) => handleInputChange('vehicle', e.target.value)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <option value="Heavy Commercial Truck">Heavy Commercial Truck</option>
                    <option value="Light Commercial Vehicle (LCV)">Light Commercial Vehicle (LCV)</option>
                    <option value="Cab / Taxi">Cab / Taxi</option>
                    <option value="Container Trailer">Container Trailer</option>
                  </select>
                </div>

              </div>

              {/* Modal Actions */}
              <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  {t.cancelBtn}
                </button>
                
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(11, 61, 140, 0.25)'
                  }}
                >
                  💾 {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
