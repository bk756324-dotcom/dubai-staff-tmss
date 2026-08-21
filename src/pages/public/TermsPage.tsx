import React, { useEffect } from 'react';
import { FileCheck, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { updatePageSEO } from '../../utils/seo.js';

interface TermsPageProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigate }) => {
  const { isArabic } = useI18n();

  useEffect(() => {
    updatePageSEO({
      title: isArabic ? 'شروط وأحكام خدمات النقل - مواصلات موظفي دبي' : 'Commercial Terms of Transport | Dubai Staff Transport',
      description: isArabic
        ? 'اطلع على الشروط والأحكام العامة لخدمات النقل التجاري، اتفاقيات مستوى الخدمة (SLA)، وضوابط السلامة في دبي.'
        : 'Read our corporate transportation service terms, RTA compliance conditions, vehicle charter agreements, and SLA commitments.',
      keywords: ['terms of transport Dubai', 'commercial bus charter agreement UAE', 'staff transport service terms'],
    });
  }, [isArabic]);

  return (
    <div className="space-y-0 bg-slate-50">
      {/* Header */}
      <section className="bg-[#0A192F] text-white py-14 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isArabic ? 'العقود واللوائح' : 'Service Agreements'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {isArabic ? 'شروط وأحكام النقل التجاري والتعاقد' : 'Corporate Transportation Terms & Conditions'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isArabic ? 'آخر مراجعة: 1 يناير 2026 | خاضعة لقوانين إمارة دبي وهيئة الطرق والمواصلات' : 'Governing Commercial Operations & Fleet Contracts in the Emirate of Dubai'}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-left rtl:text-right shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">1. General Service Framework</h2>
            <p>
              These Terms & Conditions govern all corporate bus rental, staff transit charters, daily employee commute services, and fleet management outsourcing provided by Dubai Staff Transport Operations LLC under RTA Commercial Permit #89204-DXB.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">2. Service Level Commitments (SLA)</h2>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-1.5 text-slate-600">
              <li><strong>Punctuality Standard:</strong> We guarantee a 99.2% on-time dispatch rate based on agreed shift timetables, barring unannounced major road closures or force majeure events.</li>
              <li><strong>Backup Vehicle Protocol:</strong> In the rare event of mechanical failure or roadside emergency, an equivalent replacement vehicle will be deployed from our Dubai depots within 30 minutes.</li>
              <li><strong>Speed Limiter Compliance:</strong> All coaches are electronically governed at a maximum speed of 100 km/h in strict compliance with UAE federal and RTA passenger safety laws.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">3. Client & Passenger Responsibilities</h2>
            <p>
              Corporate clients agree to provide timely notice (minimum 24 hours) for shift matrix adjustments or passenger manifest modifications. Passengers must adhere to basic safety protocols, including wearing seatbelts and abstaining from disruptive conduct.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">4. Insurance & Liability Coverage</h2>
            <p>
              All vehicles operate with comprehensive commercial passenger transit insurance covering medical liability and accidental damages in full accordance with UAE Central Bank and Insurance Authority mandates.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">5. Billing, Tariffs & Fuel Adjustments</h2>
            <p>
              Commercial billing is invoiced monthly on agreed per-trip or fixed monthly terms. Fuel indexation adjustments, if applicable, are calculated transparently based on officially published UAE fuel prices.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0A192F]">6. Governing Law & Jurisdiction</h2>
            <p>
              These terms and all underlying transportation agreements shall be governed by and construed in accordance with the laws of the Emirate of Dubai and the applicable Federal Laws of the United Arab Emirates.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/privacy')}>
              {isArabic ? 'سياسة الخصوصية' : 'View Privacy Policy'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/contact')}>
              {isArabic ? 'طلب عقد نقل مخصص' : 'Request Commercial Contract'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
