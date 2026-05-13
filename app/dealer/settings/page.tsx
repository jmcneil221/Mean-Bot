import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('dealership_id')
    .eq('id', user!.id)
    .single();

  const { data: dealership } = await supabase
    .from('dealerships')
    .select('*')
    .eq('id', profile!.dealership_id)
    .single();

  if (!dealership) return null;

  return (
    <div>
      <div className="mb-10">
        <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-2">Settings</p>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Dealership Profile</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Name</p>
            <p className="text-charcoal font-medium">{dealership.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Slug</p>
            <p className="text-charcoal/60 font-mono text-sm">{dealership.slug}</p>
          </div>
        </div>

        <div className="border-t border-[#E8E4DE]" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Plan</p>
            <p className="text-charcoal font-medium capitalize">{dealership.plan.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Status</p>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              dealership.status === 'active'
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {dealership.status}
            </span>
          </div>
        </div>

        <div className="border-t border-[#E8E4DE]" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Email</p>
            <p className="text-charcoal/70">{dealership.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Phone</p>
            <p className="text-charcoal/70">{dealership.phone || '—'}</p>
          </div>
        </div>

        <div className="border-t border-[#E8E4DE]" />

        <div>
          <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Location</p>
          <p className="text-charcoal/70">
            {[dealership.city, dealership.state, dealership.zip].filter(Boolean).join(', ') || '—'}
          </p>
        </div>

        <div className="border-t border-[#E8E4DE] pt-4">
          <p className="text-charcoal/30 text-xs">
            Contact us at dealers@carbuyinghub.com to update your dealership details.
          </p>
        </div>
      </div>
    </div>
  );
}
