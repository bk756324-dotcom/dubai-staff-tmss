import React, { useEffect } from 'react';
import { ShieldCheck, Lock, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  const { isArabic } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'سياسة الخصوصية وحماية البيانات - مواصلات موظفي دبي' : 'Corporate Privacy Policy | Dubai Staff Transport',
      description: isArabic
        ? 'اطلع على سياسة الخصوصية وحماية بيانات الركاب والشركات في نظام مواصلات موظفي دبي وفق القوانين الاتحادية الإماراتية.'
        : 'Read our corporate privacy and passenger data protection policy in accordance with UAE Federal Data Protection Law.',
      keywords: ['privacy policy Dubai staff transport', 'UAE passenger data protection'],
    });
  }, [isArabic]);

  return (
    <div className="space-y-0 bg-slate-50">
      {/* Header */}
      <section className="bg-[#0A192F] text-white py-14 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حماية البيانات' : 'Data Governance'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {isArabic ? 'سياسة الخصوصية وسرية بيانات التنقل' : 'Corporate Privacy & Data Protection Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isArabic ? 'آخر تحديث: 1 يناير 2026 | متوافقة مع القوانين الاتحادية لدولة الإمارات العربية المتحدة' : 'Last Updated: January 1, 2026 | Compliant with UAE Federal Decree-Law No. 45 of 2021'}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-left rtl:text-right shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">1. Introduction & Scope</h2>
            <p>
              Dubai Staff Transport Operations LLC ("we", "us", or "our") is dedicated to protecting the privacy, confidentiality, and security of our corporate clients, passenger employees, and visitors interacting with our Transport Management System (TMS) platform and public web interfaces.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">2. Information We Collect</h2>
            <p>We only collect and process data necessary to fulfill commercial staff transportation contracts and regulatory compliance:</p>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-1.5 text-slate-600">
              <li><strong>Corporate Contract Details:</strong> Company registration, authorized HR/facilities contact details, billing credentials, and official corporate communications.</li>
              <li><strong>Passenger Logistics Data:</strong> Anonymized or designated employee pickup/drop geocoordinates, shift assignments, and vehicle boarding timestamps.</li>
              <li><strong>Vehicle Telematics Data:</strong> GPS coordinates, speed telemetry, heading, and route execution logs captured for safety auditing and RTA compliance.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">3. Purpose of Processing</h2>
            <p>We utilize the collected information strictly for:</p>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-1.5 text-slate-600">
              <li>Executing point-to-point staff transit and shift schedules in Dubai and Northern Emirates.</li>
              <li>Sub-second telematics monitoring from our central DIP 2 control room for safety, speed control, and incident resolution.</li>
              <li>Generating accurate monthly billing and corporate SLA reports for client HR leadership.</li>
              <li>Complying with Dubai Roads and Transport Authority (RTA) commercial passenger vehicle regulations.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">4. Data Confidentiality & Zero Third-Party Sale</h2>
            <p>
              We <strong>never sell, lease, or monetize</strong> client or passenger employee data to third parties, advertising brokers, or unauthorized entities. Data is shared exclusively with certified regulatory bodies (such as the RTA or Dubai Police) when mandated by UAE law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">5. Security Standards & Encryption</h2>
            <p>
              All platform telematics and client data are transmitted using TLS 1.3 encryption and stored in secure cloud infrastructure with role-based access control (RBAC), preventing unauthorized access or data leakage.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">6. Contact Our Data Compliance Officer</h2>
            <p>
              For inquiries regarding corporate data protection or data removal requests, contact our legal desk at <a href="mailto:privacy@dubaitransport.ae" className="text-orange-600 font-semibold hover:underline">privacy@dubaitransport.ae</a> or call <a href="tel:+97143889000" className="text-orange-600 font-semibold">+971 4 388 9000</a>.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/terms')}>
              {isArabic ? 'شروط وأحكام النقل' : 'View Terms of Transport'}
            </Button>
            <Button variant="navy" size="sm" onClick={() => navigate('/')}>
              {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
