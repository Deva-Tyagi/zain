import React, { useEffect, useRef } from 'react';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

const FooterTransition = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const gradientBgRef = useRef(null);
  const logoContainerRef = useRef(null);
  const logoGlowRef = useRef(null);
  const particlesRef = useRef(null);
  const copyrightRef = useRef(null);
  const contactRef = useRef(null);
  const socialsRef = useRef(null);
  const farewellRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start animation when section is 20% into viewport
      // scrollProgress goes from 0 to 1 as section comes into view
      let scrollProgress = 0;
      
      if (rect.top < windowHeight * 0.8) {
        scrollProgress = Math.min(1, (windowHeight * 0.8 - rect.top) / (windowHeight * 0.6));
      }

      // Background fades in first (0 - 0.2)
      if (gradientBgRef.current) {
        const bgProgress = Math.min(1, scrollProgress / 0.2);
        gradientBgRef.current.style.opacity = bgProgress;
      }

      // Logo appears (0.1 - 0.4)
      if (logoContainerRef.current) {
        if (scrollProgress >= 0.1) {
          const logoProgress = Math.min(1, (scrollProgress - 0.1) / 0.3);
          logoContainerRef.current.style.opacity = logoProgress;
          logoContainerRef.current.style.transform = `translate(-50%, -50%) translateY(${(1 - logoProgress) * 30}px) scale(${0.85 + logoProgress * 0.15})`;
        }
      }

      // Logo glow (0.1 - 0.4)
      if (logoGlowRef.current) {
        if (scrollProgress >= 0.1) {
          const glowProgress = Math.min(1, (scrollProgress - 0.1) / 0.3);
          logoGlowRef.current.style.opacity = glowProgress * 0.8;
        }
      }

      // Particles (0.2 - 0.45)
      if (particlesRef.current) {
        if (scrollProgress >= 0.2) {
          const particleProgress = Math.min(1, (scrollProgress - 0.2) / 0.25);
          particlesRef.current.style.opacity = particleProgress * 0.6;
        }
      }

      // Copyright (0.3 - 0.5)
      if (copyrightRef.current) {
        if (scrollProgress >= 0.3) {
          const copyrightProgress = Math.min(1, (scrollProgress - 0.3) / 0.2);
          copyrightRef.current.style.opacity = copyrightProgress;
          copyrightRef.current.style.transform = `translateY(${(1 - copyrightProgress) * 20}px)`;
        }
      }

      // Contact info (0.35 - 0.6)
      if (contactRef.current) {
        if (scrollProgress >= 0.35) {
          Array.from(contactRef.current.children).forEach((child, i) => {
            const delay = i * 0.05;
            const itemProgress = Math.min(1, Math.max(0, (scrollProgress - 0.35 - delay) / 0.25));
            child.style.opacity = itemProgress;
            child.style.transform = `translateY(${(1 - itemProgress) * 15}px)`;
          });
        }
      }

      // Social icons (0.45 - 0.7)
      if (socialsRef.current) {
        if (scrollProgress >= 0.45) {
          Array.from(socialsRef.current.children).forEach((child, i) => {
            const delay = i * 0.04;
            const itemProgress = Math.min(1, Math.max(0, (scrollProgress - 0.45 - delay) / 0.25));
            child.style.opacity = itemProgress;
            child.style.transform = `scale(${0.7 + itemProgress * 0.3})`;
          });
        }
      }

      // Farewell message (0.55 - 0.75)
      if (farewellRef.current) {
        if (scrollProgress >= 0.55) {
          const farewellProgress = Math.min(1, (scrollProgress - 0.55) / 0.2);
          farewellRef.current.style.opacity = farewellProgress;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Floating animation
    let floatTime = 0;
    const animate = () => {
      floatTime += 0.01;
      
      if (logoContainerRef.current) {
        const currentOpacity = parseFloat(logoContainerRef.current.style.opacity) || 0;
        if (currentOpacity > 0.5) {
          const yOffset = Math.sin(floatTime) * 8;
          const scaleMatch = logoContainerRef.current.style.transform.match(/scale\([^)]+\)/);
          const scale = scaleMatch ? scaleMatch[0] : 'scale(1)';
          logoContainerRef.current.style.transform = `translate(-50%, -50%) translateY(${yOffset}px) ${scale}`;
        }
      }

      if (logoGlowRef.current) {
        const currentOpacity = parseFloat(logoGlowRef.current.style.opacity) || 0;
        if (currentOpacity > 0.3) {
          const glowPulse = 0.6 + Math.sin(floatTime * 0.8) * 0.2;
          logoGlowRef.current.style.opacity = Math.min(0.8, currentOpacity) * glowPulse;
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-transparent"
      style={{ minHeight: '100vh' }}
    >
      <div 
        ref={containerRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-transparent"
      >
        {/* Gradient Dusk Background */}
        <div 
          ref={gradientBgRef}
          className="absolute inset-0"
          style={{ opacity: 0, zIndex: 0 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="dusk gradient"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-purple-900/50 to-indigo-950/80" />
        </div>

        {/* Floating Particles */}
        <div 
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, zIndex: 10 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"
            alt="particles fade"
            className="w-full h-full object-cover opacity-20"
            style={{ mixBlendMode: 'screen' }}
          />
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-2 h-2 bg-amber-200/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)',
                boxShadow: '0 0 6px rgba(251, 191, 36, 0.4)',
                animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        {/* Main Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 20 }}>
          {/* Logo Container with Glow */}
          <div 
            ref={logoContainerRef}
            className="absolute top-1/2 left-1/2 -mt-32"
            style={{ opacity: 0, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              {/* Logo Glow */}
              <div 
                ref={logoGlowRef}
                className="absolute inset-0 -m-12"
                style={{ opacity: 0 }}
              >
                <div 
                  className="w-64 h-64 rounded-full mx-auto"
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                  }}
                />
              </div>

              {/* Logo */}
              <div className="relative text-center">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80"
                  alt="villa logo"
                  className="w-32 h-32 mx-auto mb-6 object-contain rounded-full"
                  style={{
                    filter: 'brightness(1.3) contrast(1.1)',
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)'
                  }}
                />
                <h2 className="text-6xl md:text-7xl font-light tracking-[0.3em] text-white mb-3 drop-shadow-lg">
                  VILLA
                </h2>
                <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-lg mb-4" />
                <p className="text-amber-200 text-sm tracking-[0.25em] font-light drop-shadow-md">
                  LUXURY LIVING
                </p>
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="absolute bottom-16 left-0 right-0 w-full">
            <div className="max-w-7xl mx-auto px-8">
              {/* Copyright */}
              <div 
                ref={copyrightRef}
                className="text-center mb-10"
                style={{ opacity: 0 }}
              >
                <p className="text-white/90 text-sm tracking-[0.15em] font-light mb-2 drop-shadow-md">
                  © 2025 Villa Essence. All Rights Reserved.
                </p>
                <p className="text-white/60 text-xs tracking-[0.12em] font-light italic drop-shadow-md">
                  Crafted with Passion — Designed to Inspire
                </p>
              </div>

              {/* Contact Info */}
              <div 
                ref={contactRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-10"
              >
                <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                  <div className="text-amber-300 text-xs tracking-[0.2em] mb-2 uppercase font-medium">Phone</div>
                  <div className="text-white/70">+1 (555) 123-4567</div>
                </div>
                <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                  <div className="text-amber-300 text-xs tracking-[0.2em] mb-2 uppercase font-medium">Email</div>
                  <div className="text-white/70">hello@villaessence.com</div>
                </div>
                <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                  <div className="text-amber-300 text-xs tracking-[0.2em] mb-2 uppercase font-medium">Location</div>
                  <div className="text-white/70">Malibu, California</div>
                </div>
              </div>

              {/* Social Icons */}
              <div 
                ref={socialsRef}
                className="flex justify-center gap-6 mb-8"
              >
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                  <Youtube className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>

              {/* Farewell Message */}
              <div 
                ref={farewellRef}
                className="text-center"
                style={{ opacity: 0 }}
              >
                <p className="text-white/50 text-xs tracking-[0.3em] font-light uppercase drop-shadow-lg">
                  Thank you for visiting our villa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={handleBackToTop}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:scale-110 hover:rotate-180 transition-all duration-300 cursor-pointer shadow-xl"
          style={{ zIndex: 40 }}
          aria-label="Back to top"
        >
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>

        {/* Ambient Corner Glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <div 
            className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
              filter: 'blur(70px)'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
      `}</style>
    </footer>
  );
};

export default FooterTransition;