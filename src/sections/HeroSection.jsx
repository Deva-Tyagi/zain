import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LuxuryVillaHero = () => {
  const heroRef = useRef(null);
  const mainImageRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const centerRevealRef = useRef(null);
  const img2LayerRef = useRef(null);
  const img3LayerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const overlayBarsRef = useRef([]);
  const numberRef = useRef(null);
  const featureCardsRef = useRef([]);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const img1 = '/home/home1.png';
  const img2 = '/home/home2.png';
  const img3 = '/home/home3.png';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // UNIQUE APPROACH: Vertical Split Reveal with Bars
      const entranceTL = gsap.timeline({ defaults: { ease: 'power4.inOut' } });

      // Animated overlay bars that reveal content
      entranceTL
        .from(overlayBarsRef.current, {
          scaleY: 1,
          stagger: 0.08,
          duration: 1.5
        })
        .to(overlayBarsRef.current, {
          scaleY: 0,
          transformOrigin: 'bottom',
          stagger: 0.08,
          duration: 1.2,
          ease: 'power3.in'
        }, '+=0.3')
        .from(mainImageRef.current, {
          scale: 1.5,
          opacity: 0,
          duration: 2,
          ease: 'power2.out'
        }, '-=1.5')
        .from([leftPanelRef.current, rightPanelRef.current], {
          scaleX: 0,
          transformOrigin: 'center',
          duration: 1.8,
          stagger: 0.2,
          ease: 'power3.out'
        }, '-=1.5')
        .from(img2LayerRef.current, {
          x: -200,
          y: -200,
          rotation: -90,
          opacity: 0,
          scale: 0.3,
          duration: 2,
          ease: 'back.out(1.5)'
        }, '-=1.2')
        .from(img3LayerRef.current, {
          x: 200,
          y: 200,
          rotation: 90,
          opacity: 0,
          scale: 0.3,
          duration: 2,
          ease: 'back.out(1.5)'
        }, '-=1.8')
        .from(numberRef.current, {
          scale: 0,
          rotation: 360,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        }, '-=1')
        .from(titleRef.current.children, {
          y: 200,
          opacity: 0,
          rotationX: -90,
          stagger: 0.1,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=1')
        .from(subtitleRef.current, {
          y: 100,
          opacity: 0,
          duration: 1
        }, '-=0.6')
        .from(featureCardsRef.current, {
          scale: 0,
          y: 100,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'back.out(2)'
        }, '-=0.8')
        .from(ctaRef.current, {
          y: 80,
          opacity: 0,
          scale: 0.5,
          duration: 1,
          ease: 'back.out(2)'
        }, '-=0.5');

      // UNIQUE PARALLAX: Circular rotation + depth layers
      gsap.to(mainImageRef.current, {
        scale: 1.4,
        rotation: 10,
        filter: 'brightness(0.6)',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });

      // Left panel slides out and rotates
      gsap.to(leftPanelRef.current, {
        x: -400,
        rotation: -15,
        opacity: 0.3,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Right panel slides out and rotates
      gsap.to(rightPanelRef.current, {
        x: 400,
        rotation: 15,
        opacity: 0.3,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // FIXED: img2 smoothly reverses to entrance position on scroll
      gsap.to(img2LayerRef.current, {
        x: -200,
        y: -200,
        rotation: -90,
        scale: 0.3,
        opacity: 0,
        ease: 'back.in(1.5)',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8
        }
      });

      // FIXED: img3 smoothly reverses to entrance position on scroll
      gsap.to(img3LayerRef.current, {
        x: 200,
        y: 200,
        rotation: 90,
        scale: 0.3,
        opacity: 0,
        ease: 'back.in(1.5)',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8
        }
      });

      // Content zoom out and fade
      gsap.to(centerRevealRef.current, {
        scale: 0.7,
        y: -200,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      // Number counter animation
      gsap.to(numberRef.current, {
        rotation: 360,
        scale: 1.5,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Continuous floating animation for feature cards
      featureCardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.to(card, {
            y: '+=20',
            duration: 2 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3
          });
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse 3D tilt effect - FIXED: Only apply when not scrolling
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.scrollY < window.innerHeight) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Only apply mouse parallax when at the very top (not scrolling)
    if (window.scrollY < 50) {
      gsap.to(img2LayerRef.current, {
        x: mousePos.x * 60,
        y: mousePos.y * 60,
        rotation: mousePos.x * 10,
        duration: 2,
        ease: 'power2.out',
        overwrite: false
      });

      gsap.to(img3LayerRef.current, {
        x: mousePos.x * -50,
        y: mousePos.y * -50,
        rotation: mousePos.x * -10,
        duration: 2.2,
        ease: 'power2.out',
        overwrite: false
      });

      gsap.to(leftPanelRef.current, {
        x: mousePos.x * -30,
        duration: 1.8,
        ease: 'power2.out',
        overwrite: false
      });

      gsap.to(rightPanelRef.current, {
        x: mousePos.x * 30,
        duration: 1.8,
        ease: 'power2.out',
        overwrite: false
      });
    }
  }, [mousePos]);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%)'
      }}
    >
      {/* Animated Reveal Bars Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none flex">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={el => overlayBarsRef.current[i] = el}
            className="flex-1 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900"
            style={{ transformOrigin: 'top' }}
          />
        ))}
      </div>

      {/* Main Background Image */}
      <div
        ref={mainImageRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)'
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Left Decorative Panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 h-full w-64 hidden lg:block"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-8 space-y-8">
          {['01', '02', '03'].map((num, i) => (
            <div key={i} className="text-white/20 text-6xl font-light">{num}</div>
          ))}
        </div>
      </div>

      {/* Right Decorative Panel */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 h-full w-64 hidden lg:block"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
          borderLeft: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-8 space-y-6 text-right">
          <div className="text-white/30 text-sm tracking-widest uppercase">Luxury</div>
          <div className="text-white/30 text-sm tracking-widest uppercase">Comfort</div>
          <div className="text-white/30 text-sm tracking-widest uppercase">Elegance</div>
        </div>
      </div>

      {/* Floating Image Layer 2 */}
      <div
        ref={img2LayerRef}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{
          boxShadow: '0 30px 80px rgba(168, 85, 247, 0.4)'
        }}
      >
        <img src={img2} alt="Villa Detail" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent" />
      </div>

      {/* Floating Image Layer 3 */}
      <div
        ref={img3LayerRef}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{
          boxShadow: '0 30px 80px rgba(59, 130, 246, 0.4)'
        }}
      >
        <img src={img3} alt="Villa Feature" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/30 to-transparent" />
      </div>

      {/* Center Content Reveal */}
      <div
        ref={centerRevealRef}
        className="relative z-20 h-full flex items-center justify-center px-6"
      >
        <div className="text-center max-w-5xl">
          {/* Large Number Background */}
          <div
            ref={numberRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-black opacity-5 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            01
          </div>

          {/* Title */}
          <div ref={titleRef} className="mb-8 perspective-1000">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
              <div className="overflow-hidden">
                <span className="block text-white" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                  VILLA
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className="block mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 10px 40px rgba(168, 85, 247, 0.6)'
                  }}
                >
                  LUXE
                </span>
              </div>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-white/80 text-xl md:text-3xl font-light tracking-[0.3em] uppercase mb-16"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            Where Dreams Reside
          </p>

          {/* Feature Cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: '🏛️', text: 'Architecture' },
              { icon: '✨', text: 'Luxury' },
              { icon: '🌴', text: 'Lifestyle' }
            ].map((item, i) => (
              <div
                key={i}
                ref={el => featureCardsRef.current[i] = el}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 hover:bg-white/10 hover:border-purple-400/40 transition-all cursor-pointer"
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <span className="text-white/90 text-sm tracking-wider uppercase">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            ref={ctaRef}
            className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-xl overflow-hidden transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <span className="relative z-10 flex items-center gap-4">
              DISCOVER MORE
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
          <div className="w-8 h-12 border-2 border-purple-400/60 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-pulse" />
          </div>
          <span className="text-purple-400/80 text-xs tracking-[0.4em] uppercase">Scroll</span>
        </div>
      </div>

      {/* Ambient Corner Glows */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-purple-600/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-pink-600/20 to-transparent blur-3xl pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />
    </section>
  );
};

export default LuxuryVillaHero;