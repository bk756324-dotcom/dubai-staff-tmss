import React, { useState, useEffect } from 'react';
import {
  Bus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
  Wind,
  Gauge,
  Radio,
  Sparkles,
  Users,
  Luggage,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface FleetPageProps {
  navigate: (path: string) => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HEAVY' | 'MEDIUM' | 'LIGHT' | 'EXECUTIVE'>('ALL');

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'الأسطول - مواصفات حافلات ومركبات النقل' : 'Commercial Fleet Specifications | Dubai Staff Transport',
      description: isArabic
        ? 'استعرض أسطولنا من الحافلات والمركبات التجارية: حافلات 50 راكب، باصات كوستر 30 راكب، وفانات هايس 14 راكب مجهزة بتكييف هواء فائق وأنظمة تتبع GPS.'
        : 'Explore our modern fleet of 50-seater luxury coaches, 30-seater coasters, 14-seater HiAce vans, and VIP executive vehicles in Dubai.',
      keywords: ['Dubai bus rental fleet', '50 seater bus Dubai', 'Toyota Coaster rental UAE', 'Toyota HiAce staff transport', 'RTA compliant commercial buses'],
    });
  }, [isArabic]);

  const fleetCategories = [
    {
      id: '50-seater-coach',
      category: 'HEAVY',
      name: isArabic ? 'حافلة ثقيلة فاخرة (50 / 53 راكب)' : '50 / 53-Seater Heavy Luxury Coach',
      models: 'King Long / Yutong / Ashok Leyland Falcon',
      capacity: '50 - 53 Passengers + Captain',
      luggage: 'Underfloor Luggage Compartments + Overhead Racks',
      ac: 'Carrier / Thermo King Dual High-Capacity Gulf AC',
      safety: ['RTA Speed Governor (100 km/h)', 'Full Seatbelts on every seat', 'Automatic Fire Suppression Engine System', 'Roof Emergency Exits (2)'],
      telematics: ['Live GPS Telematics', 'Driver Dashcam & Cabin Safety Monitoring', 'Automated Door Sensors'],
      bestFor: isArabic
        ? 'الشركات الكبرى، نقل المصانع، والمناوبات ذات الكثافة العالية بين المدن العمالية ومناطق العمل'
        : 'High-density daily workforce commute, factory shift rotations, and corporate inter-emirate transit.',
      imageBadge: isArabic ? 'حافلة ثقيلة' : 'Heavy Commercial Coach',
    },
    {
      id: '30-seater-coaster',
      category: 'MEDIUM',
      name: isArabic ? 'حافلة متوسطة كوستر (30 / 33 راكب)' : '30 / 33-Seater Medium Bus (Coaster)',
      models: 'Toyota Coaster / Mitsubishi Rosa / Ashok Leyland Oyster',
      capacity: '30 - 33 Passengers + Captain',
      luggage: 'Rear Boot & Overhead Parcel Shelves',
      ac: 'Denso High-Output Rapid Cooling Air Conditioning',
      safety: ['RTA Speed Limiter (100 km/h)', 'Emergency Hammer & Fire Extinguishers', 'Anti-lock Braking System (ABS)'],
      telematics: ['GPS Live Route Tracking', 'Speed Deviation Alarms', 'Automated Passenger Counter'],
      bestFor: isArabic
        ? 'الحافلات الترددية للمترو، المدارس، الفنادق، ومقرات الشركات في دبي داون تاون ومارينا'
        : 'Metro feeder loops, hotel staff shuttles, business district commutes, and educational institutions.',
      imageBadge: isArabic ? 'حافلة متوسطة' : 'Medium Bus',
    },
    {
      id: '14-seater-hiace',
      category: 'LIGHT',
      name: isArabic ? 'فان الركاب السريع (14 / 15 راكب)' : '14 / 15-Seater Commuter Minivan (HiAce)',
      models: 'Toyota HiAce Commuter / Nissan Urvan',
      capacity: '14 - 15 Passengers + Captain',
      luggage: 'Rear Trunk Area',
      ac: 'Dual Front & Rear Passenger AC Vents',
      safety: ['Speed Governor (100 km/h)', '3-Point Front Belts & Lap Rear Belts', 'Side-Impact Door Beams'],
      telematics: ['Live GPS Location Tracking', 'Real-time ETA Dispatch Engine'],
      bestFor: isArabic
        ? 'فرق العمل الإدارية، الطواقم الطبية، المناوبات السريعة، والتنقل المرن في شوارع دبي السكنية'
        : 'Executive office staff, rapid hospital medical teams, split-shift staff, and dense residential pickups.',
      imageBadge: isArabic ? 'فان ركاب' : 'Light Commuter',
    },
    {
      id: 'executive-mpv',
      category: 'EXECUTIVE',
      name: isArabic ? 'مركبة كبار الشخصيات التنفيذية (7 ركاب)' : '7-Seater Executive VIP MPV',
      models: 'Mercedes-Benz V-Class / Hyundai Staria VIP',
      capacity: '6 - 7 VIP Passengers + Chauffeur',
      luggage: 'Spacious Rear Luggage Area (4-6 Suitcases)',
      ac: 'Multi-Zone Automatic Climate Control',
      safety: ['Pre-Safe Active Safety System', 'Lane Departure Assist', '360-Degree Surround Camera'],
      telematics: ['Live VIP GPS Status', 'Flight Tracking Dispatch Integration'],
      bestFor: isArabic
        ? 'المدراء التنفيذيون، أعضاء مجلس الإدارة، وفود المؤتمرات، واستقبال كبار الشخصيات في المطارات'
        : 'Executive leadership transit, diplomatic delegations, VIP airport transfers, and investor roadshows.',
      imageBadge: isArabic ? 'تنفيذي فاخر' : 'Executive VIP',
    },
  ];

  const filteredFleet = selectedFilter === 'ALL'
    ? fleetCategories
    : fleetCategories.filter((f) => f.category === selectedFilter);

  const maintenanceProtocols = [
    {
      title: isArabic ? 'الفحص اليومي قبل انطلاق الرحلة (Pre-Trip Check)' : 'Daily Pre-Trip Inspection',
      desc: isArabic
        ? 'يقوم السائق وفني الصيانة بفحص ضغط الإطارات، مستويات الزيوت، كفاءة المكابح، وجاهزية نظام التكييف قبل كل وردية.'
        : 'Mandatory driver & technician checklist verifying tire pressure, fluids, braking efficiency, AC delta temperatures, and safety gear.',
    },
    {
      title: isArabic ? 'دورة الصيانة الوقائية كل 5,000 كم' : '5,000 KM Preventive Maintenance',
      desc: isArabic
        ? 'فحص دوري كامل وتغيير للزيوت والفلاتر واستبدال القطع الاستهلاكية في ورشة الصيانة المعتمدة بمجمع دبي للاستثمار.'
        : 'Complete mechanical diagnostics, oil/filter service, and component replacement at our centralized DIP 2 workshop.',
    },
    {
      title: isArabic ? 'الامتثال السنوي لتسجيل وهيئة الطرق (Tasjeel & RTA)' : 'Tasjeel & RTA Annual Certification',
      desc: isArabic
        ? 'جميع حافلاتنا تجتاز الفحص الفني الصارم لمركز تسجيل ومرخصة لنقل الركاب التجاري في دبي مع تأمين شامل.'
        : '100% compliant with Tasjeel commercial roadworthiness tests, speed limiter calibration, and comprehensive commercial passenger insurance.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Bus className="w-3.5 h-3.5" />
            <span>{t('fleet.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {t('fleet.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {t('fleet.subtitle')}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-slate-200 py-4 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
            <Filter className="w-4 h-4 text-orange-500" />
            <span>{isArabic ? 'تصفية حسب سعة المركبة:' : 'Filter Fleet:'}</span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: isArabic ? 'جميع الفئات (120+)' : 'All Vehicles' },
              { id: 'HEAVY', label: isArabic ? 'حافلات 50 راكب' : '50-Seater Coaches' },
              { id: 'MEDIUM', label: isArabic ? 'باصات 30 راكب' : '30-Seater Coasters' },
              { id: 'LIGHT', label: isArabic ? 'فانات 14 راكب' : '14-Seater HiAce' },
              { id: 'EXECUTIVE', label: isArabic ? 'تنفيذي فاخر' : 'Executive VIP' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Cards Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {/* Visual Specification Sidebar */}
              <div className="lg:col-span-4 bg-[#0A192F] text-white p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-block px-2.5 py-1 bg-orange-500 text-white rounded text-xs font-bold uppercase tracking-wider">
                    {vehicle.imageBadge}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-heading">{vehicle.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{vehicle.models}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Luggage className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{vehicle.luggage}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{vehicle.ac}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/contact')}
                    rightIcon={<ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />}
                  >
                    {isArabic ? 'طلب تسعير لهذا الأسطول' : 'Book This Category'}
                  </Button>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="lg:col-span-8 p-8 space-y-6 text-left rtl:text-right">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    {isArabic ? 'الاستخدام الأمثل والمسارات' : 'Operational Suitability'}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {vehicle.bestFor}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  {/* Safety features */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isArabic ? 'تجهيزات السلامة المعتمدة' : 'Safety Equipment'}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {vehicle.safety.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Telematics features */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-blue-600" />
                      <span>{isArabic ? 'الأنظمة الذكية والتتبع' : 'Telematics & Monitoring'}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {vehicle.telematics.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'ملكية سارية، فحص تسجيل، وتأمين ركاب تجاري شامل' : 'Valid RTA Mulkiya, Tasjeel Pass, Full Commercial Insurance'}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/safety')} className="shrink-0">
                    {isArabic ? 'لوائح السلامة' : 'View Safety Protocols'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Maintenance Standards */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {isArabic ? 'الصيانة والاعتمادية' : 'Fleet Engineering Standards'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] font-heading">
              {isArabic ? 'معايير الصيانة الوقائية لضمان عدم تعطل رحلات موظفيك' : 'Preventive Maintenance & RTA Roadworthiness'}
            </h2>
            <p className="text-sm text-slate-600">
              {isArabic
                ? 'مركز صيانة خاص بنا في مجمع دبي للاستثمار يضمن جاهزية الأسطول على مدار 24 ساعة.'
                : 'Our centralized maintenance depot in DIP 2 performs strict diagnostic and preventive cycles.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maintenanceProtocols.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#0A192F]">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'هل ترغب في فحص الأسطول أو طلب تجربة قيادة؟' : 'Need Fleet Allocation for Your Next Contract?'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'يسعدنا استقبالكم في مقر عملياتنا بمجمع دبي للاستثمار 2 لمعاينة الأسطول والتجهيزات التقنية.'
              : 'Visit our DIP 2 headquarters to inspect our coaches, meet dispatch coordinators, or request a trial run.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'طلب عرض تسعير الأسطول' : 'Request Fleet Proposal'}
          </Button>
        </div>
      </section>
    </div>
  );
};
