'use client';

import { useState, useMemo } from 'react';

const CREDIT_TIERS = [
  { label: 'Poor', range: '300–639', baseApr: 0.1799 },
  { label: 'Fair', range: '640–699', baseApr: 0.1149 },
  { label: 'Good', range: '700–749', baseApr: 0.0649 },
  { label: 'Excellent', range: '750+', baseApr: 0.0399 },
] as const;

const TERM_OPTIONS = [24, 36, 48, 60, 72, 84];

const TERM_MARKUPS: Record<number, number> = {
  24: 0.00,
  36: 0.00,
  48: 0.005,
  60: 0.01,
  72: 0.02,
  84: 0.035,
};

const DEALER_DOC_FEE = 599; // Average CT Conveyance Fee
const CT_DMV_FEE = 200;     // Estimated Reg/Title

function calculateMonthly(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function PaymentCalculator({ vehiclePrice }: { vehiclePrice: number }) {
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2); // Default to 20% down
  const [termMonths, setTermMonths] = useState(60);
  const [tierIndex, setTierIndex] = useState(2);
  const [includeTaxFees, setIncludeTaxFees] = useState(false);

  const tier = CREDIT_TIERS[tierIndex];
  const termMarkup = TERM_MARKUPS[termMonths] || 0;
  const finalApr = tier.baseApr + termMarkup;

  // CT Luxury Tax logic: 7.75% for vehicles over $50,000, 6.35% for everything else
  const currentTaxRate = price > 50000 ? 0.0775 : 0.0635;

  const taxAmount = includeTaxFees ? Math.round(price * currentTaxRate) : 0;
  const docFeeAmount = includeTaxFees ? DEALER_DOC_FEE : 0;
  const dmvFeeAmount = includeTaxFees ? CT_DMV_FEE : 0;
  
  const totalFees = docFeeAmount + dmvFeeAmount;
  const totalPrice = price + taxAmount + totalFees;
  const loanAmount = Math.max(0, totalPrice - downPayment);

  const monthly = useMemo(
    () => calculateMonthly(loanAmount, finalApr, termMonths),
    [loanAmount, finalApr, termMonths],
  );

  return (
    <div className="bg-white p-5 rounded-sm border border-[#1A1A1A]/[0.05] shadow-sm mb-10 w-full">
      <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#A8896B] font-semibold mb-4">Estimated Financing</h3>

      {/* Main Price Output - Keeping the standout Burgundy */}
      <div className="flex items-end justify-between border-b border-[#1A1A1A]/[0.08] pb-5 mb-5">
        <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#1A1A1A]/90 mb-1">
          {includeTaxFees ? 'Out-the-Door Payment' : 'Monthly Payment'}
        </span>
        <div className="text-right">
          <span className="font-serif text-3xl text-[#6B1D2F]">
            ${monthly > 0 ? Math.round(monthly).toLocaleString() : '0'}
            <span className="text-sm font-sans font-light text-[#1A1A1A]/40 ml-1">/mo</span>
          </span>
          <p className="text-[9px] font-medium tracking-widest uppercase text-[#A8896B] mt-1">Est. APR: {(finalApr * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Price & Down Payment Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[8px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-semibold mb-1.5">Vehicle Price</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-[#1A1A1A]/50 text-xs font-light">$</span>
              <input
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#F4F1EA]/30 border border-[#1A1A1A]/[0.08] text-sm font-light pl-6 pr-2 py-1.5 rounded-sm focus:outline-none focus:border-[#A8896B] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-semibold mb-1.5">Down Payment</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-[#1A1A1A]/50 text-xs font-light">$</span>
              <input
                type="number"
                value={downPayment || ''}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full bg-[#F4F1EA]/30 border border-[#1A1A1A]/[0.08] text-sm font-light pl-6 pr-2 py-1.5 rounded-sm focus:outline-none focus:border-[#A8896B] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Credit Score Slider */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-semibold">Credit Tier</span>
            <span className="text-[9px] font-medium text-[#6B1D2F] tracking-wide">{tier.label} ({tier.range})</span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={tierIndex}
            onChange={(e) => setTierIndex(Number(e.target.value))}
            className="w-full h-[2px] bg-[#1A1A1A]/10 rounded-none appearance-none cursor-pointer accent-[#6B1D2F]"
          />
        </div>

        {/* Term length buttons (Restored to 6 columns) */}
        <div>
          <label className="block text-[8px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-semibold mb-2">Loan Term</label>
          <div className="grid grid-cols-6 gap-1">
            {TERM_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTermMonths(t)}
                className={`py-1 text-[9px] font-medium tracking-wide rounded-sm transition-all border ${
                  termMonths === t 
                    ? 'bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A]' 
                    : 'bg-transparent text-[#1A1A1A]/60 border-[#1A1A1A]/[0.08] hover:border-[#1A1A1A]/20'
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Tax & Fees Toggle */}
        <div className="pt-3 border-t border-[#1A1A1A]/[0.05] mt-1">
          <button
            type="button"
            onClick={() => setIncludeTaxFees(!includeTaxFees)}
            className="flex items-center justify-between w-full py-1 group"
          >
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-semibold group-hover:text-[#1A1A1A]/80 transition-colors">
              Include CT Taxes & Fees
            </span>
            <div className={`relative w-7 h-3.5 rounded-full transition-colors ${includeTaxFees ? 'bg-[#6B1D2F]' : 'bg-[#1A1A1A]/10'}`}>
              <div className={`absolute top-[2px] left-[2px] w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform ${includeTaxFees ? 'translate-x-3.5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
        
        {/* Disclaimer */}
        <p className="text-[8px] font-light tracking-wide text-[#1A1A1A]/40 leading-relaxed">
          {includeTaxFees
            ? `Includes CT sales tax (${(currentTaxRate * 100).toFixed(2)}%), est. dealer fee ($${DEALER_DOC_FEE}), and DMV fees ($${CT_DMV_FEE}).`
            : '*Taxes, title, and registration fees are not included.'}
        </p>
      </div>
    </div>
  );
}