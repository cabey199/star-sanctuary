import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageContent } from "../../shared/types";

interface LanguageContextType {
  language: "en" | "am" | "ar";
  setLanguage: (lang: "en" | "am" | "ar") => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Comprehensive translations for the booking platform
const translations: LanguageContent = {
  // Navigation & Common
  "nav.home": {
    en: "Home",
    am: "ቤት",
    ar: "الرئيسية",
  },
  "nav.dashboard": {
    en: "Dashboard",
    am: "ዳሽቦርድ",
    ar: "لوحة التحكم",
  },
  "nav.settings": {
    en: "Settings",
    am: "ቅንብሮች",
    ar: "الإعدادات",
  },
  "nav.logout": {
    en: "Logout",
    am: "ውጣ",
    ar: "تسجيل الخروج",
  },
  "nav.login": {
    en: "Login",
    am: "ግባ",
    ar: "تسجيل الدخول",
  },

  // Common Actions
  "action.save": {
    en: "Save",
    am: "አስቀምጥ",
    ar: "حفظ",
  },
  "action.cancel": {
    en: "Cancel",
    am: "ሰርዝ",
    ar: "إلغاء",
  },
  "action.delete": {
    en: "Delete",
    am: "ሰርዝ",
    ar: "حذف",
  },
  "action.edit": {
    en: "Edit",
    am: "አርም",
    ar: "تحرير",
  },
  "action.add": {
    en: "Add",
    am: "ጨምር",
    ar: "إضافة",
  },
  "action.create": {
    en: "Create",
    am: "ፍጠር",
    ar: "إنشاء",
  },
  "action.update": {
    en: "Update",
    am: "ሓድስ",
    ar: "تحديث",
  },
  "action.view": {
    en: "View",
    am: "ተመልከት",
    ar: "عرض",
  },
  "action.manage": {
    en: "Manage",
    am: "አስተዳድር",
    ar: "إدارة",
  },

  // Home Page
  "home.title": {
    en: "BookingWithCal",
    am: "ቡኪንግ ዊዝ ካል",
    ar: "بوكينغ ويذ كال",
  },
  "home.subtitle": {
    en: "The complete multi-client booking platform for small businesses",
    am: "ለትንንሽ ንግዶች ሙሉ በሙሉ የደንበኞች ቦታ የማስያዝ መድረክ",
    ar: "منصة الحجز متعددة العملاء الكاملة للشركات الصغيرة",
  },
  "home.description": {
    en: "Create unlimited booking pages for barbers, salons, tattoo studios, and more.",
    am: "ለፀጉር አስተካካዮች፣ ሳሎኖች፣ ወዘተ ያልተገደበ የማስያዝ ገጾች ይፍጠሩ።",
    ar: "أنشئ صفحات حجز غير محدودة للحلاقين والصالونات واستوديوهات الوشم والمزيد.",
  },
  "home.cta.admin": {
    en: "Access Admin Dashboard",
    am: "የአስተዳዳሪ ዳሽቦርድ ይድረሱ",
    ar: "الوصول إلى لوحة تحكم المشرف",
  },
  "home.cta.demo": {
    en: "View Demo Booking Page",
    am: "የማሳያ ማስያዝ ገጽ ተመልከቱ",
    ar: "عرض صفحة الحجز التجريبية",
  },

  // Features
  "features.title": {
    en: "Everything you need to manage bookings",
    am: "ማስያዝን ለማስተዳደር የሚያስፈልግዎት ሁሉም ነገር",
    ar: "كل ما تحتاجه لإدارة الحجوزات",
  },
  "features.subtitle": {
    en: "Scale from 1 to 100+ client businesses with our powerful booking platform",
    am: "በኛ ኃይለኛ የማስያዝ መድረክ ከ1 እስከ 100+ የደንበኛ ንግዶች ይመዝኑ",
    ar: "توسع من عميل واحد إلى أكثر من 100 عميل تجاري مع منصة الحجز القوية الخاصة بنا",
  },
  "features.booking.title": {
    en: "Beautiful Booking Pages",
    am: "ያማምሩ የማስያዝ ገጾች",
    ar: "صفحات حجز جميلة",
  },
  "features.booking.description": {
    en: "Each client gets a custom branded booking page with service selection, provider choice, and seamless scheduling",
    am: "እያንዳንዱ ደንበኛ የአገልግሎት ምርጫ፣ አቅራቢ ምርጫ፣ እና ቀላል ማቀድ ያለው ብጁ ምልክት የተደረገበት የማስያዝ ገጽ ያገኛል",
    ar: "يحصل كل عميل على صفحة حجز مخصصة بعلامته التجارية مع اختيار الخدمة ومقدم الخدمة والجدولة السلسة",
  },
  "features.dashboard.title": {
    en: "Secure Dashboards",
    am: "ደህንነት ያላቸው ዳሽቦርዶች",
    ar: "لوحات تحكم آمنة",
  },
  "features.dashboard.description": {
    en: "Business owners get private dashboards to view bookings, manage schedules, and track their business",
    am: "የንግድ ባለቤቶች ማስያዝን ለመመልከት፣ ማቀዶችን ለማስተዳደር እና ንግዳቸውን ለመከታተል የግል ዳሽቦርዶች ያገኛሉ",
    ar: "يحصل أصحاب الأعمال على لوحات تحكم خاصة لعرض الحجوزات وإدارة الجداول وتتبع أعمالهم",
  },
  "features.notifications.title": {
    en: "Automated Notifications",
    am: "ራስ-ሰር ማሳወቂያዎች",
    ar: "إشعارات تلقائية",
  },
  "features.notifications.description": {
    en: "Automatic email notifications to business owners when bookings are made, with customer details and scheduling info",
    am: "ማስያዝ ሲደረግ ለንግድ ባለቤቶች የደንበኛ ዝርዝሮች እና የማቀድ መረጃ ያለው ራስ-ሰር ኢሜይል ማሳወቂያዎች",
    ar: "إشعارات بريد إلكتروني تلقائية لأصحاب الأعمال عند إجراء الحجوزات، مع تفاصيل العملاء ومعلومات الجدولة",
  },

  // Admin Dashboard
  "admin.title": {
    en: "Admin Dashboard",
    am: "የአስተዳዳሪ ዳሽቦርድ",
    ar: "لوحة تحكم المشرف",
  },
  "admin.welcome": {
    en: "Welcome",
    am: "እንኳን ደህና መጡ",
    ar: "مرحباً",
  },
  "admin.master": {
    en: "Master Admin",
    am: "ዋና አስተዳዳሪ",
    ar: "مشرف رئيسي",
  },
  "admin.subadmin": {
    en: "Subadmin",
    am: "ንዑስ አስተዳዳሪ",
    ar: "مشرف فرعي",
  },
  "admin.businesses.title": {
    en: "Client Businesses",
    am: "የደንበኛ ንግዶች",
    ar: "أعمال العملاء",
  },
  "admin.businesses.all": {
    en: "All Client Businesses",
    am: "ሁሉም የደንበኛ ንግዶች",
    ar: "جميع أعمال العملاء",
  },
  "admin.businesses.your": {
    en: "Your Client Businesses",
    am: "የእርስዎ የደንበኛ ንግዶች",
    ar: "أعمال عملائك",
  },
  "admin.businesses.manage": {
    en: "Manage all businesses on the platform",
    am: "በመድረኩ ላይ ያሉትን ሁሉንም ንግዶች ያስተዳድሩ",
    ar: "إدارة جميع الأعمال على المنصة",
  },
  "admin.businesses.manage.own": {
    en: "Manage the businesses you've added to the platform",
    am: "በመድረኩ ላይ ያከሉዋቸውን ንግዶች ያስተዳድሩ",
    ar: "إدارة الأعمال التي أضفتها إلى المنصة",
  },
  "admin.businesses.add": {
    en: "Add New Business",
    am: "አዲስ ንግድ ጨምር",
    ar: "إضافة عمل جديد",
  },
  "admin.businesses.none": {
    en: "No businesses yet",
    am: "ገና ንግዶች የሉም",
    ar: "لا توجد أعمال بعد",
  },
  "admin.businesses.none.description": {
    en: "Start by creating your first business on the platform",
    am: "በመድረኩ ላይ የመጀመሪያ ንግድዎን በመፍጠር ይጀምሩ",
    ar: "ابدأ بإنشاء عملك الأول على المنصة",
  },
  "admin.businesses.none.own": {
    en: "No businesses added yet",
    am: "ገና ንግዶች አልተጨመሩም",
    ar: "لم تتم إضافة أعمال بعد",
  },
  "admin.businesses.none.own.description": {
    en: "Add your first client business to get started",
    am: "ለመጀመር የመጀመሪያ የደንበኛ ንግድዎን ያክሉ",
    ar: "أضف عمل عميلك الأول للبدء",
  },

  // Booking Page
  "booking.title": {
    en: "Book an Appointment",
    am: "ቀጠሮ ይያዙ",
    ar: "احجز موعداً",
  },
  "booking.service.select": {
    en: "Select a Service",
    am: "አገልግሎት ይምረጡ",
    ar: "اختر خدمة",
  },
  "booking.provider.select": {
    en: "Choose Provider",
    am: "አቅራቢ ይምረጡ",
    ar: "اختر مقدم الخدمة",
  },
  "booking.date.select": {
    en: "Select Date",
    am: "ቀን ይምረጡ",
    ar: "اختر التاريخ",
  },
  "booking.time.select": {
    en: "Choose Time",
    am: "ሰዓት ይምረጡ",
    ar: "اختر الوقت",
  },
  "booking.details": {
    en: "Your Details",
    am: "የእርስዎ ዝርዝሮች",
    ar: "تفاصيلك",
  },
  "booking.name": {
    en: "Full Name",
    am: "ሙሉ ስም",
    ar: "الاسم الكامل",
  },
  "booking.email": {
    en: "Email Address",
    am: "የኢሜይል አድራሻ",
    ar: "عنوان البريد الإلكتروني",
  },
  "booking.phone": {
    en: "Phone Number",
    am: "የስልክ ቁጥር",
    ar: "رقم الهاتف",
  },
  "booking.notes": {
    en: "Special Notes (Optional)",
    am: "ልዩ ማስታወሻዎች (አማራጭ)",
    ar: "ملاحظات خاصة (اختياري)",
  },
  "booking.confirm": {
    en: "Confirm Booking",
    am: "ማስያዝን አረጋግጥ",
    ar: "تأكيد الحجز",
  },
  "booking.success": {
    en: "Booking Confirmed!",
    am: "ማስያዝ ተረጋግጧል!",
    ar: "تم تأكيد الحجز!",
  },
  "booking.flexible.title": {
    en: "Flexible Duration - Time To Be Confirmed",
    am: "ተለዋዋጭ ቆይታ - ሰዓት ለመረጋገጥ",
    ar: "مدة مرنة - الوقت قيد التأكيد",
  },
  "booking.flexible.description": {
    en: "This service requires manual scheduling. We'll review your request and confirm the exact time and final pricing within 24 hours.",
    am: "ይህ አገልግሎት ማኑዋል መርሐ ግብር ይፈልጋል። የእርስዎን ጥያቄ እንገመግማለን እና በ24 ሰዓታት ውስጥ ትክክለኛውን ሰዓት እና የመጨረሻውን ዋጋ እናረጋግጣለን።",
    ar: "تتطلب هذه الخدمة جدولة يدوية. سنراجع طلبك ونؤكد الوقت الدقيق والسعر النهائي خلال 24 ساعة.",
  },

  // Time & Date
  "time.am": {
    en: "AM",
    am: "ጠዋት",
    ar: "ص",
  },
  "time.pm": {
    en: "PM",
    am: "ቀትር",
    ar: "م",
  },
  "date.today": {
    en: "Today",
    am: "ዛሬ",
    ar: "اليوم",
  },
  "date.tomorrow": {
    en: "Tomorrow",
    am: "ነገ",
    ar: "غداً",
  },
  "date.monday": {
    en: "Monday",
    am: "ሰኞ",
    ar: "الاثنين",
  },
  "date.tuesday": {
    en: "Tuesday",
    am: "ማክሰኞ",
    ar: "الثلاثاء",
  },
  "date.wednesday": {
    en: "Wednesday",
    am: "ረቡዕ",
    ar: "الأربعاء",
  },
  "date.thursday": {
    en: "Thursday",
    am: "ሐሙስ",
    ar: "الخميس",
  },
  "date.friday": {
    en: "Friday",
    am: "አርብ",
    ar: "الجمعة",
  },
  "date.saturday": {
    en: "Saturday",
    am: "ቅዳሜ",
    ar: "السبت",
  },
  "date.sunday": {
    en: "Sunday",
    am: "እሁድ",
    ar: "الأحد",
  },

  // Messages
  "message.loading": {
    en: "Loading...",
    am: "በመጫን ላይ...",
    ar: "جارٍ التحميل...",
  },
  "message.error": {
    en: "An error occurred",
    am: "ስህተት ተከስቷል",
    ar: "حدث خطأ",
  },
  "message.success": {
    en: "Success",
    am: "ተሳክቷል",
    ar: "نجح",
  },
  "message.no.data": {
    en: "No data available",
    am: "ምንም መረጃ የለም",
    ar: "لا توجد بيانات متاحة",
  },

  // Currency
  "currency.etb": {
    en: "ETB",
    am: "ብር",
    ar: "بر",
  },

  // Status
  "status.active": {
    en: "Active",
    am: "ንቁ",
    ar: "نشط",
  },
  "status.inactive": {
    en: "Inactive",
    am: "ቦዝና",
    ar: "غير نشط",
  },
  "status.confirmed": {
    en: "Confirmed",
    am: "ተረጋግጧል",
    ar: "مؤكد",
  },
  "status.pending": {
    en: "Pending",
    am: "በመጠባበቅ ላይ",
    ar: "قيد الانتظار",
  },
  "status.cancelled": {
    en: "Cancelled",
    am: "ተሰርዟል",
    ar: "ملغى",
  },

  // Settings
  "settings.profile": {
    en: "Profile",
    am: "መገለጫ",
    ar: "الملف الشخصي",
  },
  "settings.notifications": {
    en: "Notifications",
    am: "ማሳወቂያዎች",
    ar: "الإشعارات",
  },
  "settings.security": {
    en: "Security",
    am: "ደህንነት",
    ar: "الأمان",
  },
  "settings.language": {
    en: "Language",
    am: "ቋንቋ",
    ar: "اللغة",
  },
  "settings.timezone": {
    en: "Timezone",
    am: "የሰዓት ዞን",
    ar: "المنطقة الزمنية",
  },

  // Reviews
  "reviews.title": {
    en: "Customer Reviews",
    am: "የደንበኞች ግምገማዎች",
    ar: "تقييمات العملاء",
  },
  "reviews.rating": {
    en: "Rating",
    am: "ደረጃ",
    ar: "التقييم",
  },
  "reviews.comment": {
    en: "Comment",
    am: "አስተያየት",
    ar: "تعليق",
  },
  "reviews.submit": {
    en: "Submit Review",
    am: "ግምገማ ላክ",
    ar: "إرسال التقييم",
  },

  // Footer
  "footer.powered.by": {
    en: "Powered by",
    am: "የተሰራው በ",
    ar: "مشغل بواسطة",
  },
  "footer.rights": {
    en: "All rights reserved",
    am: "ሁሉም መብቶች የተጠበቁ ናቸው",
    ar: "جميع الحقوق محفوظة",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<"en" | "am" | "ar">("en");

  useEffect(() => {
    // Load saved language or detect from browser
    const savedLanguage = localStorage.getItem("language") as
      | "en"
      | "am"
      | "ar"
      | null;
    const browserLanguage = navigator.language.split("-")[0];

    let initialLanguage: "en" | "am" | "ar" = "en";

    if (savedLanguage && ["en", "am", "ar"].includes(savedLanguage)) {
      initialLanguage = savedLanguage;
    } else if (browserLanguage === "ar") {
      initialLanguage = "ar";
    } else if (browserLanguage === "am") {
      initialLanguage = "am";
    }

    setLanguageState(initialLanguage);
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr";
  }, []);

  const setLanguage = (lang: "en" | "am" | "ar") => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const isRTL = language === "ar";

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
