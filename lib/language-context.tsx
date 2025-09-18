"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { languageNames, languageFlags, type Locale } from "./i18n"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation function - in a real app, you'd use next-intl
const translations: Record<Locale, Record<string, string>> = {
  en: {
    "navigation.home": "Home",
    "navigation.avatars": "Avatars",
    "navigation.chat": "Chat",
    "navigation.results": "Results",
    "navigation.history": "History",
    "navigation.signIn": "Sign In",
    "navigation.signUp": "Sign Up",
    "homepage.title": "See how government policies affect you",
    "homepage.subtitle": "PolicyTwin creates a personal digital twin of your financial and family profile and simulates the impact of tax reforms, subsidies, and government schemes.",
    "homepage.createAvatar": "Create Your Avatar",
    "homepage.tryDemo": "Try a Demo",
    "chat.title": "Policy Chat",
    "chat.subtitle": "Discuss policies and run simulations with your AI assistant",
    "avatars.title": "Your Avatars",
    "avatars.subtitle": "Create and manage digital personas for policy simulations",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success"
  },
  hi: {
    "navigation.home": "होम",
    "navigation.avatars": "अवतार",
    "navigation.chat": "चैट",
    "navigation.history": "इतिहास",
    "navigation.signIn": "साइन इन",
    "navigation.signUp": "साइन अप",
    "homepage.title": "देखें कि सरकारी नीतियां आपको कैसे प्रभावित करती हैं",
    "homepage.subtitle": "PolicyTwin आपकी वित्तीय और पारिवारिक प्रोफ़ाइल का एक व्यक्तिगत डिजिटल ट्विन बनाता है और कर सुधारों, सब्सिडी और सरकारी योजनाओं के प्रभाव का अनुकरण करता है।",
    "homepage.createAvatar": "अपना अवतार बनाएं",
    "homepage.tryDemo": "डेमो आज़माएं",
    "chat.title": "नीति चैट",
    "chat.subtitle": "अपने AI सहायक के साथ नीतियों पर चर्चा करें और सिमुलेशन चलाएं",
    "avatars.title": "आपके अवतार",
    "avatars.subtitle": "नीति सिमुलेशन के लिए डिजिटल व्यक्तित्व बनाएं और प्रबंधित करें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता"
  },
  bn: {
    "navigation.home": "হোম",
    "navigation.avatars": "অবতার",
    "navigation.chat": "চ্যাট",
    "navigation.results": "ফলাফল",
    "navigation.history": "ইতিহাস",
    "navigation.signIn": "সাইন ইন",
    "navigation.signUp": "সাইন আপ",
    "homepage.title": "দেখুন সরকারি নীতি আপনাকে কীভাবে প্রভাবিত করে",
    "homepage.subtitle": "PolicyTwin আপনার আর্থিক ও পারিবারিক প্রোফাইলের একটি ব্যক্তিগত ডিজিটাল টুইন তৈরি করে এবং কর সংস্কার, ভর্তুকি ও সরকারি প্রকল্পের প্রভাব সিমুলেট করে।",
    "homepage.createAvatar": "আপনার অবতার তৈরি করুন",
    "homepage.tryDemo": "ডেমো চেষ্টা করুন",
    "chat.title": "নীতি চ্যাট",
    "chat.subtitle": "আপনার AI সহায়কের সাথে নীতি নিয়ে আলোচনা করুন এবং সিমুলেশন চালান",
    "avatars.title": "আপনার অবতার",
    "avatars.subtitle": "নীতি সিমুলেশনের জন্য ডিজিটাল ব্যক্তিত্ব তৈরি এবং পরিচালনা করুন",
    "common.loading": "লোড হচ্ছে...",
    "common.error": "ত্রুটি",
    "common.success": "সফলতা"
  },
  te: {
    "navigation.home": "హోమ్",
    "navigation.avatars": "అవతారాలు",
    "navigation.chat": "చాట్",
    "navigation.results": "ఫలితాలు",
    "navigation.history": "చరిత్ర",
    "navigation.signIn": "సైన్ ఇన్",
    "navigation.signUp": "సైన్ అప్",
    "homepage.title": "ప్రభుత్వ విధానాలు మిమ్మల్ని ఎలా ప్రభావితం చేస్తాయో చూడండి",
    "homepage.subtitle": "PolicyTwin మీ ఆర్థిక మరియు కుటుంబ ప్రొఫైల్ యొక్క వ్యక్తిగత డిజిటల్ ట్విన్ను సృష్టిస్తుంది మరియు పన్ను సంస్కరణలు, సబ్సిడీలు మరియు ప్రభుత్వ పథకాల ప్రభావాన్ని అనుకరిస్తుంది.",
    "homepage.createAvatar": "మీ అవతారాన్ని సృష్టించండి",
    "homepage.tryDemo": "డెమో ప్రయత్నించండి",
    "chat.title": "విధాన చాట్",
    "chat.subtitle": "మీ AI సహాయకుడితో విధానాల గురించి చర్చించండి మరియు సిమ్యులేషన్లను అమలు చేయండి",
    "avatars.title": "మీ అవతారాలు",
    "avatars.subtitle": "విధాన సిమ్యులేషన్ల కోసం డిజిటల్ వ్యక్తిత్వాలను సృష్టించండి మరియు నిర్వహించండి",
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "లోపం",
    "common.success": "విజయం"
  },
  mr: {
    "navigation.home": "होम",
    "navigation.avatars": "अवतार",
    "navigation.chat": "चॅट",
    "navigation.results": "निकाल",
    "navigation.history": "इतिहास",
    "navigation.signIn": "साइन इन",
    "navigation.signUp": "साइन अप",
    "homepage.title": "सरकारी धोरणे तुम्हाला कशी परिणाम करतात ते पहा",
    "homepage.subtitle": "PolicyTwin तुमच्या आर्थिक आणि कौटुंबिक प्रोफाइलचा वैयक्तिक डिजिटल ट्विन तयार करतो आणि कर सुधारणा, अनुदान आणि सरकारी योजनांचा परिणाम अनुकरण करतो.",
    "homepage.createAvatar": "तुमचा अवतार तयार करा",
    "homepage.tryDemo": "डेमो वापरून पहा",
    "chat.title": "धोरण चॅट",
    "chat.subtitle": "तुमच्या AI सहाय्यकाशी धोरणांबद्दल चर्चा करा आणि अनुकरणे चालवा",
    "avatars.title": "तुमचे अवतार",
    "avatars.subtitle": "धोरण अनुकरणांसाठी डिजिटल व्यक्तिमत्वे तयार करा आणि व्यवस्थापित करा",
    "common.loading": "लोड होत आहे...",
    "common.error": "त्रुटी",
    "common.success": "यश"
  },
  ta: {
    "navigation.home": "முகப்பு",
    "navigation.avatars": "அவதாரங்கள்",
    "navigation.chat": "அரட்டை",
    "navigation.results": "முடிவுகள்",
    "navigation.history": "வரலாறு",
    "navigation.signIn": "உள்நுழைய",
    "navigation.signUp": "பதிவு செய்",
    "homepage.title": "அரசு கொள்கைகள் உங்களை எவ்வாறு பாதிக்கின்றன என்பதைப் பாருங்கள்",
    "homepage.subtitle": "PolicyTwin உங்கள் நிதி மற்றும் குடும்ப சுயவிவரத்தின் தனிப்பட்ட டிஜிட்டல் இரட்டையை உருவாக்குகிறது மற்றும் வரி சீர்திருத்தங்கள், மானியங்கள் மற்றும் அரசு திட்டங்களின் தாக்கத்தை உருவகப்படுத்துகிறது.",
    "homepage.createAvatar": "உங்கள் அவதாரத்தை உருவாக்குங்கள்",
    "homepage.tryDemo": "டெமோ முயற்சிக்கவும்",
    "chat.title": "கொள்கை அரட்டை",
    "chat.subtitle": "உங்கள் AI உதவியாளருடன் கொள்கைகளைப் பற்றி விவாதிக்கவும் மற்றும் உருவகப்படுத்தல்களை இயக்கவும்",
    "avatars.title": "உங்கள் அவதாரங்கள்",
    "avatars.subtitle": "கொள்கை உருவகப்படுத்தல்களுக்காக டிஜிட்டல் ஆளுமைகளை உருவாக்கவும் மற்றும் நிர்வகிக்கவும்",
    "common.loading": "ஏற்றப்படுகிறது...",
    "common.error": "பிழை",
    "common.success": "வெற்றி"
  },
  gu: {
    "navigation.home": "હોમ",
    "navigation.avatars": "અવતાર",
    "navigation.chat": "ચેટ",
    "navigation.results": "પરિણામો",
    "navigation.history": "ઇતિહાસ",
    "navigation.signIn": "સાઇન ઇન",
    "navigation.signUp": "સાઇન અપ",
    "homepage.title": "જુઓ કે સરકારી નીતિઓ તમને કેવી રીતે અસર કરે છે",
    "homepage.subtitle": "PolicyTwin તમારા નાણાકીય અને પારિવારિક પ્રોફાઇલનો વ્યક્તિગત ડિજિટલ ટ્વિન બનાવે છે અને કર સુધારાઓ, સબ્સિડી અને સરકારી યોજનાઓના પ્રભાવનું અનુકરણ કરે છે.",
    "homepage.createAvatar": "તમારો અવતાર બનાવો",
    "homepage.tryDemo": "ડેમો અજમાવો",
    "chat.title": "નીતિ ચેટ",
    "chat.subtitle": "તમારા AI સહાયક સાથે નીતિઓ વિશે ચર્ચા કરો અને અનુકરણો ચલાવો",
    "avatars.title": "તમારા અવતાર",
    "avatars.subtitle": "નીતિ અનુકરણો માટે ડિજિટલ વ્યક્તિત્વો બનાવો અને સંચાલિત કરો",
    "common.loading": "લોડ થઈ રહ્યું છે...",
    "common.error": "ભૂલ",
    "common.success": "સફળતા"
  },
  kn: {
    "navigation.home": "ಮುಖಪುಟ",
    "navigation.avatars": "ಅವತಾರಗಳು",
    "navigation.chat": "ಚಾಟ್",
    "navigation.results": "ಫಲಿತಾಂಶಗಳು",
    "navigation.history": "ಇತಿಹಾಸ",
    "navigation.signIn": "ಸೈನ್ ಇನ್",
    "navigation.signUp": "ಸೈನ್ ಅಪ್",
    "homepage.title": "ಸರ್ಕಾರಿ ನೀತಿಗಳು ನಿಮ್ಮನ್ನು ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡಿ",
    "homepage.subtitle": "PolicyTwin ನಿಮ್ಮ ಹಣಕಾಸು ಮತ್ತು ಕುಟುಂಬ ಪ್ರೊಫೈಲ್ನ ವೈಯಕ್ತಿಕ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಅನ್ನು ರಚಿಸುತ್ತದೆ ಮತ್ತು ತೆರಿಗೆ ಸುಧಾರಣೆಗಳು, ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಪ್ರಭಾವವನ್ನು ಅನುಕರಿಸುತ್ತದೆ.",
    "homepage.createAvatar": "ನಿಮ್ಮ ಅವತಾರವನ್ನು ರಚಿಸಿ",
    "homepage.tryDemo": "ಡೆಮೊ ಪ್ರಯತ್ನಿಸಿ",
    "chat.title": "ನೀತಿ ಚಾಟ್",
    "chat.subtitle": "ನಿಮ್ಮ AI ಸಹಾಯಕರೊಂದಿಗೆ ನೀತಿಗಳ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ ಮತ್ತು ಅನುಕರಣೆಗಳನ್ನು ಚಲಾಯಿಸಿ",
    "avatars.title": "ನಿಮ್ಮ ಅವತಾರಗಳು",
    "avatars.subtitle": "ನೀತಿ ಅನುಕರಣೆಗಳಿಗಾಗಿ ಡಿಜಿಟಲ್ ವ್ಯಕ್ತಿತ್ವಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ",
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "common.error": "ದೋಷ",
    "common.success": "ಯಶಸ್ಸು"
  },
  ml: {
    "navigation.home": "ഹോം",
    "navigation.avatars": "അവതാരങ്ങൾ",
    "navigation.chat": "ചാറ്റ്",
    "navigation.results": "ഫലങ്ങൾ",
    "navigation.history": "ചരിത്രം",
    "navigation.signIn": "സൈൻ ഇൻ",
    "navigation.signUp": "സൈൻ അപ്പ്",
    "homepage.title": "സർക്കാർ നയങ്ങൾ നിങ്ങളെ എങ്ങനെ ബാധിക്കുന്നുവെന്ന് കാണുക",
    "homepage.subtitle": "PolicyTwin നിങ്ങളുടെ സാമ്പത്തിക, കുടുംബ പ്രൊഫൈലിന്റെ ഒരു വ്യക്തിഗത ഡിജിറ്റൽ ട്വിൻ സൃഷ്ടിക്കുന്നു, കൂടാതെ നികുതി പരിഷ്കരണങ്ങൾ, സബ്സിഡികൾ, സർക്കാർ പദ്ധതികളുടെ സ്വാധീനം അനുകരിക്കുന്നു.",
    "homepage.createAvatar": "നിങ്ങളുടെ അവതാരം സൃഷ്ടിക്കുക",
    "homepage.tryDemo": "ഡെമോ പരീക്ഷിക്കുക",
    "chat.title": "നയ ചാറ്റ്",
    "chat.subtitle": "നിങ്ങളുടെ AI അസിസ്റ്റന്റുമായി നയങ്ങളെക്കുറിച്ച് ചർച്ച ചെയ്യുക, സിമുലേഷനുകൾ പ്രവർത്തിപ്പിക്കുക",
    "avatars.title": "നിങ്ങളുടെ അവതാരങ്ങൾ",
    "avatars.subtitle": "നയ സിമുലേഷനുകൾക്കായി ഡിജിറ്റൽ വ്യക്തിത്വങ്ങൾ സൃഷ്ടിക്കുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക",
    "common.loading": "ലോഡ് ചെയ്യുന്നു...",
    "common.error": "പിശക്",
    "common.success": "വിജയം"
  },
  pa: {
    "navigation.home": "ਹੋਮ",
    "navigation.avatars": "ਅਵਤਾਰ",
    "navigation.chat": "ਚੈਟ",
    "navigation.results": "ਨਤੀਜੇ",
    "navigation.history": "ਇਤਿਹਾਸ",
    "navigation.signIn": "ਸਾਈਨ ਇਨ",
    "navigation.signUp": "ਸਾਈਨ ਅੱਪ",
    "homepage.title": "ਦੇਖੋ ਸਰਕਾਰੀ ਨੀਤੀਆਂ ਤੁਹਾਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀਆਂ ਹਨ",
    "homepage.subtitle": "PolicyTwin ਤੁਹਾਡੇ ਵਿੱਤੀ ਅਤੇ ਪਰਿਵਾਰਕ ਪ੍ਰੋਫਾਈਲ ਦਾ ਇੱਕ ਨਿੱਜੀ ਡਿਜੀਟਲ ਟਵਿਨ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਟੈਕਸ ਸੁਧਾਰਾਂ, ਸਬਸਿਡੀਆਂ ਅਤੇ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਦੇ ਪ੍ਰਭਾਵ ਦਾ ਅਨੁਕਰਣ ਕਰਦਾ ਹੈ।",
    "homepage.createAvatar": "ਆਪਣਾ ਅਵਤਾਰ ਬਣਾਓ",
    "homepage.tryDemo": "ਡੈਮੋ ਅਜ਼ਮਾਓ",
    "chat.title": "ਨੀਤੀ ਚੈਟ",
    "chat.subtitle": "ਆਪਣੇ AI ਸਹਾਇਕ ਨਾਲ ਨੀਤੀਆਂ ਬਾਰੇ ਚਰਚਾ ਕਰੋ ਅਤੇ ਸਿਮੂਲੇਸ਼ਨ ਚਲਾਓ",
    "avatars.title": "ਤੁਹਾਡੇ ਅਵਤਾਰ",
    "avatars.subtitle": "ਨੀਤੀ ਸਿਮੂਲੇਸ਼ਨਾਂ ਲਈ ਡਿਜੀਟਲ ਵਿਅਕਤੀਗਤਤਾ ਬਣਾਓ ਅਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
    "common.loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "common.error": "ਗਲਤੀ",
    "common.success": "ਸਫਲਤਾ"
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    // Load saved language preference
    const savedLocale = localStorage.getItem("preferred-language") as Locale
    if (savedLocale && Object.keys(translations).includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("preferred-language", newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
