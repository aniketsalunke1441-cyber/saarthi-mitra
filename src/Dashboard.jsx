import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const i18n = {
  en: {
    brand_subtitle: "Highway Assistance & Driver Safety Network",
    on_duty: "On Duty / Live Tracking",
    welcome: "Welcome,",
    role_driver: "Truck Driver",
    sos_title: "EMERGENCY HIGHWAY SOS",
    sos_desc: "Tap in case of accident, breakdown, medical emergency, or security alert.",
    press_sos: "SOS",
    press_sub: "PRESS NOW",
    sos_contacts_set: "Emergency Contacts Active",
    setup_sos: "Configure SOS Numbers",

    // Stats
    stat_safety: "Safety Score",
    // 4 Helping Options
    help_breakdown_title: "Breakdown Help",
    help_breakdown_sub: "24/7 Mobile Towing & Engine Service",
    help_tyre_title: "Tyre Repair",
    help_tyre_sub: "Mobile Puncture & Air Pressure",
    help_mechanic_title: "Mechanic Locator",
    help_mechanic_sub: "Find Nearby Verified Mechanics",
    help_voice_title: "AI Voice Helper",
    help_voice_sub: "Tap to Speak Voice Commands",

    // Route
    live_route: "Active Transit Route",
    route_details: "NH 48 Highway Corridor",
    distance_remaining: "45 km remaining to destination",
    fuel_level: "Fuel / Battery",
    engine_temp: "Engine Temp",
    tyre_pressure: "Tyre Pressure",
    rest_break: "Next Rest Break",

    // Actions
    quick_hub: "Essential Services & Quick Actions",
    mechanic_service: "Find Highway Mechanic",
    mechanic_sub: "Mobile vans, tyre repair & towing",
    fuel_service: "Pumps & Charging",
    fuel_sub: "24/7 Diesel pumps & EV chargers",
    parking_service: "Truck Rest Stops",
    parking_sub: "CCTV parking, dhabas & lodging",
    medical_service: "Emergency Hospital",
    medical_sub: "Trauma centers & ambulance support",
    doc_service: "E-Way Bills & Docs",
    doc_sub: "Digital trip permits & RC check",
    contact_service: "SOS Contact Setup",
    contact_sub: "Update family & fleet emergency phone",

    // Sidebar
    helpline_title: "24/7 Emergency Helplines",
    police: "Highway Police Dispatch",
    ambulance: "National Highway Ambulance",
    crane: "SaarthiMitra Towing Crane",
    toll: "NHAI Highway Toll Helpline",

    // Modals
    sos_modal_title: "EMERGENCY DIRECT MESSAGE DISPATCHED TO MECHANICS!",
    sos_alerting: "Transmitting live GPS location & breakdown message directly to 3 nearby highway mechanics...",
    sos_success_badge: "💬 Emergency Direct Message Sent to 3 Mechanics Instantly!",
    gps_location_label: "Live Breakdown GPS Location:",
    message_payload_label: "Dispatched Emergency Message:",
    notified_mechanics_label: "Local Mechanics Notified (In-App Dispatch):",
    resend_in_app: "Re-send Alert",
    call_now: "Call Mechanic",
    siren_on: "Stop Emergency Siren Audio",
    siren_off: "Play Emergency Siren Audio",
    close: "Close Emergency Alert",
    mechanic_modal_title: "Nearby Verified Highway Mechanics",
    edit_profile: "Edit Driver Profile",
    save: "Save Changes",
    logout: "Log Out"
  },
  mr: {
    brand_subtitle: "महामार्ग सहाय्य आणि ड्रायव्हर सुरक्षा नेटवर्क",
    on_duty: "ड्युटीवर / थेट ट्रॅकिंग चालू",
    welcome: "स्वागत आहे,",
    role_driver: "ट्रक चालक",
    sos_title: "आपत्कालीन हायवे SOS",
    sos_desc: "अपघात, ब्रेकडाऊन, वैद्यकीय आणीबाणी किंवा सुरक्षेसाठी दाबा.",
    press_sos: "SOS",
    press_sub: "आत्ता दाबा",
    sos_contacts_set: "आपत्कालीन संपर्क सक्रिय",
    setup_sos: "SOS नंबर जोडा",

    // 4 Helping Options
    help_breakdown_title: "ब्रेकडाऊन मदत",
    help_breakdown_sub: "२४/७ टोइंग आणि इंजिन दुरुस्ती",
    help_tyre_title: "टायर रिपेअर",
    help_tyre_sub: "मोबाइल पंक्चर आणि हवा दाब सेवा",
    help_mechanic_title: "मेकॅनिक लोकेटर",
    help_mechanic_sub: "जवळचे सत्यापित मेकॅनिक्स शोधा",
    help_voice_title: "AI व्हॉइस असिस्टंट",
    help_voice_sub: "हायवे व्हॉइस कमांड वापरा",

    // Route
    live_route: "सक्रिय प्रवास मार्ग",
    route_details: "NH 48 हायवे कॉरिडॉर",
    distance_remaining: "गंतव्यस्थानापर्यंत ४५ किमी बाकी",
    fuel_level: "इंधन / बॅटरी",
    engine_temp: "इंजिन तापमान",
    tyre_pressure: "टायरचा दाब",
    rest_break: "पुढील विश्रांती",

    // Actions
    quick_hub: "महत्त्वाच्या सेवा आणि जलद कृती",
    mechanic_service: "हायवे मेकॅनिक शोधा",
    mechanic_sub: "मोबाइल व्हॅन, टायर रिपेअर आणि टोइंग",
    fuel_service: "पंप आणि चार्जिंग",
    fuel_sub: "२४/७ डिझेल पंप आणि EV चार्जर",
    parking_service: "ट्रक विश्रांतीगृह",
    parking_sub: "CCTV पार्किंग, ढाबा आणि राहण्याची सोय",
    medical_service: "आपत्कालीन रुग्णालय",
    medical_sub: "ट्रॉमा सेंटर आणि रुग्णवाहिका",
    doc_service: "ई-वे बिल आणि कागदपत्रे",
    doc_sub: "डिजिटल ट्रिप परवाने आणि आरसी तपासणी",
    contact_service: "SOS संपर्क सेटअप",
    contact_sub: "कुटुंब आणि ताफा आपत्कालीन नंबर अपडेट करा",

    // Sidebar
    helpline_title: "२४/७ आपत्कालीन हेल्पलाइन",
    police: "हायवे पोलिस टीम",
    ambulance: "राष्ट्रीय महामार्ग रुग्णवाहिका",
    crane: "सारथीमित्र टोइंग क्रेन",
    toll: "NHAI टोल हेल्पलाइन",

    // Modals
    sos_modal_title: "मेकॅनिक्सना आपत्कालीन थेट संदेश पाठवला!",
    sos_alerting: "जवळच्या ३ हायवे मेकॅनिक्सना ॲपमध्ये आपत्कालीन मेसेज पाठवत आहे...",
    sos_success_badge: "💬 ३ स्थानिक मेकॅनिक्सना आपत्कालीन थेट संदेश पाठवला आहे!",
    gps_location_label: "थेट ब्रेकडाऊन GPS स्थान:",
    message_payload_label: "पाठवलेला आपत्कालीन मेसेज:",
    notified_mechanics_label: "स्थानिक मेकॅनिक्स प्राप्तकर्ता (ॲप अलर्ट):",
    resend_in_app: "पुन्हा मेसेज पाठवा",
    call_now: "मेकॅनिकला कॉल करा",
    siren_on: "सायरेन आवाज बंद करा",
    siren_off: "सायरेन आवाज सुरू करा",
    close: "आपत्कालीन अलर्ट बंद करा",
    mechanic_modal_title: "जवळचे सत्यापित हायवे मेकॅनिक्स",
    edit_profile: "प्रोफाइल संपादित करा",
    save: "जतन करा",
    logout: "लॉग आऊट"
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');

  // Driver Profile from localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('driverProfile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        return {
          fullName: p.fullName || "Krishna Gadhe",
          vehicleNumber: p.vehicleNumber || "MH 12 AB 1234",
          licenseNumber: p.licenseNumber || "MH12 20230001234",
          emergencyContact: p.emergencyContact || "9876543210",
          role: p.role || "Truck Driver"
        };
      } catch (e) { }
    }
    return {
      fullName: "Krishna Gadhe",
      vehicleNumber: "MH 12 AB 1234",
      licenseNumber: "MH12 20230001234",
      emergencyContact: "9876543210",
      role: "Truck Driver"
    };
  });

  // SOS Contacts from localStorage
  const [sosContacts, setSosContacts] = useState(() => {
    const saved = localStorage.getItem('sarthi_sos_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return { contact1: '9876543210', contact2: '9123456789' };
  });

  // Modals state
  const [isSosActive, setIsSosActive] = useState(false);
  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isTyreModalOpen, setIsTyreModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSosSetupOpen, setIsSosSetupOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState('');

  // Breakdown Help Form State
  const [breakdownPhoto, setBreakdownPhoto] = useState(null);
  const [breakdownDesc, setBreakdownDesc] = useState('');
  const [breakdownResult, setBreakdownResult] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Voice Translator State
  const [voiceInputText, setVoiceInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef(null);

  const wordDicts = {
    hi: { name: 'Hindi', flag: '\u{1F1EE}\u{1F1F3}', words: {
      'hello':'नमस्ते','hi':'नमस्ते','hey':'अरे','good':'अच्छा','morning':'सुबह','night':'रात','evening':'शाम',
      'help':'मदद','need':'चाहिए','want':'चाहिए','please':'कृपया','yes':'हां','no':'नहीं','ok':'ठीक है',
      'i':'मैं','my':'मेरा','me':'मुझे','we':'हम','you':'आप','your':'आपका','is':'है','are':'हैं',
      'the':'','a':'एक','an':'एक','this':'यह','that':'वह','it':'यह','was':'था','not':'नहीं',
      'where':'कहाँ','what':'क्या','how':'कैसे','when':'कब','who':'कौन','which':'कौन सा',
      'truck':'ट्रक','vehicle':'वाहन','car':'गाड़ी','bus':'बस','bike':'बाइक',
      'engine':'इंजन','tyre':'टायर','tire':'टायर','brake':'ब्रेक','oil':'तेल','fuel':'ईंधन',
      'petrol':'पेट्रोल','diesel':'डीज़ल','gas':'गैस','water':'पानी','battery':'बैटरी',
      'breakdown':'ब्रेकडाउन','broke':'खराब','broken':'टूटा','down':'बंद','stop':'रुको','stopped':'रुक गया',
      'puncture':'पंक्चर','flat':'फ्लैट','burst':'फट गया','leak':'लीक','smoke':'धुआँ','noise':'आवाज़',
      'repair':'मरम्मत','fix':'ठीक करो','change':'बदलो','replace':'बदलो','check':'जांच',
      'mechanic':'मैकेनिक','garage':'गैरेज','shop':'दुकान','service':'सर्विस','station':'स्टेशन',
      'nearest':'नजदीकी','near':'पास','nearby':'आसपास','close':'पास','far':'दूर','find':'ढूंढो',
      'road':'सड़क','highway':'हाईवे','bridge':'पुल','toll':'टोल','turn':'मोड़',
      'left':'बाएं','right':'दाएं','straight':'सीधा','back':'पीछे','front':'आगे',
      'hospital':'अस्पताल','police':'पुलिस','ambulance':'एम्बुलेंस','fire':'आग','accident':'दुर्घटना','emergency':'आपातकाल',
      'call':'फ़ोन करो','phone':'फ़ोन','send':'भेजो','come':'आओ','go':'जाओ','fast':'जल्दी',
      'food':'खाना','eat':'खाओ','drink':'पीओ','rest':'आराम','sleep':'नींद','tired':'थका हुआ',
      'hot':'गरम','cold':'ठंडा','big':'बड़ा','small':'छोटा','new':'नया','old':'पुराना',
      'money':'पैसा','pay':'भुगतान','cost':'कीमत','price':'दाम','expensive':'महंगा','cheap':'सस्ता',
      'thank':'धन्यवाद','thanks':'धन्यवाद','sorry':'माफ़ करो','wait':'रुको','hurry':'जल्दी करो',
      'overheating':'गरम हो रहा','working':'काम कर रहा','towing':'टोइंग','problem':'समस्या','issue':'समस्या',
      'can':'सकते','cannot':'नहीं कर सकते','will':'करेंगे','have':'है','has':'है','had':'था',
      'very':'बहुत','much':'बहुत','many':'बहुत','some':'कुछ','all':'सभी','one':'एक','two':'दो',
      'here':'यहाँ','there':'वहाँ','now':'अब','today':'आज','tomorrow':'कल','time':'समय',
      'open':'खुला','closed':'बंद','start':'शुरू','running':'चल रहा','moving':'चल रहा',
      'dangerous':'खतरनाक','safe':'सुरक्षित','careful':'सावधान','slow':'धीरे','speed':'गति',
      'driver':'ड्राइवर','passenger':'यात्री','load':'माल','heavy':'भारी','light':'हल्का',
      'dhaba':'ढाबा','parking':'पार्किंग','hotel':'होटल'
    }},
    mr: { name: 'Marathi', flag: '\u{1F1EE}\u{1F1F3}', words: {
      'hello':'नमस्कार','hi':'नमस्कार','hey':'अरे','good':'चांगले','morning':'सकाळ','night':'रात्र',
      'help':'मदत','need':'हवे','want':'पाहिजे','please':'कृपया','yes':'हो','no':'नाही','ok':'ठीक आहे',
      'i':'मी','my':'माझा','me':'मला','we':'आम्ही','you':'तुम्ही','your':'तुमचा','is':'आहे','are':'आहेत',
      'the':'','a':'एक','this':'हे','that':'ते','it':'हे','was':'होता','not':'नाही',
      'where':'कुठे','what':'काय','how':'कसे','when':'केव्हा','who':'कोण',
      'truck':'ट्रक','vehicle':'वाहन','car':'गाडी','engine':'इंजिन','tyre':'टायर','tire':'टायर',
      'brake':'ब्रेक','oil':'तेल','fuel':'इंधन','water':'पाणी','battery':'बॅटरी',
      'breakdown':'बंद पडले','broke':'बिघडले','broken':'तुटलेले','stop':'थांबा','stopped':'थांबले',
      'puncture':'पंक्चर','burst':'फुटला','smoke':'धूर','noise':'आवाज',
      'repair':'दुरुस्ती','fix':'ठीक करा','change':'बदला','check':'तपासा',
      'mechanic':'मेकॅनिक','garage':'गॅरेज','shop':'दुकान','near':'जवळ','nearest':'जवळचा','find':'शोधा',
      'road':'रस्ता','highway':'महामार्ग','hospital':'रुग्णालय','police':'पोलीस','ambulance':'रुग्णवाहिका',
      'accident':'अपघात','emergency':'आपत्कालीन','call':'फोन करा','send':'पाठवा','come':'या','go':'जा','fast':'लवकर',
      'food':'जेवण','rest':'विश्रांती','thank':'धन्यवाद','thanks':'धन्यवाद','sorry':'माफ करा','wait':'थांबा',
      'hot':'गरम','cold':'थंड','big':'मोठा','small':'लहान','problem':'समस्या',
      'driver':'चालक','heavy':'जड','dhaba':'ढाबा','parking':'पार्किंग'
    }},
    ta: { name: 'Tamil', flag: '\u{1F1EE}\u{1F1F3}', words: {
      'hello':'வணக்கம்','hi':'வணக்கம்','help':'உதவி','need':'வேண்டும்','please':'தயவுசெய்து',
      'yes':'ஆம்','no':'இல்லை','i':'நான்','my':'என்','where':'எங்கே','what':'என்ன','how':'எப்படி',
      'truck':'லாரி','vehicle':'வாகனம்','engine':'இயந்திரம்','tyre':'டயர்','tire':'டயர்',
      'brake':'பிரேக்','oil':'எண்ணெய்','fuel':'எரிபொருள்','water':'தண்ணீர்','battery':'பேட்டரி',
      'breakdown':'கெட்டுப்போச்சு','puncture':'பஞ்சர்','repair':'பழுது','fix':'சரி செய்',
      'mechanic':'மெக்கானிக்','shop':'கடை','near':'அருகில்','nearest':'அருகிலுள்ள',
      'road':'சாலை','highway':'நெடுஞ்சாலை','hospital':'மருத்துவமனை','police':'காவல்','ambulance':'ஆம்புலன்ஸ்',
      'accident':'விபத்து','emergency':'அவசரம்','call':'அழை','send':'அனுப்பு','come':'வா','go':'போ',
      'fast':'வேகமாக','food':'உணவு','rest':'ஓய்வு','thank':'நன்றி','thanks':'நன்றி','sorry':'மன்னிக்கவும்',
      'problem':'பிரச்சனை','stop':'நிறுத்து','wait':'காத்திரு','driver':'டிரைவர்'
    }},
    te: { name: 'Telugu', flag: '\u{1F1EE}\u{1F1F3}', words: {
      'hello':'నమస్కారం','hi':'నమస్కారం','help':'సహాయం','need':'కావాలి','please':'దయచేసి',
      'yes':'అవును','no':'కాదు','i':'నేను','my':'నా','where':'ఎక్కడ','what':'ఏమిటి','how':'ఎలా',
      'truck':'ట్రక్కు','vehicle':'వాహనం','engine':'ఇంజన్','tyre':'టైరు','tire':'టైరు',
      'brake':'బ్రేక్','oil':'నూనె','fuel':'ఇంధనం','water':'నీళ్ళు','battery':'బ్యాటరీ',
      'breakdown':'చెడిపోయింది','puncture':'పంక్చర్','repair':'మరమ్మత్తు','fix':'బాగుచేయి',
      'mechanic':'మెకానిక్','shop':'షాపు','near':'దగ్గర','nearest':'సమీపంలో',
      'road':'రోడ్డు','highway':'హైవే','hospital':'ఆసుపత్రి','police':'పోలీసు','ambulance':'అంబులెన్స్',
      'accident':'ప్రమాదం','emergency':'అత్యవసరం','call':'కాల్ చేయి','send':'పంపు','come':'రా','go':'వెళ్ళు',
      'fast':'వేగంగా','food':'ఆహారం','rest':'విశ్రాంతి','thank':'ధన్యవాదాలు','thanks':'ధన్యవాదాలు',
      'problem':'సమస్య','stop':'ఆపు','wait':'ఆగు','driver':'డ్రైవర్'
    }},
    kn: { name: 'Kannada', flag: '\u{1F1EE}\u{1F1F3}', words: {
      'hello':'ನಮಸ್ಕಾರ','hi':'ನಮಸ್ಕಾರ','help':'ಸಹಾಯ','need':'ಬೇಕು','please':'ದಯವಿಟ್ಟು',
      'yes':'ಹೌದು','no':'ಇಲ್ಲ','i':'ನಾನು','my':'ನನ್ನ','where':'ಎಲ್ಲಿ','what':'ಏನು','how':'ಹೇಗೆ',
      'truck':'ಟ್ರಕ್','vehicle':'ವಾಹನ','engine':'ಇಂಜಿನ್','tyre':'ಟೈರ್','tire':'ಟೈರ್',
      'brake':'ಬ್ರೇಕ್','oil':'ಎಣ್ಣೆ','fuel':'ಇಂಧನ','water':'ನೀರು','battery':'ಬ್ಯಾಟರಿ',
      'breakdown':'ಕೆಟ್ಟಿದೆ','puncture':'ಪಂಕ್ಚರ್','repair':'ರಿಪೇರಿ','fix':'ಸರಿಮಾಡು',
      'mechanic':'ಮೆಕ್ಯಾನಿಕ್','shop':'ಅಂಗಡಿ','near':'ಹತ್ತಿರ','nearest':'ಹತ್ತಿರದ',
      'road':'ರಸ್ತೆ','highway':'ಹೆದ್ದಾರಿ','hospital':'ಆಸ್ಪತ್ರೆ','police':'ಪೊಲೀಸ್','ambulance':'ಆಂಬ್ಯುಲೆನ್ಸ್',
      'accident':'ಅಪಘಾತ','emergency':'ತುರ್ತು','call':'ಕರೆ ಮಾಡಿ','send':'ಕಳುಹಿಸಿ','come':'ಬಾ','go':'ಹೋಗು',
      'fast':'ವೇಗವಾಗಿ','food':'ಊಟ','rest':'ವಿಶ್ರಾಂತಿ','thank':'ಧನ್ಯವಾದ','thanks':'ಧನ್ಯವಾದ',
      'problem':'ಸಮಸ್ಯೆ','stop':'ನಿಲ್ಲಿಸು','wait':'ನಿಲ್ಲು','driver':'ಚಾಲಕ'
    }}
  };

  const handleTranslate = async (text) => {
    if (!text || !text.trim()) return;
    setTranslatedText('');
    setIsTranslating(true);
    setVoiceError('');

    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
      const data = await res.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        throw new Error("Translation API failed");
      }
    } catch (err) {
      console.error("Translation error:", err);
      // Fallback to word-by-word dictionary if API fails or rate limits
      const words = text.toLowerCase().trim().split(/\s+/);
      const dict = wordDicts[targetLang]?.words || {};
      const translated = words.map(word => {
        const clean = word.replace(/[^a-z]/g, '');
        if (!clean) return '';
        return dict[clean] !== undefined ? (dict[clean] || '') : word;
      }).filter(w => w !== '').join(' ');
      setTranslatedText(translated || text);
    } finally {
      setIsTranslating(false);
    }
  };

  const startVoiceRecognition = () => {
    setVoiceError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Speech recognition not supported. Please use Chrome or Edge browser.');
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_e) { /* ignore */ }
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setIsListening(true); setVoiceError(''); };
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setVoiceInputText(spoken);
      handleTranslate(spoken);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') setVoiceError('No speech detected. Tap mic and speak clearly.');
      else if (event.error === 'not-allowed') setVoiceError('Microphone blocked. Allow mic permission in browser settings.');
      else if (event.error === 'network') setVoiceError('Network error. Internet connection required.');
      else setVoiceError('Voice error: ' + event.error + '. Try again.');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    try { recognition.start(); } catch (_e) { setVoiceError('Could not start mic. Try again.'); setIsListening(false); }
  };

  const handleResendInAppAlert = (mechanicName) => {
    setToastNotice(`💬 Emergency Alert Re-sent In-App to ${mechanicName}!`);
    setTimeout(() => setToastNotice(''), 3000);
  };

  // Siren Audio State
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const sirenTimerRef = useRef(null);

  const t = i18n[lang];

  // Siren Audio Control
  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSirenAudio();
    } else {
      startSirenAudio();
    }
  };

  const startSirenAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;

      let high = false;
      sirenTimerRef.current = setInterval(() => {
        if (oscRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          oscRef.current.frequency.exponentialRampToValueAtTime(high ? 600 : 1200, now + 0.35);
          high = !high;
        }
      }, 400);

      setIsSirenPlaying(true);
    } catch (err) {
      console.log("Audio not supported or blocked", err);
    }
  };

  const stopSirenAudio = () => {
    if (sirenTimerRef.current) clearInterval(sirenTimerRef.current);
    if (oscRef.current) {
      try { oscRef.current.stop(); oscRef.current.disconnect(); } catch (e) { }
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { }
      audioCtxRef.current = null;
    }
    setIsSirenPlaying(false);
  };

  const handleOpenSos = () => {
    setIsSosActive(true);
    startSirenAudio();
  };

  const handleCloseSos = () => {
    setIsSosActive(false);
    stopSirenAudio();
  };

  // Nearby Mechanics Mock Data
  const mechanicsList = [
    { name: "Highway Auto Care & Towing", dist: "2.4 km away", rating: "4.9 ★", phone: "+91 9822012345", spec: "Engine, Tyre & Heavy Towing" },
    { name: "Pawar Diesel Mechanics", dist: "5.1 km away", rating: "4.8 ★", phone: "+91 9422054321", spec: "Brake & Fuel Pump Specialist" },
    { name: "Katraj Mobile Service Van", dist: "7.8 km away", rating: "4.7 ★", phone: "+91 9922099887", spec: "24/7 On-Road Battery & Electrical" }
  ];

  return (
    <div className="dashboard-root">
      {/* 1. Header Bar */}
      <header className="dash-header">
        <div className="brand-section">
          <div className="dash-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src="/images/logo-removebg-preview.png" alt="SaarthiMitra Logo" className="brand-logo-img" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
          <div className="brand-info">
            <h1>SaarthiMitra</h1>
            <p>{t.brand_subtitle}</p>
          </div>
        </div>

        <div className="user-status-area">
          <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}>
            {lang === 'en' ? 'मराठी' : 'English'}
          </button>

          <div className="driver-profile-pill" onClick={() => setIsProfileModalOpen(true)}>
            <div className="avatar-circle">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="driver-meta">
              <span className="driver-name">{profile.fullName}</span>
              <span className="driver-role-text">{profile.vehicleNumber}</span>
            </div>
          </div>

          <button className="lang-btn" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }} onClick={() => navigate('/')}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* 2. Main Dashboard Grid */}
      <div className="dash-main-grid">
        <div className="dash-content-col">
          {/* Emergency SOS Hero Banner */}
          <div className="sos-banner-card">
            <div className="sos-banner-info">
              <h2>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {t.sos_title}
              </h2>
              <p style={{ margin: 0 }}>{t.sos_desc}</p>
            </div>

            <div className="sos-trigger-wrapper">
              <div className="sos-pulse-ring"></div>
              <button className="sos-button-main" onClick={handleOpenSos}>
                <span className="sos-btn-text">{t.press_sos}</span>
                <span className="sos-btn-sub">{t.press_sub}</span>
              </button>
            </div>
          </div>

          {/* 4 Helping Options Grid */}
          <div className="stats-grid">
            {/* 1. Breakdown Help */}
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setIsBreakdownModalOpen(true)}>
              <div className="stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.1rem', color: '#dc2626' }}>{t.help_breakdown_title}</div>
                <div className="stat-sub" style={{ marginTop: '0.2rem', color: '#475569' }}>{t.help_breakdown_sub}</div>
              </div>
            </div>

            {/* 2. Tyre Repair */}
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setIsTyreModalOpen(true)}>
              <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.1rem', color: '#b45309' }}>{t.help_tyre_title}</div>
                <div className="stat-sub" style={{ marginTop: '0.2rem', color: '#475569' }}>{t.help_tyre_sub}</div>
              </div>
            </div>

            {/* 3. Mechanic Locator */}
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setIsMechanicModalOpen(true)}>
              <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.1rem', color: '#047857' }}>{t.help_mechanic_title}</div>
                <div className="stat-sub" style={{ marginTop: '0.2rem', color: '#475569' }}>{t.help_mechanic_sub}</div>
              </div>
            </div>

            {/* 4. AI Voice Helper */}
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setIsVoiceModalOpen(true)}>
              <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.1rem', color: '#4338ca' }}>{t.help_voice_title}</div>
                <div className="stat-sub" style={{ marginTop: '0.2rem', color: '#475569' }}>{t.help_voice_sub}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Sidebar Column */}
        <div className="dash-sidebar-col">
          {/* Helplines Widget */}
          <div className="side-widget">
            <h3>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M22 16.92V19.92A2 2 0 0 1 20.08 22 19.86 19.86 0 0 1 2 3.92 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {t.helpline_title}
            </h3>

            <div className="helpline-item">
              <div>
                <div className="helpline-name">{t.police}</div>
                <div className="helpline-sub">Dial 112 (Highway Patrol)</div>
              </div>
              <a href="tel:112" className="call-btn-mini">Call 112</a>
            </div>

            <div className="helpline-item">
              <div>
                <div className="helpline-name">{t.ambulance}</div>
                <div className="helpline-sub">Dial 108 (Trauma Ambulance)</div>
              </div>
              <a href="tel:108" className="call-btn-mini">Call 108</a>
            </div>

            <div className="helpline-item">
              <div>
                <div className="helpline-name">{t.crane}</div>
                <div className="helpline-sub">1800-266-9900 (24x7 Control)</div>
              </div>
              <a href="tel:18002669900" className="call-btn-mini">Call Support</a>
            </div>

            <div className="helpline-item">
              <div>
                <div className="helpline-name">{t.toll}</div>
                <div className="helpline-sub">Dial 1033 (NHAI Emergency)</div>
              </div>
              <a href="tel:1033" className="call-btn-mini">Call 1033</a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODALS */}

      {/* SOS Modal - In-App Direct Emergency Dispatch to Local Mechanics */}
      {isSosActive && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card" style={{ borderColor: '#ef4444', textAlign: 'left', maxWidth: '580px' }}>
            <div className="dash-modal-header" style={{ borderBottom: '1px solid #fee2e2', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                🚨 {t.sos_modal_title}
              </h3>
              <button className="close-modal-btn" onClick={handleCloseSos}>✕</button>
            </div>

            {toastNotice && (
              <div style={{ background: '#3b82f6', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                {toastNotice}
              </div>
            )}

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1rem', color: '#047857', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{t.sos_success_badge}</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{t.message_payload_label}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', lineHeight: '1.4', background: '#ffffff', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                "🚨 EMERGENCY HIGHWAY BREAKDOWN: Driver <strong>{profile.fullName}</strong> (Vehicle: <strong>{profile.vehicleNumber}</strong>) requires immediate assistance at NH-48 Katraj Bypass. Emergency Phone: <strong>{profile.emergencyContact || '9876543210'}</strong>."
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
              🛠️ {t.notified_mechanics_label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {mechanicsList.map((m, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.85rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {m.spec} • <strong style={{ color: '#059669' }}>🟢 Direct Message Received</strong> ({m.dist})
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={() => handleResendInAppAlert(m.name)} className="call-btn-mini" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8', cursor: 'pointer' }}>
                      💬 {t.resend_in_app}
                    </button>
                    <a href={`tel:${m.phone}`} className="call-btn-mini">
                      📞 {t.call_now}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="lang-btn" style={{ flex: 1, background: isSirenPlaying ? '#ef4444' : '#f1f5f9', color: isSirenPlaying ? '#ffffff' : '#334155', border: isSirenPlaying ? 'none' : '1px solid #cbd5e1', padding: '0.75rem', fontWeight: '700' }} onClick={toggleSiren}>
                🔊 {isSirenPlaying ? t.siren_on : t.siren_off}
              </button>
              <button className="lang-btn" style={{ flex: 1, background: '#0f172a', color: '#ffffff', border: 'none', padding: '0.75rem', fontWeight: '700' }} onClick={handleCloseSos}>
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mechanic Locator Modal */}
      {isMechanicModalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card" style={{ maxWidth: '620px', background: '#f0fdf4', padding: '1.75rem' }}>
            <div className="dash-modal-header" style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>📍 Mechanic Locator</h3>
              <button className="close-modal-btn" onClick={() => setIsMechanicModalOpen(false)}>✕</button>
            </div>

            {/* Slogan Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #047857)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.3px' }}>
                "Your highway mechanic, just a tap away"
              </div>
              <div style={{ fontSize: '0.78rem', color: '#d1fae5', marginTop: '0.25rem', fontWeight: '500' }}>
                SaarthiMitra Verified Mechanic Network
              </div>
            </div>

            {/* Nearby Mechanics Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>
                📍 Nearby Verified Mechanics (5–10 km)
              </span>
              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: '600' }}>
                Live GPS
              </span>
            </div>

            {/* Mechanic Shop Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Mechanic 1 */}
              <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#065f46', fontSize: '0.95rem' }}>🛠️ Patil Highway Auto Garage</div>
                  <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>5.0 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#047857', margin: '0.3rem 0' }}>Engine Repair • Brake Service • Electrical • 24/7</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.8 Rating • Open Now</div>
                <a href="tel:+919021683085" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex', background: '#059669', color: '#fff', border: 'none' }}>
                  📞 Call Now (+91 9021683085)
                </a>
              </div>

              {/* Mechanic 2 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛠️ Sharma Diesel Engine Works</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>6.3 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Diesel Engine • Turbo Repair • Oil Change</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.5 Rating • Open Now</div>
                <a href="tel:+918421678465" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 8421678465)
                </a>
              </div>

              {/* Mechanic 3 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛠️ Katraj Truck Service Center</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>7.1 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Heavy Vehicle • Suspension • Clutch & Gearbox</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.6 Rating • Open Now</div>
                <a href="tel:+919876543210" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 9876543210)
                </a>
              </div>

              {/* Mechanic 4 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛠️ NH-48 Mobile Repair Van</div>
                  <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>8.5 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Mobile Van • Roadside Emergency • AC & Coolant Fix</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.7 Rating • Open 24/7</div>
                <a href="tel:+919822012345" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex', background: '#16a34a', color: '#fff', border: 'none' }}>
                  📞 Emergency Call (+91 9822012345)
                </a>
              </div>

              {/* Mechanic 5 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛠️ Shree Auto Multi-Brand Garage</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>9.8 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Multi-Brand • Tata • Ashok Leyland • Eicher Specialist</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.4 Rating • Open Now</div>
                <a href="tel:+919123456789" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 9123456789)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Help Modal - Photo Upload & Diagnosis Form */}
      {isBreakdownModalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card" style={{ maxWidth: '620px', background: '#f8fafc', padding: '1.75rem' }}>
            <div className="dash-modal-header" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Breakdown Help</h3>
              <button className="close-modal-btn" onClick={() => setIsBreakdownModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsDiagnosing(true);
              setTimeout(() => {
                setIsDiagnosing(false);
                setBreakdownResult({
                  issue: breakdownDesc || "Engine noise & coolant smoke detected",
                  severity: "High Priority Breakdown",
                  recommendation: "Emergency Mobile Crane & Engine Repair Van dispatched to NH-48 Katraj Bypass (ETA: 12 Mins)."
                });
              }, 1200);
            }}>
              {/* Field 1: Upload Photo of Damage */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.6rem' }}>
                  Upload Photo of Damage
                </label>
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '2.5rem 1.5rem',
                    background: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '130px'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBreakdownPhoto(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                  {breakdownPhoto ? (
                    <div style={{ textAlign: 'center' }}>
                      <img src={breakdownPhoto} alt="Damage Upload" style={{ maxHeight: '110px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700', marginTop: '0.4rem' }}>✓ Photo Uploaded</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#64748b" strokeWidth="2" style={{ marginBottom: '0.4rem' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#475569' }}>Click to upload</div>
                    </div>
                  )}
                </label>
              </div>

              {/* Field 2: Describe the Issue */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.6rem' }}>
                  Describe the Issue
                </label>
                <textarea
                  rows="4"
                  value={breakdownDesc}
                  onChange={(e) => setBreakdownDesc(e.target.value)}
                  placeholder="e.g., Engine is making a strange noise and there's smoke coming from the hood."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Diagnosis Output Card */}
              {breakdownResult && (
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: '800', color: '#047857', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                    🔍 AI Breakdown Diagnosis: {breakdownResult.issue}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: '1.4' }}>
                    {breakdownResult.recommendation}
                  </div>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isDiagnosing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #e02424, #d946ef)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(217, 70, 239, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isDiagnosing ? 'Analyzing Breakdown Issue...' : 'Diagnose Problem'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tyre Repair Modal */}
      {isTyreModalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card" style={{ maxWidth: '620px', background: '#fffdf7', padding: '1.75rem' }}>
            <div className="dash-modal-header" style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>🛞 Tyre Repair</h3>
              <button className="close-modal-btn" onClick={() => setIsTyreModalOpen(false)}>✕</button>
            </div>

            {/* Slogan Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.3px' }}>
                "Where the tyre dies, help will rise"
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fef3c7', marginTop: '0.25rem', fontWeight: '500' }}>
                SaarthiMitra Highway Tyre Assistance Network
              </div>
            </div>

            {/* Nearby Tyre Shops Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>
                📍 Nearby Tyre Repair Shops (5–10 km)
              </span>
              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: '600' }}>
                Live GPS
              </span>
            </div>

            {/* Tyre Shop Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Shop 1 */}
              <div style={{ background: '#ffffff', border: '1px solid #fde68a', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#92400e', fontSize: '0.95rem' }}>🛞 Katraj Highway Tyre Works</div>
                  <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>5.2 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350f', margin: '0.3rem 0' }}>Tubeless Puncture • Air Pressure • Vulcanizing • 24/7</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.5 Rating • Open Now</div>
                <a href="tel:+919922099887" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex', background: '#d97706', color: '#fff', border: 'none' }}>
                  📞 Call Now (+91 9922099887)
                </a>
              </div>

              {/* Shop 2 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛞 Rajesh Heavy Vehicle Tyre Center</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>6.8 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Truck Tyres • Stepney Change • Wheel Alignment</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.3 Rating • Open Now</div>
                <a href="tel:+919876012345" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 9876012345)
                </a>
              </div>

              {/* Shop 3 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛞 Apollo & JK Truck Tyre Hub</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>7.5 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>New Tyres • Retreading • Air Pressure Check</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.6 Rating • Open Now</div>
                <a href="tel:+919422054321" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 9422054321)
                </a>
              </div>

              {/* Shop 4 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛞 NH-48 Mobile Puncture Van Service</div>
                  <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>8.1 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>Mobile Van • Emergency Roadside • Burst Tyre Replacement</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.7 Rating • Open 24/7</div>
                <a href="tel:+919011223344" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex', background: '#16a34a', color: '#fff', border: 'none' }}>
                  📞 Emergency Call (+91 9011223344)
                </a>
              </div>

              {/* Shop 5 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>🛞 Shree Ganesh Tyre & Service</div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>9.4 km</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.3rem 0' }}>MRF • CEAT Dealer • Balancing & Alignment</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>⭐ 4.4 Rating • Open Now</div>
                <a href="tel:+919765432100" className="call-btn-mini" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                  📞 Call Now (+91 9765432100)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Voice Helper — Language Translator */}
      {isVoiceModalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card" style={{ maxWidth: '620px', background: '#f5f3ff', padding: '1.75rem' }}>
            <div className="dash-modal-header" style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>🎙️ AI Voice Helper</h3>
              <button className="close-modal-btn" onClick={() => { setIsVoiceModalOpen(false); setVoiceInputText(''); setTranslatedText(''); }}>✕</button>
            </div>

            {/* Slogan Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.3px' }}>
                "Speak in English, translate to any language"
              </div>
              <div style={{ fontSize: '0.78rem', color: '#c7d2fe', marginTop: '0.25rem', fontWeight: '500' }}>
                SaarthiMitra Highway Voice Translator
              </div>
            </div>

            {/* Language Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                🌐 Translate To:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(wordDicts).map(([code, info]) => (
                  <button
                    key={code}
                    onClick={() => { setTargetLang(code); if (voiceInputText) handleTranslate(voiceInputText); }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '999px',
                      border: targetLang === code ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: targetLang === code ? '#e0e7ff' : '#ffffff',
                      color: targetLang === code ? '#3730a3' : '#475569',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {info.flag} {info.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {voiceError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '600' }}>
                {voiceError}
              </div>
            )}

            {/* Mic Button */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <button
                onClick={startVoiceRecognition}
                disabled={isListening}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isListening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#ffffff',
                  fontSize: '2.2rem',
                  cursor: 'pointer',
                  boxShadow: isListening ? '0 0 30px rgba(239,68,68,0.5)' : '0 8px 24px rgba(99,102,241,0.35)',
                  transition: 'all 0.2s ease',
                  animation: isListening ? 'pulse 1.2s infinite' : 'none'
                }}
              >
                🎙️
              </button>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: isListening ? '#dc2626' : '#4f46e5', marginTop: '0.5rem' }}>
                {isListening ? '🔴 Listening... Speak now!' : 'Tap to Speak'}
              </div>
            </div>

            {/* Or Type Manually */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                Or type your text:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={voiceInputText}
                  onChange={(e) => {
                    setVoiceInputText(e.target.value);
                    if (!e.target.value) setTranslatedText('');
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') handleTranslate(voiceInputText);
                  }}
                  placeholder="e.g., my truck broke down"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    fontWeight: '500',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleTranslate(voiceInputText)}
                  disabled={!voiceInputText.trim()}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '14px',
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Translate
                </button>
              </div>
            </div>

            {/* Your Speech Box */}
            {voiceInputText && (
              <div style={{ background: '#ffffff', border: '1px solid #c7d2fe', padding: '1rem', borderRadius: '14px', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  🎤 Your Speech (English)
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a' }}>
                  "{voiceInputText}"
                </div>
              </div>
            )}

            {/* Translated Output Box */}
            {(translatedText || isTranslating) && (
              <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '1rem', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#059669', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  🌐 Translation ({wordDicts[targetLang]?.name})
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#065f46' }}>
                  {isTranslating ? 'Translating...' : translatedText}
                </div>
              </div>
            )}

            {/* Quick Phrases */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>⚡ Quick Phrases:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['hello', 'help', 'breakdown', 'tyre puncture', 'i need help', 'engine overheating', 'need towing', 'thank you'].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => { setVoiceInputText(phrase); handleTranslate(phrase); }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configure SOS Numbers Modal */}
      {isSosSetupOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card">
            <div className="dash-modal-header">
              <h3>⚙️ Configure Emergency SOS Contacts</h3>
              <button className="close-modal-btn" onClick={() => setIsSosSetupOpen(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              try {
                localStorage.setItem('sarthi_sos_contacts', JSON.stringify(sosContacts));
              } catch (err) { }
              setIsSosSetupOpen(false);
              alert("Emergency SOS Contacts Updated Successfully!");
            }}>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Primary Emergency Contact (1)</label>
                <input
                  type="tel"
                  value={sosContacts.contact1}
                  onChange={e => setSosContacts({ ...sosContacts, contact1: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Secondary Emergency Contact (2)</label>
                <input
                  type="tel"
                  value={sosContacts.contact2}
                  onChange={e => setSosContacts({ ...sosContacts, contact2: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" className="lang-btn" style={{ width: '100%', background: 'var(--accent-blue)', color: '#ffffff', padding: '0.75rem', fontSize: '0.95rem' }}>
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal-card">
            <div className="dash-modal-header">
              <h3>👤 {t.edit_profile}</h3>
              <button className="close-modal-btn" onClick={() => setIsProfileModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              try {
                localStorage.setItem('driverProfile', JSON.stringify(profile));
              } catch (err) { }
              setIsProfileModalOpen(false);
              alert("Driver Profile Saved Successfully!");
            }}>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Truck / Vehicle Number</label>
                <input
                  type="text"
                  value={profile.vehicleNumber}
                  onChange={e => setProfile({ ...profile, vehicleNumber: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Driving License Number</label>
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={e => setProfile({ ...profile, licenseNumber: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" className="lang-btn" style={{ width: '100%', background: 'var(--accent-blue)', color: '#ffffff', padding: '0.75rem', fontSize: '0.95rem' }}>
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
