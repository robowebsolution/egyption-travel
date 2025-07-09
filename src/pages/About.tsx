
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const team = [
  {
    name: 'Omar Elmasry',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Visionary leader with a passion for sharing Egypt’s wonders with the world.'
  },
  {
    name: 'Sara Nabil',
    role: 'Head of Experiences',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Curates unique, authentic adventures for every traveler.'
  },
  {
    name: 'Mohamed Fathy',
    role: 'Lead Guide',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    bio: 'Expert in Egyptian history and culture, making every trip unforgettable.'
  },
  {
    name: 'Laila Hassan',
    role: 'Customer Success',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Ensures every guest feels at home and cared for.'
  }
];

const values = [
  {
    title: 'Authenticity',
    desc: 'We deliver real, immersive Egyptian experiences.'
  },
  {
    title: 'Excellence',
    desc: 'We strive for the highest quality in every detail.'
  },
  {
    title: 'Passion',
    desc: 'We love Egypt and want you to love it too.'
  },
  {
    title: 'Care',
    desc: 'Your comfort, safety, and joy are our top priorities.'
  }
];

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-pharaoh-50 py-20">
      <div className="container mx-auto px-4">
        {/* مقدمة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient-gold">
            {t('about.title') || 'About Egyptian Dreams'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {t('about.subtitle') || 'Our story, mission, and the passionate team behind your Egyptian adventures'}
          </p>
          <img
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80"
            alt="Pyramids"
            className="mx-auto rounded-2xl shadow-lg w-full max-w-2xl object-cover mb-8"
          />
        </motion.div>

        {/* رؤية ورسالة */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-20 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-pharaoh-700">
            {t('about.visionTitle') || 'Our Vision & Mission'}
          </h2>
          <p className="text-lg text-pharaoh-800 max-w-2xl mx-auto mb-2">
            {t('about.vision') || 'To connect the world with the magic of Egypt through exceptional, authentic travel experiences.'}
          </p>
          <p className="text-md text-pharaoh-700 max-w-2xl mx-auto">
            {t('about.mission') || 'We are dedicated to making every journey personal, safe, and unforgettable.'}
          </p>
        </motion.div>

        {/* فريق العمل */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-pharaoh-700 text-center">
            {t('about.teamTitle') || 'Meet Our Team'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:scale-105 transition-transform duration-300">
                <CardContent className="flex flex-col items-center p-6">
                  <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pharaoh-100 shadow" />
                  <h3 className="text-lg font-bold text-pharaoh-800 mb-1">{member.name}</h3>
                  <p className="text-sm text-pharaoh-600 mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* قيم الشركة */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-pharaoh-700 text-center">
            {t('about.valuesTitle') || 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform duration-300">
                <CardContent className="flex flex-col items-center p-6">
                  <h3 className="text-lg font-bold text-pharaoh-800 mb-2">{t(`about.value${idx+1}.title`) || val.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{t(`about.value${idx+1}.desc`) || val.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* صورة ختامية */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
            alt="Egyptian Oasis"
            className="mx-auto rounded-2xl shadow-2xl w-full max-w-2xl object-cover mb-8"
          />
          <p className="text-pharaoh-700 text-lg font-semibold">
            {t('about.closing') || 'Join us and let’s create your dream Egyptian adventure!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
