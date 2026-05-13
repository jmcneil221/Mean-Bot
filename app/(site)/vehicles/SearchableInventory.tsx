'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchableInventory({ initialVehicles }: { initialVehicles: any[] }) {
  // 1. State for all our different filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // 2. Automatically generate unique dropdown options from the actual inventory
  const uniqueMakes = Array.from(new Set(initialVehicles.map(v => v.make))).sort();
  
  const availableModels = Array.from(
    new Set(
      initialVehicles
        .filter(v => !selectedMake || v.make === selectedMake)
        .map(v => v.model)
    )
  ).sort();

  const uniqueYears = Array.from(new Set(initialVehicles.map(v => v.year))).sort((a, b) => b - a);

  // 3. The Master Filter Logic
  const filteredVehicles = initialVehicles.filter((v) => {
    const searchString = `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === '' || v.make === selectedMake;
    const matchesModel = selectedModel === '' || v.model === selectedModel;
    const matchesYear = selectedYear === '' || v.year.toString() === selectedYear;
    const matchesPrice = maxPrice === '' || (v.price_cents <= parseInt(maxPrice) * 100);

    return matchesSearch && matchesMake && matchesModel && matchesYear && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setMaxPrice('');
  };

  return (
    <>
      {/* ─── PREMIUM FILTER CONSOLE (MOBILE OPTIMIZED) ─── */}
      <div className="mb-10 md:mb-12 max-w-4xl mx-auto space-y-3 md:space-y-4">
        
        {/* Main Text Search */}
        <div className="relative shadow-sm">
          <input
            type="text"
            placeholder="Search by make, model, year, or trim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Notice text-[16px] for mobile to prevent iOS Safari auto-zooming!
            className="w-full bg-white border border-[#1A1A1A]/10 rounded-sm px-5 py-4 text-[16px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#A8896B] transition-all placeholder:text-[#1A1A1A]/30 text-[#1A1A1A]"
          />
        </div>

        {/* Dropdown Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <select 
            value={selectedMake} 
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel(''); 
            }}
            className="w-full bg-white border border-[#1A1A1A]/10 rounded-sm px-3 md:px-4 py-3.5 text-[16px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#A8896B] text-[#1A1A1A] appearance-none cursor-pointer truncate"
          >
            <option value="">All Makes</option>
            {uniqueMakes.map(make => (
              <option key={make as string} value={make as string}>{make as string}</option>
            ))}
          </select>

          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake && availableModels.length > 15}
            className="w-full bg-white border border-[#1A1A1A]/10 rounded-sm px-3 md:px-4 py-3.5 text-[16px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#A8896B] text-[#1A1A1A] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed truncate"
          >
            <option value="">All Models</option>
            {availableModels.map(model => (
              <option key={model as string} value={model as string}>{model as string}</option>
            ))}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A]/10 rounded-sm px-3 md:px-4 py-3.5 text-[16px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#A8896B] text-[#1A1A1A] appearance-none cursor-pointer truncate"
          >
            <option value="">All Years</option>
            {uniqueYears.map(year => (
              <option key={year as string} value={year as string}>{year as string}</option>
            ))}
          </select>

          <select 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A]/10 rounded-sm px-3 md:px-4 py-3.5 text-[16px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#A8896B] text-[#1A1A1A] appearance-none cursor-pointer truncate"
          >
            <option value="">Any Price</option>
            <option value="20000">Under $20k</option>
            <option value="30000">Under $30k</option>
            <option value="40000">Under $40k</option>
            <option value="50000">Under $50k</option>
            <option value="75000">Under $75k</option>
            <option value="100000">Under $100k</option>
          </select>
        </div>

        {/* Results Counter & Clear Button */}
        <div className="flex justify-between items-center px-1 pt-1 md:pt-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 font-bold">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 && 's'}
            </p>
            
            {(searchTerm || selectedMake || selectedModel || selectedYear || maxPrice) && (
              <button 
                onClick={clearFilters} 
                className="text-[10px] uppercase tracking-[0.2em] text-[#6B1D2F] font-bold hover:text-[#1A1A1A] transition-colors py-2 md:py-0"
              >
                Clear Filters
              </button>
            )}
        </div>
      </div>

      {/* ─── INVENTORY GRID ─── */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-20 border border-[#1A1A1A]/[0.06] bg-white rounded-sm shadow-sm mx-auto max-w-lg">
          <p className="text-[#1A1A1A]/40 text-sm uppercase tracking-[0.2em] mb-6 px-4">No vehicles match your current filters.</p>
          <button 
            onClick={clearFilters} 
            className="w-[90%] md:w-auto bg-[#1A1A1A] text-[#F4F1EA] px-8 py-4 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#6B1D2F]"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredVehicles.map((v) => (
            <Link 
              href={`/vehicles/${v.id}`} 
              key={v.id} 
              className="group block bg-white rounded-sm border border-[#1A1A1A]/[0.06] overflow-hidden hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="h-48 md:h-56 bg-[#F4F1EA] flex items-center justify-center text-[#1A1A1A]/20 transition-colors group-hover:bg-[#E8E4DE]">
                <span className="text-xs md:text-sm uppercase tracking-widest">Photos Soon</span>
              </div>
              
              <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <h2 className="font-serif text-lg md:text-xl font-bold group-hover:text-[#6B1D2F] transition-colors leading-tight">
                    {v.year} {v.make} {v.model}
                  </h2>
                  <p className="text-[11px] md:text-xs text-[#1A1A1A]/60 mt-1.5 md:mt-1 uppercase tracking-wider truncate">
                    {v.trim || 'Standard Trim'}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#1A1A1A]/10 flex justify-between items-center">
                  <p className="font-medium text-lg md:text-lg">${(v.price_cents / 100).toLocaleString()}</p>
                  <p className="text-[11px] md:text-xs text-[#1A1A1A]/40">{v.mileage?.toLocaleString() || '—'} mi</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}