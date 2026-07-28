import { useState } from 'react'
import './App.css'

const translations = {
  en: {
    greeting: "Hi,",
    idPrefix: "ID -",
    role: "Driver",
    tier: "Bronze",
    searchPlaceholder: "Search Jobs",
  },
  mr: {
    greeting: "नमस्कार,",
    idPrefix: "आयडी -",
    role: "चालक",
    tier: "कांस्य",
    searchPlaceholder: "नोकरी शोधा",
  }
};

function Dashboard() {
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  return (
    <div className="mobile-container">
      <header className="dashboard-header">
        <button className="language-toggle" onClick={toggleLanguage}>
          {language === 'en' ? 'मराठी' : 'English'}
        </button>
        <div className="header-content">
          <div className="user-info">
            <h1>{t.greeting}<br/>Aayan Sharma</h1>
            <p className="user-id">{t.idPrefix} TM120425DRI00233</p>
            
            <div className="badges">
              <span className="role-badge">{t.role}</span>
              <span className="tier-badge">
                <span className="tier-text">{t.tier}</span>
                <span className="tier-icon">🎖️</span>
              </span>
            </div>
          </div>
          
          <div className="profile-section">
            <div className="avatar-container">
              <img src="https://ui-avatars.com/api/?name=Aayan+Sharma&background=random&size=150" alt="Aayan Sharma" className="avatar" />
              <div className="completion-badge">100%</div>
            </div>
            <div className="rating">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <span className="search-text">{t.searchPlaceholder}</span>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>
      
      <main className="dashboard-content">
        {/* Further content can go here */}
      </main>
    </div>
  )
}

export default Dashboard
