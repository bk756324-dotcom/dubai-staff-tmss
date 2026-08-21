import React, { useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Bus,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { QuoteInquiryForm } from '../../components/public/QuoteInquiryForm.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'اتصل بنا وعروض الأسعار - مواصلات موظفي دبي' : 'Contact & Commercial Route Quotation | Dubai Staff Transport',
      description: isArabic
        ? 'تواصل مع فريق عمليات النقل التجاري في دبي، واطلب عرض أسعار فوري لنقل موظفيك أو جدول المسارات المخصصة.'
        : 'Get in touch with Dubai Staff Transport operations desk. Request a customized corporate quote, schedule a depot inspection in DIP 2, or contact our 24/7 dispatch hotline.',
      keywords: ['Dubai staff transport contact', 'request corporate bus quote Dubai', 'DIP 2 transport office', 'staff bus rental pricing Dubai'],
    });
  }, [isArabic]);

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Phone className="w-3.5 h-3.5" />
            <span>{isArabic ? 'التواصل وعروض الأسعار' : 'Contact & Quotation Desk'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'احصل على عرض سعر تجاري لمسارات موظفيك' : 'Request a Custom Corporate Route Quotation'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isArabic
              ? 'فريق منسقي المسارات جاهز لدراسة احتياجات شركتك وتزويدكم بعرض أسعار تنافسي وجدول زمني خلال 30 دقيقة.'
              : 'Our route planning and commercial contracts team is ready to analyze your shift matrix and provide transparent, RTA-compliant rates.'}
          </p>
        </div>
      </section>

      {/* Main Form & Contact Information Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Col: Contact Details & Depot info */}
            <div className="lg:col-span-5 space-y-6 text-left rtl:text-right">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  {isArabic ? 'غرفة العمليات المركزية' : 'Operations Headquarters'}
                </span>
                <h2 className="text-2xl font-bold text-[#0A192F] font-heading">
                  {isArabic ? 'مجمع دبي للاستثمار 2 (DIP 2)' : 'Dubai Operations & Fleet Command'}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isArabic
                    ? 'مركز متكامل يضم إدارة العمليات، غرفة التتبع المباشر 24/7، ومستودعات صيانة وفحص الأسطول.'
                    : 'Central facility housing our 24/7 telematics control room, commercial workshop, and vehicle staging depots.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">{isArabic ? 'العنوان والموقع' : 'Depot & Office Location'}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Plot 598-102, Industrial Cluster, Dubai Investment Park 2, Dubai, United Arab Emirates</p>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">{isArabic ? 'أرقام الاتصال المباشرة' : 'Direct Dispatch Hotlines'}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">24/7 Operations Desk: <a href="tel:+97143889000" className="font-semibold text-slate-900 hover:text-orange-600">+971 4 388 9000</a></p>
                    <p className="text-xs text-slate-600">Commercial Inquiries: <a href="tel:+971501234567" className="font-semibold text-slate-900 hover:text-orange-600">+971 50 123 4567</a></p>
                  </div>
                </div>

                {/* Email */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">{isArabic ? 'البريد الإلكتروني' : 'Official Communications'}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Dispatch & Control: <a href="mailto:dispatch@dubaitransport.ae" className="text-slate-900 font-medium hover:underline">dispatch@dubaitransport.ae</a></p>
                    <p className="text-xs text-slate-600">Corporate Quotes: <a href="mailto:quotes@dubaitransport.ae" className="text-slate-900 font-medium hover:underline">quotes@dubaitransport.ae</a></p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">{isArabic ? 'ساعات العمل والتشغيل' : 'Operational Availability'}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Fleet Dispatch & Emergency: <strong className="text-emerald-700">24/7 / 365 Days</strong></p>
                    <p className="text-xs text-slate-600">Commercial & Contracts Office: Mon – Sat: 8:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* RTA Assurance Badge */}
              <div className="p-4 bg-[#0A192F] text-white rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RTA Commercial Transport Permit #89204-DXB</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isArabic
                    ? 'جميع عروض الأسعار تتضمن تكلفة التأمين التجاري الشامل للركاب، وتصاريح المرور وهيئة الطرق دون أي رسوم إضافية مخفية.'
                    : 'All commercial proposals include comprehensive passenger transit insurance and municipal road permits with zero hidden surcharges.'}
                </p>
              </div>
            </div>

            {/* Right Col: Interactive Quote & Lead Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-1 text-left rtl:text-right">
                  <h3 className="text-xl font-bold text-[#0A192F]">
                    {isArabic ? 'نموذج طلب عرض الأسعار ودراسة المسار' : 'Commercial Route Quotation & Inquiries'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? 'يرجى تزويدنا بتفاصيل رحلات موظفيك وسنتواصل معكم فوراً' : 'Fill in your workforce locations and shift details for a rapid proposal'}
                  </p>
                </div>

                <QuoteInquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
