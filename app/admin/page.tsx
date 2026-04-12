import { redirect } from 'next/navigation';

// Admin index just redirects to the applications list
export default function AdminPage() {
  redirect('/admin/applications');
}
