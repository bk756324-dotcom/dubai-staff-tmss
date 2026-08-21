import React, { useState } from 'react';
import {
  Bus,
  ShieldCheck,
  MapPin,
  Clock,
  Radio,
  Building2,
  CheckCircle2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Alert } from '../components/ui/Alert.js';
import { useToast } from '../context/ToastContext.js';

interface PublicPlaceholderPageProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const PublicPlaceholderPage: React.FC<PublicPlaceholderPageProps> = ({
  currentPath,
  navigate,
}) => {
  const toast = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: 'DAILY_STAFF_COMMUTE',
    estimatedPassengers: '50',
    message: '',
  });

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteForm,
          estimatedPassengers: Number(quoteForm.estimatedPassengers) || 50,
          source: 'WEBSITE_CONTACT',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFormSubmitted(true);
        toast.success('Inquiry Received', 'Our transport operations manager will contact you with a customized proposal.');
      } else {
        toast.error('Submission Failed', json.error);
      }
    } catch {
      toast.error('Submission Error', 'Failed to reach TMS API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const keyCorridors = [
    { title: 'Dubai Investment Park (DIP 1 & 2)', routes: '14 Active Express Routes', passengers: '1,400+ Daily Passengers' },
    { title: 'Jebel Ali Free Zone (JAFZA & Port)', routes: '18 Heavy Industrial Lines', passengers: '2,200+ Daily Passengers' },
    { title: 'Dubai International Airport (DXB & Cargo)', routes: '10 Aviation Round-the-Clock Lines', passengers: '1,800+ Daily Passengers' },
    { title: 'Dubai Silicon Oasis & Academic City', routes: '8 Corporate Shuttles', passengers: '750+ Daily Passengers' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0A192F] text-white p-8 sm:p-14 overflow-hidden border border-slate-800 shadow-2xl">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Prompt 1 Architecture & Foundation Active</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Enterprise Staff Transport for Dubai & UAE Operations
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Dedicated corporate staff commute solutions, industrial workforce transfers, and luxury executive shuttles powered by live GPS telematics, RTA-certified fleet safety, and computerized dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/app/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Access TMS Operations Portal
              </Button>
              <Button
                size="lg"
                variant="navy"
                onClick={() => navigate('/services')}
                className="border-slate-700 hover:border-slate-600"
              >
                Explore Transport Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Highlights Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Full-Spectrum Commercial Transport Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Engineered specifically for Dubai's major commercial, logistics, aviation, and industrial corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyCorridors.map((item, idx) => (
            <Card key={idx} className="border-slate-200 hover:border-orange-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">{item.title}</h3>
              <p className="text-xs text-orange-600 font-semibold mb-1">{item.routes}</p>
              <p className="text-xs text-slate-500">{item.passengers}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Request Quote / Lead Generation Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Inquiries API Connected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Request a Customized Corporate Transport Proposal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tell us your workforce size, shift timings, and pickup locations. Our operations team will design an optimized route schedule with dedicated coaches.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <span>Live GPS telematics tracking for HR & HSE managers</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>100% RTA commercial passenger compliance and insured fleet</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>99.2% on-time shift arrival guarantee across all UAE routes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="border-slate-200 bg-slate-50/70 p-6">
              {formSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Quote Request Dispatched</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your inquiry has been stored in the database. Our transport dispatcher has been notified.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setFormSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Person"
                      required
                      placeholder="e.g. Adel Al Hashimi"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    />
                    <Input
                      label="Company Name"
                      required
                      placeholder="e.g. Emirates Logistics LLC"
                      value={quoteForm.company}
                      onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="adel@company.ae"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    />
                    <Input
                      label="UAE Phone Number"
                      required
                      placeholder="+971 50 123 4567"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Required Service
                      </label>
                      <select
                        value={quoteForm.serviceType}
                        onChange={(e) => setQuoteForm({ ...quoteForm, serviceType: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                      >
                        <option value="DAILY_STAFF_COMMUTE">Daily Staff Commute (2/3 Shifts)</option>
                        <option value="EXECUTIVE_SHUTTLE">Executive VIP Shuttle</option>
                        <option value="SITE_PROJECT_TRANSPORT">Construction / Site Project Shuttles</option>
                        <option value="EVENT_TRANSFER">Event / Conference Transfers</option>
                      </select>
                    </div>
                    <Input
                      label="Estimated Passengers"
                      type="number"
                      placeholder="50"
                      value={quoteForm.estimatedPassengers}
                      onChange={(e) => setQuoteForm({ ...quoteForm, estimatedPassengers: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Route Details or Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      placeholder="e.g. Morning pickup from Muhaisnah to DIP 2, 06:00 AM shift start..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Quotation Request
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
