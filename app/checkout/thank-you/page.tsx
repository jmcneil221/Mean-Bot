import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Request Sent — CarBuyingHub',
};

type Intent = 'check_availability' | 'reserve';

function normalizeIntent(raw: string | string[] | undefined): Intent {
  if (raw === 'reserve') return 'reserve';
  return 'check_availability';
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; intent?: string }>;
}) {
  const { id, intent: rawIntent } = await searchParams;
  const intent = normalizeIntent(rawIntent);
  const isHot = intent === 'reserve';

  const headline = isHot ? 'Vehicle Request Sent' : 'Availability Request Sent';

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-burgundy"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Headline */}
        <p className="section-subheading mb-3">Step 3 of 3 · Complete</p>
        <h1 className="section-heading mb-6">{headline}</h1>

        {/* Body copy — adapts to intent */}
        {isHot ? (
          <div className="space-y-5 text-charcoal/70 leading-relaxed">
            <p>
              Thanks for your interest. We&rsquo;ve sent your request to the
              dealership and let them know you&rsquo;re ready to take the next step.
            </p>
            <p>
              A dealership representative may contact you soon to confirm
              availability and discuss what comes next. No payment was collected
              through CarBuyingHub, and this request does not guarantee that the
              vehicle has been held, sold, or removed from inventory.
            </p>
          </div>
        ) : (
          <div className="space-y-5 text-charcoal/70 leading-relaxed">
            <p>
              Thanks for reaching out. We&rsquo;ve sent your request to the
              dealership so they can confirm whether this vehicle is still
              available.
            </p>
            <p>
              A dealership representative may contact you soon using the
              information you provided. Availability, pricing, and vehicle
              details should be confirmed directly with the dealer before making
              any plans.
            </p>
          </div>
        )}
      </div>

      {/* What Happens Next */}
      <div className="card mt-12">
        <h2 className="font-serif text-lg font-bold text-charcoal mb-5">
          What happens next
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-burgundy text-white text-sm font-semibold flex items-center justify-center">
              1
            </span>
            <p className="text-sm text-charcoal/70 leading-relaxed pt-0.5">
              The dealership receives your request immediately by email.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-burgundy text-white text-sm font-semibold flex items-center justify-center">
              2
            </span>
            <p className="text-sm text-charcoal/70 leading-relaxed pt-0.5">
              A representative reviews your information and reaches out by phone
              or email.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-burgundy text-white text-sm font-semibold flex items-center justify-center">
              3
            </span>
            <p className="text-sm text-charcoal/70 leading-relaxed pt-0.5">
              {isHot
                ? 'You and the dealer agree on next steps directly — including any deposit, paperwork, or scheduling.'
                : 'You confirm availability with the dealer before making the trip.'}
            </p>
          </li>
        </ol>
      </div>

      {/* Reference + actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        {id && (
          <p className="text-charcoal/40">
            Reference ID:{' '}
            <span className="font-mono text-charcoal/60 select-all">{id}</span>
          </p>
        )}
        <div className="flex gap-3">
          <Link href="/vehicles" className="btn-secondary">
            Browse More Vehicles
          </Link>
          <Link href="/" className="btn-ghost">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer disclaimer */}
      <p className="text-xs text-charcoal/40 text-center mt-12 leading-relaxed">
        CarBuyingHub connects buyers and dealers but is not a party to the sale
        of any vehicle. All transactions, payments, and final terms are arranged
        directly between you and the dealership.
      </p>
    </section>
  );
}