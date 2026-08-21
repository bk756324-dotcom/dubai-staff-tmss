import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCheck,
  Award,
  HeartPulse,
  Bus,
  Clock,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Select } from '../../components/ui/Select.js';
import { useI18n } from '../../context/I18nContext.js';
import { useToast } from '../../context/ToastContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface CareersPageProps {
  navigate: (path: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ navigate }) => {
  const { isArabic, t } = useI18n();
  const { success, error } = useToast();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'الوظائف والانضمام لفريقنا - مواصلات موظفي دبي' : 'Careers & Driver Captain Recruitment | Dubai Staff Transport',
      description: isArabic
        ? 'انضم إلى فريق عمل مواصلات موظفي دبي: وظائف شاغرة لكباتن الحافلات الثقيلة، منسقي العمليات، وفنيي صيانة الأساطيل.'
        : 'Explore career opportunities at Dubai Staff Transport. We are hiring RTA licensed Heavy Bus Captains, fleet dispatchers, and workshop technicians in Dubai.',
      keywords: ['heavy bus driver jobs Dubai', 'RTA bus captain vacancy UAE', 'fleet dispatcher jobs Dubai', 'transport careers UAE'],
    });
  }, [isArabic]);

  const openPositions = [
    {
      title: isArabic ? 'كابتن حافلة ثقيلة (Heavy Bus Captain)' : 'Heavy Commercial Bus Captain',
      department: isArabic ? 'العمليات والتشغيل' : 'Fleet Operations',
      location: 'Dubai / Northern Emirates Routes',
      type: 'Full-Time (RTA Regulated Shifts)',
      requirements: [
        isArabic ? 'رخصة قيادة إماراتية سارية (فئة 6 - حافلة ثقيلة)' : 'Valid UAE Heavy Bus Driver License (Category 6)',
        isArabic ? 'خبرة لا تقل عن 3 سنوات في قيادة الحافلات في دولة الإمارات' : 'Minimum 3+ years commercial driving experience in UAE',
        isArabic ? 'معرفة ممتازة بشوارع ومناطق دبي، الشارقة، وجبل علي' : 'Strong geographical knowledge of Dubai, Sharjah, DIP, and JAFZA',
        isArabic ? 'سجل مروري نظيف واجتياز الفحص الطبي' : 'Clean traffic record and satisfactory medical fitness test',
      ],
    },
    {
      title: isArabic ? 'منسق عمليات وتوزيع رحلات (Fleet Dispatcher)' : 'Operations & Shift Dispatcher',
      department: isArabic ? 'غرفة التحكم المركزية' : '24/7 Operations Control Desk',
      location: 'DIP 2 Operations Center',
      type: 'Shift-Based (Day / Night Rotation)',
      requirements: [
        isArabic ? 'خبرة سابقة في إدارة وتتبع أساطيل النقل التجاري' : 'Experience with fleet telematics, GPS consoles, and driver coordination',
        isArabic ? 'إجادة تامة للغتين الإنجليزية والعربية' : 'Strong bilingual communication skills (English & Arabic/Urdu/Hindi)',
        isArabic ? 'القدرة على التعامل مع الطوارئ وتعديل المسارات بسرعة' : 'Problem-solving mindset under dynamic traffic conditions',
      ],
    },
    {
      title: isArabic ? 'فني ميكانيك وكهرباء حافلات (Commercial Fleet Technician)' : 'Heavy Bus Mechanic & AC Technician',
      department: isArabic ? 'ورشة الصيانة المركزية' : 'Workshop & Preventive Maintenance',
      location: 'DIP 2 Fleet Depot',
      type: 'Full-Time',
      requirements: [
        isArabic ? 'خبرة عملية في صيانة حافلات كينج لونج، يوتونج، وتويوتا كوستر' : 'Hands-on experience with Yutong, King Long, Ashok Leyland, and Toyota buses',
        isArabic ? 'معرفة متخصصة في أنظمة التكييف الخليجية عالية السعة' : 'Proficiency in high-capacity dual Gulf AC diagnostics and repairs',
        isArabic ? 'شهادة مهنية في ميكانيكا المركبات الثقيلة' : 'Technical diploma in automotive/heavy vehicle mechanics',
      ],
    },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    position: 'Heavy Commercial Bus Captain',
    experienceYears: '3-5 Years',
    licenseNumber: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMsg(isArabic ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please provide your full name and phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.fullName,
        company: 'Career Applicant',
        email: formData.email || 'careers@dubaitransport.ae',
        phone: formData.phone,
        service: `Job Application: ${formData.position}`,
        passengers: formData.experienceYears,
        pickup: formData.licenseNumber ? `License: ${formData.licenseNumber}` : 'N/A',
        drop: 'Careers Department',
        shift: 'Standard',
        vehicle: 'N/A',
        message: `Career Application for [${formData.position}]. Experience: ${formData.experienceYears}. License: ${formData.licenseNumber || 'None'}. Details: ${formData.message}`,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit application');
      }

      setIsSuccess(true);
      success(
        isArabic ? 'تم استلام طلب التوظيف بنجاح' : 'Job Application Submitted',
        isArabic
          ? 'سيقوم قسم الموارد البشرية بمراجعة طلبك والتواصل معك لإجراء المقابلة.'
          : 'Our HR recruitment team will review your credentials and contact you shortly.'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
      error(
        isArabic ? 'خطأ في التقديم' : 'Submission Failed',
        err.message || 'Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isArabic ? 'انضم إلى فريقنا' : 'Join Our Operations Team'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            {isArabic ? 'فرص العمل والتوظيف في مواصلات موظفي دبي' : 'Build Your Transport Career With Dubai’s Best Fleet'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {isArabic
              ? 'نوفر بيئة عمل احترافية ومجزية تحترم السائقين وتقدم تدريباً مستمراً وحوافز أداء متميزة.'
              : 'Competitive compensation, regulated working hours, modern air-conditioned fleet, and dedicated professional growth in Dubai.'}
          </p>
        </div>
      </section>

      {/* Open Positions & Form Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Open Positions List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  {isArabic ? 'الشواغر المتاحة حالياً' : 'Current Openings'}
                </span>
                <h2 className="text-2xl font-bold text-[#0A192F] font-heading">
                  {isArabic ? 'الوظائف المتاحة في دبي' : 'Featured Positions in Dubai'}
                </h2>
              </div>

              <div className="space-y-4">
                {openPositions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-[#0A192F]">{pos.title}</h3>
                        <p className="text-xs text-orange-600 font-semibold">{pos.department}</p>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg shrink-0">
                        {pos.type}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                        {isArabic ? 'المتطلبات الأساسية:' : 'Key Requirements:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pos.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-4 sticky top-24">
                <div className="border-b border-slate-100 pb-3 space-y-1">
                  <h3 className="text-lg font-bold text-[#0A192F]">
                    {isArabic ? 'قدم طلب التوظيف الآن' : 'Submit Candidate Application'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? 'سنقوم بالتواصل معك لتحديد موعد المقابلة' : 'Direct application to HR Recruitment Desk'}
                  </p>
                </div>

                {isSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900">
                      {isArabic ? 'تم استلام طلبكم بنجاح' : 'Application Received'}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isArabic
                        ? 'شكراً لاهتمامكم بالعمل معنا. سيقوم فريق الموارد البشرية بمراجعة بياناتك والتواصل معك.'
                        : 'Thank you for your interest in joining our team. Our recruitment officer will contact you if your profile matches our requirements.'}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setIsSuccess(false)}>
                      {isArabic ? 'تقديم طلب آخر' : 'Submit Another'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5 text-left rtl:text-right">
                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <Input
                      label={isArabic ? 'الاسم الكامل *' : 'Full Name *'}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Mohammed Farooq"
                      required
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />

                    <Input
                      label={isArabic ? 'رقم الهاتف / الواتساب في الإمارات *' : 'UAE Mobile / WhatsApp *'}
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+971 50 000 0000"
                      required
                      leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                    />

                    <Input
                      label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="driver@example.com"
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    />

                    <Select
                      label={isArabic ? 'الوظيفة المستهدفة' : 'Position Applied For'}
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      options={[
                        { value: 'Heavy Commercial Bus Captain', label: 'Heavy Commercial Bus Captain (RTA Cat 6)' },
                        { value: 'Operations & Shift Dispatcher', label: 'Operations & Shift Dispatcher' },
                        { value: 'Heavy Bus Mechanic & AC Technician', label: 'Heavy Bus Mechanic & AC Tech' },
                        { value: 'General Fleet Staff', label: 'Other Support Operations' },
                      ]}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        label={isArabic ? 'سنوات الخبرة' : 'UAE Experience'}
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        options={[
                          { value: '1-2 Years', label: '1 - 2 Years' },
                          { value: '3-5 Years', label: '3 - 5 Years' },
                          { value: '5-10 Years', label: '5 - 10 Years' },
                          { value: '10+ Years', label: '10+ Years' },
                        ]}
                      />
                      <Input
                        label={isArabic ? 'رقم رخصة القيادة' : 'Driving License #'}
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="e.g. DXB-8921"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isArabic ? 'نبذة عن خبرتك أو ملاحظات إضافية' : 'Summary of Experience / Notes'}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={2}
                        placeholder={isArabic ? 'اذكر الشركات السابقة والمسارات التي عملت عليها...' : 'Mention previous transport companies or routes you have driven...'}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      isLoading={isSubmitting}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      {isArabic ? 'إرسال طلب التوظيف' : 'Submit Application'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
