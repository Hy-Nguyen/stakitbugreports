import BugDashboard from '@/features/bugreports/components/BugDashboard';

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#FBFBFB] p-4 lg:p-8">
      <BugDashboard />
    </main>
  );
}
