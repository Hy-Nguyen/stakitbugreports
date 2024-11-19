'use client';
import { BugProvider } from '@/features/bugreports/provider/BugDashboardContext';
import { Toaster } from 'react-hot-toast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BugProvider>
      <Toaster />
      {children}
    </BugProvider>
  );
}
