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
        cab: "Cab",
        cab_driver: "Cab Driver",
        passenger: "Passenger",
        mechanics: "Mechanics",
        select_cab_role: "Select Cab Role",
        select_cab_role_sub: "Are you logging in as a Cab Driver or Passenger?",
        back_to_roles: "Back to Roles",
        driver_info_title: "Personal Driver Information",
        driver_info_sub: "Please fill in your details to complete your driver profile",
        full_name_label: "Full Name",
        full_name_placeholder: "Enter your full name",
        license_label: "Driving License Number",
        license_placeholder: "e.g. MH12 20230001234",
        vehicle_label: "Truck / Vehicle Number",
        vehicle_placeholder: "e.g. MH 12 AB 1234",
        emergency_phone_label: "Emergency Contact Number",
        emergency_phone_placeholder: "Enter 10-digit emergency phone number",
        city_label: "City / Base Location",
        city_placeholder: "e.g. Pune / Highway Route",
        passenger_info_title: "Personal Passenger Information",
        passenger_info_sub: "Please fill in your emergency contact details for your safety",
        emergency_contact1_label: "Primary Emergency Contact Number (1)",
        emergency_contact1_placeholder: "Enter 10-digit primary emergency contact",
        emergency_contact2_label: "Secondary Emergency Contact Number (2)",
        emergency_contact2_placeholder: "Enter 10-digit secondary emergency contact",
        mechanic_info_title: "Mechanic & Service Information",
        mechanic_info_sub: "Register your workshop details to receive local breakdown requests",
        mechanic_name_label: "Mechanic / Owner Full Name",
        mechanic_name_placeholder: "Enter mechanic or shop owner name",
        shop_name_label: "Garage / Shop Name",
        shop_name_placeholder: "e.g. Highway Auto Repair & Towing",
        mechanic_phone_label: "Shop Emergency Phone Number",
        mechanic_phone_placeholder: "Enter 10-digit shop phone number",
        service_location_label: "Service Area / Highway Location",
        service_location_placeholder: "e.g. Pune-Mumbai Expressway, Katraj Bypass",
        save_and_continue: "Save & Continue",
        back_to_role_select: "Back to Role Selection",
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
        select_role_sub: "आज तुम्हाला कसे लॉग इन करायला आवडेल?",
        truck_driver: "ट्रक चालक",
        cab: "कॅब",
        cab_driver: "कॅब चालक",
        passenger: "प्रवासी",
        mechanics: "मेकॅनिक",
        select_cab_role: "कॅब भूमिका निवडा",
        select_cab_role_sub: "तुम्ही कॅब चालक किंवा प्रवासी म्हणून लॉग इन करत आहात?",
        back_to_roles: "भूमिका निवडीकडे परत",
        driver_info_title: "वैयक्तिक चालक माहिती",
        driver_info_sub: "तुमचे ड्रायव्हर प्रोफाइल पूर्ण करण्यासाठी कृपया तुमचे तपशील भरा",
        full_name_label: "पूर्ण नाव",
        full_name_placeholder: "तुमचे पूर्ण नाव टाका",
        license_label: "ड्रायव्हिंग लायसन्स नंबर",
        license_placeholder: "उदा. MH12 20230001234",
        vehicle_label: "ट्रक / वाहन क्रमांक",
        vehicle_placeholder: "उदा. MH 12 AB 1234",
        emergency_phone_label: "आपत्कालीन संपर्क क्रमांक",
        emergency_phone_placeholder: "१० अंकी आपत्कालीन नंबर टाका",
        city_label: "शहर / मूळ ठिकाण",
        city_placeholder: "उदा. पुणे / हायवे रूट",
        passenger_info_title: "वैयक्तिक प्रवासी माहिती",
        passenger_info_sub: "तुमच्या सुरक्षेसाठी कृपया तुमचे आपत्कालीन संपर्क तपशील भरा",
        emergency_contact1_label: "प्राथमिक आपत्कालीन संपर्क क्रमांक (१)",
        emergency_contact1_placeholder: "१० अंकी प्राथमिक आपत्कालीन नंबर टाका",
        emergency_contact2_label: "दुय्यम आपत्कालीन संपर्क क्रमांक (२)",
        emergency_contact2_placeholder: "१० अंकी दुय्यम आपत्कालीन नंबर टाका",
        mechanic_info_title: "मेकॅनिक आणि सेवा माहिती",
        mechanic_info_sub: "स्थानिक ब्रेकडाऊन विनंत्या प्राप्त करण्यासाठी तुमची कार्यशाळा नोंदवा",
        mechanic_name_label: "मेकॅनिक / मालकाचे पूर्ण नाव",
        mechanic_name_placeholder: "मेकॅनिक किंवा दुकानाच्या मालकाचे नाव टाका",
        shop_name_label: "गॅरेज / दुकानाचे नाव",
        shop_name_placeholder: "उदा. हायवे ऑटो रिपेअर आणि टोइंग",
        mechanic_phone_label: "दुकानातील आपत्कालीन फोन नंबर",
        mechanic_phone_placeholder: "१० अंकी फोन नंबर टाका",
        service_location_label: "सेवा क्षेत्र / हायवे परिसर",
        service_location_placeholder: "उदा. पुणे-मुंबई एक्सप्रेसवे, कात्रज बायपास",
        save_and_continue: "जतन करा आणि पुढे जा",
        back_to_role_select: "भूमिका निवडीकडे परत",
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
    const [showCabOptions, setShowCabOptions] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [driverInfo, setDriverInfo] = useState({
        fullName: '',
        licenseNumber: '',
        vehicleNumber: '',
        emergencyContact: '',
        city: ''
    });
    const [passengerInfo, setPassengerInfo] = useState({
        fullName: '',
        gender: 'male',
        emergencyContact1: '',
        emergencyContact2: ''
    });
    const [mechanicInfo, setMechanicInfo] = useState({
        fullName: '',
        shopName: '',
        emergencyContact: '',
        serviceLocation: ''
    });
    
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
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setError('');
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
        console.log("Selected role:", role);
        setSelectedRole(role);
        setError('');
        if (role === 'Truck Driver' || role === 'Cab Driver') {
            setStep(4);
        } else if (role === 'Passenger') {
            setStep(5);
        } else if (role === 'Mechanics') {
            setStep(6);
        } else {
            alert(`Successfully logged in as ${role}!`);
        }
    };

    const handleDriverInfoSubmit = (e) => {
        e.preventDefault();
        if (!driverInfo.fullName.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!driverInfo.licenseNumber.trim()) {
            setError('Please enter your driving license number');
            return;
        }
        if (!driverInfo.vehicleNumber.trim()) {
            setError('Please enter your vehicle / truck number');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            try {
                localStorage.setItem('driverProfile', JSON.stringify({
                    fullName: driverInfo.fullName,
                    licenseNumber: driverInfo.licenseNumber,
                    vehicleNumber: driverInfo.vehicleNumber,
                    emergencyContact: driverInfo.emergencyContact,
                    role: selectedRole || 'Truck Driver',
                    phone: phone || '+91 9876543210'
                }));
            } catch (err) {}
            if (selectedRole === 'Cab Driver') {
                navigate('/cab-driver-dashboard');
            } else {
                navigate('/dashboard');
            }
        }, 1000);
    };

    const handlePassengerInfoSubmit = (e) => {
        e.preventDefault();
        if (!passengerInfo.fullName.trim()) {
            setError('Please enter your full name');
            return;
        }
        const p1 = passengerInfo.emergencyContact1.replace(/\D/g, '');
        if (p1.length < 10) {
            setError('Please enter a valid 10-digit primary emergency contact number');
            return;
        }
        if (passengerInfo.gender === 'female') {
            const p2 = passengerInfo.emergencyContact2.replace(/\D/g, '');
            if (p2.length < 10) {
                setError('For Women Safety Protection, please enter a valid 2nd emergency contact number');
                return;
            }
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            try {
                localStorage.setItem('passengerProfile', JSON.stringify({
                    fullName: passengerInfo.fullName,
                    gender: passengerInfo.gender,
                    emergencyContact1: passengerInfo.emergencyContact1,
                    emergencyContact2: passengerInfo.gender === 'female' ? passengerInfo.emergencyContact2 : '',
                    role: 'Passenger'
                }));
            } catch (err) {}
            navigate('/passenger-dashboard');
        }, 1000);
    };

    const handleMechanicInfoSubmit = (e) => {
        e.preventDefault();
        if (!mechanicInfo.fullName.trim()) {
            setError('Please enter mechanic / shop owner full name');
            return;
        }
        if (!mechanicInfo.shopName.trim()) {
            setError('Please enter garage / shop name');
            return;
        }
        const phoneDigits = mechanicInfo.emergencyContact.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            setError('Please enter a valid 10-digit shop emergency phone number');
            return;
        }
        if (!mechanicInfo.serviceLocation.trim()) {
            setError('Please enter service location or highway area');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            try {
                localStorage.setItem('mechanicProfile', JSON.stringify({
                    fullName: mechanicInfo.fullName,
                    shopName: mechanicInfo.shopName,
                    serviceLocation: mechanicInfo.serviceLocation,
                    emergencyContact: mechanicInfo.emergencyContact,
                    specialty: mechanicInfo.specialty || 'General Auto Repair & Breakdown',
                    role: 'Mechanic'
                }));
            } catch (err) {}
            navigate('/mechanic-dashboard');
        }, 1000);
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
                                {!showCabOptions ? (
                                    <>
                                        <div className="role-header">
                                            <h3>{t.select_role}</h3>
                                            <p>{t.select_role_sub}</p>
                                        </div>

                                        <div className="role-options">
                                            {/* 1st Card: Truck Driver */}
                                            <button className="role-card" onClick={() => handleRoleSelection('Truck Driver')}>
                                                <div className="role-icon truck-icon">
                                                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px' }}>
                                                        {/* Trailer body extending back */}
                                                        <path d="M30 18L58 30V44H34V41H30V18Z" fill="currentColor" opacity="0.85" />
                                                        <path d="M30 18L58 30V44H34V41H30V18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                                                        
                                                        {/* Front Cab */}
                                                        <path d="M10 16C10 14.8954 10.8954 14 12 14H28C29.1046 14 30 14.8954 30 16V42H10V16Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                                                        
                                                        {/* Windshield */}
                                                        <path d="M13 18H27V25H13V18Z" fill="#ffffff" />
                                                        
                                                        {/* Front Grill Lines */}
                                                        <line x1="14" y1="29" x2="26" y2="29" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                                                        <line x1="14" y1="33" x2="26" y2="33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                                                        <line x1="14" y1="37" x2="26" y2="37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                                                        
                                                        {/* Bumper / Headlights */}
                                                        <rect x="11" y="39" width="4" height="2.5" rx="0.5" fill="#ffffff" />
                                                        <rect x="25" y="39" width="4" height="2.5" rx="0.5" fill="#ffffff" />
                                                        
                                                        {/* Wheels */}
                                                        <circle cx="16" cy="46" r="4" fill="currentColor" stroke="#ffffff" strokeWidth="2" />
                                                        <circle cx="27" cy="46" r="4" fill="currentColor" stroke="#ffffff" strokeWidth="2" />
                                                        <circle cx="42" cy="46" r="3.5" fill="currentColor" stroke="#ffffff" strokeWidth="2" />
                                                        <circle cx="49" cy="46" r="3.5" fill="currentColor" stroke="#ffffff" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                                <span className="role-name">{t.truck_driver}</span>
                                            </button>
                                            
                                            {/* 2nd Card: Cab (Clicking opens sub-selection) */}
                                            <button className="role-card" onClick={() => setShowCabOptions(true)}>
                                                <div className="role-icon cab-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 17L21 11L18 8H6L3 11L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M5 17H19V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H16C15.4696 22 14.9609 21.7893 14.5858 21.4142C14.2107 21.0391 14 20.5304 14 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <circle cx="7.5" cy="14.5" r="0.5" fill="currentColor"/>
                                                        <circle cx="16.5" cy="14.5" r="0.5" fill="currentColor"/>
                                                    </svg>
                                                </div>
                                                <span className="role-name">{t.cab}</span>
                                            </button>

                                            {/* 3rd Card: Mechanics */}
                                            <button className="role-card" onClick={() => handleRoleSelection('Mechanics')}>
                                                <div className="role-icon mechanic-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span className="role-name">{t.mechanics}</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* Sub-selection view when user clicks "Cab" */
                                    <>
                                        <div className="role-header">
                                            <h3>{t.select_cab_role}</h3>
                                            <p>{t.select_cab_role_sub}</p>
                                        </div>

                                        <div className="role-options" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                            {/* Cab Driver */}
                                            <button className="role-card" onClick={() => handleRoleSelection('Cab Driver')}>
                                                <div className="role-icon cab-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 17L21 11L18 8H6L3 11L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M5 17H19V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H16C15.4696 22 14.9609 21.7893 14.5858 21.4142C14.2107 21.0391 14 20.5304 14 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <circle cx="7.5" cy="14.5" r="0.5" fill="currentColor"/>
                                                        <circle cx="16.5" cy="14.5" r="0.5" fill="currentColor"/>
                                                    </svg>
                                                </div>
                                                <span className="role-name">{t.cab_driver}</span>
                                            </button>

                                            {/* Passenger */}
                                            <button className="role-card" onClick={() => handleRoleSelection('Passenger')}>
                                                <div className="role-icon passenger-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C14.4214 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span className="role-name">{t.passenger}</span>
                                            </button>
                                        </div>

                                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                            <button type="button" className="back-role-btn" onClick={() => setShowCabOptions(false)}>
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                                </svg>
                                                <span>{t.back_to_roles}</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <form className="login-form driver-info-step" onSubmit={handleDriverInfoSubmit}>
                                <div className="role-header" style={{ marginBottom: '1.25rem' }}>
                                    <h3>{t.driver_info_title}</h3>
                                    <p>{t.driver_info_sub}</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="fullName">{t.full_name_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="fullName" 
                                            placeholder={t.full_name_placeholder} 
                                            value={driverInfo.fullName} 
                                            onChange={e => setDriverInfo({ ...driverInfo, fullName: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="licenseNumber">{t.license_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="16" rx="2" />
                                            <line x1="7" y1="8" x2="17" y2="8" />
                                            <line x1="7" y1="12" x2="13" y2="12" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="licenseNumber" 
                                            placeholder={t.license_placeholder} 
                                            value={driverInfo.licenseNumber} 
                                            onChange={e => setDriverInfo({ ...driverInfo, licenseNumber: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="vehicleNumber">{t.vehicle_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="3" width="15" height="13" />
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                            <circle cx="5.5" cy="18.5" r="2.5" />
                                            <circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="vehicleNumber" 
                                            placeholder={t.vehicle_placeholder} 
                                            value={driverInfo.vehicleNumber} 
                                            onChange={e => setDriverInfo({ ...driverInfo, vehicleNumber: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="emergencyContact">{t.emergency_phone_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" />
                                        </svg>
                                        <input 
                                            type="tel" 
                                            id="emergencyContact" 
                                            placeholder={t.emergency_phone_placeholder} 
                                            value={driverInfo.emergencyContact} 
                                            onChange={e => setDriverInfo({ ...driverInfo, emergencyContact: e.target.value })} 
                                        />
                                    </div>
                                </div>



                                {error && <div className="error-message" style={{color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem'}}>{error}</div>}

                                <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                                    <span>{t.save_and_continue}</span>
                                    {!loading && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button type="button" className="back-role-btn" onClick={() => setStep(3)}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        <span>{t.back_to_role_select}</span>
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 5 && (
                            <form className="login-form passenger-info-step" onSubmit={handlePassengerInfoSubmit}>
                                <div className="role-header" style={{ marginBottom: '1.25rem' }}>
                                    <h3>{t.passenger_info_title}</h3>
                                    <p>{t.passenger_info_sub}</p>
                                </div>

                                {/* GENDER SELECTION CARDS */}
                                <div className="input-group">
                                    <label>Select Gender</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.35rem' }}>
                                        <button
                                            type="button"
                                            className={`role-card ${passengerInfo.gender === 'male' ? 'active' : ''}`}
                                            onClick={() => setPassengerInfo({ ...passengerInfo, gender: 'male' })}
                                            style={{
                                                padding: '0.85rem',
                                                borderRadius: '14px',
                                                border: passengerInfo.gender === 'male' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                                                background: passengerInfo.gender === 'male' ? '#e0e7ff' : '#ffffff',
                                                fontWeight: '800',
                                                color: passengerInfo.gender === 'male' ? '#3730a3' : '#475569',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span>Male</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`role-card ${passengerInfo.gender === 'female' ? 'active' : ''}`}
                                            onClick={() => setPassengerInfo({ ...passengerInfo, gender: 'female' })}
                                            style={{
                                                padding: '0.85rem',
                                                borderRadius: '14px',
                                                border: passengerInfo.gender === 'female' ? '2px solid #ec4899' : '1px solid #cbd5e1',
                                                background: passengerInfo.gender === 'female' ? '#fce7f3' : '#ffffff',
                                                fontWeight: '800',
                                                color: passengerInfo.gender === 'female' ? '#be185d' : '#475569',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span>Female</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="passengerFullName">{t.full_name_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="passengerFullName" 
                                            placeholder={t.full_name_placeholder} 
                                            value={passengerInfo.fullName} 
                                            onChange={e => setPassengerInfo({ ...passengerInfo, fullName: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                {/* PRIMARY EMERGENCY CONTACT */}
                                <div className="input-group">
                                    <label htmlFor="emergencyContact1">
                                        {passengerInfo.gender === 'female' ? 'Primary Emergency Contact (1)' : 'Emergency Contact Number'}
                                    </label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" />
                                        </svg>
                                        <input 
                                            type="tel" 
                                            id="emergencyContact1" 
                                            placeholder="Enter 10-digit emergency contact number" 
                                            value={passengerInfo.emergencyContact1} 
                                            onChange={e => setPassengerInfo({ ...passengerInfo, emergencyContact1: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                {/* SECONDARY EMERGENCY CONTACT ONLY FOR FEMALE */}
                                {passengerInfo.gender === 'female' && (
                                    <div className="input-group">
                                        <label htmlFor="emergencyContact2" style={{ color: '#be185d', fontWeight: '700' }}>
                                            🛡️ Secondary Emergency Contact (2) — Women Safety
                                        </label>
                                        <div className="input-wrapper" style={{ borderColor: '#f472b6' }}>
                                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" />
                                            </svg>
                                            <input 
                                                type="tel" 
                                                id="emergencyContact2" 
                                                placeholder="Enter 10-digit 2nd emergency contact" 
                                                value={passengerInfo.emergencyContact2} 
                                                onChange={e => setPassengerInfo({ ...passengerInfo, emergencyContact2: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                )}

                                {error && <div className="error-message" style={{color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem'}}>{error}</div>}

                                <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                                    <span>{t.save_and_continue}</span>
                                    {!loading && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>

                                 <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button type="button" className="back-role-btn" onClick={() => setStep(3)}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        <span>{t.back_to_role_select}</span>
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 6 && (
                            <form className="login-form mechanic-info-step" onSubmit={handleMechanicInfoSubmit}>
                                <div className="role-header" style={{ marginBottom: '1.25rem' }}>
                                    <h3>{t.mechanic_info_title}</h3>
                                    <p>{t.mechanic_info_sub}</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="mechanicFullName">{t.mechanic_name_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="mechanicFullName" 
                                            placeholder={t.mechanic_name_placeholder} 
                                            value={mechanicInfo.fullName} 
                                            onChange={e => setMechanicInfo({ ...mechanicInfo, fullName: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="shopName">{t.shop_name_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="shopName" 
                                            placeholder={t.shop_name_placeholder} 
                                            value={mechanicInfo.shopName} 
                                            onChange={e => setMechanicInfo({ ...mechanicInfo, shopName: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="mechanicPhone">{t.mechanic_phone_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" />
                                        </svg>
                                        <input 
                                            type="tel" 
                                            id="mechanicPhone" 
                                            placeholder={t.mechanic_phone_placeholder} 
                                            value={mechanicInfo.emergencyContact} 
                                            onChange={e => setMechanicInfo({ ...mechanicInfo, emergencyContact: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="serviceLocation">{t.service_location_label}</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <input 
                                            type="text" 
                                            id="serviceLocation" 
                                            placeholder={t.service_location_placeholder} 
                                            value={mechanicInfo.serviceLocation} 
                                            onChange={e => setMechanicInfo({ ...mechanicInfo, serviceLocation: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                {error && <div className="error-message" style={{color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem'}}>{error}</div>}

                                <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                                    <span>{t.save_and_continue}</span>
                                    {!loading && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button type="button" className="back-role-btn" onClick={() => setStep(3)}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        <span>{t.back_to_role_select}</span>
                                    </button>
                                </div>
                            </form>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}
