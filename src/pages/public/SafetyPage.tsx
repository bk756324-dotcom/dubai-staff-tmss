import React, { useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck,
  HeartPulse,
  Flame,
  Gauge,
  Phone,
  ArrowRight,
  Eye,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface SafetyPageProps {
  navigate: (path: string) => void;
}

export const SafetyPage: React.FC<SafetyPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'معايير السلامة وهيئة الطرق (RTA) - مواصلات موظفي دبي' : 'Safety Standards & RTA Regulatory Protocols | Dubai Staff Transport',
      description: isArabic
        ? 'اطلع على منظومة السلامة المعتمدة لدينا: تراخيص هيئة الطرق والمواصلات، تدريب السائقين الوقائي، تقييد السرعة الذكي، وفحص الصيانة الدوري.'
        : 'Discover our 6-pillar corporate transportation safety framework, RTA commercial licensing, driver captain vetting, speed limiters, and emergency protocols in Dubai.',
      keywords: ['RTA safety standards Dubai', 'staff transport safety UAE', 'commercial bus driver vetting Dubai', 'passenger insurance Dubai transport'],
    });
  }, [isArabic]);

  const safetyPillars = [
    {
      title: isArabic ? '1. ترخيص واعتماد هيئة الطرق والمواصلات (RTA)' : '1. RTA Commercial Operator Licensing',
      icon: ShieldCheck,
      desc: isArabic
        ? 'نحمل ترخيص نقل تجاري معتمد برقم (89204-DXB)، وجميع حافلاتنا مسجلة ومطابقة لجميع اللوائح الاتحادية والمحلية لإمارة دبي.'
        : 'Fully licensed commercial passenger transport provider under RTA Commercial Transport Permit #89204-DXB, in strict compliance with UAE federal and Dubai municipal road transport mandates.',
    },
    {
      title: isArabic ? '2. اختيار وتدريب كباتن الحافلات (Driver Captains)' : '2. Rigorous Driver Captain Vetting & Training',
      icon: HeartPulse,
      desc: isArabic
        ? 'سائقونا يحملون رخص قيادة حافلات ثقيلة سارية من الإمارات مع خبرة لا تقل عن 3 سنوات، ويخضعون لفحوصات طبية سنوية وتدريب دوري على القيادة الوقائية.'
        : 'All captains hold valid UAE Heavy Bus commercial licenses (min 3+ years experience), undergo mandatory annual medical fitness clearances, drug screenings, and defensive driving refresher courses.',
    },
    {
      title: isArabic ? '3. محددات السرعة الذكية (100 كم/ساعة)' : '3. Calibrated Speed Limiters & Governor Controls',
      icon: Gauge,
      desc: isArabic
        ? 'جميع حافلات الأسطول مزودة بمحددات سرعة معتمدة ومبرمجة عند 100 كم/ساعة كحد أقصى لمنع أي تجاوز للسرعة وحماية الركاب.'
        : 'Every vehicle in our fleet is mechanically and electronically governed at a maximum speed of 100 km/h in accordance with RTA commercial bus mandates, with automatic telematics alerts for overspeed events.',
    },
    {
      title: isArabic ? '4. أنظمة الإطفاء والسلامة من الحرائق' : '4. Automatic Fire Suppression & Emergency Exits',
      icon: Flame,
      desc: isArabic
        ? 'حجرات المحرك مزودة بأنظمة إطفاء حرائق آلية (Fire Suppression)، مع مخارج طوارئ علوية، ومطارق كسر الزجاج، وطفايات حريق معتمدة.'
        : 'Engine bays are equipped with automated thermal fire suppression systems, complemented by certified cabin fire extinguishers, dual roof escape hatches, and glass-break emergency hammers.',
    },
    {
      title: isArabic ? '5. المراقبة والتتبع المباشر 24/7 (Live Telematics)' : '5. 24/7 Real-Time Telematics & Control Room',
      icon: Radio,
      desc: isArabic
        ? 'غرفة تحكم مركزية في مجمع دبي للاستثمار ترصد حركة الحافلات وسرعتها وسلوك السائقين وتوفر الدعم الفوري عند أي طارئ.'
        : 'Our central operations control room continuously monitors GPS coordinates, harsh braking, lane swerving, and traffic diversions across all active routes in the UAE.',
    },
    {
      title: isArabic ? '6. التأمين الشامل على الركاب والمسؤولية' : '6. Comprehensive Commercial Passenger Insurance',
      icon: FileCheck,
      desc: isArabic
        ? 'تغطية تأمينية كاملة وتجارية على كل مقعد في الأسطول، لحماية الموظفين والشركات من أي مخاطر أو مسؤوليات قانونية.'
        : 'Full commercial passenger liability coverage on every registered seat, underwriting our corporate clients and their workforce with maximum legal peace of mind.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('safety.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {t('safety.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {t('safety.subtitle')}
          </p>
        </div>
      </section>

      {/* 6 Pillars Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'منظومة الأمان المتكاملة' : 'Our 6-Pillar Framework'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'حماية موظفيك هي أولويتنا التشغيلية الأولى' : 'Engineered for Absolute Safety & Zero Compromise'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-500 transition-colors space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0A192F]">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Driver Captain Vetting Checklist */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A192F] text-white rounded-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-orange-400 rounded-full text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{isArabic ? 'معايير اختيار السائقين' : 'Driver Captain Criteria'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {isArabic ? 'كيف نختار وندرب كباتن حافلاتنا؟' : 'How We Certify Our Commercial Captains'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isArabic
                  ? 'السائق هو حجر الأساس في سلامة الركاب. نطبق إجراءات توظيف وفحص صارمة لا تقبل التهاون لضمان أعلى مستويات الالتزام والأخلاق المهنية.'
                  : 'Our drivers are not just operators; they are certified transport professionals thoroughly trained in customer care, emergency response, and UAE traffic regulations.'}
              </p>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 rounded-xl p-6 border border-slate-800 space-y-3 text-xs text-slate-300">
              {[
                isArabic ? 'رخصة قيادة حافلة ثقيلة إماراتية سارية المفعول (فئة 6)' : 'Valid UAE Category 6 Heavy Commercial Bus License',
                isArabic ? 'سجل قيادة مروري نظيف وخالٍ من المخالفات الجسيمة' : 'Clean Dubai Police traffic record with zero serious infractions',
                isArabic ? 'فحص طبي وبصري شامل وفحص عدم تعاطي سنوي' : 'Comprehensive annual occupational health and vision clearance',
                isArabic ? 'إتقان اللغتين الإنجليزية والأساسية العربية للتواصل الفعال' : 'Functional English and Arabic conversational fluency',
                isArabic ? 'التزام تام بساعات الراحة ومنع القيادة أثناء الإرهاق' : 'Strict enforcement of maximum driving hours to prevent fatigue',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Control & Response */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'غرفة طوارئ وعمليات مركزية على مدار الساعة' : '24/7 Operations Command & Incident Hotline'}
            </h2>
            <p className="text-sm text-slate-600">
              {isArabic
                ? 'فريق منسقي العمليات متاح دائماً لدعم السائقين والشركات وحل أي طارئ على الطريق في دقائق.'
                : 'Direct escalation hotline connecting your HR desk with our central dispatchers in Dubai.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-900">
            <Phone className="w-6 h-6 text-orange-500" />
            <div className="text-left rtl:text-right">
              <div className="text-xs text-slate-500 font-semibold">{isArabic ? 'خط العمليات المباشر 24/7' : '24/7 Direct Dispatch Hotline'}</div>
              <div className="text-lg font-bold font-mono text-[#0A192F]">+971 4 388 9000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'اطلب نسخة من ملف الامتثال وتراخيص RTA' : 'Request Our RTA Compliance & Safety Dossier'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'يسرنا تزويد مسؤولي المشتريات والموارد البشرية بجميع شهادات التأمين وتراخيص هيئة الطرق.'
              : 'Our compliance department will provide full insurance policies, operator permits, and fleet inspection certificates.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'طلب ملف التراخيص والسلامة' : 'Request Compliance Dossier'}
          </Button>
        </div>
      </section>
    </div>
  );
};
