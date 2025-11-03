'use client';
import React, { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const CreateUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const linkClasses = 'hover:text-brand-logo uppercase font-Archivo text-brand-cream ';

  return (
    <>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 w-full flex justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ zIndex: 1000 }}
        >
          <div className="w-[90%] bg-brand-green shadow-md border-[0.5px] border-brand-logo z-50 rounded-full mt-4">
            <div className="container mx-auto flex items-center justify-between px-8 py-2 ">
              <div className="flex items-center">
                <a href="/home">
                  <img src="/images/sloanelogo.png" alt="Logo" className="h-8" />
                </a>
              </div>
              <nav className="hidden lg:flex space-x-8 font-Black">
                <a href="https://www.sloane.biz/about" target="_blank" rel="noopener noreferrer" className={linkClasses}>About</a>
                <a href="https://www.sloane.biz/pricing" target="_blank" rel="noopener noreferrer" className={linkClasses}>Pricing</a>
                <a href="https://app.sloane.biz/" target="_blank" rel="noopener noreferrer" className={linkClasses}>Login</a>
                <a href="https://www.sloane.biz/FAQS" target="_blank" rel="noopener noreferrer" className={linkClasses}>FAQS</a>
                <a href="https://www.sloane.biz/contact" target="_blank" rel="noopener noreferrer" className={linkClasses}>Contact</a>
              </nav>
              <div className="lg:hidden">
                <button onClick={toggleMenu} className="flex items-center justify-center focus:outline-none h-8 w-8 pt-3 text-brand-cream">
                  {isOpen ? <Close fontSize="large" /> : (
                    <svg width="30" height="24" viewBox="0 0 30 24">
                      <rect width="30" height="2" rx="2" fill="#FDF3E3"/>
                      <rect y="10" width="30" height="2" rx="2" fill="#FDF3E3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {isOpen && (
              <motion.div 
                className="lg:hidden fixed top-0 left-0 w-full h-full bg-brand-green flex flex-col items-center justify-center z-40"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={toggleMenu} className="text-brand-cream focus:outline-none absolute top-4 right-4">
                  <Close fontSize="large" />
                </button>
                <nav className="flex flex-col space-y-10 mt-16">
                  <a href="https://www.sloane.biz/about" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="text-2xl hover:text-brand-orange uppercase font-Archivo text-brand-cream text-center">About</a>
                  <a href="https://example.com/pricing" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="text-2xl hover:text-brand-orange uppercase font-Archivo text-brand-cream text-center">Pricing</a>
                  <a href="https://example.com/login" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="text-2xl hover:text-brand-orange uppercase font-Archivo text-brand-cream text-center">Login</a>
                  <a href="https://example.com/#FAQ" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="text-2xl hover:text-brand-orange uppercase font-Archivo text-brand-cream text-center">FAQ</a>
                  <a href="https://example.com/contact" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="text-2xl hover:text-brand-orange uppercase font-Archivo text-brand-cream text-center">Contact</a>
                </nav>
              </motion.div>
            )}
          </div>
        </motion.header>
      )}
    </>
  );
};

export default CreateUserMenu;
