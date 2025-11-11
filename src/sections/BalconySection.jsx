import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Import your images - replace these with your actual image imports
import img1 from '/balcony/balcony1.png';
import img2 from '/balcony/balcony2.png';
import img3 from '/balcony/balcony3.png';
import img4 from '/balcony/balcony4.png';

gsap.registerPlugin(ScrollTrigger);

const BalconySection = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const currentImageRef = useRef(null);
  const nextImageRef = useRef(null);
  const pageFlipRef = useRef(null);
  const transitionMaskRef = useRef(null);
  const lenisRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  
  const [currentView, setCurrentView] = useState(0);
  const isTransitioningRef = useRef(false);
  
  const views = [
    {
      url: img1,
      title: 'Living Room',
      description: 'Where comfort meets elegance',
      ambiance: 'warm'
    },
    {
      url: img2,
      title: 'Balcony Center',
      description: 'Step into the open air',
      ambiance: 'cool'
    },
    {
      url: img3,
      title: 'Left Panorama',
      description: 'The city awakens',
      ambiance: 'night'
    },
    {
      url: img4,
      title: 'Right Vista',
      description: 'Horizons unlimited',
      ambiance: 'twilight'
    }
  ];

  const transitions = ['pageFlip', 'curtain', 'fold', 'cube'];

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Preload images for smooth transitions
    views.forEach(view => {
      const img = new Image();
      img.src = view.url;
    });

    const section = sectionRef.current;
    
    // Create pinned scroll section with smooth progress
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * views.length}`, // Fixed: exact length, no extra scroll
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalViews = views.length;
        const viewProgress = progress * (totalViews - 1); // Fixed: scale to actual transitions
        const currentIndex = Math.floor(viewProgress);
        const nextIndex = Math.min(currentIndex + 1, totalViews - 1);
        const segmentProgress = viewProgress - currentIndex;
        
        // Ensure we don't exceed array bounds
        if (currentIndex >= totalViews - 1) {
          if (currentView !== totalViews - 1) {
            setCurrentView(totalViews - 1);
            resetToCleanState(totalViews - 1);
          }
          return;
        }
        
        // Smooth transition window
        if (segmentProgress > 0.05 && segmentProgress < 0.95) {
          if (!isTransitioningRef.current) {
            isTransitioningRef.current = true;
          }
          performTransition(currentIndex, nextIndex, segmentProgress);
        } else {
          if (isTransitioningRef.current) {
            isTransitioningRef.current = false;
          }
          if (segmentProgress <= 0.05 && currentView !== currentIndex) {
            setCurrentView(currentIndex);
            resetToCleanState(currentIndex);
          } else if (segmentProgress >= 0.95 && currentView !== nextIndex) {
            setCurrentView(nextIndex);
            resetToCleanState(nextIndex);
          }
        }
      }
    });

    scrollTriggerRef.current = scrollTrigger;

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (lenisRef.current) {
        lenis.destroy();
      }
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  const resetToCleanState = (index) => {
    // Safety check
    if (index < 0 || index >= views.length) return;

    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;
    const viewport = viewportRef.current;
    const pageFlip = pageFlipRef.current;
    const mask = transitionMaskRef.current;

    if (!currentImg || !nextImg || !viewport || !pageFlip || !mask) return;

    gsap.set([currentImg, nextImg, viewport], {
      scale: 1,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      filter: 'blur(0px) brightness(1)',
      opacity: 1,
    });

    gsap.set(pageFlip, { opacity: 0, rotationY: 0 });
    gsap.set(mask, { opacity: 0, x: '-100%' });
    gsap.set(nextImg, { display: 'none' });
    gsap.set(currentImg, { display: 'block' });
  };

  const performTransition = (fromIndex, toIndex, progress) => {
    // Safety checks
    if (fromIndex < 0 || fromIndex >= views.length || toIndex < 0 || toIndex >= views.length) {
      return;
    }

    const transitionType = transitions[fromIndex % transitions.length];
    
    // Smooth easing for all transitions
    const smoothProgress = gsap.parseEase('power2.inOut')(progress);
    
    switch(transitionType) {
      case 'pageFlip':
        animatePageFlip(fromIndex, toIndex, smoothProgress);
        break;
      case 'curtain':
        animateCurtain(fromIndex, toIndex, smoothProgress);
        break;
      case 'fold':
        animateFold(fromIndex, toIndex, smoothProgress);
        break;
      case 'cube':
        animateCube(fromIndex, toIndex, smoothProgress);
        break;
    }

    if (progress > 0.5 && currentView !== toIndex) {
      setCurrentView(toIndex);
    }
  };

  const animatePageFlip = (fromIndex, toIndex, progress) => {
    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;
    const pageFlip = pageFlipRef.current;
    const viewport = viewportRef.current;

    if (!currentImg || !nextImg || !pageFlip || !viewport) return;

    gsap.set(pageFlip, {
      backgroundImage: `url(${views[toIndex].url})`,
      opacity: progress < 0.85 ? 1 : 1 - ((progress - 0.85) / 0.15),
      rotationY: -180 * progress,
      transformOrigin: 'left center',
      zIndex: 100
    });

    gsap.set([currentImg, viewport], {
      scale: 1 + (progress * 0.6),
      filter: `blur(${6 * progress}px) brightness(${1 + 0.15 * progress})`
    });

    gsap.set(currentImg, {
      opacity: 1 - (progress * 0.7)
    });

    if (progress > 0.5) {
      gsap.set(currentImg, { display: 'none' });
      gsap.set(nextImg, { 
        display: 'block',
        backgroundImage: `url(${views[toIndex].url})`,
        opacity: (progress - 0.5) * 2,
        scale: 1.6 - ((progress - 0.5) * 1.2),
        filter: `blur(${(1 - progress) * 12}px)`
      });
      gsap.set(viewport, {
        scale: 1.6 - ((progress - 0.5) * 1.2),
        filter: `blur(${(1 - progress) * 12}px) brightness(1)`
      });
    } else {
      gsap.set(nextImg, { display: 'none' });
      gsap.set(currentImg, { display: 'block' });
    }
  };

  const animateCurtain = (fromIndex, toIndex, progress) => {
    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;
    const mask = transitionMaskRef.current;
    const viewport = viewportRef.current;

    if (!currentImg || !nextImg || !mask || !viewport) return;

    gsap.set([currentImg, viewport], {
      scale: 1 + (progress * 0.5),
      filter: `blur(${4 * progress}px)`
    });

    gsap.set(mask, {
      x: `${-100 + (200 * progress)}%`,
      opacity: 1,
      zIndex: 50
    });

    if (progress > 0.5) {
      gsap.set(currentImg, { display: 'none' });
      gsap.set(nextImg, { 
        display: 'block',
        backgroundImage: `url(${views[toIndex].url})`,
        opacity: 1,
        scale: 1.5 - ((progress - 0.5) * 1.0),
        filter: `blur(${(1 - progress) * 8}px)`
      });
      gsap.set(viewport, {
        scale: 1.5 - ((progress - 0.5) * 1.0),
        filter: `blur(${(1 - progress) * 8}px)`
      });
    } else {
      gsap.set(nextImg, { display: 'none' });
      gsap.set(currentImg, { display: 'block' });
    }
  };

  const animateFold = (fromIndex, toIndex, progress) => {
    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;

    if (!currentImg || !nextImg) return;

    if (progress < 0.5) {
      const foldProgress = progress * 2;
      gsap.set(currentImg, {
        display: 'block',
        rotationX: 90 * foldProgress,
        scale: 1 - (0.2 * foldProgress),
        filter: `blur(${8 * foldProgress}px) brightness(${1 - 0.3 * foldProgress})`,
        transformOrigin: 'center bottom'
      });
      gsap.set(nextImg, { display: 'none' });
    } else {
      const unfoldProgress = (progress - 0.5) * 2;
      gsap.set(currentImg, { display: 'none' });
      gsap.set(nextImg, {
        display: 'block',
        backgroundImage: `url(${views[toIndex].url})`,
        rotationX: -90 + (90 * unfoldProgress),
        scale: 0.8 + (0.2 * unfoldProgress),
        filter: `blur(${8 * (1 - unfoldProgress)}px) brightness(${0.7 + 0.3 * unfoldProgress})`,
        transformOrigin: 'center top',
        opacity: 1
      });
    }
  };

  const animateCube = (fromIndex, toIndex, progress) => {
    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;
    const viewport = viewportRef.current;

    if (!currentImg || !nextImg || !viewport) return;

    gsap.set(viewport, {
      rotationY: 90 * progress
    });

    gsap.set(currentImg, {
      opacity: 1 - progress,
      rotationY: 90 * progress
    });

    if (progress > 0.2) {
      gsap.set(nextImg, {
        display: 'block',
        backgroundImage: `url(${views[toIndex].url})`,
        opacity: (progress - 0.2) / 0.8,
        rotationY: -90 * (1 - progress),
        x: `${100 * (1 - progress)}%`
      });
    } else {
      gsap.set(nextImg, { display: 'none' });
    }
  };

  // Safety check for current view
  const safeCurrentView = Math.min(currentView, views.length - 1);
  const currentViewData = views[safeCurrentView] || views[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black"
    >
      <div 
        ref={viewportRef}
        className="absolute inset-0"
        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
      >
        <div
          ref={currentImageRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${currentViewData.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          <div 
            className="absolute top-0 right-0 w-[900px] h-[900px] opacity-25 mix-blend-screen pointer-events-none transition-opacity duration-1000"
            style={{
              background: currentViewData.ambiance === 'warm' 
                ? 'radial-gradient(circle at 30% 30%, rgba(255,180,100,0.6) 0%, transparent 60%)'
                : currentViewData.ambiance === 'cool'
                ? 'radial-gradient(circle at 30% 30%, rgba(100,200,255,0.5) 0%, transparent 60%)'
                : currentViewData.ambiance === 'night'
                ? 'radial-gradient(circle at 30% 30%, rgba(100,150,255,0.4) 0%, transparent 60%)'
                : 'radial-gradient(circle at 30% 30%, rgba(255,150,200,0.4) 0%, transparent 60%)'
            }}
          />
        </div>

        <div
          ref={nextImageRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            display: 'none'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>

        <div
          ref={pageFlipRef}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <div
          ref={transitionMaskRef}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 50%, rgba(0,0,0,0.95) 100%)',
            boxShadow: '0 0 100px rgba(0,0,0,0.8)'
          }}
        />
      </div>

      {safeCurrentView > 0 && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                opacity: Math.random() * 0.7 + 0.3,
                boxShadow: `0 0 ${Math.random() * 8 + 4}px rgba(255,255,255,${Math.random() * 0.5 + 0.5})`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 md:px-12 lg:px-24 pointer-events-none">
        <div className="max-w-6xl w-full text-center">
          
          <div 
            key={`badge-${safeCurrentView}`}
            className="inline-block mb-8 animate-fadeScale"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
              <span className="relative inline-block px-8 py-3 bg-black/30 backdrop-blur-2xl border border-white/20 rounded-full text-white/90 text-xs md:text-sm tracking-[0.3em] uppercase font-light shadow-2xl">
                {currentViewData.title}
              </span>
            </div>
          </div>

          <h2
            key={`title-${safeCurrentView}`}
            className="text-6xl md:text-8xl lg:text-9xl font-extralight text-white mb-6 leading-[0.9] tracking-tight animate-fadeSlideUp"
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: '0 10px 80px rgba(0,0,0,0.9), 0 0 100px rgba(0,0,0,0.7)',
              letterSpacing: '-0.03em'
            }}
          >
            {currentViewData.title.split(' ').map((word, i) => (
              <span 
                key={i}
                className="inline-block"
                style={{
                  animation: `fadeSlideUp 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both`
                }}
              >
                {word}
                {i < currentViewData.title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </h2>
          
          <p
            key={`desc-${safeCurrentView}`}
            className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed tracking-wide mb-16 font-light animate-fadeSlideUp"
            style={{ 
              fontFamily: "'Inter', system-ui, sans-serif",
              textShadow: '0 4px 50px rgba(0,0,0,0.9)',
              animationDelay: '0.2s'
            }}
          >
            {currentViewData.description}
          </p>

          <div className="flex gap-4 justify-center mt-16 items-center">
            {views.map((view, index) => (
              <div
                key={index}
                className="relative transition-all duration-500"
                title={view.title}
              >
                {index === safeCurrentView ? (
                  <div className="relative">
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg shadow-white/50" />
                    <div className="absolute inset-0 bg-white/30 blur-md" />
                  </div>
                ) : (
                  <div className="w-2 h-0.5 bg-white/30 transition-all duration-500" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-white/30 text-sm tracking-[0.3em] font-light">
            <span className="text-white/60">{String(safeCurrentView + 1).padStart(2, '0')}</span>
            <span className="w-8 h-px bg-white/20" />
            <span>{String(views.length).padStart(2, '0')}</span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-white/40 text-xs capitalize">{transitions[safeCurrentView % transitions.length]}</span>
          </div>

          <div className="mt-8 text-white/40 text-xs tracking-wider">
            Scroll to explore
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: `radial-gradient(circle, ${
                Math.random() > 0.6 ? 'rgba(255,255,255,0.4)' : 'rgba(100,200,255,0.3)'
              }, transparent)`,
              boxShadow: `0 0 ${Math.random() * 30 + 10}px rgba(255,255,255,0.2)`,
              animation: `floatParticle ${10 + Math.random() * 8}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
          mixBlendMode: 'multiply'
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none z-25 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px'
        }}
      />

      <style jsx>{`
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          25% {
            opacity: 0.6;
          }
          50% {
            transform: translate(-50px, -140px) scale(1.5);
            opacity: 1;
          }
          75% {
            opacity: 0.4;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .animate-fadeScale {
          animation: fadeScale 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-fadeSlideUp {
          animation: fadeSlideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Inter:wght@300;400&display=swap');
      `}</style>
    </section>
  );
};

export default BalconySection;