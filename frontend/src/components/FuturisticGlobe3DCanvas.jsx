import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FuturisticGlobe3DCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const isMobileInit = container.clientWidth < 480;
    camera.position.set(0, 0, isMobileInit ? 9.6 : 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    // Master Group for 3D Drag & Parallax Rotation
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 2. Focused Dual Lighting Setup: Top Brand Orange, Bottom Vibrant Green
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Top Brand Orange Point Light
    const orangePointLight = new THREE.PointLight(0xea580c, 10, 30);
    orangePointLight.position.set(0, 3.5, 4);
    scene.add(orangePointLight);

    // Bottom Vibrant Green Point Light
    const greenPointLight = new THREE.PointLight(0x15803d, 10, 30);
    greenPointLight.position.set(0, -3.5, 4);
    scene.add(greenPointLight);

    // 3. Particle Texture - Deep solid disc with smooth edge (avoids milky/washed out overlap)
    const createParticleTexture = () => {
      const dotCanvas = document.createElement('canvas');
      dotCanvas.width = 64;
      dotCanvas.height = 64;
      const dotCtx = dotCanvas.getContext('2d');
      const gradient = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.50, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(0.80, 'rgba(255, 255, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      dotCtx.fillStyle = gradient;
      dotCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(dotCanvas);
    };

    const particleTexture = createParticleTexture();

    // 4. Sample PaulTech "P" Points (Sized down for elegant proportion & separated colors)
    let particleMesh = null;
    let particleGeometry = null;
    let particleCount = 0;
    let targets = [];
    let scatters = [];
    let phases = [];
    let colors = [];
    let currentPositions = null;

    const buildPointsFromCanvas = (canvasSource) => {
      const w = canvasSource.width;
      const h = canvasSource.height;
      const ctx = canvasSource.getContext('2d');
      const imgData = ctx.getImageData(0, 0, w, h);
      const pixels = imgData.data;

      const newTargets = [];
      const newScatters = [];
      const newPhases = [];
      const newColors = [];

      const step = Math.max(2, Math.floor(w / 110)); // Crisp high resolution

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const idx = (py * w + px) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          // Pure color validation:
          // Real logo pixels are distinctly Orange or Green (never near-white/grey compression noise)
          const isOrangeLogo = r > 130 && g < 175 && b < 105 && r > g + 20;
          const isGreenLogo = g > 70 && r < 125 && b < 125 && g > r + 15;

          if (a > 60 && (isOrangeLogo || isGreenLogo)) {
            // Reduced scale factor: 0.0135 (Reduced ~29% for compact, centered elegance)
            const tx = (px - w / 2) * 0.0135;
            const ty = -(py - h / 2) * 0.0135;
            const tz = (Math.random() - 0.5) * 0.35;

            newTargets.push(tx, ty, tz);

            // Explosive 3D scatter coordinates (Proportionately scaled)
            const angle = Math.random() * Math.PI * 2;
            const dist = 2.4 + Math.random() * 4.8;
            const elevation = (Math.random() - 0.5) * Math.PI;
            const sx = Math.cos(angle) * Math.cos(elevation) * dist;
            const sy = Math.sin(elevation) * dist;
            const sz = Math.sin(angle) * Math.cos(elevation) * dist;
            newScatters.push(sx, sy, sz);

            newPhases.push(Math.random() * Math.PI * 2);

            // Deep, rich, dark brand shades (never light/pale/milky):
            if (isOrangeLogo) {
              // Deep Dark Vibrant Brand Orange (rich dark orange, no pale yellow/sand tint)
              newColors.push(0.92, 0.22 + Math.random() * 0.04, 0.01);
            } else {
              // Deep Dark Vibrant Tech Green (rich dark emerald, no pale mint tint)
              newColors.push(0.04, 0.58 + Math.random() * 0.04, 0.10);
            }
          }
        }
      }

      if (newTargets.length === 0) return;

      targets = newTargets;
      scatters = newScatters;
      phases = newPhases;
      colors = newColors;
      particleCount = targets.length / 3;

      currentPositions = new Float32Array(targets.length);
      for (let i = 0; i < targets.length; i++) {
        currentPositions[i] = targets[i];
      }

      if (particleMesh) {
        sceneGroup.remove(particleMesh);
        particleGeometry.dispose();
      }

      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.115,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.98,
        depthWrite: false
      });

      particleMesh = new THREE.Points(particleGeometry, particleMaterial);
      sceneGroup.add(particleMesh);
    };



    // Draw procedural PaulTech stylized "P" immediately as baseline
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = 320;
    baseCanvas.height = 360;
    const baseCtx = baseCanvas.getContext('2d');
    baseCtx.fillStyle = '#ffffff';
    baseCtx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);

    const bW = baseCanvas.width;
    const bH = baseCanvas.height;

    // Top Orange Petal (Vibrant Brand Orange)
    baseCtx.fillStyle = '#ea580c';
    baseCtx.beginPath();
    baseCtx.moveTo(bW * 0.20, bH * 0.35);
    baseCtx.bezierCurveTo(bW * 0.20, bH * 0.10, bW * 0.44, bH * 0.05, bW * 0.70, bH * 0.05);
    baseCtx.bezierCurveTo(bW * 0.94, bH * 0.05, bW * 0.95, bH * 0.20, bW * 0.95, bH * 0.35);
    baseCtx.lineTo(bW * 0.20, bH * 0.35);
    baseCtx.closePath();
    baseCtx.fill();

    // Bottom Green Stem and Hook (Vibrant Tech Green)
    baseCtx.fillStyle = '#16a34a';


    baseCtx.beginPath();
    baseCtx.moveTo(bW * 0.20, bH * 0.43);
    baseCtx.lineTo(bW * 0.74, bH * 0.43);
    baseCtx.bezierCurveTo(bW * 0.96, bH * 0.43, bW * 0.96, bH * 0.67, bW * 0.74, bH * 0.70);
    baseCtx.lineTo(bW * 0.44, bH * 0.70);
    baseCtx.lineTo(bW * 0.44, bH * 0.95);
    baseCtx.lineTo(bW * 0.20, bH * 0.95);
    baseCtx.lineTo(bW * 0.20, bH * 0.43);
    baseCtx.closePath();
    baseCtx.fill();

    buildPointsFromCanvas(baseCanvas);

    // Next: Also load `/paultech-p.png` image to sample exact visual contours
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/paultech-p.png';
    logoImg.onload = () => {
      const imgCanvas = document.createElement('canvas');
      imgCanvas.width = 320;
      imgCanvas.height = 360;
      const imgCtx = imgCanvas.getContext('2d');
      imgCtx.fillStyle = '#ffffff';
      imgCtx.fillRect(0, 0, imgCanvas.width, imgCanvas.height);
      imgCtx.drawImage(logoImg, 40, 30, 240, 300);
      buildPointsFromCanvas(imgCanvas);
    };

    // 5. Holographic Ambient Quantum Dust (Subtle & Non-distracting)
    const dustCount = 30;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let d = 0; d < dustCount; d++) {
      dustPositions[d * 3] = (Math.random() - 0.5) * 10;
      dustPositions[d * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPositions[d * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35
    });
    const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    sceneGroup.add(dustMesh);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.clientX - halfX) * 0.0012;
      mouseY = (e.clientY - halfY) * 0.0012;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop: Snappy Assembly + 2-Second Hold + Burst Scatter
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (particleGeometry && particleCount > 0) {
        // Precise 5.4-second cycle:
        // - 0.0s to 0.8s: Snappy cubic assembly into "P"
        // - 0.8s to 3.2s: SOLID 2.4-SECOND HOLD in crisp "P" shape!
        // - 3.2s to 4.0s: Explosive 3D scatter burst
        // - 4.0s to 5.4s: Swirling orbit in space before next snap
        const cycleDuration = 5.4;
        const cycleTime = elapsed % cycleDuration;

        let smoothFactor = 0;

        if (cycleTime < 0.85) {
          // Snappy cubic ease-out assembly
          const t = cycleTime / 0.85;
          smoothFactor = 1 - Math.pow(1 - t, 3);
        } else if (cycleTime < 3.25) {
          // 2.4-Second Solid Hold: 100% assembled in PaulTech "P" logo
          smoothFactor = 1.0;
        } else if (cycleTime < 4.05) {
          // Explosive scatter burst
          const t = (cycleTime - 3.25) / 0.8;
          smoothFactor = 1.0 - t * t;
        } else {
          // Swirling dispersed particle field
          smoothFactor = 0.0;
        }

        const posAttr = particleGeometry.attributes.position;
        const posArray = posAttr.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const phase = phases[i];

          const tx = targets[i3];
          const ty = targets[i3 + 1];
          const tz = targets[i3 + 2];

          // Dynamic 3D scatter burst with orbital wave
          const sx = scatters[i3] + Math.sin(elapsed * 1.5 + phase) * 0.35;
          const sy = scatters[i3 + 1] + Math.cos(elapsed * 1.8 + phase) * 0.35;
          const sz = scatters[i3 + 2] + Math.sin(elapsed * 1.1 + phase) * 0.35;

          // Gentle holographic shimmer during the hold
          const levitateY = Math.sin(elapsed * 2.0 + tx * 3) * 0.035 * smoothFactor;
          const levitateZ = Math.cos(elapsed * 1.8 + ty * 3) * 0.02 * smoothFactor;

          posArray[i3] = sx + (tx - sx) * smoothFactor;
          posArray[i3 + 1] = sy + (ty - sy) * smoothFactor + levitateY;
          posArray[i3 + 2] = sz + (tz - sz) * smoothFactor + levitateZ;
        }

        posAttr.needsUpdate = true;
      }

      // Continuous 3D Holographic Orbit and Gentle Rotation
      sceneGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.20;
      sceneGroup.rotation.x = Math.cos(elapsed * 0.4) * 0.10;

      // Parallax Reaction to User's Cursor
      sceneGroup.rotation.y += (mouseX * 2.0 - sceneGroup.rotation.y) * 0.06;
      sceneGroup.rotation.x += (-mouseY * 2.0 - sceneGroup.rotation.x) * 0.06;

      dustMesh.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      const isMob = container.clientWidth < 480;
      camera.position.z = isMob ? 9.6 : 8.5;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (particleGeometry) particleGeometry.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[260px] sm:min-h-[420px] lg:min-h-[560px] relative flex items-center justify-center overflow-visible pointer-events-auto"
      />
    </div>
  );
};

export default FuturisticGlobe3DCanvas;
