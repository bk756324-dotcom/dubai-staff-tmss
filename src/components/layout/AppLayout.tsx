import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar.js';
import { TopBar } from './TopBar.js';
import { ChevronRight } from 'lucide-react';
import { CommandPalette } from '../ui/CommandPalette.js';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPath, navigate }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Generate breadcrumb titles
  const pathSegments = currentPath.split('/').filter(Boolean);
  const pageTitle = pathSegments.length > 1 ? pathSegments[1].toUpperCase() : 'DASHBOARD';

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentPath={currentPath}
          navigate={navigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 lg:hidden transform transition-transform duration-200 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentPath={currentPath}
          navigate={(path) => {
            navigate(path);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={false}
          onToggleCollapse={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Workspace Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopBar
          navigate={navigate}
          onOpenMobileSidebar={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
        />

        {/* Operational Breadcrumbs & Context Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">TMS Control</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-orange-600">{pageTitle}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Fleet GPS Server: Connected</span>
            </span>
          </div>
        </div>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global Command & Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        navigate={navigate}
      />
    </div>
  );
};
