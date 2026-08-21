import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface I18nContextType {
  language: Language;
  direction: Direction;
  isArabic: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Common
    'brand.title': 'Dubai Staff Transport',
    'brand.subtitle': 'Enterprise Staff Transport & Fleet Management',
    'brand.badge': 'UAE',
    'rta.certified': 'RTA Certified Commercial Transport Operator',
    'control.room.247': '24/7 Operations Control: +971 4 388 9000',
    'portal.link': 'TMS Portal',
    'quote.request': 'Request a Quote',
    'explore.services': 'Explore Services',
    'explore.fleet': 'Explore Fleet',
    'explore.platform': 'Explore Platform',
    'learn.more': 'Learn More',
    'get.in.touch': 'Get in Touch',
    'submit.inquiry': 'Submit Inquiry',
    'submit.quote': 'Submit Quotation Request',
    'submit.application': 'Submit Application',
    'contact.us': 'Contact Us',

    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.fleet': 'Fleet',
    'nav.industries': 'Industries',
    'nav.safety': 'Safety & Standards',
    'nav.technology': 'Technology',
    'nav.clients': 'Clients',
    'nav.about': 'About Us',
    'nav.careers': 'Careers',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact & Quote',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Transport',
    'nav.signIn': 'Sign In',

    // Hero Section
    'hero.eyebrow': 'Commercial Staff & Corporate Transportation in Dubai & UAE',
    'hero.title': 'Safe, Reliable & Technology-Enabled Staff Transport Across Dubai',
    'hero.desc': 'Dedicated daily employee commute, executive transfers, and industrial workforce logistics backed by live GPS telematics, professional certified drivers, and 99.2% on-time dispatch guarantee.',
    'hero.stats.exp': 'Years Experience',
    'hero.stats.fleet': 'Modern Vehicles',
    'hero.stats.trips': 'Daily Trips',
    'hero.stats.clients': 'Corporate Clients',
    'hero.stats.ontime': 'On-Time Dispatch',

    // Services
    'services.badge': 'Comprehensive Fleet Solutions',
    'services.title': 'Tailored Transportation Services for Dubai Enterprises',
    'services.subtitle': 'From high-density daily shift shuttles to executive corporate transfers, our managed fleet connects your workforce seamlessly across all UAE Emirates.',
    'service.staff.title': 'Employee Staff Transportation',
    'service.staff.desc': 'Scheduled point-to-point daily transportation connecting employee residential communities with business districts and industrial hubs.',
    'service.shuttle.title': 'Corporate Shuttle Services',
    'service.shuttle.desc': 'Recurring inter-campus, metro-feeder, and commercial cluster shuttle loops tailored to your business working hours.',
    'service.pickup.title': 'Employee Pickup & Drop',
    'service.pickup.desc': 'Customized multi-point neighborhood routing ensuring safe and punctual doorstep or community hub pickup for your team.',
    'service.shift.title': 'Shift Transportation',
    'service.shift.desc': 'Round-the-clock 2-shift and 3-shift workforce transfers engineered for manufacturing, healthcare, aviation, and hospitality.',
    'service.custom.title': 'Customized Fleet Transport',
    'service.custom.desc': 'Dedicated client-branded coaches, private contracts, and bespoke route design aligned with corporate SLAs.',
    'service.mgmt.title': 'Transport Management Outsourcing',
    'service.mgmt.desc': 'End-to-end management covering route planning, live telematics, compliance permits, fuel management, and driver scheduling.',

    // Fleet
    'fleet.badge': 'Modern Commercial Fleet',
    'fleet.title': 'Engineered for Safety, Reliability & Comfort',
    'fleet.subtitle': 'Fully air-conditioned, RTA-certified commercial vehicles equipped with dual cooling, GPS telematics, speed governors, and modern safety features.',

    // Industries
    'industries.badge': 'Specialized Sector Solutions',
    'industries.title': 'Adapting Transport to Your Industry Needs',
    'industries.subtitle': 'Solving shift logistics, remote site commutes, and multi-tier corporate mobility challenges across diverse UAE industries.',

    // Safety
    'safety.badge': 'Safety First Philosophy',
    'safety.title': 'Uncompromising Safety Standards on Every Kilometer',
    'safety.subtitle': 'Our rigorous 6-pillar safety framework combines certified driver training, preventive vehicle engineering, real-time telemetry, and full regulatory compliance.',

    // Technology
    'tech.badge': 'Intelligent Operations',
    'tech.title': 'Technology-Driven Fleet Management & Live Telematics',
    'tech.subtitle': 'Our proprietary Transport Management System (TMS) enables real-time GPS fleet monitoring, computerized shift scheduling, and full operational transparency.',

    // Footer
    'footer.desc': "Dubai's premier commercial corporate transportation management system. Dedicated daily employee commute, airport logistics, industrial shuttles, and luxury coaches.",
    'footer.services': 'Transportation Services',
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.corridors': 'Key UAE Corridors',
    'footer.rights': 'Dubai Staff Transport Operations LLC. All rights reserved.',

    // TMS Modules & Operations
    'tms.tracking': 'Fleet Live Tracking',
    'tms.tracking.desc': 'Live GPS telemetry, corridor transit monitoring & speed telemetry',
    'tms.maintenance': 'Fleet Maintenance',
    'tms.maintenance.desc': 'Preventive work orders, service records & garage logs',
    'tms.documents': 'Document Vault',
    'tms.documents.desc': 'Mulkiya registrations, RTA permits, insurance & corporate contracts',
    'tms.compliance': 'Compliance Center',
    'tms.compliance.desc': 'RTA regulatory alignment, document expiry watchdog & audit exports',
    'tms.notifications': 'Notifications & Alerts',
    'tms.notifications.desc': 'Real-time operational alerts, trip delays & compliance notifications',
    'tms.simulated_telematics': 'Simulated Telematics Active',
    'tms.simulated_desc': 'Virtual GPS telemetry generated for demonstration & development',
    'status.valid': 'Valid',
    'status.expiring_soon': 'Expiring Soon',
    'status.expired': 'Expired',
    'status.scheduled': 'Scheduled',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
  },
  ar: {
    // Brand & Common
    'brand.title': 'مواصلات موظفي دبي',
    'brand.subtitle': 'إدارة نقل الموظفين والأساطيل المؤسسية',
    'brand.badge': 'الإمارات',
    'rta.certified': 'مشغل نقل تجاري مرخص ومعتمد من هيئة الطرق والمواصلات',
    'control.room.247': 'غرفة التحكم والعمليات على مدار الساعة: 9000 388 4 971+',
    'portal.link': 'بوابة النظام (TMS)',
    'quote.request': 'طلب عرض أسعار',
    'explore.services': 'استكشف الخدمات',
    'explore.fleet': 'استكشف الأسطول',
    'explore.platform': 'استكشف المنصة',
    'learn.more': 'معرفة المزيد',
    'get.in.touch': 'تواصل معنا',
    'submit.inquiry': 'إرسال الاستفسار',
    'submit.quote': 'إرسال طلب التسعير',
    'submit.application': 'تقديم طلب التوظيف',
    'contact.us': 'اتصل بنا',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.fleet': 'الأسطول',
    'nav.industries': 'القطاعات',
    'nav.safety': 'السلامة والمعايير',
    'nav.technology': 'التقنية والأنظمة',
    'nav.clients': 'عملاؤنا',
    'nav.about': 'عن الشركة',
    'nav.careers': 'الوظائف',
    'nav.gallery': 'معرض الصور',
    'nav.contact': 'اتصل بنا وعروض الأسعار',
    'nav.privacy': 'سياسة الخصوصية',
    'nav.terms': 'شروط النقل',
    'nav.signIn': 'تسجيل الدخول',

    // Hero Section
    'hero.eyebrow': 'نقل موظفي الشركات والمنشآت التجارية في دبي والإمارات',
    'hero.title': 'حلول نقل موظفين آمنة وموثوقة ومدعومة بالتكنولوجيا في كافة أنحاء دبي',
    'hero.desc': 'نقل يومي منتظم للموظفين، تنقلات تنفيذية لكبار الشخصيات، وحلول لوجستية لنقل القوى العاملة الصناعية مدعومة بتتبع GPS المباشر وسائقين محترفين معتمدين مع ضمان دقة المواعيد بنسبة 99.2٪.',
    'hero.stats.exp': 'سنوات خبرة',
    'hero.stats.fleet': 'حافلة ومركبة حديثة',
    'hero.stats.trips': 'رحلة يومية',
    'hero.stats.clients': 'شركة ومؤسسة متعاقدة',
    'hero.stats.ontime': 'التزام بالمواعيد',

    // Services
    'services.badge': 'حلول نقل شاملة',
    'services.title': 'خدمات نقل مخصصة لشركات ومؤسسات دبي',
    'services.subtitle': 'من رحلات نقل المناوبات الكثيفة إلى التنقلات التنفيذية الفاخرة، يربط أسطولنا موظفيك بمرونة وكفاءة عبر جميع إمارات الدولة.',
    'service.staff.title': 'نقل الموظفين والعمال اليومي',
    'service.staff.desc': 'رحلات منتظمة ومجدولة تربط المجمعات السكنية للموظفين بمناطق الأعمال والمراكز الصناعية بدقة وسلاسة.',
    'service.shuttle.title': 'خدمات الحافلات الترددية للشركات',
    'service.shuttle.desc': 'حافلات ترددية منتظمة بين فروع الشركات، محطات المترو، والمجمعات التجارية مصممة وفق أوقات دوام موظفيك.',
    'service.pickup.title': 'نقل وتوصيل الموظفين المخصص',
    'service.pickup.desc': 'مسارات متعددة النقاط عبر الأحياء السكنية لضمان راحة وسلامة وصول كل موظف إلى مقر عمله في الموعد المحدد.',
    'service.shift.title': 'نقل مناوبات العمل (24/7)',
    'service.shift.desc': 'نقل مدار الساعة بنظام الورديتين أو الثلاث ورديات مصمم لمصانع الإنتاج، المستشفيات، الطيران، وقطاع الضيافة.',
    'service.custom.title': 'عقود النقل المخصصة',
    'service.custom.desc': 'حافلات مخصصة بهوية شركتكم، عقود مرنة قصيرة وطويلة الأجل، ومسارات مصممة بدقة حسب اتفاقيات مستوى الخدمة.',
    'service.mgmt.title': 'إدارة وتشغيل خدمات النقل',
    'service.mgmt.desc': 'إدارة شاملة تغطي تخطيط المسارات، التتبع الحي بالـ GPS، تصاريح هيئة الطرق، إدارة الوقود وجدولة السائقين.',

    // Fleet
    'fleet.badge': 'أسطول تجاري حديث',
    'fleet.title': 'مصمم لأعلى معايير السلامة والراحة والاعتمادية',
    'fleet.subtitle': 'مركبات مجهزة بتكييف هواء فائق لمناخ الخليج، معتمدة من هيئة الطرق والمواصلات، ومزودة بأنظمة تتبع وتقييد السرعة الذكية.',

    // Industries
    'industries.badge': 'حلول قطاعية متخصصة',
    'industries.title': 'نلائم خدمات النقل مع طبيعة أعمالك ومناوباتك',
    'industries.subtitle': 'نحل تحديات نقل القوى العاملة للمواقع الإنشائية، المناطق الحرة، المستشفيات، الفنادق والمراكز التجارية في دبي.',

    // Safety
    'safety.badge': 'السلامة أولاً ودائماً',
    'safety.title': 'معايير أمان صارمة في كل كيلومتر نقطعه',
    'safety.subtitle': 'منظومة سلامة متكاملة ترتكز على تدريب السائقين الاحترافي، الصيانة الوقائية المستمرة، المراقبة اللحظية، والامتثال للوائح.',

    // Technology
    'tech.badge': 'عمليات رقمية ذكية',
    'tech.title': 'نظام تقني متطور لإدارة الأساطيل والتتبع المباشر',
    'tech.subtitle': 'منصة TMS متطورة تتيح التتبع اللحظي عبر الأقمار الصناعية، الجدولة الآلية للمناوبات، والشفافية التشغيلية الكاملة لمدراء الموارد البشرية.',

    // Footer
    'footer.desc': 'المزود الرائد في دبي لإدارة وتشغيل نقل الموظفين المؤسسي، رحلات المناوبات الصناعية، والخدمات اللوجستية للشركات.',
    'footer.services': 'خدمات النقل',
    'footer.company': 'الشركة',
    'footer.resources': 'المصادر',
    'footer.corridors': 'أهم مناطق ومحاور دبي',
    'footer.rights': 'شركة مواصلات موظفي دبي ذ.م.م. جميع الحقوق محفوظة.',

    // TMS Modules & Operations
    'tms.tracking': 'التتبع الحي للأسطول',
    'tms.tracking.desc': 'مراقبة التتبع عبر الأقمار الصناعية وحركة المحاور والسرعة اللحظية',
    'tms.maintenance': 'صيانة الأسطول',
    'tms.maintenance.desc': 'أوامر العمل الوقائية، سجلات الخدمة والفحص الفني',
    'tms.documents': 'خزينة الوثائق والمستندات',
    'tms.documents.desc': 'ملكية المركبات، تصاريح هيئة الطرق، وثائق التأمين والعقود',
    'tms.compliance': 'مركز الامتثال والرقابة',
    'tms.compliance.desc': 'متابعة المعايير التنظيمية، صلاحيات الوثائق وتصدير تقارير التدقيق',
    'tms.notifications': 'الإشعارات والتنبيهات التشغيلية',
    'tms.notifications.desc': 'تنبيهات فورية لعمليات النقل، تأخير الرحلات وتجديد الوثائق',
    'tms.simulated_telematics': 'نظام التتبع التجريبي الافتراضي',
    'tms.simulated_desc': 'يتم توليد إحداثيات GPS افتراضية لأغراض العرض والتطوير',
    'status.valid': 'سارٍ',
    'status.expiring_soon': 'ينتهي قريباً',
    'status.expired': 'منتهي الصلاحية',
    'status.scheduled': 'مجدول',
    'status.in_progress': 'قيد التنفيذ',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغى',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dubai_tms_lang');
    return (saved === 'ar' ? 'ar' : 'en') as Language;
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('dubai_tms_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, defaultText?: string): string => {
    return TRANSLATIONS[language]?.[key] || defaultText || key;
  };

  return (
    <I18nContext.Provider value={{ language, direction, isArabic, setLanguage, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
