
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperiences } from '@/hooks/useExperiences';
import { Card, CardContent } from '@/components/ui/card';

const Experiences = () => {
  const { data: experiences = [], isLoading, error } = useExperiences();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-egyptian py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-gold text-center">{t('experiences.title') || 'Cultural Experiences'}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-10">
          {t('experiences.subtitle') || 'Immerse yourself in authentic Egyptian culture with our unique experiences'}
        </p>
        {isLoading && <div className="text-center py-20 text-xl font-semibold">{t('experience.loading')}</div>}
        {error && <div className="text-center py-20 text-red-600 font-semibold">{t('error.loading') || 'Error loading experiences'}</div>}
        {!isLoading && !error && experiences.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">{t('experiences.notfound') || 'No experiences found.'}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading && !error && experiences.map((exp) => (
            <Link key={exp.id} to={`/experiences/${exp.id}`} className="block group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group-hover:ring-2 group-hover:ring-pharaoh-400">
                <img src={exp.image} alt={exp.title} className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105" />
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gradient-gold group-hover:text-pharaoh-700">{exp.title}</h3>
<span className=" w-[70px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">{exp.price} $</span>
                  <p className="text-muted-foreground mb-4 flex-1">{exp.description}</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {exp.highlights?.map((h, i) => (
                      <span key={i} className="bg-pharaoh-100 text-pharaoh-700 px-2 py-1 rounded text-xs">{h}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
