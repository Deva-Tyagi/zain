import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MasterBedroomSection = () => {
  const sectionRef = useRef(null);
  const imageCarousel = useRef(null);
  const imageRefs = useRef([]);
  const sidebarRef = useRef(null);
  const numberRef = useRef(null);
  const titleWordRefs = useRef([]);
  const descRef = useRef(null);
  const statsRef = useRef(null);
  const exploreRef = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Combined images array with your imports and Unsplash images
  const images = [
    '/bedroom/bedroom1.png',
    '/bedroom/bedroom2.png',
    '/bedroom/bedroom3.png',
    '/bedroom/bedroom4.png',
    '/bedroom/bedroom5.png',
    '/bedroom/bedroom6.png',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
  ];

  // Z-index layers for stacking (front to back)
  const zLayers = [200, 100, 0, -100, -200, -300, -400, -500, -600, -700];
  const xPositions = [-250, -100, 0, 100, 250, 350, 400, 450, 500, 550];
  const rotations = [-15, -10, 0, 10, 15, 20, 25, 30, 35, 40];
  const scales = [0.9, 0.95, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65];

  const [currentOrder, setCurrentOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Handle image click - rotate order
  const handleImageClick = (clickedIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Find position of clicked image in current order
    const positionInOrder = currentOrder.indexOf(clickedIndex);
    
    // If it's already at front (position 2 - center), rotate the entire stack
    if (positionInOrder <= 2) {
      // Move front image to back
      const newOrder = [...currentOrder];
      const frontImage = newOrder.shift();
      newOrder.push(frontImage);
      
      // Animate transition
      gsap.to(imageRefs.current, {
        duration: 1.2,
        ease: 'power3.inOut',
        onStart: () => {
          setCurrentOrder(newOrder);
        },
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    } else {
      // Bring clicked image to front
      const newOrder = [...currentOrder];
      newOrder.splice(positionInOrder, 1);
      newOrder.unshift(clickedIndex);
      
      gsap.to(imageRefs.current, {
        duration: 1.2,
        ease: 'power3.inOut',
        onStart: () => {
          setCurrentOrder(newOrder);
        },
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // UNIQUE APPROACH: Horizontal sliding reveal
      const entranceTL = gsap.timeline({
        defaults: { ease: 'power4.inOut' }
      });

      // Images slide in from right in sequence
      entranceTL
        .from(imageRefs.current.slice(0, 3), {
          x: '100vw',
          rotation: 45,
          scale: 0.5,
          duration: 1.8,
          stagger: 0.15
        })
        .from(imageRefs.current.slice(3, 6), {
          x: '-100vw',
          rotation: -45,
          scale: 0.5,
          duration: 1.8,
          stagger: 0.15
        }, '-=1.5')
        .from(imageRefs.current.slice(6), {
          x: '100vw',
          rotation: 45,
          scale: 0.5,
          opacity: 0,
          duration: 1.8,
          stagger: 0.1
        }, '-=1.2')
        .from(sidebarRef.current, {
          x: -400,
          opacity: 0,
          duration: 1.5
        }, '-=1.2')
        .from(numberRef.current, {
          scale: 0,
          rotation: 720,
          duration: 1.2,
          ease: 'back.out(2)'
        }, '-=0.8')
        .from(titleWordRefs.current, {
          y: 150,
          opacity: 0,
          rotationX: 90,
          stagger: 0.1,
          duration: 1
        }, '-=0.8')
        .from(descRef.current, {
          x: -100,
          opacity: 0,
          duration: 0.8
        }, '-=0.4')
        .from(statsRef.current.children, {
          scale: 0,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(2)'
        }, '-=0.4')
        .from(exploreRef.current, {
          y: 100,
          opacity: 0,
          duration: 0.8
        }, '-=0.3');

      // UNIQUE PARALLAX: Depth-based 3D rotation on scroll
      gsap.to(imageCarousel.current, {
        rotationY: -25,
        x: -300,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });

      // Individual image parallax with 3D transforms
      imageRefs.current.forEach((img, i) => {
        gsap.to(img, {
          x: -400 + (i * 100),
          y: -200 + (i * 20),
          rotationZ: -15 + (i * 5),
          scale: 0.7 + (i * 0.03),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5 + (i * 0.1)
          }
        });
      });

      gsap.to(sidebarRef.current, {
        y: -400,
        opacity: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Continuous rotation animation for carousel
      gsap.to(imageCarousel.current, {
        rotationY: '+=5',
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    gsap.to(imageCarousel.current, {
      rotationY: mousePos.x * 15,
      rotationX: mousePos.y * -10,
      duration: 2,
      ease: 'power2.out'
    });
  }, [mousePos]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-zinc-950"
      style={{ perspective: '2000px' }}
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-950/30 via-zinc-950 to-black" />

      {/* Left Sidebar with Content */}
      <div
        ref={sidebarRef}
        className="absolute left-0 top-0 h-full w-full lg:w-2/5 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-20"
      >
        {/* Big Number */}
        <div
          ref={numberRef}
          className="text-[180px] md:text-[240px] lg:text-[300px] font-black leading-none mb-8 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          01
        </div>

        {/* Title with Split Animation */}
        <h1 className="mb-8 space-y-2 perspective-1000">
          {['MASTER', 'BEDROOM', 'SUITE'].map((word, i) => (
            <div
              key={i}
              ref={el => titleWordRefs.current[i] = el}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight"
              style={{
                color: i === 1 ? 'transparent' : 'white',
                background: i === 1 ? 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' : 'none',
                WebkitBackgroundClip: i === 1 ? 'text' : 'none',
                WebkitTextFillColor: i === 1 ? 'transparent' : 'white',
                textShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              {word}
            </div>
          ))}
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="text-gray-400 text-lg md:text-xl lg:text-2xl leading-relaxed mb-12 max-w-xl"
        >
          Experience luxury redefined. Where contemporary design meets ultimate comfort in your private sanctuary.
        </p>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 gap-6 mb-12 max-w-md">
          {[
            { value: '450', label: 'SQ FT' },
            { value: '12ft', label: 'CEILING' },
            { value: 'King', label: 'BED SIZE' },
            { value: '5★', label: 'LUXURY' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{stat.value}</div>
              <div className="text-gray-500 text-sm tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={exploreRef}>
          <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
            <span className="relative z-10 flex items-center gap-3">
              EXPLORE ROOM
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Right Side - 3D Image Carousel */}
      <div
        ref={imageCarousel}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-3/5 h-screen flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '2000px'
        }}
      >
        {images.map((img, index) => {
          const positionInOrder = currentOrder.indexOf(index);
          const isCenter = positionInOrder === 2;
          
          return (
            <div
              key={index}
              ref={el => imageRefs.current[index] = el}
              onClick={() => handleImageClick(index)}
              className={`absolute rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-1000 ${
                isCenter 
                  ? 'border-purple-400/40 cursor-pointer hover:scale-105' 
                  : 'border-white/20 cursor-pointer hover:border-purple-400/60'
              }`}
              style={{
                width: positionInOrder <= 2 ? '480px' : '380px',
                height: positionInOrder <= 2 ? '620px' : '500px',
                transform: `translateZ(${zLayers[positionInOrder]}px) translateX(${xPositions[positionInOrder]}px) rotateY(${rotations[positionInOrder]}deg) scale(${scales[positionInOrder]})`,
                transformStyle: 'preserve-3d',
                boxShadow: isCenter 
                  ? '0 50px 100px rgba(168, 85, 247, 0.4)' 
                  : '0 20px 40px rgba(0, 0, 0, 0.3)',
                zIndex: 100 - positionInOrder,
                transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img 
                src={img} 
                alt={`Bedroom view ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80';
                }}
              />
              <div className={`absolute inset-0 ${
                isCenter 
                  ? 'bg-gradient-to-t from-purple-900/40 to-transparent' 
                  : 'bg-gradient-to-t from-purple-900/50 to-transparent'
              }`} />
              
              {/* Click indicator on center image */}
              {isCenter && (
                <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold animate-pulse">
                  Click to rotate
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 border border-purple-500/30 rounded-full animate-pulse" />
      <div className="absolute bottom-32 left-1/2 w-60 h-60 border border-pink-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400/60 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-pulse" />
          </div>
          <span className="text-purple-400/80 text-xs tracking-[0.4em] uppercase font-light">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default MasterBedroomSection;