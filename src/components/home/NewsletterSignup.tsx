
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Egyptian Pattern Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-egyptian-pattern opacity-5" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-12 bg-pharaoh-400" />
                <span className="text-pharaoh-600 dark:text-pharaoh-400 font-medium tracking-wider text-sm uppercase">
                  {t('newsletter.stayConnected') || 'Stay Connected'}
                </span>
                <div className="h-px w-12 bg-pharaoh-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-gold">
                {t('newsletter.title')}
              </h2>
              
              <p className="text-muted-foreground mb-8">
                {t('newsletter.subtitle')}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="sm:px-8"
                >
                  {isLoading ? t('newsletter.subscribing') || 'Subscribing...' : t('newsletter.subscribe')}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                {t('newsletter.nospam') || 'No spam, only the best travel insights and exclusive offers.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
