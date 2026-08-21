import React, { useState, useEffect } from 'react';
import {
  Bus,
  Image as ImageIcon,
  Filter,
  ArrowRight,
  ShieldCheck,
  Radio,
  Building2,
  Wrench,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface GalleryPageProps {
  navigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();
  const [filter, setFilter] = useState<'ALL' | 'FLEET' | 'CORRIDORS' | 'CONTROL' | 'DEPOT'>('ALL');

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'معرض الصور والأسطول - مواصلات موظفي دبي' : 'Operations & Fleet Visual Gallery | Dubai Staff Transport',
      description: isArabic
        ? 'استعرض صور حافلاتنا التجارية، غرفة العمليات المركزية، ورشة الصيانة بمجمع دبي للاستثمار، ومسارات النقل في دبي.'
        : 'View our visual photo gallery of 50-seater luxury coaches, 24/7 DIP 2 telematics dispatch center, maintenance depot, and highway corridors in Dubai.',
      keywords: ['Dubai staff transport gallery', 'luxury bus photos Dubai', 'fleet depot DIP 2 photos'],
    });
  }, [isArabic]);

  const galleryItems = [
    {
      id: 1,
      category: 'FLEET',
      title: isArabic ? 'حافلة ثقيلة فاخرة 50 راكب' : '50-Seater Heavy Luxury Coach',
      tag: isArabic ? 'الأسطول التجاري' : 'Heavy Fleet',
      desc: isArabic ? 'حافلة حديثة بتكييف خليجي مزدوج ومقاعد وثيرة لنقل الموظفين.' : 'High-capacity luxury coach equipped with dual Gulf AC and ergonomic passenger seating.',
    },
    {
      id: 2,
      category: 'FLEET',
      title: isArabic ? 'باص تويوتا كوستر 30 راكب' : '30-Seater Toyota Coaster Shuttle',
      tag: isArabic ? 'حافلات متوسطة' : 'Medium Shuttle',
      desc: isArabic ? 'مثالي للحافلات الترددية للمترو ونقل موظفي المكاتب والمستشفيات.' : 'Agile campus shuttle optimized for metro-feeder routes and healthcare shift teams.',
    },
    {
      id: 3,
      category: 'CONTROL',
      title: isArabic ? 'غرفة التحكم والتتبع المباشر 24/7' : '24/7 Central Telematics Control Room',
      tag: isArabic ? 'غرفة العمليات' : 'Operations Command',
      desc: isArabic ? 'شاشات مراقبة لحظية ترصد إحداثيات كل حافلة وسرعتها والتزامها بالمسار.' : 'Real-time multi-screen monitoring console tracking vehicle speeds, ETAs, and road safety.',
    },
    {
      id: 4,
      category: 'CORRIDORS',
      title: isArabic ? 'طريق الشيخ محمد بن زايد' : 'Sheikh Mohammed Bin Zayed Corridor',
      tag: isArabic ? 'المسارات السريعة' : 'Highway Transit',
      desc: isArabic ? 'انطلاق رحلات الصباح الباكر نحو مجمع دبي للاستثمار وجافزا.' : 'Early morning synchronized workforce transit towards Dubai Investment Park and JAFZA.',
    },
    {
      id: 5,
      category: 'DEPOT',
      title: isArabic ? 'ورشة الصيانة المركزية (DIP 2)' : 'DIP 2 Central Maintenance Depot',
      tag: isArabic ? 'الصيانة والفحص' : 'Workshop & Service',
      desc: isArabic ? 'فحص دوري كل 5,000 كم وتبديل للقطع الاستهلاكية لضمان سلامة الرحلات.' : 'Preventive diagnostic bays, oil change lanes, and daily tire pressure inspection stations.',
    },
    {
      id: 6,
      category: 'FLEET',
      title: isArabic ? 'فان هايس سريع 14 راكب' : '14-Seater HiAce Commuter Van',
      tag: isArabic ? 'فان ركاب' : 'Light Commuter',
      desc: isArabic ? 'تنقل سريع ومرن للمناوبات الطارئة والمناطق السكنية الضيقة.' : 'Rapid commuter van navigating inner Dubai residential quarters with speed limiter compliance.',
    },
  ];

  const filteredItems = filter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isArabic ? 'معرض العمليات والأسطول' : 'Visual Showcase'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'نظرة واقعية على أسطولنا ومرافقنا التشغيلية' : 'Inside Dubai Staff Transport Operations'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {isArabic
              ? 'شاهد حافلاتنا، غرفة التحكم والعمليات المركزية، ومستودعات الصيانة في مجمع دبي للاستثمار 2.'
              : 'Explore high-resolution visual perspectives of our modern coaches, 24/7 command center, and highway routes.'}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-slate-200 py-4 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
            <Filter className="w-4 h-4 text-orange-500" />
            <span>{isArabic ? 'تصفية الصور:' : 'Filter Showcase:'}</span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: isArabic ? 'جميع الأقسام' : 'All Views' },
              { id: 'FLEET', label: isArabic ? 'حافلات الأسطول' : 'Buses & Coaches' },
              { id: 'CONTROL', label: isArabic ? 'غرفة العمليات' : '24/7 Command Center' },
              { id: 'DEPOT', label: isArabic ? 'ورشة الصيانة' : 'Depot & Workshop' },
              { id: 'CORRIDORS', label: isArabic ? 'مسارات دبي' : 'Dubai Corridors' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === tab.id
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

      {/* Gallery Cards Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                {/* Visual Header Placeholder Container */}
                <div className="h-48 bg-[#0A192F] p-6 relative flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent z-10" />
                  <div className="relative z-20 flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-500 text-white rounded-lg">
                      {item.tag}
                    </span>
                    <Bus className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <div className="relative z-20">
                    <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-3 text-left rtl:text-right">
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RTA Verified Facility</span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/fleet')} className="text-xs text-orange-600 p-0 h-auto">
                      {isArabic ? 'مواصفات الأسطول' : 'View Specs'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A192F] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isArabic ? 'هل ترغب في معاينة الأسطول على أرض الواقع؟' : 'Inspect Our Vehicles & Depot in Person'}
          </h2>
          <p className="text-sm text-slate-300">
            {isArabic
              ? 'تفضل بزيارة مركز عملياتنا في مجمع دبي للاستثمار 2، وسيقوم مدير الأسطول بمرافقتكم.'
              : 'Our fleet managers are available 6 days a week to show you through our buses and maintenance facilities.'}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
            {isArabic ? 'حجز موعد زيارة' : 'Book a Facility Tour'}
          </Button>
        </div>
      </section>
    </div>
  );
};
