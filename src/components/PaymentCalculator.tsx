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

export default function PaymentCalculator({
  vehiclePrice,
}: {
  vehiclePrice: number;
}) {
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(0);
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

  const totalCost = monthly * termMonths;
  const totalInterest = totalCost - loanAmount;

  return (
    <>
      <div className="space-y-5">
        <p className="text-xs text-charcoal/40 uppercase tracking-[0.2em] font-bold">Payment Calculator</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1.5">Price</label>
            <div className="flex items-center gap-2">
              <span className="text-charcoal/60 text-base font-medium">$</span>
              <input
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-parchment border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-burgundy"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1.5">Down Pay</label>
            <div className="flex items-center gap-2">
              <span className="text-charcoal/60 text-base font-medium">$</span>
              <input
                type="number"
                value={downPayment || ''}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full bg-parchment border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-burgundy"
              />
            </div>
          </div>
        </div>

        {/* Tax & Fees Toggle */}
        <button
          type="button"
          onClick={() => setIncludeTaxFees(!includeTaxFees)}
          className="flex flex-col items-center justify-center gap-2 w-full py-3 px-3 bg-parchment rounded-lg group transition-all hover:bg-[#E8E4DE]"
        >
          <span className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold">
            Include Est. Taxes & Fees
          </span>
          <div className={`relative w-10 h-5 rounded-full transition-colors ${includeTaxFees ? 'bg-burgundy' : 'bg-charcoal/10'}`}>
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${includeTaxFees ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        {includeTaxFees && (
          <div className="grid grid-cols-3 text-center text-[10px] text-charcoal/40 px-1 -mt-1 gap-1">
            <span>CT Tax: <span className="text-charcoal font-medium">${taxAmount.toLocaleString()}</span></span>
            <span>Doc Fee: <span className="text-charcoal font-medium">${docFeeAmount}</span></span>
            <span>DMV Reg: <span className="text-charcoal font-medium">${dmvFeeAmount}</span></span>
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-3">
            Credit Score
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={tierIndex}
            onChange={(e) => setTierIndex(Number(e.target.value))}
            className="w-full h-2 bg-[#E8E4DE] rounded-lg cursor-pointer accent-burgundy"
          />
          <div className="flex justify-between mt-2">
            {CREDIT_TIERS.map((t, i) => (
              <div key={t.label} className="text-center">
                <p className={`text-[10px] font-bold uppercase tracking-tighter ${i === tierIndex ? 'text-burgundy' : 'text-charcoal/30'}`}>
                  {t.label}
                </p>
                <p className="text-[9px] text-charcoal/20">{t.range}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center bg-parchment p-1 rounded-xl">
          {TERM_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTermMonths(t)}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                termMonths === t ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/40'
              }`}
            >
              {t}m
            </button>
          ))}
        </div>

        <div className="text-center border-t border-[#E8E4DE] pt-5">
          <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1">
            {includeTaxFees ? 'Est. Out-the-Door Payment' : 'Monthly Payment'}
          </p>
          <p className="font-serif text-3xl font-bold text-charcoal">
            ${monthly > 0 ? Math.round(monthly).toLocaleString() : '—'}
            <span className="text-sm font-sans font-normal text-charcoal/40">/mo</span>
          </p>
          <p className="text-[10px] text-charcoal/40 mt-1">
            Est. APR: <span className="text-charcoal font-bold">{(finalApr * 100).toFixed(1)}%</span>
            {includeTaxFees && <span className="text-charcoal/30"> · incl. tax & fees</span>}
          </p>
        </div>

        {loanAmount > 0 && (
          <div className={`grid ${includeTaxFees ? 'grid-cols-2' : 'grid-cols-3'} gap-3 bg-parchment rounded-xl p-3`}>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-0.5">Loan</p>
              <p className="text-xs font-bold text-charcoal">${loanAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-0.5">Interest</p>
              <p className="text-xs font-bold text-charcoal">${totalInterest > 0 ? Math.round(totalInterest).toLocaleString() : '0'}</p>
            </div>
            {!includeTaxFees && (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-0.5">Total</p>
                <p className="text-xs font-bold text-charcoal">${totalCost > 0 ? Math.round(totalCost).toLocaleString() : '0'}</p>
              </div>
            )}
            {includeTaxFees && (
              <>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-0.5">Tax & Fees</p>
                  <p className="text-xs font-bold text-charcoal">${(taxAmount + totalFees).toLocaleString()}</p>
                </div>
                <div className="text-center col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-0.5">Total Out-the-Door</p>
                  <p className="text-xs font-bold text-charcoal">${totalCost > 0 ? Math.round(totalCost).toLocaleString() : '0'}</p>
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-charcoal/30 text-[10px] leading-relaxed text-center">
          {includeTaxFees
            ? `Includes CT sales tax (${(currentTaxRate * 100).toFixed(2)}%), est. dealer conveyance fee ($${DEALER_DOC_FEE}), and est. DMV registration/title fees ($${CT_DMV_FEE}). Actual fees may vary by dealer and municipality.`
            : 'Excludes taxes, title, registration, and dealer fees. For illustrative purposes only.'}
        </p>
      </div>
    </>
  );
}