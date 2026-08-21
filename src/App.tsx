/**
 * Dubai Staff Transport Management System (TMS)
 * Complete Full-Stack Platform
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.js';
import { I18nProvider } from './context/I18nContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { PublicLayout } from './components/layout/PublicLayout.js';
import { AppLayout } from './components/layout/AppLayout.js';
import { SignInPage } from './pages/SignInPage.js';
import { OperationsDashboard } from './pages/OperationsDashboard.js';
import { FoundationConsole } from './pages/FoundationConsole.js';
import { FleetManagementPage } from './pages/FleetManagementPage.js';
import { DriverManagementPage } from './pages/DriverManagementPage.js';
import { ClientManagementPage } from './pages/ClientManagementPage.js';
import { PassengerManagementPage } from './pages/PassengerManagementPage.js';
import { RouteManagementPage } from './pages/RouteManagementPage.js';
import { TripManagementPage } from './pages/TripManagementPage.js';
import { SchedulePage } from './pages/SchedulePage.js';
import { FleetTrackingPage } from './pages/FleetTrackingPage.js';
import { MaintenancePage } from './pages/MaintenancePage.js';
import { DocumentManagementPage } from './pages/DocumentManagementPage.js';
import { ComplianceCenterPage } from './pages/ComplianceCenterPage.js';
import { NotificationCenterPage } from './pages/NotificationCenterPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { AppPlaceholderPage } from './pages/AppPlaceholderPage.js';

// Public Pages
import { HomePage } from './pages/public/HomePage.js';
import { ServicesPage } from './pages/public/ServicesPage.js';
import { FleetPage } from './pages/public/FleetPage.js';
import { IndustriesPage } from './pages/public/IndustriesPage.js';
import { SafetyPage } from './pages/public/SafetyPage.js';
import { TechnologyPage } from './pages/public/TechnologyPage.js';
import { ClientsPage } from './pages/public/ClientsPage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { CareersPage } from './pages/public/CareersPage.js';
import { GalleryPage } from './pages/public/GalleryPage.js';
import { ContactPage } from './pages/public/ContactPage.js';
import { PrivacyPage } from './pages/public/PrivacyPage.js';
import { TermsPage } from './pages/public/TermsPage.js';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Authentication Routes
  if (currentPath === '/sign-in' || currentPath === '/sign-up') {
    return <SignInPage navigate={navigate} />;
  }

  // 2. TMS App Routes (/app/*)
  if (currentPath.startsWith('/app')) {
    if (currentPath === '/app' || currentPath === '/app/dashboard') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <OperationsDashboard navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/fleet') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <FleetManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/drivers') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <DriverManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/clients') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <ClientManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/passengers') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <PassengerManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/routes') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <RouteManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/trips') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <TripManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/schedule') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <SchedulePage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/tracking') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <FleetTrackingPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/maintenance') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <MaintenancePage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/documents') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <DocumentManagementPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/compliance') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <ComplianceCenterPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/notifications') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <NotificationCenterPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/reports') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <ReportsPage onNavigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/app/foundation') {
      return (
        <AppLayout currentPath={currentPath} navigate={navigate}>
          <FoundationConsole navigate={navigate} />
        </AppLayout>
      );
    }

    return (
      <AppLayout currentPath={currentPath} navigate={navigate}>
        <AppPlaceholderPage currentPath={currentPath} navigate={navigate} />
      </AppLayout>
    );
  }

  // 3. Public Corporate Website Routes
  const renderPublicPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/services':
        return <ServicesPage navigate={navigate} />;
      case '/fleet':
        return <FleetPage navigate={navigate} />;
      case '/industries':
        return <IndustriesPage navigate={navigate} />;
      case '/safety':
        return <SafetyPage navigate={navigate} />;
      case '/technology':
        return <TechnologyPage navigate={navigate} />;
      case '/clients':
        return <ClientsPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/careers':
        return <CareersPage navigate={navigate} />;
      case '/gallery':
        return <GalleryPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <PublicLayout currentPath={currentPath} navigate={navigate}>
      {renderPublicPage()}
    </PublicLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <I18nProvider>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </I18nProvider>
    </ToastProvider>
  );
}
