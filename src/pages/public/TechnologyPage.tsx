import React, { useEffect } from 'react';
import {
  Cpu,
  Radio,
  Clock,
  FileCheck,
  ShieldCheck,
  Smartphone,
  BarChart3,
  MapPin,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Layers,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface TechnologyPageProps {
  navigate: (path: string) => void;
}

export const TechnologyPage: React.FC<TechnologyPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'التقنية والأنظمة الذكية - مواصلات موظفي دبي' : 'Proprietary TMS Platform & Live Telematics | Dubai Staff Transport',
      description: isArabic
        ? 'تعرف على نظام إدارة النقل الذكي (TMS): تتبع مباشر عبر الأقمار الصناعية، جدولة آلية للورديات، وبوابة إلكترونية لمدراء الموارد البشرية.'
        : 'Explore our proprietary Transport Management System (TMS) powering live GPS fleet telematics, shift roster synchronization, and corporate HR portal in Dubai.',
      keywords: ['transport management system Dubai', 'fleet tracking software UAE', 'corporate bus GPS tracking', 'employee transport telematics'],
    });
  }, [isArabic]);

  const platformModules = [
    {
      title: isArabic ? '1. التتبع الحي بالأقمار الصناعية (Live GPS Telematics)' : '1. Real-Time GPS Fleet Telematics',
      icon: Radio,
      desc: isArabic
        ? 'أجهزة تتبع متطورة مثبتة في كل حافلة تبث الموقع الجغرافي والسرعة ومسار الرحلة كل ثانية إلى غرفة التحكم المركزية.'
        : 'Enterprise-grade hardware sensors broadcasting high-frequency location, telemetry, heading, and speed data to our central dispatch console.',
      features: [
        isArabic ? 'تحديث لحظي للموقع على خريطة دبي' : 'Sub-second digital live map rendering',
        isArabic ? 'تنبيه فوري عند تجاوز السرعة المحددة' : 'Automated over-speed and harsh-braking alerts',
        isArabic ? 'حساب دقيق لوقت الوصول المتوقع (ETA)' : 'Dynamic traffic-aware ETA calculation',
      ],
    },
    {
      title: isArabic ? '2. نظام تحسين المسارات الذكي (Smart Route Sequencer)' : '2. Algorithmic Route Optimization',
      icon: MapPin,
      desc: isArabic
        ? 'خوارزميات ذكية تعيد ترتيب نقاط التجمع والمحطات لتقليل وقت الرحلة على الموظفين وتفادي الاختناقات المرورية في ساعات الذروة.'
        : 'Custom algorithms sequencing stops to minimize transit duration, curb fuel burn, and bypass known peak-hour congestion bottlenecks in Dubai.',
    },
    {
      title: isArabic ? '3. تطبيق السائق الرقمي (Driver Captain Console)' : '3. Driver Captain Dispatch Interface',
      icon: Smartphone,
      desc: isArabic
        ? 'واجهة تشغيل سهلة على الأجهزة اللوحية تتيح للسائق استعراض خط السير، قائمة الركاب، وبدء وإنهاء الرحلات بضغطة زر.'
        : 'Simplified, high-contrast mobile dispatch console enabling captains to view sequenced passenger manifests, log departures, and report road alerts.',
    },
    {
      title: isArabic ? '4. بوابة الشركات والعملاء (Corporate Client Portal)' : '4. HR & Corporate Client Transparency Portal',
      icon: BarChart3,
      desc: isArabic
        ? 'لوحة تحكم خاصة بمسؤولي الموارد البشرية للاطلاع على تقارير الحضور، الالتزام بالمواعيد، وحالة الحافلات المخصصة لشركتهم في أي لحظة.'
        : 'Secure self-service dashboard providing HR directors with live trip maps, on-time performance charts, passenger attendance, and downloadable invoices.',
    },
    {
      title: isArabic ? '5. محرك الامتثال وتراخيص RTA (Compliance Tracker)' : '5. Automated RTA Compliance & Permit Engine',
      icon: FileCheck,
      desc: isArabic
        ? 'نظام تنبيهات ذكي يرصد تواريخ انتهاء ملكيات الحافلات وتصاريح السائقين وفحص تسجيل قبل 60 يوماً لتفادي أي توقف مفاجئ.'
        : 'Automated document registry tracking Mulkiya renewals, Tasjeel roadworthiness certificates, and driver permit expiries with 60-day early warnings.',
    },
    {
      title: isArabic ? '6. الصيانة التنبؤية وسجلات العداد (Preventive Telemetry)' : '6. Odometer & Preventive Maintenance Engine',
      icon: Cpu,
      desc: isArabic
        ? 'ربط مباشر مع عدادات الحافلات لتحديد مواعيد الصيانة الدورية وتغيير الزيوت تلقائياً في ورشة الصيانة دون انتظار الأعطال.'
        : 'Real-time odometer synchronization triggering automatic work orders for 5,000 km lube services and component safety checks.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t('tech.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {t('tech.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {t('tech.subtitle')}
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button size="lg" variant="primary" onClick={() => navigate('/sign-in')} rightIcon={<ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}>
              {isArabic ? 'الدخول إلى بوابة العمليات' : 'Open TMS Portal'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-slate-700 text-white hover:bg-slate-800">
              {isArabic ? 'طلب تجربة المنصة' : 'Request Platform Demo'}
            </Button>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'بنية المنصة الرقمية' : 'Platform Architecture'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'تكامل رقمي يربط الحافلات، السائقين، والإدارة' : 'Seamless Digital Integration Across All Touchpoints'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-orange-500 transition-colors space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-orange-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0A192F]">{mod.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                  </div>

                  {mod.features && (
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      {mod.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Data Privacy in UAE */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A192F] text-white rounded-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-emerald-400 rounded-full text-xs font-bold">
                <Lock className="w-4 h-4" />
                <span>{isArabic ? 'أمان وسرية البيانات' : 'Enterprise Data Privacy'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {isArabic ? 'حماية بيانات تنقل الموظفين وفق أعلى المعايير' : 'Secure & Confidential Corporate Data Handling'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isArabic
                  ? 'تتوافق منصتنا مع قوانين حماية البيانات في دولة الإمارات العربية المتحدة. يتم تشفير جميع إحداثيات السكن وسجلات الموظفين لضمان السرية التامة.'
                  : 'All passenger registries, geocoded residential coordinates, and fleet movement logs are stored under strict encrypted protocols in compliance with UAE data governance guidelines.'}
              </p>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 rounded-xl p-6 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>TLS 1.3 & AES-256 Encrypted Telematics Data Transmission</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Role-Based Access Control (Admins, Dispatchers, HR Clients)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>99.9% Platform Availability SLA with High-Availability Redundancy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
            {isArabic ? 'هل ترغب في تجربة بوابة إدارة النقل؟' : 'Ready to Experience Our TMS Platform?'}
          </h2>
          <p className="text-sm text-slate-600">
            {isArabic
              ? 'سجل الدخول الآن أو تواصل معنا لحجز جلسة استعراضية حية للنظام.'
              : 'Sign in to access operational dashboards, live tracking consoles, and fleet diagnostics.'}
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="navy" onClick={() => navigate('/sign-in')}>
              {isArabic ? 'تسجيل الدخول للمنصة' : 'Enter TMS Console'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              {isArabic ? 'طلب عرض توضيحي' : 'Request Live Demo'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
