
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { useLanguage } from '@/contexts/LanguageContext';

const TopDestinations = () => {
  const { data: destinations, isLoading, error } = useDestinations();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">{t('destinations.loading') || 'Loading destinations...'}</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{t('error.loading') || 'Failed to load destinations'}</div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-pharaoh-400" />
            <span className="text-pharaoh-600 font-medium tracking-wider text-sm uppercase">
              {t('destinations.title')}
            </span>
            <div className="h-px w-12 bg-pharaoh-400" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient-gold">
            {t('destinations.subtitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('destinations.description') || "From ancient wonders to pristine beaches, explore the most captivating destinations Egypt has to offer"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations?.map((destination) => (
            <motion.div key={destination.id} variants={cardVariants}>
              <Link to={`/destinations-trips/${destination.id}`} className="block h-full">
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 text-white mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{destination.region}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {destination.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-pharaoh-900 mb-2">{t('destinations.activities') || 'Activities'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {destination.activities.map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-pharaoh-900 mb-2">{t('destinations.highlights') || 'Highlights'}</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {destination.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-pharaoh-400 rounded-full" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopDestinations;
