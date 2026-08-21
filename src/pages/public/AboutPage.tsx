import React, { useEffect } from 'react';
import {
  Bus,
  ShieldCheck,
  Target,
  Eye,
  Award,
  Users,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'عن الشركة وتاريخنا - مواصلات موظفي دبي' : 'About Us & Company Heritage | Dubai Staff Transport',
      description: isArabic
        ? 'تعرف على قصة تأسيس مواصلات موظفي دبي، رؤيتنا، قيمنا الأساسية، ومقر عملياتنا في مجمع دبي للاستثمار.'
        : 'Learn about our corporate history, leadership team, 24/7 operations depot in DIP 2, and commitment to safe workforce transport in Dubai.',
      keywords: ['about Dubai staff transport', 'commercial fleet operator UAE', 'DIP 2 transport company Dubai'],
    });
  }, [isArabic]);

  const values = [
    {
      title: isArabic ? '1. الالتزام والدقة (Punctuality)' : '1. Relentless Punctuality',
      desc: isArabic
        ? 'الوقت هو عصب الإنتاجية. نعتبر الالتزام بالمواعيد التزاماً مقدساً تدعمه أنظمة تتبع رقمية دقيقة.'
        : 'Every minute matters. Our 99.2% on-time dispatch SLA is backed by sub-second telematics and standby fleet buffers.',
    },
    {
      title: isArabic ? '2. السلامة فوق كل اعتبار (Safety First)' : '2. Safety Without Compromise',
      desc: isArabic
        ? 'سلامة كل راكب وسائق ومستخدم طريق هي مسؤوليتنا الكبرى عبر تدريب صارم وصيانة وقائية استباقية.'
        : 'We maintain zero tolerance for non-compliance, operating under strict RTA guidelines, speed limiters, and daily vehicle checks.',
    },
    {
      title: isArabic ? '3. الريادة التقنية والشفافية (Tech-Driven)' : '3. Technology & Transparency',
      desc: isArabic
        ? 'نوفر لعملائنا رؤية حية كاملة لرحلاتهم وأسطولهم دون أي غموض أو تكاليف خفية.'
        : 'Empowering HR directors and operations managers with live GPS visibility, attendance tracking, and transparent reporting.',
    },
    {
      title: isArabic ? '4. الشراكة المستدامة (Client Partnership)' : '4. Collaborative Partnership',
      desc: isArabic
        ? 'لا نعتبر أنفسنا مجرد مزود حافلات، بل شريكاً استراتيجياً يتفهم تحديات عملك وينمو معك.'
        : 'We act as an extension of your operations, adapting dynamically to shift adjustments, expansions, and emergency surges.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'عن الشركة' : 'Company Overview'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'الريادة في حلول النقل المؤسسي والتجاري في دبي' : 'Powering UAE Corporate Mobility for Over 15 Years'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isArabic
              ? 'تأسست مواصلات موظفي دبي بهدف إعادة تعريف معايير نقل القوى العاملة والكوادر الإدارية من خلال الجمع بين الأسطول الحديث، السائقين المعتمدين، والتقنية الذكية.'
              : 'Founded with a singular mission: to provide Dubai enterprises with a dependable, technology-enabled, and strictly compliant staff transport ecosystem.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A192F] font-heading">
                {isArabic ? 'رسالتنا (Our Mission)' : 'Our Mission'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isArabic
                  ? 'تمكين الشركات والمصانع في دبي من تحقيق أعلى مستويات الإنتاجية عبر توفير حلول نقل موظفين آمنة ومريحة ودقيقة المواعيد ترفع من رضا الموظفين وتزيل أعباء إدارة الأساطيل عن كاهل الإدارة.'
                  : 'To empower organizations across the UAE by delivering seamless, safe, and punctual workforce transportation, reducing corporate operational burdens while elevating employee daily commuting standards.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A192F] font-heading">
                {isArabic ? 'رؤيتنا (Our Vision)' : 'Our Vision'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isArabic
                  ? 'أن نكون الخيار الأول والأكثر موثوقية في دولة الإمارات العربية المتحدة لإدارة النقل التجاري والمؤسسي، وأن نقود التحول الرقمي والاستدامة البيئية في قطاع نقل الركاب.'
                  : 'To stand as the undisputed benchmark for commercial corporate transport management in the Middle East, leading through fleet electrification, telematics innovation, and uncompromising safety.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'مبادئنا الأساسية' : 'Guiding Principles'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'القيم التي تحكم كل رحلة ننطلق بها' : 'The Values That Guide Every Kilometer We Drive'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0A192F]">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Headquarters & Depot Spotlight */}
      <section className="py-16 bg-[#0A192F] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase text-orange-400 tracking-wider">
                {isArabic ? 'المقر الرئيسي والمستودع المركزي' : 'Operations Headquarters & Depot'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {isArabic ? 'مجمع دبي للاستثمار (DIP 2) — قلب عملياتنا' : 'Dubai Investment Park 2 Operations Command'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isArabic
                  ? 'يقع مجمع عملياتنا على مساحة مجهزة تضم ورشة صيانة متكاملة، محطة وقود، مغسلة حافلات آلية، وغرفة تحكم وتتبع تعمل على مدار 24 ساعة لخدمة جميع إمارات الدولة.'
                  : 'Our strategically positioned facility in DIP 2 houses our 24/7 central telematics dispatch room, commercial maintenance bays, automated bus wash station, and dedicated driver training center.'}
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Plot 598-102, Industrial Cluster, Dubai Investment Park 2, Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>24 Hours / 7 Days a Week Dispatch Readiness</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                {isArabic ? 'بيانات الاعتماد والتراخيص الرسمية' : 'Official Certifications & Registrations'}
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">RTA Commercial Permit:</span>
                  <span className="font-mono text-emerald-400 font-bold">#89204-DXB</span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Quality Management:</span>
                  <span className="font-semibold text-white">ISO 9001:2015 Certified</span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Road Traffic Safety:</span>
                  <span className="font-semibold text-white">ISO 39001 Compliant</span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Dubai Chamber of Commerce:</span>
                  <span className="font-semibold text-white">Active Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
            {isArabic ? 'هل ترغب في زيارة مقر عملياتنا؟' : 'Schedule a Visit to Our Operations Depot'}
          </h2>
          <p className="text-sm text-slate-600">
            {isArabic
              ? 'يسعدنا دائماً استقبال مدراء الموارد البشرية والمشتريات لمعاينة الأسطول والاطلاع على منظومة العمليات.'
              : 'Meet our fleet managers, inspect our coaches, and see our live control room in action.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'تواصل معنا وحجز موعد' : 'Schedule Depot Tour'}
          </Button>
        </div>
      </section>
    </div>
  );
};
