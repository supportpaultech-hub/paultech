import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrendingUp, Sparkles, Activity, ShieldCheck, Cpu } from 'lucide-react';

const AboutTechCoreCanvas = () => {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Master Group for 3D Interaction
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 2. Cinematic Multi-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Warm Brand Orange Key Light
    const orangeKeyLight = new THREE.PointLight(0xf97316, 12, 25);
    orangeKeyLight.position.set(4.5, 3.5, 4.5);
    scene.add(orangeKeyLight);

    // Tech Emerald Fill Light
    const emeraldFillLight = new THREE.PointLight(0x10b981, 10, 25);
    emeraldFillLight.position.set(-4.5, -3.5, 4);
    scene.add(emeraldFillLight);

    // Electric Cyan Rim Light
    const cyanRimLight = new THREE.PointLight(0x38bdf8, 8, 20);
    cyanRimLight.position.set(0, 4.5, -4);
    scene.add(cyanRimLight);

    // 3. Dot Texture for Laser Nodes & Particles
    const createGlowDotTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.25, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.55, 'rgba(56,189,248,0.5)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const glowDotTexture = createGlowDotTexture();

    // 4. Central Cyber Core: Faceted Geodesic Sphere with Glowing Vertex Plexus
    // A. Inner Plasma Core
    const plasmaGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.9
    });
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    coreGroup.add(plasmaMesh);

    // B. Faceted Geodesic Glass/Wireframe Shell
    const icosahedronGeo = new THREE.IcosahedronGeometry(1.28, 2);
    const wireframeEdges = new THREE.EdgesGeometry(icosahedronGeo);
    const wireframeLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
      linewidth: 1
    });
    const wireframeLines = new THREE.LineSegments(wireframeEdges, wireframeLineMat);
    coreGroup.add(wireframeLines);

    // C. Glowing Plexus Vertex Nodes
    const vertexPointsMat = new THREE.PointsMaterial({
      size: 0.09,
      map: glowDotTexture,
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const vertexNodes = new THREE.Points(icosahedronGeo, vertexPointsMat);
    coreGroup.add(vertexNodes);

    // 5. Razor-Thin Laser Concentric Orbital Rings with Traveling Data Satellites
    const createOrbitalRing = (radius, colorHex, emissiveHex, tubeThick = 0.012) => {
      const ringGroup = new THREE.Group();

      // Hairline Torus Ring
      const ringGeo = new THREE.TorusGeometry(radius, tubeThick, 16, 120);
      const ringMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.95
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringGroup.add(ringMesh);

      // Data Satellite Packet (Glowing dot on the orbital path)
      const satGeo = new THREE.SphereGeometry(0.055, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      ringGroup.add(satMesh);

      return { group: ringGroup, radius, satMesh };
    };

    // Ring 1: Cyan / DevOps Infrastructure (Radius 2.25)
    const ring1 = createOrbitalRing(2.25, 0x06b6d4, 0x0891b2, 0.014);
    coreGroup.add(ring1.group);

    // Ring 2: Brand Orange / Enterprise ERP (Radius 1.82)
    const ring2 = createOrbitalRing(1.82, 0xf97316, 0xc2410c, 0.016);
    ring2.group.rotation.x = Math.PI / 3;
    coreGroup.add(ring2.group);

    // Ring 3: Tech Emerald / AI Automation (Radius 1.48)
    const ring3 = createOrbitalRing(1.48, 0x10b981, 0x059669, 0.014);
    ring3.group.rotation.y = Math.PI / 3.5;
    coreGroup.add(ring3.group);

    // 6. Ambient Quantum Particle Stars
    const particleCount = 160;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const pRand = Math.random();
      if (pRand < 0.35) {
        // Warm Orange
        particleColors[i * 3] = 0.98;
        particleColors[i * 3 + 1] = 0.55;
        particleColors[i * 3 + 2] = 0.15;
      } else if (pRand < 0.70) {
        // Emerald
        particleColors[i * 3] = 0.12;
        particleColors[i * 3 + 1] = 0.85;
        particleColors[i * 3 + 2] = 0.55;
      } else {
        // Cyan / Sky
        particleColors[i * 3] = 0.25;
        particleColors[i * 3 + 1] = 0.75;
        particleColors[i * 3 + 2] = 0.98;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      map: glowDotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starParticles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(starParticles);

    // 7. Interactive Mouse Tracking & Drag Rotations
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = nx * 0.45;
      mouseY = ny * 0.45;

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        targetRotY += dx * 0.009;
        targetRotX += dy * 0.009;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gyroscope Ring Rotations
      ring1.group.rotation.x = elapsed * 0.38;
      ring1.group.rotation.y = elapsed * 0.28;
      // Ring 1 Satellite Position
      const sAngle1 = elapsed * 1.6;
      ring1.satMesh.position.set(Math.cos(sAngle1) * ring1.radius, Math.sin(sAngle1) * ring1.radius, 0);

      ring2.group.rotation.y = -elapsed * 0.44;
      ring2.group.rotation.z = elapsed * 0.32;
      // Ring 2 Satellite Position
      const sAngle2 = -elapsed * 1.8;
      ring2.satMesh.position.set(Math.cos(sAngle2) * ring2.radius, Math.sin(sAngle2) * ring2.radius, 0);

      ring3.group.rotation.x = -elapsed * 0.28;
      ring3.group.rotation.z = -elapsed * 0.48;
      // Ring 3 Satellite Position
      const sAngle3 = elapsed * 2.1;
      ring3.satMesh.position.set(Math.cos(sAngle3) * ring3.radius, Math.sin(sAngle3) * ring3.radius, 0);

      // Central Plasma Core Subtle Breathing Pulse
      const corePulse = 1.0 + Math.sin(elapsed * 2.2) * 0.04;
      plasmaMesh.scale.set(corePulse, corePulse, corePulse);
      plasmaMesh.rotation.y = elapsed * 0.6;
      plasmaMesh.rotation.x = elapsed * 0.3;

      // Geodesic Wireframe & Vertex Plexus Rotation
      wireframeLines.rotation.y = -elapsed * 0.35;
      wireframeLines.rotation.x = elapsed * 0.2;
      vertexNodes.rotation.y = -elapsed * 0.35;
      vertexNodes.rotation.x = elapsed * 0.2;

      // Celestial Quantum Dust Drift
      starParticles.rotation.y = elapsed * 0.1;

      // Smooth Intertia Mouse Reaction
      targetRotY += (mouseX - targetRotY) * 0.05;
      targetRotX += (-mouseY - targetRotX) * 0.05;

      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.08;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      plasmaGeo.dispose();
      plasmaMat.dispose();
      icosahedronGeo.dispose();
      wireframeEdges.dispose();
      wireframeLineMat.dispose();
      vertexPointsMat.dispose();
      glowDotTexture.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="w-full relative rounded-3xl bg-[#070B14] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden select-none group">
      
      {/* Subtle Ambient Studio Light Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Modern Dot Matrix Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className={`w-full h-[380px] sm:h-[440px] lg:h-[480px] relative cursor-grab ${isInteracting ? 'cursor-grabbing' : ''}`}
      />

      {/* Top HUD Telemetry Header */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Core System Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
            PAULTECH CORE // ARCHITECTURE V2
          </span>
        </div>

        {/* Live Reliability Metric */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] sm:text-[11px] font-mono text-cyan-400 backdrop-blur-md">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>99.98% UPTIME</span>
        </div>
      </div>

      {/* Sleek Glass Telemetry Pill 1: Cloud & DevOps (Left Edge) */}
      <div className="absolute top-1/3 left-4 sm:left-6 z-20 pointer-events-none hidden sm:block">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[11px] font-medium text-slate-200">Cloud & Kubernetes</span>
        </div>
      </div>

      {/* Sleek Glass Telemetry Pill 2: AI & Microservices (Right Edge) */}
      <div className="absolute top-1/3 right-4 sm:right-6 z-20 pointer-events-none hidden sm:block">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-orange-500/30 backdrop-blur-md shadow-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-[11px] font-medium text-slate-200">Enterprise ERP & AI</span>
        </div>
      </div>

      {/* Bottom Floating Metric: Growth Rate +125% YOY */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20">
        <div className="bg-slate-900/95 border border-slate-700/90 py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>Growth Rate</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            </p>
            <p className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              +125% <span className="text-xs font-semibold text-emerald-400">YOY</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint (Bottom-Right) */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400/90 bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-full backdrop-blur-md">
          INTERACTIVE 3D ✦ DRAG TO ROTATE
        </span>
      </div>

    </div>
  );
};

export default AboutTechCoreCanvas;
