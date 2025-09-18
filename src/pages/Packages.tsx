
import React from 'react';
import { motion } from 'framer-motion';

import { usePackages } from '@/hooks/usePackages';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatUSD } from '@/lib/currency';

const Packages = () => {
  const { data: packages = [], isLoading, error } = usePackages();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-egyptian py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-gold text-center">Travel Packages</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-10">
          Discover our carefully curated travel packages designed to showcase the best of Egypt
        </p>
        {isLoading && <div className="text-center py-20 text-xl font-semibold">Loading packages...</div>}
        {error && <div className="text-center py-20 text-red-600 font-semibold">Error loading packages</div>}
        {!isLoading && !error && packages.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No packages found.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading && !error && packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer" onClick={() => window.location.href = `/packages/${pkg.id}`}>
              <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{pkg.group_size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{pkg.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gradient-gold">{pkg.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{pkg.description}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {pkg.highlights?.map((h, i) => (
                    <span key={i} className="bg-pharaoh-100 text-pharaoh-700 px-2 py-1 rounded text-xs">{h}</span>
                  ))}
                </div>
                <div className="text-pharaoh-600 font-bold text-lg mt-auto">{t('price.startFrom')} {formatUSD(pkg.price)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;
