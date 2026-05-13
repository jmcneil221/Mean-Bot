'use client';

import { useState, useTransition } from 'react';
import { updateDealershipSettings } from '@/app/dealer/settings/actions';

export default function DealerSettingsForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    startTransition(async () => {
      const result = await updateDealershipSettings(formData);
      if (result.success) setMessage('Settings updated successfully!');
      else setMessage('Error: ' + result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Branding Section */}
      <div className="bg-white p-8 rounded-2xl border border-[#E8E4DE] space-y-6">
        <h2 className="font-serif text-xl font-bold text-charcoal">Branding & Bio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={formData.primary_color || '#2C2C2C'} 
                onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0"
              />
              <span className="text-sm font-mono text-charcoal/60 uppercase">{formData.primary_color}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">Logo URL</label>
            <input 
              type="text" 
              value={formData.logo_url || ''} 
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
              className="input-field text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">About Our Dealership</label>
          <textarea 
            rows={4}
            value={formData.about_text || ''} 
            onChange={(e) => setFormData({...formData, about_text: e.target.value})}
            className="input-field text-sm"
            placeholder="Tell your story..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${message.includes('Error') ? 'text-burgundy' : 'text-green-600'}`}>{message}</p>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
}
