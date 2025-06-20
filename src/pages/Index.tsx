
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import TopDestinations from '@/components/home/TopDestinations';
import PopularPackages from '@/components/home/PopularPackages';
import CulturalExperiences from '@/components/home/CulturalExperiences';
import WhyEgypt from '@/components/home/WhyEgypt';
import CustomerStories from '@/components/home/CustomerStories';
import NewsletterSignup from '@/components/home/NewsletterSignup';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <HeroSection />
      <TopDestinations />
      <PopularPackages />
      <CulturalExperiences />
      <WhyEgypt />
      <CustomerStories />
      <NewsletterSignup />
    </motion.div>
  );
};

export default Index;
