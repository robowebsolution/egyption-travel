
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    destinations: [
      { name: 'Dahab', href: '/destinations' },
      { name: 'Siwa Oasis', href: '/destinations' },
      { name: 'Luxor', href: '/destinations' },
      { name: 'White Desert', href: '/destinations' },
    ],
    experiences: [
      { name: 'Desert Safari', href: '/experiences' },
      { name: 'Diving Tours', href: '/experiences' },
      { name: 'Cultural Immersion', href: '/experiences' },
      { name: 'Photography Tours', href: '/experiences' },
    ],
    company: [
      { name: t('nav.about'), href: '/about' },
      { name: t('nav.contact'), href: '/contact' },
      { name: t('nav.blog'), href: '/blog' },
      { name: 'Privacy Policy', href: '/privacy' },
    ]
  };

  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">𓂀</span>
              <span className="text-xl font-bold text-gradient-gold">Egyptian Dreams</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
              Creating unforgettable journeys through Egypt's timeless wonders. 
              Experience authentic Egyptian culture with our expert local guides.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-pharaoh-500" />
                <span className="text-muted-foreground">Cairo, Egypt</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-pharaoh-500" />
                <span className="text-muted-foreground">hello@egyptiandreams.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-pharaoh-500" />
                <span className="text-muted-foreground">+20 123 456 789</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-pharaoh-600 dark:text-pharaoh-400">
              Popular Destinations
            </h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-pharaoh-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-pharaoh-600 dark:text-pharaoh-400">
              Experiences
            </h4>
            <ul className="space-y-2">
              {footerLinks.experiences.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-pharaoh-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-pharaoh-600 dark:text-pharaoh-400">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-pharaoh-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Egyptian Dreams. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-pharaoh-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-8 h-8 bg-pharaoh-100 dark:bg-pharaoh-900 rounded-full flex items-center justify-center text-xs font-bold">
                    {social[0]}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
