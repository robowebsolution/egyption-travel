
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePackages } from '@/hooks/usePackages';

const PopularPackages = () => {
  const { t } = useLanguage();

  const { data: packages = [], isLoading, error } = usePackages();

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
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
              Travel Packages
            </span>
            <div className="h-px w-12 bg-pharaoh-400" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient-gold">
            {t('packages.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('packages.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {isLoading && (
            <div className="col-span-4 flex justify-center items-center h-40 text-xl font-semibold">Loading packages...</div>
          )}
          {error && (
            <div className="col-span-4 flex justify-center items-center h-40 text-red-600 font-semibold">Error loading packages</div>
          )}
          {!isLoading && !error && packages.map((pkg) => (
            <motion.div key={pkg.id} variants={cardVariants} >
              <Link to={`/packages/${pkg.id}`} className="block h-full" >

                <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-0 bg-white/80  backdrop-blur-sm">
                  <div className="relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-pharaoh-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.price}
                    </div>
                  </div>
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
                    
                    <h3 className="text-xl font-bold mb-2 text-gradient-gold group-hover:text-pharaoh-600 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      {pkg.description}
                    </p>
                    
                    <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                      {pkg.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-pharaoh-400 rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    
                    <Button asChild size="sm" className="w-full group">
                      <Link to={`/packages/${pkg.id}`} className="flex items-center gap-2">
                        Book Now
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.div>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/packages" className="flex items-center gap-2">
              {t('packages.viewAll')}
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularPackages;
