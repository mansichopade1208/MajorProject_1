
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Stethoscope,
  ShieldCheck,
  Eye,
  EyeOff,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import MediKioskHeader from "../components/MediKioskHeader.jsx";

const inputClass =
  "w-full rounded-xl border border-[#DCE5DC] bg-white px-4 py-3 text-sm text-[#214A43] outline-none transition placeholder:text-[#9AAEA5] focus:border-[#47796F] focus:ring-4 focus:ring-[#47796F]/10";

const labelClass = "mb-2 block text-sm font-semibold text-[#315E54]";

const translations = {
  en: {
    title: "Create your account",
    subtitle: "A simpler way to connect patients and healthcare professionals. Choose your account type to get started.",
    patient: "Patient",
    doctor: "Doctor",
    forPatient: "For patients",
    forDoctor: "For doctors",
    patientTitle: "Your health, your journey.",
    doctorTitle: "Care starts with connection.",
    patientDesc: "Prepare for consultations by sharing your details and health concerns in one convenient place.",
    doctorDesc: "Create your professional profile to help patients prepare for consultations.",
    patientBenefits: ["Keep your basic details organized", "Share health information when needed", "Prepare for your consultations"],
    doctorBenefits: ["Create your professional profile", "Provide your credentials and specialization", "Help patients prepare for their visits"],
    infoTitle: "Your information matters",
    infoDesc: "Only provide information you are comfortable sharing. Sensitive health details should be handled securely.",
    signup: "Sign up",
    selectType: "Select the account type that describes you.",
    personal: "Personal information",
    professional: "Personal & professional information",
    fullName: "Full name",
    enterName: "Enter your full name",
    email: "Email address",
    phone: "Phone number",
    enterPhone: "Enter phone number",
    dob: "Date of birth",
    registration: "Medical registration number",
    enterRegistration: "Enter registration number",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    preferNot: "Prefer not to say",
    specialization: "Specialization",
    selectSpecialization: "Select specialization",
    general: "General Physician",
    cardiology: "Cardiology",
    dermatology: "Dermatology",
    pediatrics: "Pediatrics",
    gynecology: "Gynecology",
    orthopedics: "Orthopedics",
    neurology: "Neurology",
    psychiatry: "Psychiatry",
    dentistry: "Dentistry",
    other: "Other",
    healthProfile: "Health profile",
    optional: "Optional. You can also provide these details later as part of your patient intake.",
    bloodGroup: "Blood group",
    selectBlood: "Select if known",
    unknown: "Don't know",
    city: "City",
    yourCity: "Your city",
    address: "Address",
    addressPlaceholder: "House, street and area",
    secure: "Secure your account",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm password",
    confirmPlaceholder: "Enter password again",
    showPassword: "Show password",
    hidePassword: "Hide password",
    createPatient: "Create Patient Account",
    createDoctor: "Create Doctor Account",
    creating: "Creating account...",
    already: "Already have an account?",
    login: "Log in",
    mismatch: "Your passwords do not match.",
    registrationFailed: "Registration failed. Please try again.",
    backend: "Cannot connect to the backend. Make sure the backend server is running at http://localhost:5000.",
    error: "Something went wrong. Please try again.",
    footer: "Patient-first healthcare",
  },

  hi: {
    title: "अपना खाता बनाएँ",
    subtitle: "मरीजों और स्वास्थ्य पेशेवरों को जोड़ने का आसान तरीका। शुरू करने के लिए अपना खाता चुनें।",
    patient: "मरीज",
    doctor: "डॉक्टर",
    forPatient: "मरीजों के लिए",
    forDoctor: "डॉक्टरों के लिए",
    patientTitle: "आपका स्वास्थ्य, आपका सफर।",
    doctorTitle: "देखभाल की शुरुआत जुड़ाव से होती है।",
    patientDesc: "अपनी जानकारी और स्वास्थ्य संबंधी समस्याएँ साझा करके परामर्श की तैयारी करें।",
    doctorDesc: "मरीजों की मदद के लिए अपनी पेशेवर प्रोफ़ाइल बनाएँ।",
    patientBenefits: ["अपनी जानकारी व्यवस्थित रखें", "ज़रूरत पड़ने पर स्वास्थ्य जानकारी साझा करें", "परामर्श के लिए तैयार रहें"],
    doctorBenefits: ["अपनी पेशेवर प्रोफ़ाइल बनाएँ", "अपनी योग्यता और विशेषज्ञता दें", "मरीजों की तैयारी में मदद करें"],
    infoTitle: "आपकी जानकारी महत्वपूर्ण है",
    infoDesc: "केवल वही जानकारी दें जिसे साझा करने में आप सहज हों। स्वास्थ्य संबंधी जानकारी सुरक्षित रखें।",
    signup: "साइन अप",
    selectType: "अपने खाते का प्रकार चुनें।",
    personal: "व्यक्तिगत जानकारी",
    professional: "व्यक्तिगत और पेशेवर जानकारी",
    fullName: "पूरा नाम",
    enterName: "अपना पूरा नाम लिखें",
    email: "ईमेल पता",
    phone: "फोन नंबर",
    enterPhone: "फोन नंबर लिखें",
    dob: "जन्म तिथि",
    registration: "मेडिकल रजिस्ट्रेशन नंबर",
    enterRegistration: "रजिस्ट्रेशन नंबर लिखें",
    gender: "लिंग",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    preferNot: "बताना नहीं चाहते",
    specialization: "विशेषज्ञता",
    selectSpecialization: "विशेषज्ञता चुनें",
    general: "सामान्य चिकित्सक",
    cardiology: "हृदय रोग",
    dermatology: "त्वचा रोग",
    pediatrics: "बाल रोग",
    gynecology: "स्त्री रोग",
    orthopedics: "हड्डी रोग",
    neurology: "तंत्रिका रोग",
    psychiatry: "मानसिक स्वास्थ्य",
    dentistry: "दंत चिकित्सा",
    other: "अन्य",
    healthProfile: "स्वास्थ्य प्रोफ़ाइल",
    optional: "यह जानकारी वैकल्पिक है। आप इसे बाद में भी दे सकते हैं।",
    bloodGroup: "ब्लड ग्रुप",
    selectBlood: "यदि पता हो तो चुनें",
    unknown: "पता नहीं",
    city: "शहर",
    yourCity: "अपने शहर का नाम",
    address: "पता",
    addressPlaceholder: "मकान, सड़क और क्षेत्र",
    secure: "अपने खाते को सुरक्षित करें",
    password: "पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षर",
    confirmPassword: "पासवर्ड फिर से लिखें",
    confirmPlaceholder: "पासवर्ड दोबारा लिखें",
    showPassword: "पासवर्ड दिखाएँ",
    hidePassword: "पासवर्ड छिपाएँ",
    createPatient: "मरीज का खाता बनाएँ",
    createDoctor: "डॉक्टर का खाता बनाएँ",
    creating: "खाता बन रहा है...",
    already: "पहले से खाता है?",
    login: "लॉग इन करें",
    mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    registrationFailed: "रजिस्ट्रेशन नहीं हुआ। फिर से कोशिश करें।",
    backend: "बैकएंड से कनेक्ट नहीं हो पा रहा है। कृपया सर्वर चालू करें।",
    error: "कुछ गलत हुआ। फिर से कोशिश करें।",
    footer: "मरीजों की देखभाल हमारी प्राथमिकता",
  },

  bn: {
    title: "আপনার অ্যাকাউন্ট তৈরি করুন",
    subtitle: "রোগী ও স্বাস্থ্যকর্মীদের সংযুক্ত করার সহজ উপায়। আপনার অ্যাকাউন্টের ধরন বেছে নিন।",
    patient: "রোগী", doctor: "চিকিৎসক",
    forPatient: "রোগীদের জন্য", forDoctor: "চিকিৎসকদের জন্য",
    patientTitle: "আপনার স্বাস্থ্য, আপনার যাত্রা।",
    doctorTitle: "যত্ন শুরু হয় সংযোগ থেকে।",
    patientDesc: "আপনার তথ্য ও স্বাস্থ্য সমস্যা শেয়ার করে পরামর্শের প্রস্তুতি নিন।",
    doctorDesc: "রোগীদের সাহায্য করার জন্য আপনার পেশাগত প্রোফাইল তৈরি করুন।",
    patientBenefits: ["নিজের তথ্য গুছিয়ে রাখুন", "প্রয়োজনে স্বাস্থ্য তথ্য শেয়ার করুন", "পরামর্শের জন্য প্রস্তুত হন"],
    doctorBenefits: ["পেশাগত প্রোফাইল তৈরি করুন", "যোগ্যতা ও বিশেষজ্ঞতা দিন", "রোগীদের প্রস্তুত হতে সাহায্য করুন"],
    infoTitle: "আপনার তথ্য গুরুত্বপূর্ণ",
    infoDesc: "যে তথ্য শেয়ার করতে স্বচ্ছন্দ, শুধু সেটিই দিন। স্বাস্থ্য তথ্য নিরাপদে রাখুন।",
    signup: "সাইন আপ", selectType: "আপনার অ্যাকাউন্টের ধরন বেছে নিন।",
    personal: "ব্যক্তিগত তথ্য", professional: "ব্যক্তিগত ও পেশাগত তথ্য",
    fullName: "পুরো নাম", enterName: "আপনার পুরো নাম লিখুন",
    email: "ইমেল ঠিকানা", phone: "ফোন নম্বর", enterPhone: "ফোন নম্বর লিখুন",
    dob: "জন্মতারিখ", registration: "মেডিকেল রেজিস্ট্রেশন নম্বর",
    enterRegistration: "রেজিস্ট্রেশন নম্বর লিখুন",
    gender: "লিঙ্গ", selectGender: "লিঙ্গ বেছে নিন",
    male: "পুরুষ", female: "মহিলা", preferNot: "বলতে চাই না",
    specialization: "বিশেষজ্ঞতা", selectSpecialization: "বিশেষজ্ঞতা বেছে নিন",
    general: "সাধারণ চিকিৎসক", cardiology: "হৃদরোগ", dermatology: "চর্মরোগ",
    pediatrics: "শিশুরোগ", gynecology: "স্ত্রীরোগ", orthopedics: "অস্থিরোগ",
    neurology: "স্নায়ুরোগ", psychiatry: "মনোরোগ", dentistry: "দন্তচিকিৎসা", other: "অন্যান্য",
    healthProfile: "স্বাস্থ্য প্রোফাইল",
    optional: "ঐচ্ছিক। পরে এই তথ্য দিতে পারবেন।",
    bloodGroup: "রক্তের গ্রুপ", selectBlood: "জানা থাকলে বেছে নিন",
    unknown: "জানি না", city: "শহর", yourCity: "আপনার শহর",
    address: "ঠিকানা", addressPlaceholder: "বাড়ি, রাস্তা ও এলাকা",
    secure: "আপনার অ্যাকাউন্ট সুরক্ষিত করুন",
    password: "পাসওয়ার্ড", passwordPlaceholder: "অন্তত ৮টি অক্ষর",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন", confirmPlaceholder: "আবার পাসওয়ার্ড লিখুন",
    showPassword: "পাসওয়ার্ড দেখান", hidePassword: "পাসওয়ার্ড লুকান",
    createPatient: "রোগীর অ্যাকাউন্ট তৈরি করুন", createDoctor: "চিকিৎসকের অ্যাকাউন্ট তৈরি করুন",
    creating: "অ্যাকাউন্ট তৈরি হচ্ছে...", already: "আগে থেকেই অ্যাকাউন্ট আছে?",
    login: "লগ ইন", mismatch: "দুটি পাসওয়ার্ড মেলেনি।",
    registrationFailed: "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    backend: "সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না।", error: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    footer: "রোগী-প্রথম স্বাস্থ্যসেবা",
  },
};

const aliases = {
  english: "en", hindi: "hi", bengali: "bn", bangla: "bn",
  marathi: "mr", telugu: "te", tamil: "ta", gujarati: "gu",
  kannada: "kn", malayalam: "ml", punjabi: "pa",
};

function getLanguageCode(value) {
  const code = String(value || "en").toLowerCase();
  return aliases[code] || code;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
  children,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#A45D36]">*</span>}
      </label>

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = getLanguageCode(sessionStorage.getItem("medikioskLanguage"));
    return saved;
  });

  // Languages without a full signup translation currently use English.
  const t = translations[selectedLanguage] || translations.en;
  const isPatient = role === "patient";

  function changeLanguage(language) {
    const code = getLanguageCode(language);
    setSelectedLanguage(code);
    sessionStorage.setItem("medikioskLanguage", code);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("password") !== data.get("confirmPassword")) {
      setMessage(t.mismatch);
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: data.get("fullName"),
        email: data.get("email"),
        phone: data.get("phone"),
        password: data.get("password"),
        role,
      };

      if (role === "patient") {
        payload.dateOfBirth = data.get("dateOfBirth");
        payload.gender = data.get("gender");
        payload.bloodGroup = data.get("bloodGroup");
        payload.city = data.get("city");
        payload.address = data.get("address");
      } else {
        payload.medicalRegistrationNumber = data.get("registrationNumber");
        payload.specialization = data.get("specialization");
      }

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || t.registrationFailed);
      }

      form.reset();

      if (role === "patient") {
        navigate("/patient/dashboard");
      } else {
        navigate("/doctor/dashboard");
      }

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      if (
        error instanceof TypeError ||
        error.message === "Failed to fetch"
      ) {
        setMessage(t.backend);
      } else {
        setMessage(error.message || t.error);
      }

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const specialties = [
    ["general-physician", t.general],
    ["cardiology", t.cardiology || "Cardiology"],
    ["dermatology", t.dermatology || "Dermatology"],
    ["pediatrics", t.pediatrics || "Pediatrics"],
    ["gynecology", t.gynecology || "Gynecology"],
    ["orthopedics", t.orthopedics || "Orthopedics"],
    ["neurology", t.neurology || "Neurology"],
    ["psychiatry", t.psychiatry || "Psychiatry"],
    ["dentistry", t.dentistry || "Dentistry"],
    ["other", t.other],
  ];

  return (
  <main className="relative min-h-screen overflow-hidden bg-[#F8F7F1] px-0 py-0">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#DDEAE1]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#F2E2D6]/60 blur-3xl" />

     <div className="relative w-full">
  <MediKioskHeader
    selectedLanguage={selectedLanguage}
    onLanguageChange={changeLanguage}
  />

  <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="mb-9 mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#214A43] sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#627C74] sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-[#E3E9E0] bg-white shadow-xl shadow-[#214A43]/5 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="relative overflow-hidden bg-[#214A43] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                {isPatient ? <HeartPulse size={30} /> : <Stethoscope size={30} />}
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#B8D8C5]">
                {isPatient ? t.forPatient : t.forDoctor}
              </p>

              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                {isPatient ? t.patientTitle : t.doctorTitle}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
                {isPatient ? t.patientDesc : t.doctorDesc}
              </p>

              <div className="mt-9 space-y-4">
                {(isPatient ? t.patientBenefits : t.doctorBenefits).map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#B8D8C5]" />
                    <p className="text-sm leading-6 text-white/90">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={23} className="mt-0.5 shrink-0 text-[#B8D8C5]" />
                  <div>
                    <p className="font-semibold">{t.infoTitle}</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">{t.infoDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="p-5 sm:p-9 lg:p-12">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#214A43]">{t.signup}</h2>
              <p className="mt-2 text-sm text-[#789087]">{t.selectType}</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl bg-[#F4F7F2] p-2">
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setMessage("");
                }}
                aria-pressed={isPatient}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition-all ${
                  isPatient
                    ? "bg-[#47796F] text-white shadow-md"
                    : "text-[#52746D] hover:bg-white"
                }`}
              >
                <UserRound size={19} />
                {t.patient}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("doctor");
                  setMessage("");
                }}
                aria-pressed={!isPatient}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition-all ${
                  !isPatient
                    ? "bg-[#47796F] text-white shadow-md"
                    : "text-[#52746D] hover:bg-white"
                }`}
              >
                <Stethoscope size={19} />
                {t.doctor}
              </button>
            </div>

            <form key={role} onSubmit={handleSubmit} className="space-y-7">
              <div>
                <h3 className="mb-4 text-base font-bold text-[#214A43]">
                  {isPatient ? t.personal : t.professional}
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label={t.fullName} name="fullName" placeholder={t.enterName} autoComplete="name" required />
                  <Field label={t.email} name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                  <Field label={t.phone} name="phone" type="tel" placeholder={t.enterPhone} autoComplete="tel" required />

                  {isPatient ? (
                    <Field label={t.dob} name="dateOfBirth" type="date" required />
                  ) : (
                    <Field label={t.registration} name="registrationNumber" placeholder={t.enterRegistration} required />
                  )}

                  {isPatient ? (
                    <Field label={t.gender} name="gender" required>
                      <select id="gender" name="gender" className={inputClass} defaultValue="" required>
                        <option value="" disabled>{t.selectGender}</option>
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                        <option value="prefer not say">{t.preferNot}</option>
                      </select>
                    </Field>
                  ) : (
                    <Field label={t.specialization} name="specialization" required>
                      <select id="specialization" name="specialization" className={inputClass} defaultValue="" required>
                        <option value="" disabled>{t.selectSpecialization}</option>
                        {specialties.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>
              </div>

              {isPatient && (
                <div className="border-t border-[#E8EDE7] pt-6">
                  <h3 className="mb-2 text-base font-bold text-[#214A43]">{t.healthProfile}</h3>
                  <p className="mb-4 text-xs leading-5 text-[#789087]">{t.optional}</p>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label={t.bloodGroup} name="bloodGroup">
                      <select id="bloodGroup" name="bloodGroup" className={inputClass} defaultValue="">
                        <option value="">{t.selectBlood}</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                        <option value="unknown">{t.unknown}</option>
                      </select>
                    </Field>

                    <Field label={t.city} name="city" placeholder={t.yourCity} autoComplete="address-level2" />

                    <div className="sm:col-span-2">
                      <Field label={t.address} name="address" placeholder={t.addressPlaceholder} autoComplete="street-address" />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-[#E8EDE7] pt-6">
                <h3 className="mb-4 text-base font-bold text-[#214A43]">{t.secure}</h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label={t.password} name="password" required>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder={t.passwordPlaceholder}
                        required
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? t.hidePassword : t.showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </Field>

                  <Field label={t.confirmPassword} name="confirmPassword" required>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder={t.confirmPlaceholder}
                        required
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? t.hidePassword : t.showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                      >
                        {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`rounded-xl p-4 text-sm leading-6 ${
                    messageType === "success"
                      ? "bg-[#E6F3E9] text-[#245E43]"
                      : "bg-[#FBE9E5] text-[#9D4337]"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#47796F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#47796F]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#315E54] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? t.creating
                  : isPatient
                    ? t.createPatient
                    : t.createDoctor}
                <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-center text-sm text-[#789087]">
                {t.already}{" "}
                <Link to="/login" className="font-bold text-[#47796F] hover:text-[#214A43]">
                  {t.login}
                </Link>
              </p>
            </form>
          </section>
        </div>

        <p className="mt-7 text-center text-xs text-[#8AA097]">
          © {new Date().getFullYear()} MediKiosk · {t.footer}
        </p>
      </div>
    </div>
    </main>
  );
}
