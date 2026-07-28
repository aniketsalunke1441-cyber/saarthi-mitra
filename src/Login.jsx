import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const i18n = {
    en: {
        welcome: "Welcome Back",
        signin_subtitle: "Sign in to continue your journey",
        phone_label: "Phone Number",
        phone_placeholder: "Enter your phone number",
        send_otp: "Send OTP",
        otp_sent: "OTP sent to",
        change: "Change",
        enter_otp: "Enter 6-digit OTP",
        resend_in: "Resend OTP in",
        resend_otp: "Resend OTP",
        verify_otp: "Verify OTP",
        select_role: "Select Your Role",
        select_role_sub: "How would you like to log in today?",
        truck_driver: "Truck Driver",
        cab_driver: "Cab Driver",
        passenger: "Passenger",
        no_account: "Don't have an account?",
        sign_up: "Sign up"
    },
    mr: {
        welcome: "स्वागत आहे",
        signin_subtitle: "तुमचा प्रवास सुरू ठेवण्यासाठी साइन इन करा",
        phone_label: "फोन नंबर",
        phone_placeholder: "तुमचा फोन नंबर प्रविष्ट करा",
        send_otp: "OTP पाठवा",
        otp_sent: "OTP येथे पाठवला:",
        change: "बदला",
        enter_otp: "६-अंकी OTP प्रविष्ट करा",
        resend_in: "पुन्हा OTP पाठवा",
        resend_otp: "पुन्हा OTP पाठवा",
        verify_otp: "OTP पडताळणी करा",
        select_role: "तुमची भूमिका निवडा",
        select_role_sub: "आज तुम्हाला कसे लॉग log in करायला आवडेल?",
        truck_driver: "ट्रक चालक",
        cab_driver: "कॅब चालक",
        passenger: "प्रवासी",
        no_account: "खाते नाही?",
        sign_up: "साइन अप करा"
    }
};

export default function Login() {
    const navigate = useNavigate();
    const [lang, setLang] = useState('en');
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    
    const t = i18n[lang];

    // Resend Timer Effect
    useEffect(() => {
        let interval;
        if (step === 2 && resendTimer > 0 && !canResend) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer, canResend]);

    const maskPhone = (p) => {
        const digits = p.replace(/\D/g, '');
        if (digits.length >= 4) return '******' + digits.slice(-4);
        return p;
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        setError('');
        if (!phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        if (!/^[\d\s\-+()]{10,}$/.test(phone)) {
            setError('Please enter a valid phone number');
            return;
        }
        
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setResendTimer(30);
            setCanResend(false);
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        }, 1500);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }
        
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleRoleSelection = (role) => {
        console.log("Logged in as:", role);
        navigate('/dashboard');
    };

    return (
        <div className="login-page-wrapper">
            <div className="container">
                {/* Left Side - Branding */}
                <div className="branding-section">
                    <div className="branding-content">
                        <div className="logo">
                            <img src="/images/logo-removebg-preview.png" alt="SarthiMitra Logo" className="logo-image" />
                            <span className="logo-text">SarthiMitra</span>
                        </div>

                        <div className="driver-photo-container">
                            <div className="photo-decorations">
                                <div className="blob-shape"></div>
                                <div className="curved-line curved-line-1"></div>
                                <div className="curved-line curved-line-2"></div>
                                <div className="dotted-pattern"></div>
                            </div>
                            <img src="/images/driver-photo.png" alt="SarthiMitra Driver" className="driver-photo" />
                        </div>

                        <h1 className="branding-title">गाडी तुमची,<br/>सुरक्षा आमची</h1>
                    </div>
                    <div className="branding-decoration">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-section">
                    <div className="lang-toggle-wrapper">
                        <button className="lang-toggle-btn" onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            <span>{lang === 'en' ? 'मराठी' : 'English'}</span>
                        </button>
                    </div>

                    <div className="login-card">
                        <div className="login-header">
                            <h2>{t.welcome}</h2>
                            <p>{t.signin_subtitle}</p>
                        </div>

                        {step === 1 && (
                            <form className="login-form" onSubmit={handleSendOTP}>
                                <div className="input-group">
                                    <label htmlFor="phone">{t.phone_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <input type="tel" id="phone" name="phone" placeholder={t.phone_placeholder} value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                    {error && <div className="error-message" style={{color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem'}}>{error}</div>}
                                </div>
                                <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                                    <span>{t.send_otp}</span>
                                    {!loading && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form className="login-form otp-step" onSubmit={handleVerifyOTP}>
                                <div className="otp-phone-display">
                                    <p><span>{t.otp_sent}</span> <strong>{maskPhone(phone)}</strong></p>
                                    <button type="button" className="change-phone-btn" onClick={() => setStep(1)}>{t.change}</button>
                                </div>

                                <div className="input-group">
                                    <label>{t.enter_otp}</label>
                                    <div className="otp-inputs">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={otpRefs[index]}
                                                type="text"
                                                maxLength="1"
                                                className={`otp-box ${digit ? 'filled' : ''}`}
                                                value={digit}
                                                onChange={e => handleOtpChange(index, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(index, e)}
                                                inputMode="numeric"
                                            />
                                        ))}
                                    </div>
                                    {error && <div className="error-message" style={{color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem', textAlign: 'center'}}>{error}</div>}
                                </div>

                                <div className="resend-otp">
                                    {!canResend ? (
                                        <span><span>{t.resend_in}</span> <strong>{resendTimer}</strong>s</span>
                                    ) : (
                                        <button type="button" className="resend-btn" onClick={() => {
                                            setResendTimer(30);
                                            setCanResend(false);
                                            setOtp(['', '', '', '', '', '']);
                                        }}>{t.resend_otp}</button>
                                    )}
                                </div>

                                <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                                    <span>{t.verify_otp}</span>
                                    {!loading && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="role-step">
                                <div className="role-header">
                                    <h3>{t.select_role}</h3>
                                    <p>{t.select_role_sub}</p>
                                </div>
                                <div className="role-options">
                                    <button className="role-card" onClick={() => handleRoleSelection('Truck Driver')}>
                                        <div className="role-icon truck-icon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 17V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H14V17H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 6H19L22 9V17H14V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <span className="role-name">{t.truck_driver}</span>
                                    </button>
                                    
                                    <button className="role-card" onClick={() => handleRoleSelection('Cab Driver')}>
                                        <div className="role-icon cab-icon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 17L21 11L18 8H6L3 11L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M5 17H19V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H16C15.4696 22 14.9609 21.7893 14.5858 21.4142C14.2107 21.0391 14 20.5304 14 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 17H5V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H8C8.53043 22 9.03914 21.7893 9.41421 21.4142C9.78929 21.0391 10 20.5304 10 20V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="7.5" cy="14.5" r="0.5" fill="currentColor"/>
                                                <circle cx="16.5" cy="14.5" r="0.5" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span className="role-name">{t.cab_driver}</span>
                                    </button>

                                    <button className="role-card" onClick={() => handleRoleSelection('Passenger')}>
                                        <div className="role-icon passenger-icon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C14.4214 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <span className="role-name">{t.passenger}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="signup-link">
                            <p><span>{t.no_account}</span> <a href="#" onClick={(e) => { e.preventDefault(); }}>{t.sign_up}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
