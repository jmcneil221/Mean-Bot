'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UploadResult {
  success: boolean;
  error?: string;
  summary?: {
    totalRows: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  mappedColumns?: string[];
  errors?: { row: number; message: string }[];
  skippedVins?: string[];
}

export default function InventoryUpload() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setResult({ success: false, error: 'Please upload a .csv file' });
      return;
    }

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/dealers/inventory/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      if (data.success) {
        router.refresh();
      }
    } catch {
      setResult({ success: false, error: 'Network error — could not upload file' });
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-burgundy bg-burgundy/5'
            : 'border-[#E8E4DE] hover:border-charcoal/30 hover:bg-parchment'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4">
            <div className="w-8 h-8 border-2 border-charcoal/20 border-t-burgundy rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-charcoal/60">Processing CSV...</p>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-charcoal/20 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-charcoal mb-1">
              Drop your inventory CSV here
            </p>
            <p className="text-xs text-charcoal/40">
              or click to browse — requires VIN, Year, Make, Model, Price columns
            </p>
          </>
        )}
      </div>

      {result && (
        <div className={`rounded-xl border p-5 ${
          result.success ? 'border-gold/30 bg-gold/5' : 'border-red-200 bg-red-50'
        }`}>
          {result.success && result.summary ? (
            <>
              <p className="font-serif font-bold text-charcoal mb-3">Import Complete</p>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-charcoal">{result.summary.inserted}</p>
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Added</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-charcoal">{result.summary.updated}</p>
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Updated</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-charcoal/40">{result.summary.skipped}</p>
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Skipped</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-500">{result.summary.errors}</p>
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Errors</p>
                </div>
              </div>
              {result.mappedColumns && (
                <p className="text-xs text-charcoal/40">
                  Mapped: {result.mappedColumns.join(', ')}
                </p>
              )}
              {result.errors && result.errors.length > 0 && (
                <details className="mt-3">
                  <summary className="text-xs text-charcoal/40 cursor-pointer hover:text-charcoal/60">
                    {result.errors.length} issue{result.errors.length !== 1 ? 's' : ''} — click to expand
                  </summary>
                  <ul className="text-xs text-red-600 space-y-0.5 mt-2">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err.row > 0 ? 'Row ' + err.row + ': ' : ''}{err.message}</li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          ) : (
            <div>
              <p className="font-medium text-red-700 text-sm mb-1">{result.error}</p>
              {result.errors && result.errors.length > 0 && (
                <ul className="text-xs text-red-600 space-y-0.5 mt-2">
                  {result.errors.map((err, i) => (
                    <li key={i}>Row {err.row}: {err.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
