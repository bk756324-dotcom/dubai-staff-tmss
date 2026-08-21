import React, { useState, useEffect } from 'react';
import {
  Bus,
  Globe,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Car,
} from 'lucide-react';
import { Button } from '../ui/Button.js';
import { useI18n } from '../../context/I18nContext.js';
import { motion, AnimatePresence } from 'motion/react';

interface PublicLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, currentPath, navigate }) => {
  const { isArabic, toggleLanguage, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const publicNavLinks = [
    { path: '/', label: isArabic ? 'الرئيسية' : 'Home' },
    { path: '/services', label: isArabic ? 'الخدمات' : 'Services' },
    { path: '/fleet', label: isArabic ? 'الأسطول' : 'Fleet' },
    { path: '/industries', label: isArabic ? 'القطاعات' : 'Industries' },
    { path: '/safety', label: isArabic ? 'السلامة وهيئة الطرق' : 'Safety & RTA' },
    { path: '/technology', label: isArabic ? 'التقنية' : 'Technology' },
    { path: '/clients', label: isArabic ? 'عملاؤنا' : 'Clients' },
    { path: '/about', label: isArabic ? 'عن الشركة' : 'About' },
    { path: '/gallery', label: isArabic ? 'الصور' : 'Gallery' },
    { path: '/careers', label: isArabic ? 'الوظائف' : 'Careers' },
    { path: '/contact', label: isArabic ? 'اتصل بنا' : 'Contact & Quote' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
      {/* Top Corporate Strip */}
      <div className="bg-[#060D17] text-slate-300 text-xs py-2 px-4 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isArabic ? 'مشغل نقل تجاري مرخص من هيئة الطرق والمواصلات' : 'RTA Certified Commercial Operator'}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href="tel:+97143889000"
              className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>24/7 Operations: +971 4 388 9000</span>
            </a>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>99.2% On-Time Dispatch SLA</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-white px-2 py-0.5 rounded transition-colors text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700"
              title="Toggle English / Arabic"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold text-xs">{isArabic ? 'English' : 'العربية'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors flex items-center gap-1 text-xs"
            >
              <span>{isArabic ? 'بوابة TMS' : 'TMS Portal'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0A192F] flex items-center justify-center text-orange-500 border border-slate-800 shadow-md group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-[#0A192F] font-heading">
                  {isArabic ? 'مواصلات موظفي دبي' : 'DUBAI STAFF TRANSPORT'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded border border-orange-200">
                  UAE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {isArabic ? 'إدارة نقل الموظفين والأساطيل المؤسسية' : 'Enterprise Transportation & Fleet Management'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-[13px] font-semibold text-slate-700">
            {publicNavLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`transition-colors hover:text-orange-600 py-1 ${
                    isActive ? 'text-orange-600 font-bold border-b-2 border-orange-500' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="hidden sm:inline-flex"
            >
              {isArabic ? 'طلب عرض أسعار' : 'Request Quote'}
            </Button>
            <Button
              size="sm"
              variant="navy"
              onClick={() => navigate('/app/dashboard')}
              rightIcon={<ArrowRight className={`w-4 h-4 text-orange-400 ${isArabic ? 'rotate-180' : ''}`} />}
              className="hidden sm:inline-flex"
            >
              {isArabic ? 'بوابة العمليات' : 'TMS Portal'}
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 xl:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: isArabic ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${
                isArabic ? 'right-0' : 'left-0'
              } w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col xl:hidden`}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0A192F] text-orange-500 flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-[#0A192F]">
                      {isArabic ? 'مواصلات موظفي دبي' : 'DUBAI STAFF TRANSPORT'}
                    </span>
                    <span className="block text-[10px] text-slate-500">RTA Certified Fleet</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {publicNavLinks.map((link) => {
                  const isActive = currentPath === link.path;
                  return (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => {
                        navigate(link.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 ${isArabic ? 'rotate-180' : ''}`} />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                >
                  {isArabic ? 'طلب عرض أسعار فوري' : 'Request a Quote'}
                </Button>
                <Button
                  variant="navy"
                  className="w-full"
                  onClick={() => {
                    navigate('/sign-in');
                    setMobileMenuOpen(false);
                  }}
                >
                  {isArabic ? 'تسجيل الدخول لبوابة TMS' : 'Sign In to TMS Portal'}
                </Button>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 font-semibold text-slate-700"
                  >
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                    <span>{isArabic ? 'Switch to English' : 'التحويل إلى العربية'}</span>
                  </button>
                  <span>+971 4 388 9000</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Public Content */}
      <main className="flex-1">{children}</main>

      {/* Corporate Footer */}
      <footer className="bg-[#0A192F] text-slate-300 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand & RTA info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight font-heading">
                    {isArabic ? 'مواصلات موظفي دبي' : 'DUBAI STAFF TRANSPORT'}
                  </span>
                  <p className="text-xs text-slate-400">
                    {isArabic ? 'حلول النقل التجاري وإدارة أساطيل الشركات' : 'Enterprise Transportation & Fleet Management'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                {isArabic
                  ? 'المزود المعتمد في دبي لخدمات نقل الموظفين المؤسسي، رحلات المناوبات الصناعية (24/7)، ونقل الكوادر التنفيذية والطبية عبر شبكة أسطول حديثة تغطي دبي وأبوظبي والإمارات الشمالية.'
                  : 'Dubai’s certified corporate transportation partner. Providing dedicated daily employee commute, airport logistics, industrial shuttles, and luxury coaches with guaranteed 99.2% on-time dispatch and live GPS telematics.'}
              </p>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>RTA Commercial Transport License #89204-DXB</span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>ISO 9001:2015 & ISO 39001 Road Traffic Safety Certified</span>
                </div>
              </div>
            </div>

            {/* Col 2: Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {isArabic ? 'خدمات النقل' : 'Fleet Services'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'نقل الموظفين اليومي' : 'Daily Staff Commute'}</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'حافلات الشركات الترددية' : 'Corporate Shuttle Services'}</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'نقل مناوبات العمل (24/7)' : 'Shift Logistics & 24/7'}</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'نقل المناطق الحرة والصناعية' : 'Industrial & Free Zones'}</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'حافلات النقل الفاخر والتنفيذي' : 'Executive VIP Transfers'}</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">{isArabic ? 'إدارة النقل الشاملة' : 'Fleet Management Outsourcing'}</button></li>
              </ul>
            </div>

            {/* Col 3: Key Hubs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {isArabic ? 'محاور العمليات' : 'Dubai Corridors'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><span>Dubai Investment Park (DIP 1 & 2)</span></li>
                <li><span>Jebel Ali Free Zone (JAFZA)</span></li>
                <li><span>Dubai Silicon Oasis & Academic City</span></li>
                <li><span>Dubai Airport & DAFZA</span></li>
                <li><span>Business Bay & Downtown Dubai</span></li>
                <li><span>Al Quoz & Sonapur Workforce Hubs</span></li>
                <li><span>Dubai - Abu Dhabi Commuter Line</span></li>
              </ul>
            </div>

            {/* Col 4: Operations & Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {isArabic ? 'غرفة العمليات والتواصل' : 'Operations Command'}
              </h4>
              <div className="space-y-3 text-xs text-slate-400 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Plot 598-102, Industrial Cluster, Dubai Investment Park 2, Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <a href="tel:+97143889000" className="hover:text-white">+971 4 388 9000</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                  <a href="mailto:dispatch@dubaitransport.ae" className="hover:text-white">dispatch@dubaitransport.ae</a>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/contact')}
                className="w-full text-xs"
              >
                {isArabic ? 'طلب عرض أسعار مخصص' : 'Request Commercial Quote'}
              </Button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Dubai Staff Transport Operations LLC. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
            <div className="flex flex-wrap items-center gap-6">
              <button onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition-colors">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-slate-300 transition-colors">
                {isArabic ? 'شروط وأحكام النقل' : 'Terms of Transport'}
              </button>
              <button onClick={() => navigate('/safety')} className="hover:text-slate-300 transition-colors">
                {isArabic ? 'لوائح السلامة وهيئة الطرق' : 'RTA Safety Protocol'}
              </button>
              <button onClick={() => navigate('/careers')} className="hover:text-slate-300 transition-colors">
                {isArabic ? 'بوابة التوظيف' : 'Careers'}
              </button>
              <button onClick={() => navigate('/gallery')} className="hover:text-slate-300 transition-colors">
                {isArabic ? 'معرض الأسطول' : 'Gallery'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
