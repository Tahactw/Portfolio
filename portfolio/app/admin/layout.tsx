import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.login !== process.env.GITHUB_ADMIN_USERNAME) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <AdminNav />
      <main className="flex-1 p-8 overflow-y-auto scrollable-content">
        {children}
      </main>
    </div>
  );
}