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
                <span className="tier-badge">
                  <span className="tier-text">{profile.tier}</span>
                  <span className="tier-icon">🎖️</span>
                </span>
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

          <div className="logo-container">
            <div className="logo-wrapper">
              <img src="/images/logo-removebg-preview.png" alt="Sarthi Logo" className="logo-img" />
            </div>
          </div>
        </header>
        
        <main className="dashboard-content" style={{ padding: '50px 24px 24px' }}>
          
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
            ✏️ Edit Profile
          </button>
          <button type="button" className="sidebar-btn">⚙️ Settings</button>
          <button type="button" className="sidebar-btn">🎧 Support</button>
        </div>
      </aside>

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
