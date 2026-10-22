import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApplicationProvider } from '@/context/ApplicationContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { CommandCentre } from '@/pages/CommandCentre';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ApplicationReviewWorkspace } from '@/pages/ApplicationReviewWorkspace';
import { VerificationCentrePage } from '@/pages/VerificationCentrePage';
import { RiskIntelligencePage } from '@/pages/RiskIntelligencePage';
import { DeficienciesPage } from '@/pages/DeficienciesPage';
import { DocumentForensicsPage } from '@/pages/DocumentForensicsPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<CommandCentre />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationsPage />} />
            <Route path="applications/:id/review" element={<ApplicationReviewWorkspace />} />
            <Route path="verification" element={<VerificationCentrePage />} />
            <Route path="risk-insights" element={<RiskIntelligencePage />} />
            <Route path="risk-intelligence" element={<RiskIntelligencePage />} />
            <Route path="deficiencies" element={<DeficienciesPage />} />
            <Route path="document-forensics" element={<DocumentForensicsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  );
}

export default App;
