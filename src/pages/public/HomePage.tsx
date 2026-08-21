import React, { useEffect } from 'react';
import {
  Bus,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  Building2,
  Phone,
  ArrowRight,
  CheckCircle2,
  Radio,
  Sliders,
  Award,
  Zap,
  TrendingUp,
  ChevronRight,
  Star,
  FileCheck,
  Gauge,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { QuoteInquiryForm } from '../../components/public/QuoteInquiryForm.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'الرئيسية - حلول نقل الموظفين المؤسسي' : 'Enterprise Staff Transport Solutions in Dubai',
      description: isArabic
        ? 'خدمات نقل موظفي الشركات والعمال في دبي والإمارات. أسطول حافلات حديث، تتبع GPS مباشر، وسائقين معتمدين من هيئة الطرق والمواصلات.'
        : 'Leading staff transport company in Dubai & UAE. Modern air-conditioned buses, 24/7 shift logistics, live GPS telematics, and RTA certified captains.',
      keywords: ['Dubai staff transport', 'employee bus rental Dubai', 'corporate shuttle UAE', 'industrial workforce transport DIP JAFZA', 'RTA commercial transport'],
    });
  }, [isArabic]);

  const stats = [
    { value: '15+', label: isArabic ? 'سنوات من الخبرة والريادة' : 'Years Experience', sub: isArabic ? 'في طرق ومناطق دبي' : 'In UAE Transport Operations' },
    { value: '120+', label: isArabic ? 'حافلة ومركبة تجارية حديثة' : 'Commercial Vehicles', sub: isArabic ? 'تكييف خليجي متطور' : '50, 33, 14 Seater Fleet' },
    { value: '650+', label: isArabic ? 'رحلة يومية مجدولة' : 'Daily Trips Dispatched', sub: isArabic ? 'تغطية على مدار 24 ساعة' : '24/7 Shift Operations' },
    { value: '85+', label: isArabic ? 'شركة ومؤسسة متعاقدة' : 'Corporate Clients', sub: isArabic ? 'عقود مستدامة وشراكات' : 'Across Key Industries' },
    { value: '99.2%', label: isArabic ? 'نسبة الالتزام بالمواعيد' : 'On-Time SLA Record', sub: isArabic ? 'بناءً على سجلات الـ GPS' : 'Audited via Telematics' },
  ];

  const services = [
    {
      id: 'staff-commute',
      title: isArabic ? 'نقل الموظفين اليومي' : 'Daily Staff Commute',
      desc: isArabic
        ? 'رحلات مخصصة لنقل الموظفين من التجمعات السكنية إلى مقرات العمل ومجمعات الأعمال بمواعيد ثابتة ومسارات محسوبة بدقة.'
        : 'Dedicated point-to-point daily employee shuttle connecting major residential clusters with commercial districts across Dubai and Sharjah.',
      icon: Bus,
      badge: isArabic ? 'الأكثر طلباً' : 'Most Popular',
      features: [
        isArabic ? 'حافلات مخصصة لشركتك فقط' : 'Dedicated branded/non-branded fleet',
        isArabic ? 'مسارات ذكية لتوفير وقت الرحلة' : 'Optimized multi-stop routing',
        isArabic ? 'تكييف هواء فائق لمناخ دبي' : 'High-capacity dual Gulf AC',
      ],
    },
    {
      id: 'corporate-shuttle',
      title: isArabic ? 'حافلات الشركات الترددية' : 'Corporate Campus Shuttles',
      desc: isArabic
        ? 'حافلات دورية ترددية تربط محطات المترو والمباني الإدارية وفروع الشركات لتسهيل حركة الموظفين والزوار.'
        : 'Scheduled inter-office, metro-feeder, and business park loop services operating smoothly throughout business hours.',
      icon: Sliders,
      badge: isArabic ? 'مرونة عالية' : 'Flexible Hours',
      features: [
        isArabic ? 'ربط مباشر مع محطات مترو دبي' : 'Seamless Dubai Metro connectivity',
        isArabic ? 'ترددات منتظمة كل 15-30 دقيقة' : '15-30 min timed frequencies',
        isArabic ? 'شاشات إلكترونية ومقاعد مريحة' : 'Digital route displays & comfort seating',
      ],
    },
    {
      id: 'shift-logistics',
      title: isArabic ? 'نقل المناوبات والورديات (24/7)' : '24/7 Shift Logistics',
      desc: isArabic
        ? 'حلول نقل مدار الساعة للمصانع، المستشفيات، وشركات الطيران والخدمات اللوجستية التي تعمل بنظام الورديات المتتالية.'
        : 'Round-the-clock shift-rotation transportation engineered for industrial manufacturing, aviation, healthcare, and hospitality.',
      icon: Clock,
      badge: isArabic ? 'تشغيل 24/7' : '24/7 Availability',
      features: [
        isArabic ? 'مناوبات ليلية ونهارية مستمرة' : 'Day, swing, and night shift synchrony',
        isArabic ? 'حافلات بديلة فورية عند الطوارئ' : 'Guaranteed backup bus within 30 mins',
        isArabic ? 'تنسيق مباشر مع مدراء العمليات' : 'Dedicated dispatch liaison',
      ],
    },
    {
      id: 'industrial-transport',
      title: isArabic ? 'نقل المناطق الحرة والمواقع الصناعية' : 'Industrial & Free Zone Fleet',
      desc: isArabic
        ? 'خدمة متخصصة لربط مجمعات العمال في جبل علي والصناعية بمشاريع جافزا، مجمع دبي للاستثمار، والمدن الصناعية.'
        : 'High-capacity logistics linking workforce accommodation in Sonapur and DIP to industrial plants in JAFZA and Dubai South.',
      icon: Building2,
      badge: isArabic ? 'سعات كبيرة' : 'High Volume',
      features: [
        isArabic ? 'حافلات سعة 50 و 60 راكب' : '50 to 60-passenger heavy coaches',
        isArabic ? 'امتثال تام لمعايير الدفاع المدني وهيئة الطرق' : 'Strict civil defence & RTA compliance',
        isArabic ? 'عقود سنوية وشهرية مرنة' : 'Monthly and multi-year contract options',
      ],
    },
    {
      id: 'executive-van',
      title: isArabic ? 'النقل التنفيذي وكبار الشخصيات' : 'Executive & VIP Coaches',
      desc: isArabic
        ? 'مركبات فاخرة ومريحة لنقل الإدارات التنفيذية، ضيوف المؤتمرات، والوفود الرسمية مع سائقين يرتدون الزي الرسمي.'
        : 'Premium Mercedes/Hyundai executive vans with leather seating, Wi-Fi, and suited captains for management teams and client visits.',
      icon: Award,
      badge: isArabic ? 'درجة أولى' : 'Executive Tier',
      features: [
        isArabic ? 'مقاعد جلدية مريحة وواي فاي' : 'Leather reclining seats & on-board Wi-Fi',
        isArabic ? 'سائقون متحدثون بالإنجليزية والعربية' : 'Multilingual professional chauffeurs',
        isArabic ? 'استقبال وتوديع في مطارات دبي' : 'DXB / DWC Airport meet & greet',
      ],
    },
    {
      id: 'managed-transport',
      title: isArabic ? 'إدارة النقل المؤسسي الشامل' : 'Full Transport Outsourcing',
      desc: isArabic
        ? 'تعهيد كامل لمنظومة النقل يشمل تخطيط المسارات، الصيانة الدورية، تصاريح هيئة الطرق، والتقارير الشهرية للموارد البشرية.'
        : 'Turnkey fleet and mobility outsourcing eliminating overhead, vehicle maintenance burdens, and regulatory liabilities for your HR team.',
      icon: Cpu,
      badge: isArabic ? 'حلول متكاملة' : 'Turnkey Solution',
      features: [
        isArabic ? 'بوابة إلكترونية لمدراء الموارد البشرية' : 'Live corporate client dashboard',
        isArabic ? 'تقارير شهرية عن الالتزام بالوقت' : 'Monthly KPI & fuel carbon reporting',
        isArabic ? 'إدارة تصاريح القيادة والملكية وتأمين الركاب' : 'Complete insurance & permit administration',
      ],
    },
  ];

  const dubaiCorridors = [
    { name: 'Dubai Investment Park (DIP 1 & 2)', desc: 'Industrial logistics, manufacturing plants, and accommodation hubs' },
    { name: 'Jebel Ali Free Zone (JAFZA)', desc: 'North & South gates, container freight stations, and global headquarters' },
    { name: 'Dubai Silicon Oasis & Academic City', desc: 'Tech parks, university campuses, and administrative centers' },
    { name: 'Dubai Airport Freezone (DAFZA & DXB)', desc: 'Aviation catering, air freight, and terminal ground staff' },
    { name: 'Business Bay & Downtown Dubai', desc: 'Corporate towers, financial institutions, and hospitality staff' },
    { name: 'Sonapur & Muhaisnah Accommodation', desc: 'Workforce residential zones connecting to prime construction & plant sites' },
  ];

  const fleetPreview = [
    {
      name: '50-Seater Luxury Staff Coach',
      capacity: '50 / 53 Passengers',
      type: 'Heavy Commercial Coach',
      bestFor: 'Daily corporate commute & high-density workforce transfers',
      features: ['Dual Gulf AC Units', 'RTA Speed Governor (100 km/h)', 'GPS Live Tracker', 'Safety Belts on all seats', 'Luggage Compartment'],
    },
    {
      name: '30-Seater Medium Coaster Bus',
      capacity: '30 / 33 Passengers',
      type: 'Medium Bus (Toyota Coaster / Ashok Leyland)',
      bestFor: 'Inter-campus loops, hospitality shifts, school/staff routes',
      features: ['High-output AC', 'Automatic Sliding Doors', 'Emergency Roof Hatch', 'Individual Air Vents', 'Reverse Cameras'],
    },
    {
      name: '14-Seater Commuter Minivan',
      capacity: '14 / 15 Passengers',
      type: 'Light Bus (Toyota HiAce Commuter)',
      bestFor: 'Executive staff, split-shift healthcare teams, fast highway transit',
      features: ['Compact City Navigation', 'Reclining Fabric Seats', 'Tinted UV Windows', 'Speed Limiter', 'Fire Suppression'],
    },
  ];

  const testimonials = [
    {
      quote:
        'Dubai Staff Transport transformed our factory operations in DIP. With over 240 staff rotating across two shifts, their on-time rate has been flawless for over 18 months.',
      author: 'Kareem Al Mansoori',
      role: 'Operations Director',
      company: 'Gulf Precision Manufacturing (DIP 2)',
    },
    {
      quote:
        'Managing employee pickup from Sonapur to Business Bay was a logistical nightmare before we outsourced to them. The live GPS visibility gives our HR team complete peace of mind.',
      author: 'Fatima Al Sayed',
      role: 'VP Human Resources',
      company: 'Emirates Retail Management Group',
    },
    {
      quote:
        'Their RTA compliance, cleanliness, and driver discipline are unmatched in the UAE. When we need extra buses on short notice, their dispatch team responds in minutes.',
      author: 'David Richardson',
      role: 'Facilities & Logistics Lead',
      company: 'Aviation Ground Services DXB',
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A192F] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-slate-800">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left rtl:text-right">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-orange-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span>{t('hero.eyebrow')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading leading-tight">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {t('hero.desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/contact')}
                  rightIcon={<ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}
                  className="shadow-xl shadow-orange-500/25"
                >
                  {t('quote.request')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/services')}
                  className="bg-white/5 border-slate-700 text-white hover:bg-white/10 hover:text-white"
                >
                  {t('explore.services')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/fleet')}
                  className="bg-white/5 border-slate-700 text-white hover:bg-white/10 hover:text-white"
                >
                  {t('explore.fleet')}
                </Button>
              </div>

              {/* RTA & Reliability highlights */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isArabic ? 'ترخيص RTA تجاري' : 'RTA Commercial License'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{isArabic ? 'تتبع GPS مباشر 24/7' : 'Live GPS Telematics'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{isArabic ? 'دقة مواعيد 99.2٪' : '99.2% Punctuality'}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Quote Calculator */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#0A192F]">
                        {isArabic ? 'احسب تكلفة نقل موظفيك' : 'Quick Route Quotation'}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {isArabic ? 'احصل على عرض سعر تجاري في 30 دقيقة' : 'Commercial pricing within 30 mins'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    RTA Ready
                  </span>
                </div>

                <QuoteInquiryForm compact={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-[#060D17] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {stats.map((item, idx) => (
              <div key={idx} className="space-y-1 p-2">
                <div className="text-3xl lg:text-4xl font-extrabold text-orange-400 tracking-tight font-heading">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">{item.label}</div>
                <div className="text-[11px] text-slate-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES OVERVIEW */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
              <Bus className="w-3.5 h-3.5" />
              <span>{t('services.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-heading">
              {t('services.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-orange-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                        {srv.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/services')}
                      className="w-full justify-between group-hover:border-orange-500 group-hover:text-orange-600"
                      rightIcon={<ChevronRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}
                    >
                      <span>{t('learn.more')}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="navy"
              onClick={() => navigate('/services')}
              rightIcon={<ArrowRight className={`w-4 h-4 text-orange-400 ${isArabic ? 'rotate-180' : ''}`} />}
            >
              {isArabic ? 'استعراض كافة خدمات النقل وإجراءات التشغيل' : 'View All Services & Workflow Specifications'}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. FLEET SHOWCASE PREVIEW */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-2xl text-left rtl:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {t('fleet.badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
                {t('fleet.title')}
              </h2>
              <p className="text-sm text-slate-600">
                {t('fleet.subtitle')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/fleet')}>
              {t('explore.fleet')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleetPreview.map((bus, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-slate-400 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                      <Bus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-white text-[#0A192F] border border-slate-200 rounded-lg shadow-2xs">
                      {bus.capacity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0A192F]">{bus.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{bus.type}</p>
                    <p className="text-xs text-slate-600 mt-2 italic">{bus.bestFor}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                    {bus.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    variant="navy"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/contact')}
                  >
                    {isArabic ? 'طلب هذا الأسطول' : 'Book This Category'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KEY DUBAI CORRIDORS & INDUSTRIAL HUBS */}
      <section className="py-20 bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {isArabic ? 'تغطية جغرافية متكاملة' : 'UAE Operational Network'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white">
              {isArabic ? 'أهم محاور النقل والمناطق الصناعية في دبي' : 'High-Density Corridors & Industrial Hubs'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {isArabic
                ? 'رحلات يومية منتظمة تربط المجمعات السكنية بالمناطق الحرة، موانئ الشحن، والمراكز المالية في دبي وأبوظبي.'
                : 'Our scheduled fleet navigates vital UAE transit corridors daily, connecting workforce hubs to manufacturing, ports, and commercial centers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dubaiCorridors.map((corridor, cIdx) => (
              <div
                key={cIdx}
                className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-orange-500/50 transition-colors flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{corridor.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{corridor.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Inter-emirate line callout */}
          <div className="mt-10 p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {isArabic
                  ? 'نوفر أيضاً خطوط نقل يومية بين دبي وأبوظبي، الشارقة، عجمان، ورأس الخيمة لنقل الكوادر الوظيفية.'
                  : 'We also operate scheduled inter-emirate routes between Dubai, Abu Dhabi, Sharjah, Ajman, and Ras Al Khaimah.'}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/contact')} className="border-slate-600 text-white hover:bg-slate-700 shrink-0">
              {isArabic ? 'استفسر عن المسارات بين الإمارات' : 'Inquire Inter-Emirate Routes'}
            </Button>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY & TMS HIGHLIGHT */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-left rtl:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>{t('tech.badge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-heading">
                {t('tech.title')}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('tech.subtitle')}
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isArabic ? 'تتبع فوري بالأقمار الصناعية (Live GPS)' : 'Sub-Second Live GPS Telematics'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {isArabic ? 'مراقبة حركة كل حافلة، السرعة الحالية، وأوقات الوصول المقدرة (ETA).' : 'Instant speed, heading, route deviation, and arrival time tracking on digital map consoles.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isArabic ? 'جدولة المناوبات الذكية ومصفوفة الورديات' : 'Automated Shift & Roster Synchronization'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {isArabic ? 'تنسيق أوتوماتيكي مع جداول دوام موظفي شركتك لضمان عدم حدوث أي تأخير.' : 'Seamless matching of driver rosters with company shift rotations across multiple work sites.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isArabic ? 'مراقبة الامتثال وتصاريح هيئة الطرق (RTA)' : 'Automated Compliance & Permit Expiry Engine'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {isArabic ? 'إدارة رقمية لتجديد ملكيات المركبات وتصاريح القيادة التجارية بدون أي انقطاع.' : 'Zero downtime through automated tracking of Mulkiya registrations, driver permits, and Tasjeel checks.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button variant="navy" onClick={() => navigate('/technology')} rightIcon={<ArrowRight className="w-4 h-4 text-orange-400" />}>
                  {t('explore.platform')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/sign-in')}>
                  {isArabic ? 'دخول بوابة TMS' : 'Open TMS Console'}
                </Button>
              </div>
            </div>

            {/* Right Card Mockup: Live Control Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="bg-[#0A192F] text-white rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">TMS Operations Control Engine</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-orange-400">
                    LIVE TELEMETRY
                  </span>
                </div>

                {/* Mock Active Trip Card */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-orange-400" />
                      <span>DXB-BUS-104 (50-Seater)</span>
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold text-[11px]">
                      ON SCHEDULE (98.8%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block">Route:</span>
                      <span className="text-white font-medium">Sonapur → DIP 2 Industrial</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Current Corridor:</span>
                      <span className="text-white font-medium">Sheikh Mohammed Bin Zayed Rd</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Speed / Limit:</span>
                      <span className="text-emerald-400 font-medium">84 km/h (Governed: 100)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Passenger Load:</span>
                      <span className="text-white font-medium">48 / 50 Staff on board</span>
                    </div>
                  </div>
                </div>

                {/* Live KPI Indicators */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-lg font-bold text-emerald-400 font-heading">99.2%</div>
                    <div className="text-[10px] text-slate-400">On-Time Rate</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-lg font-bold text-orange-400 font-heading">0.00%</div>
                    <div className="text-[10px] text-slate-400">Speed Violations</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-lg font-bold text-blue-400 font-heading">&lt; 30m</div>
                    <div className="text-[10px] text-slate-400">Backup SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CORPORATE TESTIMONIALS & CASE HIGHLIGHTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'ثقة كبرى الشركات' : 'Trusted by Leading Enterprises'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'ماذا يقول شركاؤنا عن التزامنا وجودة خدماتنا' : 'What UAE Operations Leaders Say About Us'}
            </h2>
            <p className="text-sm text-slate-600">
              {isArabic
                ? 'نخدم يومياً أكثر من 85 شركة رائدة في قطاعات الصناعة، الطيران، التجزئة، والمقاولات.'
                : 'Delivering punctual, safe, and regulated transport for corporate teams across Dubai and Northern Emirates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, tIdx) => (
              <div
                key={tIdx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex text-orange-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="font-bold text-sm text-[#0A192F]">{test.author}</div>
                  <div className="text-xs text-slate-500">{test.role}</div>
                  <div className="text-xs text-orange-600 font-semibold mt-0.5">{test.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA SECTION */}
      <section className="py-16 bg-[#0A192F] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white">
            {isArabic ? 'هل أنت مستعد لترقية وتأمين منظومة نقل موظفيك؟' : 'Ready to Elevate Your Corporate Staff Mobility?'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {isArabic
              ? 'تواصل مع فريق عقود النقل التجاري للحصول على دراسة تفصيلية لمسارات موظفيك وعرض أسعار تنافسي.'
              : 'Speak with our route engineers and commercial fleet specialists today for a comprehensive route audit and competitive tariff.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/contact')}
              rightIcon={<ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}
              className="shadow-xl shadow-orange-500/25"
            >
              {isArabic ? 'احصل على عرض سعر تجاري' : 'Request Commercial Quotation'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/services')}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              {isArabic ? 'استكشف كافة الخدمات' : 'Explore All Services'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
