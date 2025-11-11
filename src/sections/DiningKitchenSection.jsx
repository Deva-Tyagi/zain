import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img1 from '/dining/kitchen1.png';
import img2 from '/dining/kitchen2.png';
import img3 from '/dining/kitchen3.png';
import img4 from '/dining/kitchen4.png';
import img5 from '/dining/kitchen5.png';

gsap.registerPlugin(ScrollTrigger);

const DiningKitchen = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const kitchenCounterRef = useRef(null);
  const chandelierRef = useRef(null);
  const vaseRef = useRef(null);
  const lightOverlayRef = useRef(null);
  const lightRay1Ref = useRef(null);
  const lightRay2Ref = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const contentRef = useRef(null);
  const buttonBgRef = useRef(null);
  const expandingImageRef = useRef(null);
  const overlayMaskRef = useRef(null);
  const vignetteRef = useRef(null);

  // Kitchen images array - using YOUR images
  const kitchenImages = [
    img1, 
    'https://cdn.home-designing.com/wp-content/uploads/2018/12/luxury-white-kitchen.jpg', 
    'https://kitchendecor.in/wp-content/uploads/2024/01/IMG_1779-1.jpg', 
    'https://www.asenseinterior.com/assets/uploads//90af95fb823b39a863e282b57ede44b9.webp'
  ];
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const kitchenCounter = kitchenCounterRef.current;
    const chandelier = chandelierRef.current;
    const vase = vaseRef.current;
    const lightOverlay = lightOverlayRef.current;
    const lightRay1 = lightRay1Ref.current;
    const lightRay2 = lightRay2Ref.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const cta = ctaRef.current;
    const content = contentRef.current;

    // Set initial states
    gsap.set(section, { 
      opacity: 0,
      x: '100%'
    });
    gsap.set([headline, subtext, cta], { 
      opacity: 0, 
      y: 60 
    });
    gsap.set(lightOverlay, { 
      opacity: 0 
    });
    gsap.set([lightRay1, lightRay2], {
      opacity: 0,
      scale: 0.8
    });
    gsap.set(chandelier, {
      rotation: -2
    });

    // Entrance transition - slide in from right with lens wipe effect
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top center',
        scrub: 1.5,
      }
    });

    entranceTl
      .to(section, {
        opacity: 1,
        x: '0%',
        duration: 1,
        ease: 'power2.out'
      })
      .to(lightOverlay, {
        opacity: 0.7,
        duration: 1
      }, 0.3)
      .to([lightRay1, lightRay2], {
        opacity: 0.4,
        scale: 1,
        duration: 1,
        stagger: 0.2
      }, 0.5);

    // Camera dolly-in effect (zoom simulation)
    gsap.to(bg, {
      scale: 1.15,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });

    // Background pan left
    gsap.to(bg, {
      x: '-10%',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8
      }
    });

    // Kitchen counter mid-layer parallax
    gsap.to(kitchenCounter, {
      y: -80,
      x: '-5%',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.3
      }
    });

    // Chandelier sway animation (yoyo)
    gsap.to(chandelier, {
      rotation: 2,
      transformOrigin: 'top center',
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Chandelier parallax
    gsap.to(chandelier, {
      y: -120,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.9
      }
    });

    // Content parallax - slides up
    gsap.to(content, {
      y: -100,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Light overlay drift
    gsap.to(lightOverlay, {
      x: '20%',
      y: '-10%',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.5
      }
    });

    // Light rays animation
    gsap.to(lightRay1, {
      opacity: 0.6,
      scale: 1.1,
      rotation: 5,
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to(lightRay2, {
      opacity: 0.5,
      scale: 1.15,
      rotation: -3,
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom top',
        scrub: 2
      }
    });

    // Text reveal animation with stagger
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        end: 'top 20%',
        scrub: 1
      }
    });

    textTl
      .to(headline, {
        opacity: 1,
        y: 0,
        duration: 1
      })
      .to(subtext, {
        opacity: 1,
        y: 0,
        duration: 1
      }, 0.2)
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 1
      }, 0.4);

    // Exit animation - dim and cool tone shift
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'bottom 70%',
        end: 'bottom top',
        scrub: 1
      }
    });

    exitTl
      .to(section, {
        filter: 'brightness(0.6) saturate(0.7)',
        duration: 1
      })
      .to(lightOverlay, {
        opacity: 0.3,
        duration: 1
      }, 0);

    // Mouse parallax interaction
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(chandelier, {
        x: xPercent * 20,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to(lightRay1, {
        x: xPercent * 30,
        y: yPercent * 20,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.to(lightRay2, {
        x: xPercent * -25,
        y: yPercent * -15,
        duration: 1.2,
        ease: 'power2.out'
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // PREMIUM CLASSIC BUTTON ANIMATION - Cinematic iris expansion with vignette
  const handleExploreClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const expandingImg = expandingImageRef.current;
    const mainBg = bgRef.current;
    const overlayMask = overlayMaskRef.current;
    const vignette = vignetteRef.current;
    const button = ctaRef.current;
    const content = contentRef.current;

    // Create premium cinematic timeline
    const tl = gsap.timeline();

    // Classic iris/circular expansion with elegant easing
    tl
      // Button shrink and glow
      .to(button, {
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
      })
      // Vignette fade in for dramatic effect
      .to(vignette, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0)
      // Circular iris expansion from center
      .to(expandingImg, {
        clipPath: 'circle(150% at center)',
        scale: 1,
        duration: 1.8,
        ease: 'expo.inOut'
      }, 0.2)
      // Overlay fade for smooth transition
      .to(overlayMask, {
        opacity: 0.8,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0.3)
      // Content subtle fade during transition
      .to(content, {
        opacity: 0.3,
        scale: 0.98,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0.2)
      // Hold for cinematic pause
      .to({}, { duration: 0.3 })
      // UPDATE BACKGROUND HERE - when image is fully expanded
      .call(() => {
        setCurrentBgIndex(nextImageIndex);
        const newNextIndex = (nextImageIndex + 1) % kitchenImages.length;
        setNextImageIndex(newNextIndex);
      })
      // Fade out expanding image to reveal new background
      .to(expandingImg, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      })
      // Fade out overlays
      .to([overlayMask, vignette], {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, '-=0.4')
      // Restore content
      .to(content, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.5')
      // Button restore
      .to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
      }, '-=0.4')
      // Reset everything at the end
      .call(() => {
        gsap.set(expandingImg, {
          scale: 0,
          opacity: 1,
          clipPath: 'circle(0% at center)'
        });
        gsap.set(overlayMask, { opacity: 0 });
        gsap.set(vignette, { opacity: 0 });
        setIsAnimating(false);
      });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-stone-900"
    >
      {/* Background Layer - Dining & Kitchen */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
      >
        <img
          src={kitchenImages[currentBgIndex]}
          alt="Luxury Dining & Kitchen"
          className="w-full h-full object-cover"
        />
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-900/20" />
      </div>

      {/* Expanding Image - Circular Iris Effect */}
      <div 
        ref={expandingImageRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath: 'circle(0% at center)',
          opacity: 1
        }}
      >
        <img
          src={kitchenImages[nextImageIndex]}
          alt="Next Interior"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Transition Overlay Mask */}
      <div
        ref={overlayMaskRef}
        className="absolute inset-0 bg-black z-25 pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Cinematic Vignette */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 z-35 pointer-events-none"
        style={{ 
          opacity: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Light Rays Layer 1 */}
      <div
        ref={lightRay1Ref}
        className="absolute top-0 right-1/4 w-96 h-full pointer-events-none mix-blend-screen"
      >
        <div className="w-full h-full bg-gradient-to-b from-amber-200/40 via-yellow-100/20 to-transparent blur-3xl" />
      </div>

      {/* Light Rays Layer 2 */}
      <div
        ref={lightRay2Ref}
        className="absolute top-1/4 left-1/3 w-80 h-80 pointer-events-none mix-blend-screen"
      >
        <div className="w-full h-full bg-gradient-radial from-orange-200/30 via-amber-100/15 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Light Overlay Texture */}
      <div
        ref={lightOverlayRef}
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
      >
        <img
          src={img3}
          alt="Light Texture"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Chandelier - Foreground Decor */}
      <div
        ref={chandelierRef}
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-64 h-80 pointer-events-none z-10"
      >
        <img
          src={img4}
          alt="Chandelier"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="relative z-20 flex items-center justify-center h-screen px-8 md:px-16 lg:px-32"
      >
        <div className="max-w-3xl text-center">
          <h2
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-tight"
            style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '0 4px 30px rgba(0,0,0,0.7)'
            }}
          >
            Where Every Meal
            <br />
            Becomes a Memory
          </h2>
          <p
            ref={subtextRef}
            className="text-lg md:text-xl text-gray-200 leading-relaxed tracking-wide mb-8"
            style={{ 
              fontFamily: 'system-ui, sans-serif',
              textShadow: '0 2px 15px rgba(0,0,0,0.6)'
            }}
          >
            Experience the artistry of space designed for togetherness.
          </p>
          <button
            ref={ctaRef}
            onClick={handleExploreClick}
            disabled={isAnimating}
            className="group relative px-12 py-6 text-white text-base md:text-lg tracking-widest overflow-visible transition-all duration-500 disabled:opacity-70 hover:shadow-2xl hover:shadow-amber-500/20"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Button border with subtle animation */}
            <div className="absolute inset-0 border-2 border-white/40 rounded-lg backdrop-blur-sm bg-black/20 group-hover:border-white/60 group-hover:bg-black/30 transition-all duration-500" />
            
            {/* Button background with next image preview */}
            <div 
              ref={buttonBgRef}
              className="absolute inset-0 rounded-lg overflow-hidden opacity-20 group-hover:opacity-40 transition-all duration-700"
              style={{ zIndex: -2 }}
            >
              <img
                src={kitchenImages[nextImageIndex]}
                alt="Next Interior Preview"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Premium glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/0 via-amber-400/0 to-amber-500/0 group-hover:via-amber-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            {/* Button text */}
            <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-lg">
              Explore More Interiors
              <span className="inline-block group-hover:translate-x-2 transition-transform duration-500 text-xl">→</span>
            </span>

            {/* Elegant pulse ring */}
            <div className="absolute inset-0 border border-white/20 rounded-lg animate-elegant-pulse" />
          </button>
        </div>
      </div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/30 rounded-full animate-float-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float-dust {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          25% {
            opacity: 0.4;
          }
          50% {
            transform: translate(40px, -80px) scale(1.3);
            opacity: 0.6;
          }
          75% {
            opacity: 0.3;
          }
        }
        .animate-float-dust {
          animation: float-dust linear infinite;
        }

        @keyframes elegant-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.6;
          }
        }
        .animate-elegant-pulse {
          animation: elegant-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default DiningKitchen;