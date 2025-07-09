import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HeroSection = () => {
  const { t } = useLanguage();
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch images from Supabase
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_images')
        .select('url')
        .order('order_index', { ascending: true });
      if (!error && data) {
        setBackgroundImages(data.map((img) => img.url));
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (backgroundImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with automatic transition */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentImageIndex === index ? 1 : 0,
              scale: currentImageIndex === index ? 1.05 : 1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
        
        {/* Floating Egyptian Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl text-pharaoh-400 opacity-20"
        >
          𓂀
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-16 text-8xl text-pharaoh-300 opacity-15"
        >
          𓉤
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 text-4xl text-pharaoh-500 opacity-10"
        >
          ⚱️
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-12 bg-pharaoh-400" />
            <span className="text-pharaoh-300 font-medium tracking-wider text-sm uppercase">
              {t('hero.ctaSubtitle') || 'Luxury Egyptian Adventures'}
            </span>
            <div className="h-px w-12 bg-pharaoh-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
          >
            <span className="text-gradient-gold">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="group">
              <Link to="/packages" className="flex items-center gap-2">
                {t('hero.cta')}
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="group bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to="/destinations" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('hero.exploreDestinations') || 'Explore Destinations'}
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
          >
            {[
              { number: '15+', label: t('hero.stats.destinations') || 'Unique Destinations' },
              { number: '500+', label: t('hero.stats.travelers') || 'Happy Travelers' },
              { number: '50+', label: t('hero.stats.experiences') || 'Cultural Experiences' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="text-2xl md:text-3xl font-bold text-pharaoh-300">
                  {stat.number}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Image indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2"
      >
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index ? 'bg-pharaoh-400 w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-pharaoh-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-pharaoh-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
