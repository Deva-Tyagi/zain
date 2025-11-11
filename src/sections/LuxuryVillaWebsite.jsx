import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== HERO SECTION COMPONENT =====
const HeroSection = () => {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const glassLayer1Ref = useRef(null);
  const glassLayer2Ref = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const lightOverlayRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    gsap.set(heroRef.current, { opacity: 1 });
    
    // Initial fade in animation
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTL.from(logoRef.current, {
      opacity: 0,
      y: -30,
      duration: 1.2,
      delay: 0.3
    })
    .from(taglineRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1
    }, '-=0.6')
    .from(scrollIndicatorRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8
    }, '-=0.4');

    // Hero scroll-triggered animations
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(bgRef.current, {
          scale: 1 + (progress * 0.15),
          ease: 'none',
          duration: 0
        });

        gsap.to(lightOverlayRef.current, {
          opacity: 0.3 + (progress * 0.4),
          ease: 'none',
          duration: 0
        });

        gsap.to(glassLayer1Ref.current, {
          y: progress * -150,
          x: progress * 50,
          rotation: progress * 5,
          ease: 'none',
          duration: 0
        });

        gsap.to(glassLayer2Ref.current, {
          y: progress * -100,
          x: progress * -30,
          rotation: progress * -3,
          ease: 'none',
          duration: 0
        });

        gsap.to(contentRef.current, {
          opacity: 1 - (progress * 1.2),
          y: progress * 100,
          ease: 'none',
          duration: 0
        });
      }
    });

    // Scroll indicator pulse animation
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    gsap.to(contentRef.current, {
      x: mousePos.x * 15,
      y: mousePos.y * 15,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to(glassLayer1Ref.current, {
      x: mousePos.x * 30,
      y: mousePos.y * 30,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to(glassLayer2Ref.current, {
      x: mousePos.x * -20,
      y: mousePos.y * -20,
      duration: 1,
      ease: 'power2.out'
    });
  }, [mousePos]);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image Layer */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transformOrigin: 'center center'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Light Gradient Overlay */}
      <div 
        ref={lightOverlayRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
        }}
      />

      {/* Glass Overlay Layer 1 */}
      <div
        ref={glassLayer1Ref}
        className="absolute top-1/4 right-1/4 w-96 h-96 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      />

      {/* Glass Overlay Layer 2 */}
      <div
        ref={glassLayer2Ref}
        className="absolute bottom-1/3 left-1/4 w-80 h-80 pointer-events-none"
        style={{
          background: 'linear-gradient(225deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(8px)',
          borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Content Layer */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="text-6xl font-light tracking-widest text-white/90">
            VILLA
          </div>
          <div className="h-px w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        </div>

        {/* Tagline */}
        <h1 
          ref={taglineRef}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-white text-center tracking-wide mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Step Inside
          <br />
          <span className="text-amber-100">Timeless Elegance</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl tracking-wider mt-4 font-light">
          A journey through architectural mastery
        </p>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3 cursor-pointer"
      >
        <span className="text-white/60 text-sm tracking-widest uppercase font-light">
          Scroll to Explore
        </span>
        <svg 
          className="w-6 h-6 text-white/60" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

// ===== LIVING ROOM SECTION COMPONENT =====
const LivingRoomSection = () => {
  const livingRoomRef = useRef(null);
  const livingBgRef = useRef(null);
  const livingWallRef = useRef(null);
  const livingFurnitureRef = useRef(null);
  const plantRef = useRef(null);
  const lampRef = useRef(null);
  const livingTextRef = useRef(null);
  const livingHeadlineRef = useRef(null);
  const livingSubtextRef = useRef(null);
  const glassOverlayLRRef = useRef(null);
  const lightTextureRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Living Room entrance animation
    ScrollTrigger.create({
      trigger: livingRoomRef.current,
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(livingBgRef.current, {
          y: (1 - progress) * 100,
          opacity: progress,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(lightTextureRef.current, {
          opacity: progress * 0.5,
          ease: 'none',
          duration: 0
        });
      }
    });

    // Living Room parallax scroll
    ScrollTrigger.create({
      trigger: livingRoomRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(livingBgRef.current, {
          x: progress * -80,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(livingWallRef.current, {
          x: progress * -50,
          y: progress * 20,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(livingFurnitureRef.current, {
          x: progress * -30,
          y: progress * -15,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(plantRef.current, {
          x: progress * 100,
          y: progress * -80,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(lampRef.current, {
          x: progress * -120,
          y: progress * -60,
          rotation: progress * -5,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(glassOverlayLRRef.current, {
          x: progress * 150,
          y: progress * -100,
          rotation: progress * 10,
          ease: 'none',
          duration: 0
        });
        
        gsap.to(livingTextRef.current, {
          x: progress * 80,
          opacity: 1 - (progress * 1.3),
          ease: 'none',
          duration: 0
        });
        
        gsap.to(livingRoomRef.current, {
          filter: `brightness(${1 - (progress * 0.3)})`,
          ease: 'none',
          duration: 0
        });
      }
    });

    // Text reveal animation
    ScrollTrigger.create({
      trigger: livingRoomRef.current,
      start: 'top center',
      onEnter: () => {
        gsap.from(livingHeadlineRef.current, {
          opacity: 0,
          x: -60,
          duration: 1.2,
          ease: 'power3.out'
        });
        
        gsap.from(livingSubtextRef.current, {
          opacity: 0,
          x: -40,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        });
      }
    });

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (plantRef.current) {
      gsap.to(plantRef.current, {
        x: mousePos.x * 25,
        y: mousePos.y * 25,
        duration: 1.5,
        ease: 'power2.out'
      });
    }
    
    if (lampRef.current) {
      gsap.to(lampRef.current, {
        x: mousePos.x * -15,
        y: mousePos.y * -15,
        duration: 1.3,
        ease: 'power2.out'
      });
    }
  }, [mousePos]);

  return (
    <section 
      ref={livingRoomRef}
      className="relative min-h-screen w-full overflow-hidden bg-neutral-900"
    >
      {/* Background Image - Main Living Room */}
      <div 
        ref={livingBgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0
        }}
      />

      {/* Warm Light Texture Overlay */}
      <div 
        ref={lightTextureRef}
        className="absolute inset-0 opacity-0"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(255,220,180,0.3) 0%, transparent 60%)',
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Wall Shadow Layer - Mid depth */}
      <div
        ref={livingWallRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Furniture Shadow Layer */}
      <div
        ref={livingFurnitureRef}
        className="absolute bottom-0 left-0 w-full h-2/3 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%)',
        }}
      />

      {/* Decorative Plant - Foreground Left */}
      <div
        ref={plantRef}
        className="absolute bottom-0 left-0 w-64 h-96 pointer-events-none hidden md:block"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(40,80,40,0.6) 0%, transparent 60%)',
          filter: 'blur(1px)',
        }}
      >
        <div className="absolute bottom-8 left-8 w-32 h-64 rounded-full"
          style={{
            background: 'linear-gradient(to top, rgba(50,90,50,0.7), rgba(80,120,80,0.3))',
            filter: 'blur(8px)'
          }}
        />
      </div>

      {/* Decorative Lamp - Foreground Right */}
      <div
        ref={lampRef}
        className="absolute top-1/4 right-12 w-40 h-64 pointer-events-none hidden md:block"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,220,150,0.8) 0%, rgba(255,180,100,0.3) 50%, transparent 70%)',
            filter: 'blur(12px)'
          }}
        />
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-2 h-40 bg-gradient-to-b from-amber-900/40 to-transparent" />
      </div>

      {/* Glass Overlay - Diagonal Drift */}
      <div
        ref={glassOverlayLRRef}
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(12px)',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />

      {/* Ambient Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`lr-particle-${i}`}
          className="absolute w-1 h-1 bg-amber-200/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 12}s`
          }}
        />
      ))}

      {/* Content - Text Overlay */}
      <div 
        ref={livingTextRef}
        className="relative z-10 flex flex-col justify-center h-screen px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-2xl">
          <h2 
            ref={livingHeadlineRef}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-wide leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Where Design
            <br />
            <span className="text-amber-100">Meets Comfort</span>
          </h2>

          <p 
            ref={livingSubtextRef}
            className="text-white/70 text-xl md:text-2xl font-light tracking-wide leading-relaxed"
          >
            A harmony of space, light, and luxury.
          </p>
        </div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-900 pointer-events-none" />
    </section>
  );
};

// ===== MAIN APP COMPONENT =====
const LuxuryVillaWebsite = () => {
  useEffect(() => {
    // Global smooth scroll setup
    const lenisScroll = (time) => {
      requestAnimationFrame(lenisScroll);
    };
    requestAnimationFrame(lenisScroll);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <HeroSection />
      <LivingRoomSection />
      
      {/* Next Section Preview - Dining & Kitchen */}
      <section className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-white text-center p-12">
          <h2 className="text-5xl font-light mb-6 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            Dining & Kitchen
          </h2>
          <p className="text-white/60 text-xl font-light">The heart of gathering...</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default LuxuryVillaWebsite;