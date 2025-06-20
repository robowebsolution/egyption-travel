
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Mountain, Heart, Shield, Coins, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhyEgypt = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Crown,
      title: 'Rich Heritage',
      description: 'Explore 5,000 years of fascinating history and ancient civilization'
    },
    {
      icon: Mountain,
      title: 'Diverse Landscapes',
      description: 'From Red Sea reefs to Sahara dunes and Nile valleys'
    },
    {
      icon: Heart,
      title: 'Warm Hospitality',
      description: 'Experience genuine Egyptian warmth and traditional welcome'
    },
    {
      icon: Shield,
      title: 'Safe Travel',
      description: 'Well-established tourism infrastructure with experienced guides'
    },
    {
      icon: Coins,
      title: 'Great Value',
      description: 'Affordable luxury experiences and exceptional value for money'
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Native guides sharing authentic stories and hidden gems'
    }
  ];

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
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
              Why Choose Egypt
            </span>
            <div className="h-px w-12 bg-pharaoh-400" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient-gold">
            {t('whyEgypt.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('whyEgypt.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="mb-6"
                    >
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pharaoh-400 to-pharaoh-600 rounded-full flex items-center justify-center group-hover:from-pharaoh-500 group-hover:to-pharaoh-700 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gradient-gold group-hover:text-pharaoh-600 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyEgypt;
