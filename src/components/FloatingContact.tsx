import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/config/contact';

/**
 * FloatingContact
 * - A modern floating phone button that reveals a neatly organized WhatsApp card above with smooth animation.
 * - Uses site palette (pharaoh/royal), supports safe-area, and is responsive across devices.
 */
const FloatingContact: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
  const telHref = `tel:${CONTACT.phoneTel}`;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 right-4 sm:right-6 select-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      <div className="relative">
        {/* Popover panel above main button */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="popover"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 mb-3 w-[min(92vw,320px)] sm:w-[320px] -top-2 translate-y-[-100%] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-xl shadow-black/10"
            >
              {/* Arrow */}
              <span className="absolute -bottom-2 right-5 h-4 w-4 rotate-45 bg-card/95 border border-border border-t-0 border-l-0" />

              <div className="p-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-full rounded-xl px-3 py-3 border border-border/70 hover:border-royal-400/60 transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-royal-500 to-royal-700 text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">الدردشة عبر واتساب</span>
                    <span className="text-xs text-muted-foreground truncate">{CONTACT.phoneDisplay}</span>
                  </div>
                </a>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={telHref}
                    className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 border border-pharaoh-300/70 text-pharaoh-800 hover:bg-pharaoh-50/60 transition-colors"
                    aria-label="Call by phone"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">اتصال</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 border border-border text-foreground/80 hover:bg-accent/50 transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          type="button"
          aria-label="Show contact options"
          onClick={() => setOpen((s) => !s)}
          whileTap={{ scale: 0.94 }}
          className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white shadow-xl shadow-pharaoh-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-400 bg-gradient-to-br from-pharaoh-400 to-pharaoh-600 hover:from-pharaoh-500 hover:to-pharaoh-700"
        >
          <Phone className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingContact;
