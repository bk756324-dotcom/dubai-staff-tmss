import React, { useEffect } from 'react';
import {
  Building2,
  HardHat,
  Hotel,
  Activity,
  Plane,
  Warehouse,
  ShoppingBag,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Bus,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface IndustriesPageProps {
  navigate: (path: string) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'القطاعات والصناعات - مواصلات موظفي دبي' : 'Industry Transport Solutions in Dubai & UAE',
      description: isArabic
        ? 'حلول نقل مخصصة لقطاعات الشركات، المقاولات، المستشفيات، الفنادق، الطيران، والمناطق الحرة في دبي.'
        : 'Tailored corporate transportation solutions for construction, healthcare, aviation, hospitality, logistics, and retail in Dubai.',
      keywords: ['construction worker transport Dubai', 'hospital staff shuttle UAE', 'aviation crew transport DXB', 'hotel employee shuttle Dubai'],
    });
  }, [isArabic]);

  const industries = [
    {
      id: 'corporate-offices',
      title: isArabic ? 'المكاتب والمراكز المالية والشركات' : 'Corporate Offices & Financial Districts',
      icon: Building2,
      corridors: 'DIFC, Business Bay, Downtown Dubai, Dubai Internet City',
      challenge: isArabic
        ? 'ازدحام مواقف السيارات وارتفاع تكاليف تنقل الموظفين اليومي وتأخرهم بسبب حركة المرور الصباحية.'
        : 'Parking congestion, exorbitant individual commuting expenses, and morning peak-hour bottlenecks.',
      solution: isArabic
        ? 'حافلات ترددية وسريعة تربط محطات المترو والأحياء السكنية بأبراج المكاتب مع مقاعد مريحة وواي فاي.'
        : 'Dedicated executive shuttles and direct metro-feeder loops providing peaceful, productive commutes.',
      benefits: [
        isArabic ? 'زيادة إنتاجية ورضا الموظفين' : 'Punctual 8:30 AM arrival guarantees',
        isArabic ? 'توفير تكاليف مواقف السيارات' : 'Reduces corporate parking expenditure',
        isArabic ? 'تقليل الانبعاثات الكربونية' : 'Corporate ESG & carbon footprint reduction',
      ],
    },
    {
      id: 'construction-infra',
      title: isArabic ? 'المقاولات والمشاريع الإنشائية والبنية التحتية' : 'Construction, EPC & Infrastructure',
      icon: HardHat,
      corridors: 'Dubai South, Palm Jebel Ali, Al Quoz, Sonapur Accommodation',
      challenge: isArabic
        ? 'نقل مئات أو آلاف العمال في مواعيد دقيقة بين المجمعات السكنية والمواقع الإنشائية وفق اشتراطات السلامة.'
        : 'High-density morning dispatch of hundreds of workers from camp facilities to strict gate entry times.',
      solution: isArabic
        ? 'أسطول حافلات ثقيلة 50 و60 راكب مجهزة بتكييف هواء فائق وأنظمة تقييد السرعة والسلامة المعتمدة.'
        : 'Heavy 50-seater coach fleets operating synchronized departures with civil defence & RTA clearance.',
      benefits: [
        isArabic ? 'امتثال كامل لاشتراطات السلامة' : '100% compliant with UAE labour transport laws',
        isArabic ? 'عدم توقف العمل في الموقع' : 'Zero project site delays or shift downtime',
        isArabic ? 'تسعير اقتصادي مدروس' : 'Optimized per-head volume pricing',
      ],
    },
    {
      id: 'hospitality-resorts',
      title: isArabic ? 'الفنادق والمنتجعات والضيافة الفاخرة' : 'Hospitality, Luxury Resorts & Theme Parks',
      icon: Hotel,
      corridors: 'Palm Jumeirah, JBR, Dubai Marina, Downtown, Bluewaters',
      challenge: isArabic
        ? 'تعدد مناوبات موظفي الفنادق (صباحية، مسائية، ليلية) وحاجة الطواقم للوصول بنشاط ومظهر لائق.'
        : 'Continuous 3-shift hotel rosters requiring clean, air-conditioned transport arriving 24/7.',
      solution: isArabic
        ? 'حافلات متوسطة وفانات نظيفة ومكيفة تعمل على مدار الساعة لربط سكن الفندق بالواجهة الشاطئية.'
        : '24/7 punctual coaster and van rotations with neat, sanitised interiors and vetted captains.',
      benefits: [
        isArabic ? 'تغطية كاملة للمناوبات الليلية' : 'Flawless 24/7 midnight shift coverage',
        isArabic ? 'حافلات معقمة ومريحة' : 'Impeccable vehicle cleanliness and AC standards',
        isArabic ? 'مرونة في زيادة الحافلات في المواسم' : 'Surge fleet availability for peak tourism seasons',
      ],
    },
    {
      id: 'healthcare-hospitals',
      title: isArabic ? 'المستشفيات والقطاع الصحي والمختبرات' : 'Healthcare, Hospitals & Clinical Teams',
      icon: Activity,
      corridors: 'Dubai Healthcare City, Garhoud, Al Barsha, DSO Health Hub',
      challenge: isArabic
        ? 'حساسية مواعيد تسليم مناوبات التمريض والأطباء التي لا تقبل أي تأخير تحت أي ظرف.'
        : 'Zero-tolerance timing for nursing and emergency clinical shift handovers across the city.',
      solution: isArabic
        ? 'خدمة نقل سريعة ودقيقة ومخصصة للأطقم الطبية مع مسارات مريحة وحافلات بديلة فورية للطوارئ.'
        : 'Rapid commuter vans and coasters with guaranteed backup vehicles on standby within 20 mins.',
      benefits: [
        isArabic ? 'التزام تام بمواعيد تبديل المناوبات' : 'Guaranteed on-time shift changeover',
        isArabic ? 'بيئة هادئة ومريحة للكادر الطبي' : 'Quiet, restful environment for resting staff',
        isArabic ? 'تعقيم دوري مستمر' : 'Hospital-grade sanitization standards',
      ],
    },
    {
      id: 'aviation-ground',
      title: isArabic ? 'الطيران والخدمات الأرضية ومطارات دبي' : 'Aviation & Airport Ground Handling',
      icon: Plane,
      corridors: 'Dubai International (DXB Terminal 1,2,3), DAFZA, Al Maktoum (DWC)',
      challenge: isArabic
        ? 'اشتراطات أمنية صارمة لدخول المطارات ومواعيد دقيقة ترتبط بجداول إقلاع وهبوط الطائرات.'
        : 'Strict airside access protocols, high-security gate compliance, and tight flight turnarounds.',
      solution: isArabic
        ? 'سائقون يحملون تصاريح أمنية معتمدة وحافلات مجهزة لنقل طواقم التموين والخدمات الأرضية والصيانة.'
        : 'Permitted drivers and dedicated staff coaches coordinated directly with flight dispatch timetables.',
      benefits: [
        isArabic ? 'تصاريح أمنية ومطابقة تامة' : 'Security-vetted captains for airport zones',
        isArabic ? 'تشغيل مستمر 365 يوماً' : '365-day seamless operational continuity',
        isArabic ? 'تنسيق مباشر مع عمليات المطار' : 'Direct integration with airline dispatch desks',
      ],
    },
    {
      id: 'logistics-freezones',
      title: isArabic ? 'المناطق الحرة والمستودعات والخدمات اللوجستية' : 'Logistics, Warehousing & Free Zones',
      icon: Warehouse,
      corridors: 'JAFZA, Dubai Investment Park (DIP 1 & 2), Dubai Industrial City, DAFZA',
      challenge: isArabic
        ? 'اتساع المساحات الجغرافية للمناطق الحرة وصعوبة وصول العمال إلى المستودعات الطرفية.'
        : 'Vast industrial parks with limited public transit connecting remote distribution warehouses.',
      solution: isArabic
        ? 'شبكة حافلات مخصصة توزع العمال بدقة أمام بوابات المستودعات ومحطات الفرز.'
        : 'Engineered warehouse-to-accommodation transit with sequenced drop-offs at exact bay gates.',
      benefits: [
        isArabic ? 'توفير الهدر في أوقات التنقل' : 'Cuts transit time by up to 35%',
        isArabic ? 'تغطية بوابات جافزا الشمالية والجنوبية' : 'Full access across all JAFZA and DIP checkpoints',
        isArabic ? 'مرونة عالية لأوقات مواسم التجارة الإلكترونية' : 'Rapid scaling during e-commerce sales surges',
      ],
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('industries.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {t('industries.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {t('industries.subtitle')}
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-4 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-orange-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A192F] font-heading">{ind.title}</h2>
                    <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
                      <span>{ind.corridors}</span>
                    </p>
                  </div>
                  <Button
                    variant="navy"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/contact')}
                    rightIcon={<ArrowRight className={`w-4 h-4 text-orange-400 ${isArabic ? 'rotate-180' : ''}`} />}
                  >
                    {isArabic ? 'طلب حلول لهذا القطاع' : 'Inquire For This Sector'}
                  </Button>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left rtl:text-right">
                  {/* Challenge & Solution */}
                  <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase text-red-600 tracking-wider">
                        {isArabic ? 'التحدي التشغيلي:' : 'Industry Challenge:'}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{ind.challenge}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 space-y-1">
                      <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                        {isArabic ? 'حل مواصلات موظفي دبي:' : 'Our Tailored Solution:'}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{ind.solution}</p>
                    </div>
                  </div>

                  {/* Measurable Benefits */}
                  <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">
                      {isArabic ? 'الفوائد الملموسة:' : 'Key Operational Benefits:'}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {ind.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SLA Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'اتفاقيات مستوى الخدمة (SLA)' : 'Enterprise Service Level Agreements'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'ضمانات تعاقدية تحمي سير عمليات شركتك' : 'Rigorous Guarantees for Every Industry Partner'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left rtl:text-right">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-2xl font-bold text-orange-500 font-heading">99.2%</div>
              <h3 className="text-sm font-bold text-slate-900">{isArabic ? 'نسبة الالتزام بالوقت' : 'On-Time Arrival SLA'}</h3>
              <p className="text-xs text-slate-600">
                {isArabic ? 'مراقبة آلية لكل رحلة عبر نظام التتبع.' : 'Continuous monitoring with automated delay alerts.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-2xl font-bold text-emerald-600 font-heading">&lt; 30 Mins</div>
              <h3 className="text-sm font-bold text-slate-900">{isArabic ? 'حافلة بديلة فورية' : 'Emergency Backup Dispatch'}</h3>
              <p className="text-xs text-slate-600">
                {isArabic ? 'حافلات جاهزة في مستودعات دبي للتدخل الفوري.' : 'Strategic standby buses stationed across Dubai depots.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-2xl font-bold text-blue-600 font-heading">100%</div>
              <h3 className="text-sm font-bold text-slate-900">{isArabic ? 'امتثال هيئة الطرق (RTA)' : 'RTA & Labor Compliance'}</h3>
              <p className="text-xs text-slate-600">
                {isArabic ? 'سائقون مفحوصون وتراخيص سارية وتأمين شامل.' : 'Zero liability, all permits and insurance up to date.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'هل ترغب في دراسة مخصصة لقطاعك؟' : 'Request an Industry-Specific Mobility Study'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'تواصل مع فريقنا وسنزودك بدراسة حالة مفصلة لشركات مماثلة في نفس قطاعك.'
              : 'Our operations team will provide customized case studies and cost comparisons for your industry.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'طلب استشارة مجانية' : 'Book Free Route Consultation'}
          </Button>
        </div>
      </section>
    </div>
  );
};
