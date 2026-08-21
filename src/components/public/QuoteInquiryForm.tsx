import React, { useState } from 'react';
import { Bus, Send, CheckCircle2, AlertCircle, Clock, MapPin, Users, Building2, Phone, Mail, User } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { useToast } from '../../context/ToastContext.js';
import { useI18n } from '../../context/I18nContext.js';

interface QuoteInquiryFormProps {
  initialService?: string;
  className?: string;
  compact?: boolean;
}

export const QuoteInquiryForm: React.FC<QuoteInquiryFormProps> = ({
  initialService = 'Daily Staff Commute',
  className = '',
  compact = false,
}) => {
  const { isArabic } = useI18n();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: initialService,
    estimatedPassengers: '30-50',
    pickupLocation: 'Dubai Investment Park (DIP)',
    dropLocation: 'Business Bay / Downtown',
    shiftTiming: 'Morning & Evening (2 Shifts)',
    vehiclePreference: '50-Seater Luxury Bus',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.companyName.trim() || !formData.contactPerson.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMessage(isArabic ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.contactPerson,
        company: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        service: formData.serviceType,
        passengers: formData.estimatedPassengers,
        pickup: formData.pickupLocation,
        drop: formData.dropLocation,
        shift: formData.shiftTiming,
        vehicle: formData.vehiclePreference,
        message: formData.notes || `Quote requested for ${formData.serviceType} from ${formData.pickupLocation} to ${formData.dropLocation} (${formData.estimatedPassengers} passengers).`,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit quote inquiry');
      }

      setIsSuccess(true);
      success(
        isArabic ? 'تم استلام طلب التسعير بنجاح' : 'Quote Request Received',
        isArabic
          ? 'سيتواصل معك فريق عمليات النقل التجاري في غضون 30 دقيقة.'
          : 'Our commercial transport operations team will contact you within 30 minutes.'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your request.');
      error(
        isArabic ? 'تعذر إرسال الطلب' : 'Submission Failed',
        err.message || 'Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      serviceType: 'Daily Staff Commute',
      estimatedPassengers: '30-50',
      pickupLocation: 'Dubai Investment Park (DIP)',
      dropLocation: 'Business Bay / Downtown',
      shiftTiming: 'Morning & Evening (2 Shifts)',
      vehiclePreference: '50-Seater Luxury Bus',
      notes: '',
    });
  };

  if (isSuccess) {
    return (
      <div className={`p-8 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-4 ${className}`}>
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">
            {isArabic ? 'تم استلام طلبكم بنجاح' : 'Quotation Request Logged'}
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {isArabic
              ? 'شكراً لتواصلكم معنا. تم توجيه طلبكم إلى قسم عقود النقل التجاري، وسيقوم مسؤول الحسابات بإرسال عرض الأسعار المبدئي وجدول المسار المقترح.'
              : 'Thank you for contacting Dubai Staff Transport. Your request has been dispatched to our commercial operations desk. An account manager will reach out with a tailored route matrix and commercial rate card.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 max-w-md mx-auto text-left text-xs text-slate-600 space-y-1.5">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-semibold text-slate-700">{isArabic ? 'الشركة:' : 'Company:'}</span>
            <span>{formData.companyName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-semibold text-slate-700">{isArabic ? 'الخدمة:' : 'Service:'}</span>
            <span>{formData.serviceType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-semibold text-slate-700">{isArabic ? 'المسار:' : 'Corridor:'}</span>
            <span>{formData.pickupLocation} → {formData.dropLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">{isArabic ? 'الاستجابة:' : 'Target SLA:'}</span>
            <span className="text-emerald-700 font-bold">Within 30 Minutes</span>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            {isArabic ? 'إرسال طلب تسعير آخر' : 'Submit Another Request'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Company & Contact Person */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={isArabic ? 'اسم الشركة / المؤسسة *' : 'Company Name *'}
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="e.g. Al Futtaim Group / Emirates Logistics"
          required
          leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
        />
        <Input
          label={isArabic ? 'اسم المسؤول / مدير الموارد البشرية *' : 'Contact Person *'}
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="e.g. Tariq Mansoor"
          required
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Row 2: Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={isArabic ? 'رقم الهاتف / الواتساب (الإمارات) *' : 'UAE Phone / WhatsApp *'}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+971 50 123 4567"
          required
          leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
        />
        <Input
          label={isArabic ? 'البريد الإلكتروني للعمل *' : 'Corporate Email *'}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tariq@company.ae"
          required
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Row 3: Service Type & Passenger Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={isArabic ? 'نوع خدمة النقل المطلوبة' : 'Transportation Service'}
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          options={[
            { value: 'Daily Staff Commute', label: 'Daily Staff Commute (Dedicated Buses)' },
            { value: 'Corporate Shuttle Service', label: 'Corporate Inter-Campus / Metro Shuttle' },
            { value: 'Shift Logistics (24/7)', label: 'Shift Workforce Logistics (24/7 Multi-Shift)' },
            { value: 'Executive & VIP Coach', label: 'Executive Luxury Van & VIP Transfer' },
            { value: 'Industrial & Free Zone Transport', label: 'Industrial & Free Zone Transport (JAFZA/DIP)' },
            { value: 'Fully Managed Fleet Outsourcing', label: 'Full Transport Management Outsourcing' },
          ]}
        />
        <Select
          label={isArabic ? 'العدد التقديري للموظفين' : 'Estimated Passenger Volume'}
          name="estimatedPassengers"
          value={formData.estimatedPassengers}
          onChange={handleChange}
          options={[
            { value: '1-14', label: '1 - 14 Employees (HiAce / Minivan)' },
            { value: '15-33', label: '15 - 33 Employees (Coaster Bus)' },
            { value: '34-50', label: '34 - 50 Employees (Luxury Coach)' },
            { value: '50-150', label: '50 - 150 Employees (Multiple Buses)' },
            { value: '150-500+', label: '150 - 500+ Workforce (Enterprise Fleet)' },
          ]}
        />
      </div>

      {!compact && (
        <>
          {/* Row 4: Dubai Corridors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={isArabic ? 'نقطة الانطلاق / المجمع السكني' : 'Primary Pickup Zone'}
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              options={[
                { value: 'Dubai Investment Park (DIP 1 & 2)', label: 'Dubai Investment Park (DIP 1 & 2)' },
                { value: 'Al Quoz Industrial Area', label: 'Al Quoz Industrial Area' },
                { value: 'Sonapur / Muhaisnah', label: 'Sonapur / Muhaisnah Workers City' },
                { value: 'Deira / Bur Dubai', label: 'Deira / Bur Dubai' },
                { value: 'Sharjah - Dubai Commute', label: 'Sharjah Residential Hubs' },
                { value: 'Ajman - Dubai Commute', label: 'Ajman / Northern Emirates' },
                { value: 'Jebel Ali / Discovery Gardens', label: 'Jebel Ali / Discovery Gardens' },
                { value: 'Other Dubai Area', label: 'Other Custom Location' },
              ]}
            />
            <Select
              label={isArabic ? 'وجهة الوصول / مقر العمل' : 'Workplace / Destination Hub'}
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              options={[
                { value: 'Jebel Ali Free Zone (JAFZA)', label: 'Jebel Ali Free Zone (JAFZA)' },
                { value: 'Business Bay / Downtown Dubai', label: 'Business Bay / Downtown Dubai' },
                { value: 'Dubai Silicon Oasis (DSO)', label: 'Dubai Silicon Oasis (DSO)' },
                { value: 'Dubai Airport Freezone (DAFZA / DXB)', label: 'Dubai Airport / DAFZA' },
                { value: 'Dubai South / Al Maktoum Airport', label: 'Dubai South / DWC' },
                { value: 'Dubai Internet City / Media City', label: 'Dubai Internet / Media City' },
                { value: 'Al Quoz / Al Barsha Business Clusters', label: 'Al Quoz / Al Barsha' },
                { value: 'Abu Dhabi / Khalifa Port Corridor', label: 'Abu Dhabi Route' },
              ]}
            />
          </div>

          {/* Row 5: Shift Timing & Vehicle preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={isArabic ? 'نظام الدوام والمناوبات' : 'Shift / Working Hours'}
              name="shiftTiming"
              value={formData.shiftTiming}
              onChange={handleChange}
              options={[
                { value: 'Standard Office (8:00 AM - 5:00 PM)', label: 'Standard Office (8:00 AM - 5:00 PM)' },
                { value: 'Morning & Evening (2 Shifts)', label: '2 Shifts (e.g. 7 AM / 7 PM)' },
                { value: '24/7 Operations (3 Shifts)', label: '3 Shifts / Continuous 24/7 Rotation' },
                { value: 'Split Shift / Hospital Rotation', label: 'Split Shift / Flexible Health Roster' },
                { value: 'Weekend / Site Rotation', label: 'Project-Based / Weekend Only' },
              ]}
            />
            <Select
              label={isArabic ? 'نوع المركبة المفضل' : 'Preferred Fleet Category'}
              name="vehiclePreference"
              value={formData.vehiclePreference}
              onChange={handleChange}
              options={[
                { value: '50-Seater Luxury Bus', label: '50/53-Seater Heavy Coach (Dual Gulf AC)' },
                { value: '30-Seater Coaster', label: '30/33-Seater Medium Bus (Toyota Coaster/similar)' },
                { value: '14-Seater HiAce', label: '14/15-Seater Commuter Van (Toyota HiAce)' },
                { value: '7-Seater Executive MPV', label: '7-Seater VIP Executive MPV (Mercedes/Hyundai)' },
                { value: 'Mixed Multi-Type Fleet', label: 'Mixed Fleet Managed Recommendation' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isArabic ? 'ملاحظات إضافية / متطلبات خاصة' : 'Additional Route Requirements / Special Notes'}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder={
                isArabic
                  ? 'يرجى ذكر أي متطلبات خاصة مثل مواعيد دقيقة، شاشات بيانات، أو أجهزة تتبع خاصة...'
                  : 'Mention any specific requirements, e.g. multi-stop sequence, contract duration, weekend coverage, or urgent start date...'
              }
              className="w-full text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all resize-y"
            />
          </div>
        </>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full shadow-lg shadow-orange-500/20"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-4 h-4" />}
        >
          {isArabic ? 'طلب عرض السعر الفوري (مجاناً)' : 'Request Instant Route Quotation (Free)'}
        </Button>
        <p className="text-[11px] text-slate-500 text-center mt-2">
          {isArabic
            ? 'لا يوجد أي التزام. نقدم عروض أسعار تنافسية متوافقة مع اشتراطات هيئة الطرق والمواصلات.'
            : 'Zero obligation. Transparent commercial pricing compliant with all RTA & Dubai Municipality regulations.'}
        </p>
      </div>
    </form>
  );
};
