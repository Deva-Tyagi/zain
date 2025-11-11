import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LoadingScene = ({ onLoadingComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const flashRef = useRef(null);
  const particleContainerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cube class for 3D projection
    class Cube {
      constructor(x, y, z, size, hue) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = 0;
        this.opacity = 0;
        this.hue = hue;
        this.glowIntensity = 0;
      }

      project(point) {
        const fov = 500;
        const scale = fov / (fov + point.z + this.z);
        return {
          x: point.x * scale + canvas.width / 2 + this.x,
          y: point.y * scale + canvas.height / 2 + this.y,
          scale: scale
        };
      }

      rotatePoint(point, rotation) {
        let { x, y, z } = point;
        
        // Rotate around X axis
        let cosX = Math.cos(rotation.x);
        let sinX = Math.sin(rotation.x);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        
        // Rotate around Y axis
        let cosY = Math.cos(rotation.y);
        let sinY = Math.sin(rotation.y);
        let x1 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;
        
        // Rotate around Z axis
        let cosZ = Math.cos(rotation.z);
        let sinZ = Math.sin(rotation.z);
        let x2 = x1 * cosZ - y1 * sinZ;
        let y2 = x1 * sinZ + y1 * cosZ;
        
        return { x: x2, y: y2, z: z2 };
      }

      draw(ctx) {
        if (this.opacity === 0) return;

        const s = this.size * this.scale;
        const vertices = [
          { x: -s, y: -s, z: -s },
          { x: s, y: -s, z: -s },
          { x: s, y: s, z: -s },
          { x: -s, y: s, z: -s },
          { x: -s, y: -s, z: s },
          { x: s, y: -s, z: s },
          { x: s, y: s, z: s },
          { x: -s, y: s, z: s }
        ];

        const rotatedVertices = vertices.map(v => this.rotatePoint(v, this.rotation));
        const projectedVertices = rotatedVertices.map(v => this.project(v));

        const faces = [
          [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
          [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]
        ];

        // Draw faces with depth sorting
        faces.forEach((face, i) => {
          const avgZ = face.reduce((sum, idx) => sum + rotatedVertices[idx].z, 0) / 4;
          
          ctx.save();
          ctx.globalAlpha = this.opacity;
          ctx.beginPath();
          
          face.forEach((idx, j) => {
            const point = projectedVertices[idx];
            if (j === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.closePath();

          // Fill with gradient
          const brightness = 0.5 + (avgZ / 300) * 0.5;
          ctx.fillStyle = `hsla(${this.hue}, 80%, ${30 + brightness * 20}%, 0.6)`;
          ctx.fill();

          // Stroke edges
          ctx.strokeStyle = `hsla(${this.hue}, 100%, ${60 + this.glowIntensity * 40}%, ${0.8 + this.glowIntensity * 0.2})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add glow
          if (this.glowIntensity > 0) {
            ctx.shadowBlur = 20 * this.glowIntensity;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.glowIntensity})`;
          }
          
          ctx.restore();
        });
      }
    }

    // Create cubes
    const cube1 = new Cube(0, 0, 0, 80, 280); // Purple/Blue
    const cube2 = new Cube(0, 0, 0, 70, 200); // Blue
    const cube3 = new Cube(0, 0, 0, 70, 320); // Violet

    const cubes = [cube1, cube2, cube3];

    // Animation loop
    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      cubes.forEach(cube => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.008;
        cube.rotation.z += 0.003;
        cube.draw(ctx);
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // Create particles
    const createParticles = () => {
      const container = particleContainerRef.current;
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${3 + Math.random() * 4}s`;
        container.appendChild(particle);
      }
    };
    createParticles();

    // GSAP Timeline for entire sequence
    const masterTL = gsap.timeline({
      onComplete: () => {
        if (onLoadingComplete) {
          setTimeout(() => onLoadingComplete(), 500);
        }
      }
    });

    // Phase 1: Initial Load (0-2s) - Center cube appears
    masterTL
      .to(cube1, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out'
      })
      .to(cube1, {
        glowIntensity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      }, '-=0.5');

    // Phase 2: Formation Sequence (2-5s) - Other cubes appear
    masterTL
      .to(cube2, {
        x: 200,
        y: -100,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'back.out(1.5)'
      }, '-=0.5')
      .to(cube3, {
        x: -200,
        y: -100,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'back.out(1.5)'
      }, '-=0.9')
      .to([cube1, cube2, cube3], {
        glowIntensity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'sine.inOut'
      }, '-=0.5');

    // Loading progress simulation
    masterTL.to({}, {
      duration: 3,
      onUpdate: function() {
        setLoadingProgress(Math.round(this.progress() * 100));
      }
    }, 0);

    // Phase 3: Cubes merge to center (5-7s)
    masterTL
      .to([cube1, cube2, cube3], {
        x: 0,
        y: 0,
        scale: 0.5,
        glowIntensity: 2,
        duration: 1,
        ease: 'power2.inOut'
      })
      .to(flashRef.current, {
        opacity: 1,
        scale: 3,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3')
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      });

    // Phase 4: Logo reveal
    masterTL
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        letterSpacing: '0.1em',
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.5')
      .to([cube1, cube2, cube3], {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.in'
      }, '-=0.5');

    // Phase 5: Particle transition and fade out
    masterTL
      .to(particleContainerRef.current, {
        opacity: 1,
        duration: 0.8
      }, '-=0.5')
      .to(logoRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power2.in'
      }, '+=0.5')
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
      masterTL.kill();
    };
  }, [onLoadingComplete]);

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #0f1729 0%, #000000 100%)'
        }}
      >
        {/* Canvas for 3D cubes */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />

        {/* Flash effect */}
        <div
          ref={flashRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div 
            className="w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200, 150, 255, 0.8) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
        </div>

        {/* Logo reveal */}
        <div
          ref={logoRef}
          className="absolute text-center z-20"
          style={{ opacity: 0, scale: 0.8 }}
        >
          <div className="relative">
            {/* Logo image placeholder */}
            <div className="mb-6 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
                alt="Villa Logo"
                className="w-32 h-32 object-contain opacity-80 rounded-full"
                style={{
                  filter: 'brightness(1.5) contrast(1.2)',
                  boxShadow: '0 0 40px rgba(200, 150, 255, 0.5)'
                }}
              />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light tracking-widest text-white mb-4">
              VILLA
            </h1>
            <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <p className="text-purple-200/70 text-lg tracking-widest mt-4 font-light">
              ESSENCE
            </p>
          </div>
        </div>

        {/* Particle container */}
        <div
          ref={particleContainerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Loading progress */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex flex-col items-center gap-4">
            <div className="text-white/40 text-sm tracking-widest font-light">
              {loadingProgress}%
            </div>
            <div className="w-64 h-px bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ambient glow overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(150, 100, 255, 0.4) 0%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />
          <div 
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(100, 150, 255, 0.3) 0%, transparent 70%)',
              filter: 'blur(70px)'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(200, 150, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat linear infinite;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(200, 150, 255, 0.8);
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--random-x, 0) * 50px));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingScene;