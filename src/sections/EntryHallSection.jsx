import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const EntryHallSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const rotationRef = useRef(0);
  const cameraZRef = useRef(12);
  const cameraYRef = useRef(3.5);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);

  const [isCanvasReady, setCanvasReady] = useState(false);

  // ====================== SCROLL HANDLER (SMOOTH + EFFICIENT) ======================
  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;

        const scrollProgress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (sectionHeight + windowHeight)
        ));

        // Phase 1: Text slides up (0 to 0.15)
        if (scrollProgress < 0.15) {
          const textProgress = scrollProgress / 0.15;
          textContainer.style.transform = `translateY(-${textProgress * 100}%)`;
          textContainer.style.opacity = 1 - textProgress;
        } else {
          textContainer.style.transform = 'translateY(-100%)';
          textContainer.style.opacity = '0';
        }

        // Phase 2: 360° rotation and zoom tour (0.15 to 1)
        if (scrollProgress >= 0.15) {
          const tourProgress = (scrollProgress - 0.15) / 0.85;
          rotationRef.current = tourProgress * 720;
          cameraZRef.current = 12 - (tourProgress * 7);
          cameraYRef.current = 3.5 + Math.sin(tourProgress * Math.PI) * 2;
        } else {
          rotationRef.current = 0;
          cameraZRef.current = 12;
          cameraYRef.current = 3.5;
        }

        ticking = false;
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ====================== THREE.JS SETUP (YOUR FULL MODEL) ======================
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 15, 35);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 12);
    camera.lookAt(0, 2.5, 0);
    cameraRef.current = camera;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // ==================== YOUR ENTIRE 1100+ LINE MODEL (UNTOUCHED) ====================

    // Premium marble floor
    const floorGeometry = new THREE.PlaneGeometry(18, 22, 128, 128);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFAFAFA, 
      roughness: 0.08,
      metalness: 0.6,
      envMapIntensity: 1.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    modelGroup.add(floor);

    // Checkered pattern with better contrast
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 11; j++) {
        if ((i + j) % 2 === 0) {
          const tile = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.MeshStandardMaterial({ 
              color: 0xE5E5E5, 
              roughness: 0.12, 
              metalness: 0.5 
            })
          );
          tile.rotation.x = -Math.PI / 2;
          tile.position.set(-8 + i * 2, 0.01, -10 + j * 2);
          tile.receiveShadow = true;
          modelGroup.add(tile);
        }
      }
    }

    // Ornate wooden border
    const borderMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4A2511, 
      roughness: 0.5,
      metalness: 0.1
    });
    
    const borderWidth = 18;
    const borderDepth = 22;
    
    // Front border
    const frontBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, 0.4, 1.2), 
      borderMaterial
    );
    frontBorder.position.set(0, 0.2, 11);
    frontBorder.castShadow = true;
    modelGroup.add(frontBorder);
    
    // Back border
    const backBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, 0.4, 1.2), 
      borderMaterial
    );
    backBorder.position.set(0, 0.2, -11);
    backBorder.castShadow = true;
    modelGroup.add(backBorder);
    
    // Left border
    const leftBorder = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.4, borderDepth), 
      borderMaterial
    );
    leftBorder.position.set(-9, 0.2, 0);
    leftBorder.castShadow = true;
    modelGroup.add(leftBorder);
    
    // Right border
    const rightBorder = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.4, borderDepth), 
      borderMaterial
    );
    rightBorder.position.set(9, 0.2, 0);
    rightBorder.castShadow = true;
    modelGroup.add(rightBorder);

    // Walls with premium finish
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFF8E7, 
      roughness: 0.8,
      metalness: 0.05
    });
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(18, 8, 0.5), 
      wallMaterial
    );
    backWall.position.set(0, 4, -11);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    modelGroup.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(22, 8, 0.5), 
      wallMaterial
    );
    leftWall.position.set(-9, 4, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    modelGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(22, 8, 0.5), 
      wallMaterial
    );
    rightWall.position.set(9, 4, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    modelGroup.add(rightWall);

    // Decorative wall panels with frames
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF5EDD8, 
      roughness: 0.4 
    });
    const frameMat = new THREE.MeshStandardMaterial({ 
      color: 0x8B7355, 
      roughness: 0.6 
    });
    
    const panelPositions = [
      [-5, 3.5, -10.7], [5, 3.5, -10.7], // back wall
      [-8.7, 3.5, -6], [-8.7, 3.5, 6], // left wall  
      [8.7, 3.5, -6], [8.7, 3.5, 6], // right wall
    ];
    
    panelPositions.forEach((pos, i) => {
      // Frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 5, 0.2), 
        frameMat
      );
      frame.position.set(...pos);
      if (i >= 2 && i < 4) frame.rotation.y = Math.PI / 2;
      if (i >= 4) frame.rotation.y = -Math.PI / 2;
      frame.castShadow = true;
      modelGroup.add(frame);
      
      // Inner panel
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 4.6, 0.15), 
        panelMaterial
      );
      panel.position.set(...pos);
      if (i >= 2 && i < 4) panel.rotation.y = Math.PI / 2;
      if (i >= 4) panel.rotation.y = -Math.PI / 2;
      panel.position.z += (i < 2 ? 0.05 : (i < 4 ? -0.05 : 0.05));
      modelGroup.add(panel);
    });

    // Crown molding
    const crownMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF, 
      roughness: 0.15, 
      metalness: 0.25 
    });
    
    [[0, 7.6, -11, 18, 0], [-9, 7.6, 0, 22, Math.PI/2], [9, 7.6, 0, 22, -Math.PI/2]].forEach(([x, y, z, w, r]) => {
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.5, 0.6), 
        crownMaterial
      );
      crown.position.set(x, y, z);
      crown.rotation.y = r;
      crown.castShadow = true;
      modelGroup.add(crown);
    });

    // GRAND ENTRANCE DOOR
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, -10.5);
    
    // Door frame
    const frameGeometry = new THREE.BoxGeometry(5, 6.5, 0.5);
    const doorFrameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5C3317, 
      roughness: 0.45, 
      metalness: 0.15 
    });
    const doorFrame = new THREE.Mesh(frameGeometry, doorFrameMaterial);
    doorFrame.position.y = 3.25;
    doorFrame.castShadow = true;
    doorGroup.add(doorFrame);

    // Double doors
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3E1F0B, 
      roughness: 0.35, 
      metalness: 0.2 
    });
    
    [-1.15, 1.15].forEach((side) => {
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(2, 5.5, 0.25), 
        doorMaterial
      );
      door.position.set(side, 2.75, 0.15);
      door.castShadow = true;
      doorGroup.add(door);

      // Door panels (6 per door)
      const panelGeo = new THREE.BoxGeometry(1.5, 0.9, 0.12);
      const doorPanelMat = new THREE.MeshStandardMaterial({ 
        color: 0x2D1508, 
        roughness: 0.55 
      });
      
      [0.7, 1.8, 2.9, 3.8, 4.7, 5.6].forEach((y) => {
        const panel = new THREE.Mesh(panelGeo, doorPanelMat);
        panel.position.set(side, y - 2.5, 0.2);
        doorGroup.add(panel);
      });

      // Door handles
      const handleGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
      const handleMat = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700, 
        roughness: 0.15, 
        metalness: 0.95 
      });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(side * (side > 0 ? 0.6 : -0.6), 2.75, 0.3);
      handle.castShadow = true;
      doorGroup.add(handle);
      
      // Door knocker decorations
      const knocker = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        handleMat
      );
      knocker.position.set(side * 0.6, 3.5, 0.3);
      doorGroup.add(knocker);
    });

    // Transom window
    const transomGeom = new THREE.BoxGeometry(4, 1.2, 0.2);
    const transomMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xB0D4E3, 
      transparent: true, 
      opacity: 0.75,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.5
    });
    const transom = new THREE.Mesh(transomGeom, transomMat);
    transom.position.y = 6;
    transom.position.z = 0.15;
    doorGroup.add(transom);

    // Door arch
    const archShape = new THREE.Shape();
    archShape.absarc(0, 0, 2.5, Math.PI, 0, false);
    archShape.lineTo(2.5, -0.4);
    archShape.lineTo(-2.5, -0.4);
    const archGeometry = new THREE.ExtrudeGeometry(archShape, { 
      depth: 0.4, 
      bevelEnabled: false 
    });
    const arch = new THREE.Mesh(archGeometry, doorFrameMaterial);
    arch.position.set(0, 6.5, 0);
    arch.rotation.x = Math.PI;
    arch.castShadow = true;
    doorGroup.add(arch);

    modelGroup.add(doorGroup);

    // CONSOLE TABLES WITH DECORATIONS
    [-5.5, 5.5].forEach((xPos) => {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(xPos, 0, -4);
      
      // Table top with detailed edge
      const tableTopGeom = new THREE.BoxGeometry(3, 0.25, 1.2);
      const tableTop = new THREE.Mesh(
        tableTopGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0x3D1F0F, 
          roughness: 0.2, 
          metalness: 0.4 
        })
      );
      tableTop.position.y = 1.5;
      tableTop.castShadow = true;
      tableGroup.add(tableTop);

      // Decorative edge
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.15, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x2A1508, roughness: 0.3 })
      );
      edge.position.y = 1.7;
      tableGroup.add(edge);

      // Curved legs with details
      [[-1.2, 0.5], [1.2, 0.5], [-1.2, -0.5], [1.2, -0.5]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, 1.5, 16),
          new THREE.MeshStandardMaterial({ color: 0x3D1F0F, roughness: 0.4 })
        );
        leg.position.set(x, 0.75, z);
        leg.castShadow = true;
        tableGroup.add(leg);
        
        // Leg decoration
        const legDeco = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3, metalness: 0.8 })
        );
        legDeco.position.set(x, 1.1, z);
        tableGroup.add(legDeco);
      });

      // Ornate vase
      const vaseGeom = new THREE.CylinderGeometry(0.2, 0.3, 0.7, 24);
      const vase = new THREE.Mesh(
        vaseGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0x1E3A5F, 
          roughness: 0.12, 
          metalness: 0.5 
        })
      );
      vase.position.y = 2.1;
      vase.castShadow = true;
      tableGroup.add(vase);
      
      // Vase neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.3, 24),
        new THREE.MeshStandardMaterial({ color: 0x1E3A5F, roughness: 0.15, metalness: 0.5 })
      );
      neck.position.y = 2.6;
      tableGroup.add(neck);

      // Flowers
      const flowerColors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFF69B4, 0xFF1493];
      for (let i = 0; i < 7; i++) {
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          new THREE.MeshStandardMaterial({ 
            color: flowerColors[i % flowerColors.length], 
            roughness: 0.5,
            emissive: flowerColors[i % flowerColors.length],
            emissiveIntensity: 0.2
          })
        );
        flower.position.set(
          (Math.random() - 0.5) * 0.25,
          2.8 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.25
        );
        flower.castShadow = true;
        tableGroup.add(flower);
        
        // Stems
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x2D5016, roughness: 0.7 })
        );
        stem.position.set(flower.position.x, 2.6, flower.position.z);
        tableGroup.add(stem);
      }

      modelGroup.add(tableGroup);
    });

    // PREMIUM CHANDELIER
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 6.5, 0);

    // Central ornate sphere
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 64, 64),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFD700, 
        roughness: 0.08, 
        metalness: 0.95,
        envMapIntensity: 1.5
      })
    );
    centerSphere.castShadow = true;
    chandelierGroup.add(centerSphere);

    // Decorative rings
    for (let ring = 0; ring < 4; ring++) {
      const ringGeom = new THREE.TorusGeometry(0.65 + ring * 0.18, 0.05, 20, 64);
      const ringMesh = new THREE.Mesh(
        ringGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0xFFD700, 
          roughness: 0.15, 
          metalness: 0.92 
        })
      );
      ringMesh.rotation.x = Math.PI / 2 + ring * 0.08;
      ringMesh.position.y = -0.25 - ring * 0.12;
      ringMesh.castShadow = true;
      chandelierGroup.add(ringMesh);
    }

    // Chandelier arms - 16 arms for grand effect
    const numArms = 16;
    for (let i = 0; i < numArms; i++) {
      const angle = (Math.PI * 2 * i) / numArms;
      const armGroup = new THREE.Group();
      
      // Main arm
      const armGeom = new THREE.CylinderGeometry(0.09, 0.07, 2.4, 20);
      const arm = new THREE.Mesh(
        armGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0xFFD700, 
          roughness: 0.18, 
          metalness: 0.92 
        })
      );
      arm.rotation.z = Math.PI / 3.1;
      arm.position.set(Math.cos(angle) * 0.65, -0.45, Math.sin(angle) * 0.65);
      arm.castShadow = true;
      
      const armContainer = new THREE.Group();
      armContainer.rotation.y = angle;
      armContainer.add(arm);
      armGroup.add(armContainer);

      // Joint decoration
      const joint = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 20, 20),
        new THREE.MeshStandardMaterial({ 
          color: 0xFFD700, 
          roughness: 0.15, 
          metalness: 0.92 
        })
      );
      joint.position.set(Math.cos(angle) * 0.65, -0.45, Math.sin(angle) * 0.65);
      joint.castShadow = true;
      armGroup.add(joint);

      // Candle holder
      const holderGeom = new THREE.CylinderGeometry(0.14, 0.1, 0.2, 20);
      const holder = new THREE.Mesh(
        holderGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0xFFD700, 
          roughness: 0.2, 
          metalness: 0.88 
        })
      );
      holder.position.set(Math.cos(angle) * 1.85, -1.3, Math.sin(angle) * 1.85);
      holder.castShadow = true;
      armGroup.add(holder);

      // Candle
      const candleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 20);
      const candle = new THREE.Mesh(
        candleGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0xFFFAF0, 
          roughness: 0.65,
          emissive: 0xFFF5E1,
          emissiveIntensity: 0.15
        })
      );
      candle.position.set(Math.cos(angle) * 1.85, -0.95, Math.sin(angle) * 1.85);
      candle.castShadow = true;
      armGroup.add(candle);

      // Flame with realistic shape
      const flameGeom = new THREE.SphereGeometry(0.12, 20, 20);
      flameGeom.scale(1, 1.6, 1);
      const flame = new THREE.Mesh(
        flameGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0xFFE87C, 
          emissive: 0xFF8C00,
          emissiveIntensity: 2.5,
          transparent: true,
          opacity: 0.95
        })
      );
      flame.position.set(Math.cos(angle) * 1.85, -0.6, Math.sin(angle) * 1.85);
      armGroup.add(flame);

      // Flame light
      const flameLight = new THREE.PointLight(0xFFAA44, 1.5, 8);
      flameLight.position.copy(flame.position);
      flameLight.castShadow = true;
      flameLight.shadow.mapSize.width = 1024;
      flameLight.shadow.mapSize.height = 1024;
      armGroup.add(flameLight);

      // Crystal drops - multiple tiers
      const crystalTiers = [[1.3, 5], [1.65, 6], [2.0, 7]];
      crystalTiers.forEach(([radius, count]) => {
        for (let j = 0; j < count; j++) {
          const crystalAngle = angle + (Math.PI * 2 * j) / count;
          const crystalGeom = new THREE.ConeGeometry(0.09, 0.7, 10);
          const crystal = new THREE.Mesh(
            crystalGeom,
            new THREE.MeshPhysicalMaterial({ 
              color: 0xFFFFFF, 
              transparent: true, 
              opacity: 0.96,
              roughness: 0.03,
              metalness: 0.08,
              clearcoat: 1,
              clearcoatRoughness: 0.08,
              envMapIntensity: 2,
              transmission: 0.3
            })
          );
          crystal.position.set(
            Math.cos(crystalAngle) * radius,
            -1.8 - Math.random() * 0.5,
            Math.sin(crystalAngle) * radius
          );
          crystal.rotation.y = Math.random() * Math.PI;
          crystal.castShadow = true;
          crystal.receiveShadow = true;
          armGroup.add(crystal);
        }
      });

      chandelierGroup.add(armGroup);
    }

    // Hanging crystal curtain
    const crystalRings = [
      [28, 0.9, 1.1],
      [36, 1.25, 1.0],
      [44, 1.6, 0.9],
      [52, 1.95, 0.85]
    ];
    
    crystalRings.forEach(([count, radius, length]) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const crystalGeom = new THREE.CylinderGeometry(0.045, 0.025, length, 10);
        const crystal = new THREE.Mesh(
          crystalGeom,
          new THREE.MeshPhysicalMaterial({ 
            color: 0xFFFFFF, 
            transparent: true, 
            opacity: 0.92,
            roughness: 0.03,
            metalness: 0.06,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            envMapIntensity: 2.2,
            transmission: 0.4
          })
        );
        crystal.position.set(
          Math.cos(angle) * radius,
          -1.6 - (i % 5) * 0.18,
          Math.sin(angle) * radius
        );
        crystal.castShadow = true;
        crystal.receiveShadow = true;
        chandelierGroup.add(crystal);
      }
    });

    // Top ornament
    const topOrnament = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.35, 0.7, 24),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFD700, 
        roughness: 0.15, 
        metalness: 0.92 
      })
    );
    topOrnament.position.y = 0.9;
    topOrnament.castShadow = true;
    chandelierGroup.add(topOrnament);

    // Crown on top
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.12, metalness: 0.94 })
    );
    crown.position.y = 1.4;
    crown.castShadow = true;
    chandelierGroup.add(crown);

    // Chain links
    const chainLinks = 10;
    for (let i = 0; i < chainLinks; i++) {
      const link = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.025, 12, 20),
        new THREE.MeshStandardMaterial({ 
          color: 0xC9C9C9, 
          roughness: 0.25, 
          metalness: 0.85 
        })
      );
      link.position.y = 1.7 + i * 0.14;
      link.rotation.x = Math.PI / 2;
      link.castShadow = true;
      chandelierGroup.add(link);
    }

    modelGroup.add(chandelierGroup);

    // WALL SCONCES - Premium lighting fixtures
    [-7, 7].forEach((xPos) => {
      [-7, 0, 7].forEach((zPos) => {
        const sconceGroup = new THREE.Group();
        sconceGroup.position.set(xPos, 4.5, zPos);
        
        // Base plate
        const basePlate = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.3, 0.15, 24),
          new THREE.MeshStandardMaterial({ 
            color: 0xFFD700, 
            roughness: 0.25, 
            metalness: 0.85 
          })
        );
        basePlate.rotation.x = Math.PI / 2;
        basePlate.castShadow = true;
        sconceGroup.add(basePlate);
        
        // Arm
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16),
          new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3, metalness: 0.8 })
        );
        arm.position.z = 0.2;
        sconceGroup.add(arm);
        
        // Glass shade
        const shade = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 24, 24),
          new THREE.MeshPhysicalMaterial({ 
            color: 0xFFE4B5, 
            transparent: true, 
            opacity: 0.6,
            roughness: 0.1,
            transmission: 0.5,
            emissive: 0xFFE4B5,
            emissiveIntensity: 0.5
          })
        );
        shade.position.z = 0.4;
        sconceGroup.add(shade);

        // Sconce light
        const sconceLight = new THREE.PointLight(0xFFE4B5, 0.8, 8);
        sconceLight.position.z = 0.4;
        sconceLight.castShadow = true;
        sconceGroup.add(sconceLight);

        sconceGroup.lookAt(0, 4.5, 0);
        modelGroup.add(sconceGroup);
      });
    });

    // POTTED PLANTS - Corner decorations
    const plantPositions = [
      [-7.5, 0, 9.5], [7.5, 0, 9.5],
      [-7.5, 0, -9.5], [7.5, 0, -9.5]
    ];
    
    plantPositions.forEach(([x, y, z]) => {
      const plantGroup = new THREE.Group();
      plantGroup.position.set(x, y, z);
      
      // Ornate pot
      const potGeom = new THREE.CylinderGeometry(0.5, 0.4, 1, 24);
      const pot = new THREE.Mesh(
        potGeom,
        new THREE.MeshStandardMaterial({ 
          color: 0x8B4513, 
          roughness: 0.6,
          metalness: 0.1 
        })
      );
      pot.position.y = 0.5;
      pot.castShadow = true;
      plantGroup.add(pot);
      
      // Pot rim
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.52, 0.06, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.5 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 1;
      plantGroup.add(rim);

      // Soil
      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: 0x3D2817, roughness: 0.9 })
      );
      soil.position.y = 1;
      plantGroup.add(soil);

      // Plant leaves - more realistic
      for (let i = 0; i < 15; i++) {
        const leafGeom = new THREE.ConeGeometry(0.18, 1.2, 6);
        const leaf = new THREE.Mesh(
          leafGeom,
          new THREE.MeshStandardMaterial({ 
            color: i % 3 === 0 ? 0x2D5016 : 0x228B22, 
            roughness: 0.6,
            side: THREE.DoubleSide
          })
        );
        const angle = (Math.PI * 2 * i) / 15;
        const radius = 0.2 + (i % 3) * 0.1;
        leaf.position.set(
          Math.cos(angle) * radius,
          1.2 + Math.random() * 0.6,
          Math.sin(angle) * radius
        );
        leaf.rotation.set(
          Math.random() * 0.3,
          angle,
          Math.PI / 2.5 + Math.random() * 0.3
        );
        leaf.castShadow = true;
        plantGroup.add(leaf);
      }

      modelGroup.add(plantGroup);
    });

    // CEILING with details
    const ceilingGeom = new THREE.PlaneGeometry(18, 22, 64, 64);
    const ceiling = new THREE.Mesh(
      ceilingGeom,
      new THREE.MeshStandardMaterial({ 
        color: 0xFFFFF5, 
        roughness: 0.85,
        metalness: 0.05
      })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    ceiling.receiveShadow = true;
    modelGroup.add(ceiling);

    // Ceiling medallion around chandelier
    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.15, 64),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF, 
        roughness: 0.3,
        metalness: 0.1
      })
    );
    medallion.position.y = 7.92;
    medallion.receiveShadow = true;
    modelGroup.add(medallion);

    // Decorative ceiling patterns
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const pattern = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 3, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.5 })
      );
      pattern.position.set(
        Math.cos(angle) * 2.5,
        7.9,
        Math.sin(angle) * 2.5
      );
      pattern.rotation.y = -angle;
      modelGroup.add(pattern);
    }

    // WINDOW on side wall (optional architectural detail)
    [-8.7, 8.7].forEach((xPos, idx) => {
      const windowGroup = new THREE.Group();
      windowGroup.position.set(xPos, 4, 0);
      
      // Window frame
      const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3.5, 2.5),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 })
      );
      windowFrame.castShadow = true;
      windowGroup.add(windowFrame);
      
      // Window glass
      const windowGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3.2, 2.2),
        new THREE.MeshPhysicalMaterial({ 
          color: 0xE6F3FF, 
          transparent: true, 
          opacity: 0.4,
          roughness: 0.05,
          transmission: 0.7
        })
      );
      windowGroup.add(windowGlass);
      
      if (idx === 0) windowGroup.rotation.y = Math.PI / 2;
      else windowGroup.rotation.y = -Math.PI / 2;
      
      modelGroup.add(windowGroup);
    });

    // RUG in center
    const rugGeom = new THREE.PlaneGeometry(6, 10, 32, 32);
    const rug = new THREE.Mesh(
      rugGeom,
      new THREE.MeshStandardMaterial({ 
        color: 0x8B0000, 
        roughness: 0.9,
        metalness: 0.05
      })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 0.02;
    rug.receiveShadow = true;
    modelGroup.add(rug);

    // Rug border pattern
    const rugBorderMat = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700, 
      roughness: 0.8 
    });
    
    // Border lines
    for (let i = 0; i < 4; i++) {
      const isHorizontal = i % 2 === 0;
      const border = new THREE.Mesh(
        new THREE.PlaneGeometry(isHorizontal ? 6 : 0.3, isHorizontal ? 0.3 : 10),
        rugBorderMat
      );
      border.rotation.x = -Math.PI / 2;
      border.position.set(
        isHorizontal ? 0 : (i === 1 ? 2.85 : -2.85),
        0.03,
        isHorizontal ? (i === 0 ? 4.85 : -4.85) : 0
      );
      modelGroup.add(border);
    }

    // BASEBOARDS
    const baseboardMat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF, 
      roughness: 0.4 
    });
    
    // Back wall baseboard
    const backBaseboard = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.3, 0.2),
      baseboardMat
    );
    backBaseboard.position.set(0, 0.15, -10.8);
    modelGroup.add(backBaseboard);
    
    // Side baseboards
    [-9, 9].forEach((xPos) => {
      const baseboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.3, 22),
        baseboardMat
      );
      baseboard.position.set(xPos, 0.15, 0);
      modelGroup.add(baseboard);
    });

    // ADDITIONAL DECORATIVE ELEMENTS
    
    // Corner columns
    const columnPositions = [
      [-8.5, 0, -10.5], [8.5, 0, -10.5],
      [-8.5, 0, 10.5], [8.5, 0, 10.5]
    ];
    
    columnPositions.forEach(([x, y, z]) => {
      const columnGroup = new THREE.Group();
      columnGroup.position.set(x, y, z);
      
      // Column base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 0.5, 24),
        new THREE.MeshStandardMaterial({ color: 0xF5F5DC, roughness: 0.6 })
      );
      base.position.y = 0.25;
      base.castShadow = true;
      columnGroup.add(base);
      
      // Column shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 6.5, 24),
        new THREE.MeshStandardMaterial({ color: 0xFFFFF0, roughness: 0.7 })
      );
      shaft.position.y = 3.75;
      shaft.castShadow = true;
      columnGroup.add(shaft);
      
      // Column capital
      const capital = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.4, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0xF5F5DC, roughness: 0.5 })
      );
      capital.position.y = 7.3;
      capital.castShadow = true;
      columnGroup.add(capital);
      
      modelGroup.add(columnGroup);
    });

    // LIGHTING SETUP - Enhanced for better quality
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    mainLight.position.set(5, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.camera.left = -18;
    mainLight.shadow.camera.right = 18;
    mainLight.shadow.camera.top = 18;
    mainLight.shadow.camera.bottom = -18;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    // Chandelier main light
    const chandelierMainLight = new THREE.PointLight(0xFFF8DC, 2, 25);
    chandelierMainLight.position.set(0, 6.5, 0);
    chandelierMainLight.castShadow = true;
    chandelierMainLight.shadow.mapSize.width = 2048;
    chandelierMainLight.shadow.mapSize.height = 2048;
    scene.add(chandelierMainLight);

    // Fill lights for better illumination
    const fillLight1 = new THREE.DirectionalLight(0xFFE4B5, 0.4);
    fillLight1.position.set(-8, 6, -10);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xFFE4B5, 0.4);
    fillLight2.position.set(8, 6, 10);
    scene.add(fillLight2);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xB0C4DE, 0.3);
    rimLight.position.set(0, 8, 12);
    scene.add(rimLight);

    // Additional point lights for warmth
    const warmLight1 = new THREE.PointLight(0xFFE4B5, 0.6, 15);
    warmLight1.position.set(-5, 4, 5);
    scene.add(warmLight1);

    const warmLight2 = new THREE.PointLight(0xFFE4B5, 0.6, 15);
    warmLight2.position.set(5, 4, -5);
    scene.add(warmLight2);

    // Animation loop
    let lastTime = 0;
    const animate = (time) => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (time - lastTime > 1000 / 60) {
        modelGroup.rotation.y = THREE.MathUtils.degToRad(rotationRef.current);
        camera.position.z = cameraZRef.current;
        camera.position.y = cameraYRef.current;
        camera.lookAt(0, 2.5, 0);
        
        // Animate chandelier crystals (subtle swing)
        const t = time * 0.001;
        chandelierGroup.children.forEach((child, i) => {
          if (child.geometry && child.geometry.type === 'ConeGeometry') {
            child.rotation.z = Math.sin(t + i * 0.5) * 0.05;
          }
        });
        
        // Animate flames (flicker effect)
        chandelierGroup.children.forEach((child) => {
          if (child.type === 'Group') {
            child.children.forEach((subChild) => {
              if (subChild.material && subChild.material.emissive) {
                const flicker = 1 + Math.sin(t * 10 + Math.random()) * 0.1;
                subChild.material.emissiveIntensity = 2.5 * flicker;
              }
            });
          }
        });
        
        renderer.render(scene, camera);
        lastTime = time;
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    setCanvasReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Text overlay - top 50% initially */}
        <div 
          ref={textContainerRef}
          className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-gray-800/90"
          style={{ clipPath: 'inset(0 0 50% 0)' }}
        >
          <div className="max-w-5xl text-center text-white px-8">
            <h2 className="text-9xl font-bold mb-10 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200">
              Welcome to<br />Your Entry Hall
            </h2>
            <p className="text-3xl leading-relaxed opacity-90 mb-8 font-light">
              Step into elegance with soaring ceilings, intricate crown molding, and a magnificent crystal chandelier.
            </p>
            <p className="text-xl leading-relaxed opacity-75 mb-16 max-w-3xl mx-auto">
              Scroll to explore every detail of this grand entrance — from the polished marble floors to the ornate architectural details that define luxury.
            </p>
            <div className="flex items-center justify-center gap-4 text-lg opacity-60 animate-pulse">
              <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-white rounded-full animate-bounce"></div>
              </div>
              <span className="font-light tracking-wide">Scroll to begin your tour</span>
            </div>
          </div>
        </div>

        {/* 3D Canvas - bottom 50% initially */}
        <div className="absolute inset-0 z-10" style={{ clipPath: 'inset(50% 0 0 0)' }}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
            style={{ display: isCanvasReady ? 'block' : 'none' }}
          />
          {!isCanvasReady && (
            <div className="flex items-center justify-center h-full text-white text-xl">
              Loading luxury experience...
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default EntryHallSection;