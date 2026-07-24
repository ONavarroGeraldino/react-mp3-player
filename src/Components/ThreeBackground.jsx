import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = ({ style = 0, accentColor = '#ff2d95', size = 'large' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (size === 'hidden') return;

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = size === 'small' ? 5 : 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pointCount = size === 'small' ? 1500 : 3000;
    const radius = size === 'small' ? 1.2 : 2.5;
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const color = new THREE.Color(accentColor);
    const material = new THREE.PointsMaterial({
      size: size === 'small' ? 0.015 : 0.02,
      color: color,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });

    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    let animationId;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) / 1000;

      const scale = 1 + Math.sin(time * 1.2) * 0.15;
      sphere.scale.setScalar(scale);

      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [accentColor, size]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500" />;
};

export default ThreeBackground;
