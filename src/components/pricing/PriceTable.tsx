import React from 'react';
import { formatUSD } from '@/lib/currency';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PricingTier } from '@/hooks/usePricingTiers';

interface PriceTableProps {
  tiers: PricingTier[];
}

export const PriceTable: React.FC<PriceTableProps> = ({ tiers }) => {
  const { t } = useLanguage();

  if (!tiers || tiers.length === 0) return null;

  const rows = [...tiers].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2 text-pharaoh-700">{t('price.title') || 'Price'}</h3>
      <p className="text-sm text-gray-500 mb-3">{t('price.note') || 'Prices may change depending on availability and demand.'}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-amber-500/90 text-white">
              <th className="text-left px-4 py-2">{t('package.people') || 'People'}</th>
              <th className="text-left px-4 py-2">{t('price.title') || 'Price'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tier, idx) => (
              <tr key={tier.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 font-medium">{tier.people_count}</td>
                <td className="px-4 py-2">{formatUSD(tier.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;
