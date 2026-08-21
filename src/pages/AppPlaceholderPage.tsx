import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Server, Database, CheckCircle2, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { LoadingSpinner } from '../components/ui/States.js';
import { useAuth } from '../context/AuthContext.js';

interface AppPlaceholderPageProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const AppPlaceholderPage: React.FC<AppPlaceholderPageProps> = ({
  currentPath,
  navigate,
}) => {
  const { apiFetch } = useAuth();
  const [moduleData, setModuleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const moduleName = currentPath.replace('/app/', '').toUpperCase();

  // Map path to appropriate API endpoint
  const apiMap: Record<string, string> = {
    '/app/fleet': '/api/vehicles',
    '/app/drivers': '/api/drivers',
    '/app/clients': '/api/clients',
    '/app/passengers': '/api/passengers',
    '/app/routes': '/api/routes',
    '/app/trips': '/api/trips',
    '/app/tracking': '/api/tracking/live',
    '/app/schedule': '/api/schedule/daily',
    '/app/maintenance': '/api/maintenance',
    '/app/documents': '/api/documents',
    '/app/notifications': '/api/notifications',
    '/app/reports': '/api/reports/kpis',
    '/app/settings': '/api/system/stats',
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const endpoint = apiMap[currentPath] || '/api/health';
      try {
        const res = await apiFetch(endpoint);
        setModuleData(res);
      } catch {
        setModuleData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPath]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange">Prompt 1 Architecture Ready</Badge>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Backend API & Schema Active</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Module: {moduleName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            This module's database tables, CRUD endpoints, and TypeScript types are fully established in Prompt 1. Detailed operational UI will be constructed in subsequent prompts.
          </p>
        </div>

        <Button
          size="sm"
          variant="navy"
          onClick={() => navigate('/app/dashboard')}
          leftIcon={<ArrowRight className="w-3.5 h-3.5 rotate-180 text-orange-400" />}
        >
          Back to Control Center
        </Button>
      </div>

      {/* Live Data Payload Inspection for this Module */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-orange-500" />
            <span>Live REST API Response for this Module ({apiMap[currentPath] || '/api/health'})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner message="Querying live module API..." />
          ) : (
            <pre className="bg-[#060D17] text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(moduleData, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
