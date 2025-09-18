
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign } from 'lucide-react';
import { useExperiences } from '@/hooks/useExperiences';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatUSD } from '@/lib/currency';

const CulturalExperiences = () => {
  const { data: experiences, isLoading, error } = useExperiences();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleExperienceClick = (experienceId: string) => {
    navigate(`/experiences/${experienceId}`);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">{t('experience.loading')}</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{t('error.loading')}</div>
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
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
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
              {t('experiences.title')}
            </span>
            <div className="h-px w-12 bg-pharaoh-400" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient-gold">
            {t('experiences.subtitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('experiences.exploreAll')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {experiences?.map((experience) => (
            <motion.div key={experience.id} variants={cardVariants}>
              <Card 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm h-full cursor-pointer"
                onClick={() => handleExperienceClick(experience.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-pharaoh-600 text-white">
                    {experience.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gradient-gold group-hover:text-pharaoh-600 transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {experience.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    {experience.duration && (
                      <div className="flex items-center gap-1 text-pharaoh-600">
                        <Clock className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                    )}
                    {experience.price && (
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>{t('price.startFrom')} {formatUSD(experience.price)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CulturalExperiences;
