import React, { useEffect } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Star,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface ClientsPageProps {
  navigate: (path: string) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'عملاؤنا وشركاء النجاح - مواصلات موظفي دبي' : 'Corporate Clients & Partnerships | Dubai Staff Transport',
      description: isArabic
        ? 'تعرف على الشركات والمؤسسات الرائدة التي تثق بخدماتنا في نقل موظفيها عبر إمارات الدولة.'
        : 'Discover the enterprise organizations, industrial conglomerates, and healthcare providers partnering with Dubai Staff Transport.',
      keywords: ['corporate clients transport Dubai', 'UAE staff transport case studies', 'commercial transport references Dubai'],
    });
  }, [isArabic]);

  const clientCategories = [
    {
      category: isArabic ? 'القطاع الصناعي والتصنيع' : 'Industrial & Manufacturing',
      count: '32+ Companies',
      examples: ['Gulf Precision Engineering LLC', 'Emirates Metal Fabrication', 'JAFZA Global Logistics FZE', 'National Plastic Industries'],
      description: isArabic
        ? 'نقل يومي لأكثر من 3,800 عامل وفني عبر 3 مناوبات عمل متتالية في مجمع دبي للاستثمار وجافزا.'
        : 'Deploying synchronized 3-shift workforce transfers for 3,800+ technical staff in DIP and JAFZA.',
    },
    {
      category: isArabic ? 'المراكز المالية والشركات الإدارية' : 'Corporate & Financial Headquarters',
      count: '24+ Enterprises',
      examples: ['Al Futtaim Business Services', 'Emirates Retail Solutions', 'Dubai Silicon Technologies', 'Gulf Trading Consortium'],
      description: isArabic
        ? 'حافلات ترددية وسريعة تربط محطات المترو بأبراج المكاتب في الخليج التجاري ومركز دبي المالي العالمي.'
        : 'Executive coaster and feeder loops serving Business Bay, DIFC, and Dubai Internet City.',
    },
    {
      category: isArabic ? 'قطاع الضيافة والفنادق الفاخرة' : 'Hospitality & Luxury Resorts',
      count: '18+ Hotels & Resorts',
      examples: ['Jumeirah Coast Luxury Resort', 'Marina Grand Suites', 'Downtown Heritage Hotel', 'Palm Gateway Residences'],
      description: isArabic
        ? 'خدمات نقل معقمة على مدار الساعة لطواقم الضيافة والمطاعم مع التزام تام بالمظهر والأناقة.'
        : 'Round-the-clock pristine shuttles for hospitality personnel with dedicated nighttime safety protocols.',
    },
    {
      category: isArabic ? 'المستشفيات والمراكز الطبية' : 'Healthcare & Hospital Networks',
      count: '12+ Medical Hubs',
      examples: ['Emirates Health Clinic Network', 'Dubai Specialized Surgical Center', 'Al Barsha Community Hospital'],
      description: isArabic
        ? 'نقل دقيق للأطباء وفرق التمريض لضمان تسليم الورديات الطبية الحساسة بدون أي تأخير.'
        : 'Guaranteed punctual transit for critical clinical teams with standby emergency vehicles.',
    },
  ];

  const caseStudies = [
    {
      title: 'Optimizing 3-Shift Transit for 450 Factory Workers in DIP 2',
      client: 'Heavy Engineering Manufacturer',
      impact: 'Reduced transit time by 28% and achieved 99.4% on-time shift arrivals over 24 consecutive months.',
      metrics: ['450 Daily Workers', '8 Assigned Coaches', '99.4% Punctuality'],
    },
    {
      title: 'Zero-Congestion Metro Feeder Loop for Financial District HQ',
      client: 'Multinational Retail & Financial Group',
      impact: 'Cut employee commuting complaints by 85% and reduced corporate parking bay subsidies by AED 320,000 annually.',
      metrics: ['280 Daily Employees', '15-Min Peak Frequency', '100% Satisfaction'],
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'عملاؤنا وشراكاتنا' : 'Enterprise Client Network'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'شركاء نعتز بخدمتهم ونمو أعمالهم' : 'Trusted by 85+ Leading Organizations Across the UAE'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {isArabic
              ? 'نبني شراكات استراتيجية طويلة الأمد قائمة على الموثوقية والشفافية التامة والالتزام بأعلى معايير الخدمة.'
              : 'Delivering dependable, compliant, and technology-monitored staff transport solutions for top employers across Dubai.'}
          </p>
        </div>
      </section>

      {/* Client Categories Breakdown */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'تنوع القطاعات' : 'Sectors Served'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'حلول مصممة لكل نموذج عمل' : 'Tailored Fleet Deployments by Industry'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clientCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-orange-500 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#0A192F]">{cat.category}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 bg-orange-100 text-orange-800 rounded-lg">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                      {isArabic ? 'أمثلة لشركائنا في هذا القطاع:' : 'Representative Client Engagements:'}
                    </span>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                      {cat.examples.map((ex, exI) => (
                        <li key={exI} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/contact')}
                  >
                    {isArabic ? 'طلب عرض مخصص لهذا القطاع' : 'Inquire for This Sector'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Spotlight */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'دراسات حالة وأثر ملموس' : 'Operational Case Studies'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'نتائج واقعية حققناها لعملائنا في دبي' : 'Measurable Impact Delivered in the Field'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((cs, idx) => (
              <div
                key={idx}
                className="bg-[#0A192F] text-white rounded-2xl p-8 border border-slate-800 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-orange-400 tracking-wider">
                    {cs.client}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">{cs.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{cs.impact}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
                  {cs.metrics.map((m, mi) => (
                    <div key={mi} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-emerald-400 truncate">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'انضم إلى نخبة الشركات المستفيدة من خدماتنا' : 'Join Dubai’s Leading Employers Today'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'احصل على عرض سعر تجاري متكامل مع دراسة مسار مخصصة لشركتك خلال 30 دقيقة.'
              : 'Our commercial team is ready to analyze your workforce locations and propose a tailored fleet matrix.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'طلب عرض سعر تجاري' : 'Request Corporate Proposal'}
          </Button>
        </div>
      </section>
    </div>
  );
};
