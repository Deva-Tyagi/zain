import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import img1 from '/living-room/living1.png';
import img2 from '/living-room/living2.png';
import img3 from '/living-room/living3.png';
import img4 from '/living-room/living4.png';
import img5 from '/living-room/living5.png';

gsap.registerPlugin(ScrollTrigger, Draggable);

const LivingRoom = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const plantRef = useRef(null);
  const lampRef = useRef(null);
  const lightRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const contentRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [plantPos, setPlantPos] = useState({ left: '5%', bottom: '5%' });
  const [lampPos, setLampPos] = useState({ right: '5%', top: '5%' });

  const plantDraggableRef = useRef(null);
  const lampDraggableRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    const plant = plantRef.current;
    const lamp = lampRef.current;
    const light = lightRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const content = contentRef.current;

    // Set initial states
    gsap.set([headline, subtext], { 
      opacity: 0, 
      x: -100 
    });
    gsap.set(overlay, { 
      opacity: 0.3, 
      x: '-20%', 
      y: '10%' 
    });
    gsap.set(light, { 
      opacity: 0 
    });

    // Main timeline for section entrance
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      }
    });

    entranceTl
      .to(section, {
        opacity: 1,
        duration: 1
      })
      .to(light, {
        opacity: 0.6,
        duration: 1
      }, 0);

    // Background parallax - slow pan right
    gsap.to(bg, {
      x: '15%',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Content parallax - slides in from left
    gsap.to(content, {
      x: '10%',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Glass overlay diagonal drift
    gsap.to(overlay, {
      x: '30%',
      y: '-20%',
      opacity: 0.5,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });

    // Text reveal animation
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1
      }
    });

    textTl
      .to(headline, {
        opacity: 1,
        x: 0,
        duration: 1
      })
      .to(subtext, {
        opacity: 1,
        x: 0,
        duration: 1
      }, 0.2);

    // Exit animation - darken as next section approaches
    gsap.to(section, {
      filter: 'brightness(0.7)',
      scrollTrigger: {
        trigger: section,
        start: 'bottom 60%',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Mouse parallax effect only on overlay
    const handleMouseMove = (e) => {
      if (editMode) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(overlay, {
        x: xPercent * 15 + 30 + '%',
        y: yPercent * 10 - 20 + '%',
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [editMode]);

  // Setup draggable functionality
  useEffect(() => {
    const plant = plantRef.current;
    const lamp = lampRef.current;

    if (editMode && plant && lamp) {
      // Enable draggable for plant
      plantDraggableRef.current = Draggable.create(plant, {
        type: 'x,y',
        bounds: sectionRef.current,
        onDragEnd: function() {
          const rect = plant.getBoundingClientRect();
          const parentRect = sectionRef.current.getBoundingClientRect();
          
          setPlantPos({
            left: `${rect.left - parentRect.left}px`,
            bottom: 'auto',
            top: `${rect.top - parentRect.top}px`
          });
          console.log('Plant moved to:', rect.left - parentRect.left, rect.top - parentRect.top);
        }
      })[0];

      // Enable draggable for lamp
      lampDraggableRef.current = Draggable.create(lamp, {
        type: 'x,y',
        bounds: sectionRef.current,
        onDragEnd: function() {
          const rect = lamp.getBoundingClientRect();
          const parentRect = sectionRef.current.getBoundingClientRect();
          
          setLampPos({
            right: 'auto',
            top: `${rect.top - parentRect.top}px`,
            left: `${rect.left - parentRect.left}px`
          });
          console.log('Lamp moved to:', rect.left - parentRect.left, rect.top - parentRect.top);
        }
      })[0];
      
      console.log('Draggable enabled for both elements');
    }

    return () => {
      if (plantDraggableRef.current) {
        plantDraggableRef.current.kill();
        plantDraggableRef.current = null;
      }
      if (lampDraggableRef.current) {
        lampDraggableRef.current.kill();
        lampDraggableRef.current = null;
      }
    };
  }, [editMode]);

  return (
    <>
      {/* Edit Mode Toggle Button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="fixed top-4 right-4 z-50 px-6 py-3 bg-white/90 hover:bg-white text-black rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 font-medium"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        {editMode ? '✓ Done Editing' : '✏️ Edit Layout'}
      </button>

      <section
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden bg-black"
        style={{ opacity: 0 }}
      >
        {/* Background Layer - Living Room Main Image */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-[120%] h-full"
          style={{ left: '-10%' }}
        >
          <img
            src={img1}
            alt="Luxury Living Room"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Soft Light Texture Overlay */}
        <div
          ref={lightRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ opacity: 0 }}
        >
          <img
            src={img2}
            alt="Soft Light"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Glass Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.3 }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-white/10 via-cyan-100/5 to-blue-200/10 backdrop-blur-sm">
            {/* Glass texture effect */}
          </div>
        </div>

        {/* Decorative Layer - Plant (Left) - DRAGGABLE */}
        <div
          ref={plantRef}
          className={`absolute z-30 ${editMode ? 'cursor-grab active:cursor-grabbing ring-4 ring-blue-400' : ''}`}
          style={{ 
            left: plantPos.left,
            bottom: plantPos.bottom,
            top: plantPos.top || 'auto',
            width: '200px', 
            height: '400px',
            pointerEvents: 'auto'
          }}
        >
          <img
            src={img4}
            alt="Decorative Plant"
            className="w-full h-full object-contain object-bottom drop-shadow-2xl pointer-events-none"
            draggable={false}
          />
          {editMode && (
            <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              🌿 Drag Plant
            </div>
          )}
        </div>

        {/* Decorative Layer - Lamp (Right) - DRAGGABLE */}
        {/* <div
          ref={lampRef}
          className={`absolute z-30 ${editMode ? 'cursor-grab active:cursor-grabbing ring-4 ring-green-400' : ''}`}
          style={{ 
            right: lampPos.right === 'auto' ? 'auto' : lampPos.right,
            left: lampPos.left || 'auto',
            top: lampPos.top,
            width: '150px', 
            height: '300px',
            pointerEvents: 'auto'
          }}
        >
          <img
            src={img5}
            alt="Decorative Lamp"
            className="w-full h-full object-contain object-top drop-shadow-2xl pointer-events-none"
            draggable={false}
          />
          {editMode && (
            <div className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              💡 Drag Lamp
            </div>
          )}
        </div> */}

        {/* Content Layer */}
        <div
          ref={contentRef}
          className="relative z-20 flex items-center justify-start h-screen px-12 md:px-24 lg:px-32"
        >
          <div className="max-w-2xl">
            <h2
              ref={headlineRef}
              className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight tracking-tight"
              style={{ 
                fontFamily: 'Georgia, serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              Where Design
              <br />
              Meets Comfort
            </h2>
            <p
              ref={subtextRef}
              className="text-lg md:text-xl text-gray-300 leading-relaxed tracking-wide"
              style={{ 
                fontFamily: 'system-ui, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              A harmony of space, light, and luxury.
            </p>
          </div>
        </div>

        {/* Ambient Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            50% {
              transform: translate(30px, -50px) scale(1.5);
              opacity: 0.6;
            }
          }
          .animate-float {
            animation: float linear infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default LivingRoom;