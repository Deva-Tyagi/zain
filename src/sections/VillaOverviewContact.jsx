import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img1 from '/overview/overview1.png';
import img2 from '/overview/overview2.png';
import img3 from '/overview/overview3.png';
import img4 from '/overview/overview4.png';
import img5 from '/overview/overview5.png';
import img6 from '/overview/overview6.png';

gsap.registerPlugin(ScrollTrigger);

const VillaOverviewContact = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const skyRef = useRef(null);
  const sunRaysRef = useRef(null);
  const villaFullshotRef = useRef(null);
  const villaMorningBgRef = useRef(null);
  const particlesRef = useRef(null);
  const treesRef = useRef(null);
  const contactCardRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const formRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const thankYouRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          pin: containerRef.current,
          anticipatePin: 1,
        }
      });

      // Phase 1: Night to Morning Transition
      tl.to(skyRef.current, {
        background: 'linear-gradient(to bottom, #87CEEB 0%, #FFE5B4 50%, #FDB462 100%)',
        duration: 0.5,
        ease: 'power2.inOut'
      })
      .to(sunRaysRef.current, {
        opacity: 0.7,
        scale: 1.2,
        rotation: 5,
        duration: 0.5,
        ease: 'power2.out'
      }, '<');

      // Phase 2: Camera Zoom Out Reveal
      tl.fromTo(villaMorningBgRef.current,
        { scale: 1.3, y: 0 },
        { scale: 1, y: -50, duration: 0.8, ease: 'power1.out' }
      )
      .fromTo(villaFullshotRef.current,
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
        '<0.2'
      );

      // Phase 3: Parallax Layers
      tl.to(villaMorningBgRef.current, {
        y: -100,
        duration: 1,
        ease: 'none'
      }, '<')
      .to(villaFullshotRef.current, {
        y: -150,
        duration: 1,
        ease: 'none'
      }, '<')
      .to(treesRef.current, {
        y: -200,
        opacity: 1,
        duration: 1,
        ease: 'none'
      }, '<');

      // Phase 4: Particles Animation
      tl.to(particlesRef.current, {
        opacity: 0.5,
        y: -100,
        duration: 1,
        ease: 'none'
      }, '<0.2');

      // Phase 5: Contact Card Reveal
      tl.fromTo(contactCardRef.current,
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
        '<0.3'
      );

      // Phase 6: Text Sequence
      tl.fromTo(headlineRef.current,
        { opacity: 0, y: 50, letterSpacing: '0.2em' },
        { opacity: 1, y: 0, letterSpacing: '0.05em', duration: 0.4, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '<0.15'
      );

      // Phase 7: Form Reveal
      tl.fromTo(formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(ctaButtonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' },
        '<0.15'
      );

      // Phase 8: Final Drift & Thank You
      tl.to(containerRef.current, {
        y: -50,
        duration: 0.5,
        ease: 'power1.inOut'
      })
      .to(thankYouRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, '<0.2');

      // Continuous Animations
      // Sun Rays Shimmer
      gsap.to(sunRaysRef.current, {
        opacity: '+=0.1',
        rotation: '+=2',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Particles Float
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: `-=${Math.random() * 50 + 20}`,
          x: `+=${Math.random() * 30 - 15}`,
          opacity: Math.random() * 0.6 + 0.3,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // CTA Button Hover Animation
      const button = ctaButtonRef.current;
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            boxShadow: '0 0 30px rgba(218, 165, 32, 0.6)',
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            boxShadow: '0 0 0px rgba(218, 165, 32, 0)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '140vh' }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Sky Background Transition (Night to Morning) */}
        <div 
          ref={skyRef}
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, #0a1628 0%, #1a2332 50%, #2a3444 100%)'
          }}
        />

        {/* Sun Rays Overlay */}
        <div 
          ref={sunRaysRef}
          className="absolute inset-0 z-5 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <img 
            src={img1}
            alt="sun rays"
            className="w-full h-full object-cover"
            style={{
              mixBlendMode: 'screen',
              filter: 'brightness(1.5) contrast(1.2)'
            }}
          />
          <div 
            className="absolute top-20 right-1/3 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 223, 128, 0.8) 0%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />
        </div>

        {/* Villa Morning Background (Slowest) */}
        <div 
          ref={villaMorningBgRef}
          className="absolute inset-0 z-10"
        >
          <img 
            src={img2}
            alt="villa morning background"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.1) saturate(1.2)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>

        {/* Villa Full Shot (Medium Speed) */}
        <div 
          ref={villaFullshotRef}
          className="absolute inset-0 z-20"
          style={{ opacity: 0 }}
        >
          <img 
            src={img3}
            alt="villa full shot"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1) contrast(1.1)' }}
          />
        </div>

        {/* Foreground Trees (Fastest) */}
        <div 
          ref={treesRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <img 
            src={img4}
            alt="trees"
            className="absolute bottom-0 left-0 w-full h-2/3 object-cover object-bottom"
            style={{ 
              filter: 'brightness(0.6) saturate(1.1)',
              maskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Floating Particles */}
        <div 
          ref={particlesRef}
          className="absolute inset-0 z-35 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <img 
            src={img5}
            alt="particles"
            className="w-full h-full object-cover opacity-30"
            style={{ mixBlendMode: 'screen' }}
          />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* Contact Card Container */}
        <div 
          ref={contactCardRef}
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="relative w-full max-w-2xl mx-auto px-6 pointer-events-auto">
            {/* Card Background */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img 
                  src={img6}
                  alt="contact card background"
                  className="w-full h-full object-cover opacity-5"
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Headline */}
                <h2 
                  ref={headlineRef}
                  className="text-5xl md:text-6xl font-light text-white mb-4 tracking-wide text-center"
                  style={{ opacity: 0 }}
                >
                  Live the Space You Dream Of
                </h2>

                {/* Subtext */}
                <p 
                  ref={subtextRef}
                  className="text-xl text-gray-200 font-light text-center mb-10"
                  style={{ opacity: 0 }}
                >
                  Experience design that defines modern luxury.
                </p>

                {/* Form Fields */}
                <div 
                  ref={formRef}
                  className="space-y-6"
                  style={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300"
                    />
                  </div>

                  <button
                    ref={ctaButtonRef}
                    onClick={handleSubmit}
                    className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium text-lg rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-lg cursor-pointer"
                    style={{ opacity: 0 }}
                  >
                    Schedule a Visit
                  </button>
                </div>

                {/* Optional Subtext */}
                <p className="text-center text-gray-300 text-sm mt-6 font-light">
                  Let's create your perfect home together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You / Logo Watermark */}
        <div 
          ref={thankYouRef}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 text-center"
          style={{ opacity: 0 }}
        >
          <p className="text-white/60 text-sm font-light tracking-widest">
            THANK YOU FOR VISITING
          </p>
          <div className="mt-2 text-white/40 text-xs font-light">
            © 2025 Luxury Villa Collection
          </div>
        </div>

        {/* Ambient Light Glow */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(255, 223, 128, 0.5) 0%, transparent 70%)',
              filter: 'blur(100px)'
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, transparent 70%)',
              filter: 'blur(90px)'
            }}
          />
        </div>

        {/* Vignette Effect */}
        <div className="absolute inset-0 z-45 pointer-events-none">
          <div className="w-full h-full" 
               style={{
                 background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 100%)'
               }} 
          />
        </div>
      </div>
    </section>
  );
};

export default VillaOverviewContact;