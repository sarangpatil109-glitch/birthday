import CreateForm from '@/components/form/CreateForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Birthday Website — HeartNote',
  description:
    'Fill in the details and create a beautiful cinematic birthday website in minutes.',
  robots: { index: false, follow: false },
};

export default function CreatePage() {
  return (
    <main style={{ background: 'var(--bg-deep)', minHeight: '100vh' }}>
      <CreateForm />
    </main>
  );
}
