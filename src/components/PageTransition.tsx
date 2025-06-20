import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import React from 'react';

const variants = {
  initial: {
    opacity: 0,
    y: 32,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
  },
  exit: {
    opacity: 0,
    y: -32,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
  }
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
