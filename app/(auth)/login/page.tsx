import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card bg-white">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
