import React, { useEffect } from 'react';
import {
  Bus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Award,
  Building2,
  Cpu,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'خدمات النقل - مواصلات موظفي دبي' : 'Commercial Staff Transport Services in Dubai',
      description: isArabic
        ? 'استكشف خدمات نقل موظفي الشركات، الحافلات الترددية، نقل المناوبات (24/7)، ونقل القوى العاملة للمناطق الحرة في دبي.'
        : 'Explore our complete spectrum of corporate staff transport services in Dubai: daily commute, campus shuttles, shift logistics, and executive fleet.',
      keywords: ['staff transport services Dubai', 'employee shuttle contract UAE', 'shift transportation JAFZA DIP', 'corporate bus charter Dubai'],
    });
  }, [isArabic]);

  const detailedServices = [
    {
      id: 'daily-staff-commute',
      title: isArabic ? 'نقل الموظفين اليومي المجدول' : 'Dedicated Daily Employee Commute',
      badge: 'Core Service',
      desc: isArabic
        ? 'خدمة النقل اليومي الثابت للموظفين بين التجمعات السكنية (مثل الشارقة، ديرة، بر دبي، سونابور، ومجمع دبي للاستثمار) ومقرات الشركات في دبي.'
        : 'Comprehensive door-to-workplace daily transit connecting your entire workforce across Dubai, Sharjah, Ajman, and Abu Dhabi with guaranteed punctuality.',
      features: [
        'Dedicated assigned bus with high-output Gulf AC',
        'Customized stops and optimized routing avoiding congestion',
        'Certified RTA commercial driver captain',
        'Live GPS tracking link for HR and operations teams',
        'Guaranteed replacement vehicle in case of breakdown within 30 minutes',
      ],
      idealFor: 'Offices, Banks, Tech Hubs, Telecom, Retail chains with standard business hours.',
    },
    {
      id: 'corporate-shuttle',
      title: isArabic ? 'حافلات الشركات ومحطات المترو الترددية' : 'Corporate Campus & Metro Feeder Shuttles',
      badge: 'Flexible Frequency',
      desc: isArabic
        ? 'حافلات ترددية مستمرة تربط مقار الشركات بأقرب محطات مترو دبي (مثل مترو ابن بطوطة، المركز المالي، مدينة دبي للإنترنت) لنقل الموظفين والزوار.'
        : 'Short-loop shuttle services running at regular intervals (every 10-20 mins) during peak arrival and departure windows.',
      features: [
        'High frequency peak-hour loops (7:00-9:30 AM & 4:30-7:00 PM)',
        'Convenient designated pickup bays at Dubai Metro stations',
        'Reduced parking congestion and zero employee transit stress',
        'Branded electronic LED route displays',
        'Flexible monthly and annual contract arrangements',
      ],
      idealFor: 'DIFC, Business Bay, Dubai Media City, Internet City, and large corporate headquarters.',
    },
    {
      id: 'shift-logistics',
      title: isArabic ? 'نقل المناوبات والورديات المستمرة (24/7)' : '24/7 Shift Logistics & Industrial Rotation',
      badge: '24/7 Operations',
      desc: isArabic
        ? 'نظام نقل مدار الساعة يلبي احتياجات المصانع، المستشفيات، وشركات الطيران والمستودعات التي تعمل بنظام 2 أو 3 ورديات متداخلة.'
        : 'Engineered for operational continuity with precise timing for shift handovers, night shifts, and emergency unscheduled call-ins.',
      features: [
        'Round-the-clock dispatch desk in Dubai Investment Park',
        'Synchronized changeover schedules (e.g. 7:00 AM / 3:00 PM / 11:00 PM)',
        'Fatigue-managed driver shift rotations compliant with RTA regulations',
        'Real-time passenger manifest tracking',
        'Emergency surge capacity for unscheduled overtime shifts',
      ],
      idealFor: 'Manufacturing plants, hospitals, pharmaceutical hubs, airport catering, and fulfillment centers.',
    },
    {
      id: 'industrial-free-zone',
      title: isArabic ? 'نقل القوى العاملة للمناطق الحرة والمواقع الإنشائية' : 'Industrial & Free Zone Workforce Fleet',
      badge: 'High Capacity',
      desc: isArabic
        ? 'أسطول حافلات ثقيلة سعة 50 و60 راكب مخصصة لنقل أعداد كبيرة من الكوادر الفنية والعمال بين المجمعات العمالية ومواقع العمل في جافزا وDIP.'
        : 'Robust, heavy-duty commercial transport built for volume workforce logistics connecting high-density accommodations to ports and plants.',
      features: [
        '50 & 53-seater heavy commercial buses',
        'Heavy-duty cooling systems engineered for UAE summer temperatures (up to 50°C)',
        'Strict safety protocols, speed limiters (governed at 100 km/h), and fire safety equipment',
        'Cost-effective per-head rate structures',
        'Daily vehicle sanitization and hygiene audits',
      ],
      idealFor: 'JAFZA North/South, Dubai Investment Park 1 & 2, Dubai South, DAFZA, and Al Quoz.',
    },
    {
      id: 'executive-luxury',
      title: isArabic ? 'النقل التنفيذي للوفود والمؤتمرات' : 'Executive VIP & Management Transport',
      badge: 'Premium Tier',
      desc: isArabic
        ? 'خدمة نقل راقية للمدراء التنفيذيين، المستثمرين، وضيوف الفعاليات والمؤتمرات على متن حافلات صغيرة فاخرة مع وسائل راحة متطورة.'
        : 'Chauffeured luxury vans (Mercedes V-Class, Hyundai Staria VIP, HiAce Executive) with plush leather interiors, Wi-Fi, and suited captains.',
      features: [
        'Luxury leather reclining seats with USB charging ports',
        'Complimentary high-speed on-board Wi-Fi and bottled water',
        'English & Arabic fluent, background-verified executive chauffeurs',
        'DXB / DWC Airport meet & assist with flight tracking',
        'Discreet, pristine, non-commercial exterior styling',
      ],
      idealFor: 'Board members, executive leadership teams, diplomatic delegations, and VIP event transfers.',
    },
    {
      id: 'full-outsourcing',
      title: isArabic ? 'تعهيد وإدارة النقل الشامل (Fleet Outsourcing)' : 'Complete Transport Management Outsourcing',
      badge: 'Turnkey Solution',
      desc: isArabic
        ? 'إدارة متكاملة لمنظومة نقل شركتك بالكامل، تشمل توريد المركبات، تعيين السائقين، الوقود، تراخيص هيئة الطرق، والصيانة والتقارير الشهرية.'
        : 'Eliminate fleet overhead, maintenance headaches, driver hiring risks, and regulatory fines by outsourcing your entire mobility operations.',
      features: [
        'Dedicated account manager and route optimization team',
        'Zero capital expenditure on vehicle purchasing or depreciation',
        'Complete regulatory coverage: RTA permits, Tasjeel inspections, insurance',
        'Live Client Portal with attendance, route telemetry, and KPI reporting',
        'Fixed, predictable monthly billing with transparent fuel adjustments',
      ],
      idealFor: 'Enterprises seeking to optimize operational expenditure and focus on core business operations.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: isArabic ? 'دراسة المسارات والتدقيق' : 'Route Audit & Shift Analysis',
      desc: isArabic
        ? 'نقوم بتحليل مواقع سكن موظفيك ومواعيد الدوام لاقتراح أفضل المسارات ونقاط التجمع لتوفير الوقت.'
        : 'We analyze employee residential clusters, shift times, and traffic bottlenecks to build the optimal transit matrix.',
    },
    {
      step: '02',
      title: isArabic ? 'تخصيص الأسطول والسائقين' : 'Fleet & Captain Assignment',
      desc: isArabic
        ? 'تخصيص الحافلات المناسبة سعةً ومواصفات وتعيين سائقين مدربين ومرخصين من هيئة الطرق والمواصلات.'
        : 'Deploying appropriately sized modern vehicles and assigning RTA-certified drivers with specific corridor experience.',
    },
    {
      step: '03',
      title: isArabic ? 'التشغيل والتتبع المباشر' : 'Live Operations & GPS Telematics',
      desc: isArabic
        ? 'بدء التشغيل اليومي مع مراقبة حية من غرفة التحكم على مدار الساعة وتوفير روابط التتبع لفريقكم.'
        : 'Daily dispatch monitored 24/7 by our central control room with live telematics, speed alerts, and punctuality logs.',
    },
    {
      step: '04',
      title: isArabic ? 'تقارير الأداء الشهرية والتحسين' : 'Monthly KPI Review & Optimization',
      desc: isArabic
        ? 'مراجعة دورية لمؤشرات الالتزام بالمواعيد وملاحظات الركاب وإعادة ضبط المسارات مع تغير مقرات العمل.'
        : 'Delivering comprehensive monthly reports on on-time delivery, passenger feedback, and dynamic route adjustments.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Banner */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Bus className="w-3.5 h-3.5" />
            <span>{isArabic ? 'خدمات النقل المؤسسي' : 'Fleet & Transportation Services'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'حلول نقل متكاملة لشركات ومؤسسات دبي' : 'Enterprise Transportation Solutions Across Dubai'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isArabic
              ? 'نقدم منظومة نقل شاملة تلبي احتياجات الشركات، المصانع، والمستشفيات مع ضمان أعلى معايير الأمان ودقة المواعيد.'
              : 'From high-density daily shift shuttles to executive corporate transfers, our managed fleet connects your workforce seamlessly across all UAE Emirates.'}
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
              {isArabic ? 'طلب تسعير لخدمة محددة' : 'Request Service Quotation'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/fleet')} className="border-slate-700 text-white hover:bg-slate-800">
              {isArabic ? 'استعراض مواصفات الأسطول' : 'View Fleet Specifications'}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {detailedServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4 text-left rtl:text-right">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold px-2.5 py-1 bg-orange-100 text-orange-800 rounded-lg border border-orange-200">
                    {srv.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Service #{idx + 1}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0A192F]">{srv.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{srv.desc}</p>

                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {isArabic ? 'المزايا والمواصفات التشغيلية:' : 'Key Operational Specifications:'}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-700">{isArabic ? 'مثالي لـ: ' : 'Ideal Sectors: '}</span>
                  <span>{srv.idealFor}</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>RTA Regulated & Insured</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {isArabic
                      ? 'جميع الرحلات مشمولة بتأمين شامل على الركاب، وسائقين مفحوصين طبياً ومعتمدين.'
                      : 'All passenger seats fully covered under UAE commercial transit insurance with 24/7 dispatch monitoring.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/contact')}
                    rightIcon={<ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}
                  >
                    {isArabic ? 'طلب عرض سعر لهذه الخدمة' : 'Request Route Proposal'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/fleet')}
                  >
                    {isArabic ? 'استعراض الحافلات الملائمة' : 'View Recommended Fleet'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Workflow */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'كيف نعمل' : 'Our Operational Blueprint'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'آلية تشغيل خدمات النقل من التعاقد حتى الانطلاق' : 'How We Implement & Manage Your Transport Contract'}
            </h2>
            <p className="text-sm text-slate-600">
              {isArabic
                ? 'منهجية دقيقة تضمن بدء الخدمة بسلاسة وبدون أي انقطاع في مواعيد دوام موظفيك.'
                : 'A structured 4-phase rollout ensuring a seamless transition and continuous on-time transport.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((wf, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative hover:border-orange-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-3xl font-extrabold text-orange-500/90 font-heading">{wf.step}</div>
                  <h3 className="text-base font-bold text-[#0A192F]">{wf.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{wf.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'معايير جودة معتمدة' : 'Standard Operating Protocol'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'هل تحتاج إلى تصميم مسار مخصص لشركتك؟' : 'Need a Customized Route for Your Workforce?'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'يقوم فريق تخطيط المسارات لدينا بدراسة إحداثيات منازل موظفيك وتصميم المسار الأكثر كفاءة وأقل تكلفة.'
              : 'Our route planning team will map your employee coordinates and design the most cost-efficient corridor matrix.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'تحدث مع خبير النقل التجاري' : 'Talk with a Route Consultant'}
          </Button>
        </div>
      </section>
    </div>
  );
};
