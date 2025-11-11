// sections/BedroomSection.js (3D bedroom model with parallax rotation)
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Custom 3D Bedroom Model Component (procedural using Three.js basics: floor, walls, bed, nightstand, lamp)
const BedroomModel = ({ rotationRef }) => {
  const groupRef = useRef();

  // Use useFrame to handle rotation based on ref value (animated by GSAP)
  useFrame(() => {
    if (groupRef.current && rotationRef.current !== undefined) {
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(rotationRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#8B4513" /> {/* Wooden floor */}
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#F0F8FF" /> {/* Light blue wall */}
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#F0F8FF" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#F0F8FF" />
      </mesh>

      {/* Bed Frame */}
      <mesh position={[0, 0.5, -3]}>
        <boxGeometry args={[4, 1, 6]} />
        <meshStandardMaterial color="#654321" /> {/* Dark wood bed frame */}
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 1.2, -3]}>
        <boxGeometry args={[3.8, 0.4, 5.8]} />
        <meshStandardMaterial color="#FFFFFF" /> {/* White mattress */}
      </mesh>

      {/* Nightstand */}
      <mesh position={[-3, 0.5, -2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#A52A2A" /> {/* Brown nightstand */}
      </mesh>

      {/* Lamp on Nightstand */}
      <mesh position={[-3, 1.2, -2]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 32]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} /> {/* Gold lamp */}
      </mesh>

      {/* Window on Back Wall (semi-transparent) */}
      <mesh position={[2, 2.5, -4.9]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} /> {/* Sky blue window */}
      </mesh>
    </group>
  );
};

const BedroomSection = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const rotationRef = useRef(0); // Ref to hold rotation value for GSAP animation

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.fromTo(
      rotationRef,
      { current: 0 },
      { current: 90, ease: 'power1.inOut' }
    ).fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: 'power2.out' }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 10, 10]} intensity={1.5} />
        <BedroomModel rotationRef={rotationRef} />
      </Canvas>
      <div ref={textRef} className="z-10 text-center">
        <h2 className="text-4xl font-bold mb-4">Master Bedroom</h2>
        <p className="text-lg">Serene retreats with plush bedding and elegant decor. Rotate view on scroll.</p>
      </div>
    </section>
  );
};

export default BedroomSection;