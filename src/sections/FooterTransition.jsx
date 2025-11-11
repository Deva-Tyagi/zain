import React, { useEffect, useRef } from 'react';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

const FooterTransition = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const gradientBgRef = useRef(null);
  const logoContainerRef = useRef(null);
  const logoGlowRef = useRef(null);
  const particlesRef = useRef(null);
  const footerContentRef = useRef(null);
  const copyrightRef = useRef(null);
  const contactRef = useRef(null);
  const socialsRef = useRef(null);
  const backToTopRef = useRef(null);
  const farewellRef = useRef(null);
  const darkOverlayRef = useRef(null);

  useEffect(() => {
    // Simple scroll-based animations without GSAP
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, 
        1 - (rect.bottom - windowHeight) / windowHeight
      ));

      // Phase 1: Background fade in
      if (gradientBgRef.current) {
        gradientBgRef.current.style.opacity = Math.min(1, scrollProgress * 2);
        const brightness = 0.7 - (scrollProgress * 0.3);
        gradientBgRef.current.style.filter = `brightness(${brightness}) saturate(1.3)`;
      }

      // Phase 2: Logo appears
      if (logoContainerRef.current && scrollProgress > 0.2) {
        const logoProgress = (scrollProgress - 0.2) / 0.3;
        logoContainerRef.current.style.opacity = Math.min(1, logoProgress * 2);
        logoContainerRef.current.style.transform = `translate(-50%, ${50 - logoProgress * 50}px) scale(${0.8 + logoProgress * 0.2})`;
      }

      // Logo glow
      if (logoGlowRef.current && scrollProgress > 0.2) {
        const glowProgress = (scrollProgress - 0.2) / 0.3;
        logoGlowRef.current.style.opacity = Math.min(0.8, glowProgress);
      }

      // Phase 3: Particles
      if (particlesRef.current && scrollProgress > 0.4) {
        const particleProgress = (scrollProgress - 0.4) / 0.2;
        particlesRef.current.style.opacity = Math.min(0.6, particleProgress);
      }

      // Phase 4: Footer content
      if (copyrightRef.current && scrollProgress > 0.5) {
        const contentProgress = (scrollProgress - 0.5) / 0.2;
        copyrightRef.current.style.opacity = Math.min(1, contentProgress * 2);
        copyrightRef.current.style.transform = `translateY(${30 - contentProgress * 30}px)`;
      }

      if (contactRef.current && scrollProgress > 0.6) {
        const contactProgress = (scrollProgress - 0.6) / 0.15;
        Array.from(contactRef.current.children).forEach((child, i) => {
          child.style.opacity = Math.min(1, (contactProgress - i * 0.1) * 2);
          child.style.transform = `translateY(${20 - (contactProgress - i * 0.1) * 20}px)`;
        });
      }

      if (socialsRef.current && scrollProgress > 0.65) {
        const socialProgress = (scrollProgress - 0.65) / 0.15;
        Array.from(socialsRef.current.children).forEach((child, i) => {
          child.style.opacity = Math.min(1, (socialProgress - i * 0.08) * 2);
          child.style.transform = `scale(${0.8 + Math.min(1, (socialProgress - i * 0.08)) * 0.2})`;
        });
      }

      // Phase 5: Farewell
      if (farewellRef.current && scrollProgress > 0.75) {
        const farewellProgress = (scrollProgress - 0.75) / 0.1;
        farewellRef.current.style.opacity = Math.min(1, farewellProgress);
      }

      // Phase 6: Final fade to black
      if (darkOverlayRef.current && scrollProgress > 0.85) {
        const fadeProgress = (scrollProgress - 0.85) / 0.15;
        darkOverlayRef.current.style.opacity = Math.min(0.9, fadeProgress * 0.9);
        
        if (logoContainerRef.current) {
          logoContainerRef.current.style.filter = `blur(${fadeProgress * 2}px)`;
        }
        if (footerContentRef.current) {
          footerContentRef.current.style.filter = `blur(${fadeProgress * 2}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // Floating animations
    let floatTime = 0;
    const animate = () => {
      floatTime += 0.01;
      
      if (logoContainerRef.current) {
        const currentTransform = logoContainerRef.current.style.transform;
        const yOffset = Math.sin(floatTime) * 15;
        logoContainerRef.current.style.transform = currentTransform.replace(/translateY\([^)]+\)/, '') + ` translateY(${yOffset}px)`;
      }

      if (logoGlowRef.current) {
        const glowPulse = 0.8 + Math.sin(floatTime * 0.8) * 0.2;
        const currentOpacity = parseFloat(logoGlowRef.current.style.opacity) || 0;
        if (currentOpacity > 0) {
          logoGlowRef.current.style.opacity = Math.min(currentOpacity, glowPulse);
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
      className="relative w-full overflow-hidden"
      style={{ minHeight: '200vh' }}
    >
      <div 
        ref={containerRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
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
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-purple-900/50 to-black/70" />
        </div>

        {/* Dark Overlay for Final Fade */}
        <div 
          ref={darkOverlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0, zIndex: 45 }}
        />

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

        {/* Logo Container with Glow */}
        <div 
          ref={logoContainerRef}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2"
          style={{ opacity: 0, zIndex: 20 }}
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
              <h2 className="text-5xl md:text-6xl font-light tracking-[0.3em] text-white mb-2 drop-shadow-lg">
                VILLA
              </h2>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-lg" />
              <p className="text-amber-200 text-sm tracking-[0.2em] mt-4 font-light drop-shadow-md">
                LUXURY LIVING
              </p>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div 
          ref={footerContentRef}
          className="absolute bottom-0 left-0 right-0 pb-12"
          style={{ zIndex: 30 }}
        >
          <div className="max-w-6xl mx-auto px-8">
            {/* Copyright */}
            <div 
              ref={copyrightRef}
              className="text-center mb-8"
              style={{ opacity: 0 }}
            >
              <p className="text-white text-sm tracking-[0.2em] font-light mb-2 drop-shadow-md">
                © 2025 Villa Essence. All Rights Reserved.
              </p>
              <p className="text-white/70 text-xs tracking-[0.15em] font-light italic drop-shadow-md">
                Crafted with Passion — Designed to Inspire
              </p>
            </div>

            {/* Contact Info */}
            <div 
              ref={contactRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8"
            >
              <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                <div className="text-amber-300 text-xs tracking-widest mb-1 uppercase font-medium">Phone</div>
                <div>+1 (555) 123-4567</div>
              </div>
              <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                <div className="text-amber-300 text-xs tracking-widest mb-1 uppercase font-medium">Email</div>
                <div>hello@villaessence.com</div>
              </div>
              <div className="text-white/80 text-sm font-light drop-shadow-md" style={{ opacity: 0 }}>
                <div className="text-amber-300 text-xs tracking-widest mb-1 uppercase font-medium">Location</div>
                <div>Malibu, California</div>
              </div>
            </div>

            {/* Social Icons */}
            <div 
              ref={socialsRef}
              className="flex justify-center gap-6 mb-8"
            >
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/30 hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300 shadow-lg" style={{ opacity: 0 }}>
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Farewell Message */}
            <div 
              ref={farewellRef}
              className="text-center"
              style={{ opacity: 0 }}
            >
              <p className="text-white/60 text-xs tracking-[0.3em] font-light uppercase drop-shadow-lg">
                Thank you for visiting our villa
              </p>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          ref={backToTopRef}
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