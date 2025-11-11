import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ParallaxBedroom = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const scrollY = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf5e6d3, 15, 35);
    sceneRef.current = scene;

    // Camera - 50mm equivalent, diagonal corner view
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(8, 3.5, 10);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - Golden hour warm tones
    const ambientLight = new THREE.AmbientLight(0xffd7a8, 0.6);
    scene.add(ambientLight);

    // Main sunlight through window
    const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.8);
    sunLight.position.set(-5, 8, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    scene.add(sunLight);

    // Warm fill light
    const fillLight = new THREE.PointLight(0xffcc99, 0.8, 20);
    fillLight.position.set(5, 4, 8);
    scene.add(fillLight);

    // Lamp warm glow
    const lampLight = new THREE.PointLight(0xffbb66, 1.2, 8);
    lampLight.position.set(3.5, 2.5, -1);
    lampLight.castShadow = true;
    scene.add(lampLight);

    // ===== BACKGROUND LAYER (z: -8 to -12) =====
    
    // Back wall
    const wallGeometry = new THREE.PlaneGeometry(20, 12);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0e5d8,
      roughness: 0.9,
      metalness: 0.0
    });
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 4, -10);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Side wall
    const sideWall = new THREE.Mesh(wallGeometry, wallMaterial);
    sideWall.rotation.y = Math.PI / 2;
    sideWall.position.set(-10, 4, 0);
    sideWall.receiveShadow = true;
    scene.add(sideWall);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(25, 25);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8dcc8,
      roughness: 0.8,
      metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Window frame
    const windowFrameGeo = new THREE.BoxGeometry(5, 6, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4c4b0,
      roughness: 0.6 
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, frameMaterial);
    windowFrame.position.set(-6, 4, -9.9);
    scene.add(windowFrame);

    // Window glass with outdoor view
    const windowGlassGeo = new THREE.PlaneGeometry(4.5, 5.5);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcce6ff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0xfff9e6,
      emissiveIntensity: 0.4
    });
    const windowGlass = new THREE.Mesh(windowGlassGeo, windowMaterial);
    windowGlass.position.set(-6, 4, -9.8);
    scene.add(windowGlass);

    // Art frames above bed
    const frameGeo = new THREE.BoxGeometry(2, 2.5, 0.1);
    const artMaterial = new THREE.MeshStandardMaterial({ color: 0xa89078 });
    
    const frame1 = new THREE.Mesh(frameGeo, artMaterial);
    frame1.position.set(-1.5, 5, -9.8);
    scene.add(frame1);
    
    const frame2 = new THREE.Mesh(frameGeo, artMaterial);
    frame2.position.set(1.5, 5, -9.8);
    scene.add(frame2);

    // ===== MID LAYER (z: -2 to -5) =====
    
    // Bed frame
    const bedFrameGeo = new THREE.BoxGeometry(6, 0.4, 7);
    const bedFrameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xc9b59a,
      roughness: 0.7 
    });
    const bedFrame = new THREE.Mesh(bedFrameGeo, bedFrameMaterial);
    bedFrame.position.set(0, 0.8, -3);
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    scene.add(bedFrame);

    // Mattress
    const mattressGeo = new THREE.BoxGeometry(5.8, 0.6, 6.8);
    const mattressMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfff8f0,
      roughness: 0.9 
    });
    const mattress = new THREE.Mesh(mattressGeo, mattressMaterial);
    mattress.position.set(0, 1.3, -3);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    scene.add(mattress);

    // Bedding - textured layers
    const beddingGeo = new THREE.BoxGeometry(5.6, 0.3, 6.5);
    const beddingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5ede3,
      roughness: 0.95 
    });
    const bedding = new THREE.Mesh(beddingGeo, beddingMaterial);
    bedding.position.set(0, 1.75, -3.2);
    bedding.castShadow = true;
    bedding.receiveShadow = true;
    scene.add(bedding);

    // Blanket folded at foot of bed
    const blanketGeo = new THREE.BoxGeometry(5, 0.4, 1.5);
    const blanketMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8d5c4,
      roughness: 0.85 
    });
    const blanket = new THREE.Mesh(blanketGeo, blanketMaterial);
    blanket.position.set(0, 1.9, -6);
    blanket.rotation.x = -0.1;
    blanket.castShadow = true;
    blanket.receiveShadow = true;
    scene.add(blanket);

    // Pillows
    const pillows = [];
    for (let i = 0; i < 3; i++) {
      const pillowGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
      const pillowMat = new THREE.MeshStandardMaterial({ 
        color: i === 1 ? 0xffffff : 0xf5f0e8,
        roughness: 0.9 
      });
      const pillow = new THREE.Mesh(pillowGeo, pillowMat);
      pillow.position.set(-2 + i * 2, 2.2, 0.5);
      pillow.rotation.x = -0.3;
      pillow.castShadow = true;
      pillow.receiveShadow = true;
      scene.add(pillow);
      pillows.push(pillow);
    }

    // Nightstand
    const nightstandGeo = new THREE.BoxGeometry(1.5, 1.8, 1.5);
    const woodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xa8906f,
      roughness: 0.6,
      metalness: 0.1 
    });
    const nightstand = new THREE.Mesh(nightstandGeo, woodMaterial);
    nightstand.position.set(3.5, 0.9, -2);
    nightstand.castShadow = true;
    nightstand.receiveShadow = true;
    scene.add(nightstand);

    // Lamp base
    const lampBaseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16);
    const lampBase = new THREE.Mesh(lampBaseGeo, woodMaterial);
    lampBase.position.set(3.5, 2.2, -2);
    lampBase.castShadow = true;
    scene.add(lampBase);

    // Lamp shade
    const lampShadeGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 16);
    const lampShadeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfff5e6,
      emissive: 0xffcc66,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9 
    });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMaterial);
    lampShade.position.set(3.5, 2.8, -2);
    scene.add(lampShade);

    // ===== FOREGROUND LAYER (z: 3 to 6) =====
    
    // Curtains - semi-transparent flowing
    const curtainGeo = new THREE.PlaneGeometry(2, 8);
    const curtainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfff9f0,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      roughness: 0.8 
    });
    
    const curtainLeft = new THREE.Mesh(curtainGeo, curtainMaterial);
    curtainLeft.position.set(-7.5, 4, 5);
    curtainLeft.rotation.y = 0.3;
    scene.add(curtainLeft);
    
    const curtainRight = new THREE.Mesh(curtainGeo, curtainMaterial);
    curtainRight.position.set(-4.5, 4, 5);
    curtainRight.rotation.y = -0.3;
    scene.add(curtainRight);

    // Sunbeam volumetric effect
    const sunbeamGeo = new THREE.ConeGeometry(3, 10, 32, 1, true);
    const sunbeamMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xfff9e6,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide 
    });
    const sunbeam = new THREE.Mesh(sunbeamGeo, sunbeamMaterial);
    sunbeam.position.set(-6, 8, -5);
    sunbeam.rotation.x = Math.PI / 2;
    sunbeam.rotation.z = -0.3;
    scene.add(sunbeam);

    setIsLoading(false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const scroll = scrollY.current;

      // Parallax effect based on scroll
      // Background moves slowest
      backWall.position.y = 4 + scroll * 0.1;
      windowFrame.position.y = 4 + scroll * 0.1;
      windowGlass.position.y = 4 + scroll * 0.1;
      frame1.position.y = 5 + scroll * 0.12;
      frame2.position.y = 5 + scroll * 0.12;

      // Mid layer moves medium speed
      bedFrame.position.y = 0.8 + scroll * 0.25;
      mattress.position.y = 1.3 + scroll * 0.25;
      bedding.position.y = 1.75 + scroll * 0.25;
      blanket.position.y = 1.9 + scroll * 0.25;
      nightstand.position.y = 0.9 + scroll * 0.25;
      lampBase.position.y = 2.2 + scroll * 0.25;
      lampShade.position.y = 2.8 + scroll * 0.25;
      pillows.forEach((p, i) => {
        p.position.y = 2.2 + scroll * 0.25 + Math.sin(time + i) * 0.02;
      });

      // Foreground moves fastest
      curtainLeft.position.y = 4 + scroll * 0.5;
      curtainRight.position.y = 4 + scroll * 0.5;
      
      // Curtain sway animation
      curtainLeft.rotation.y = 0.3 + Math.sin(time * 0.5) * 0.1;
      curtainRight.rotation.y = -0.3 + Math.sin(time * 0.5 + 1) * 0.1;
      curtainLeft.position.x = -7.5 + Math.sin(time * 0.3) * 0.05;
      curtainRight.position.x = -4.5 + Math.sin(time * 0.3 + 1.5) * 0.05;

      // Lamp flicker
      lampLight.intensity = 1.2 + Math.sin(time * 3) * 0.1;
      lampShadeMaterial.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.1;

      // Sunbeam movement
      sunbeam.position.y = 8 + scroll * 0.15;
      sunbeam.rotation.z = -0.3 + scroll * 0.05;
      sunbeamMaterial.opacity = 0.15 + Math.sin(time * 0.5) * 0.03;

      // Sunlight color shift
      const scrollFactor = Math.min(scroll * 0.2, 1);
      sunLight.intensity = 1.8 - scrollFactor * 0.3;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Scroll handler
    const handleScroll = (e) => {
      const delta = e.deltaY * 0.001;
      scrollY.current = Math.max(-2, Math.min(2, scrollY.current + delta));
    };

    containerRef.current.addEventListener('wheel', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleScroll);
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#f5e6d3]">
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5e6d3]">
          <div className="text-[#a8906f] text-xl font-light">Loading scene...</div>
        </div>
      )}
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[#a8906f] text-sm font-light mb-2">
          Scroll to explore parallax depth
        </div>
        <div className="text-[#a8906f] opacity-50 text-xs">
          Foreground • Midground • Background layers
        </div>
      </div>
    </div>
  );
};

export default ParallaxBedroom;