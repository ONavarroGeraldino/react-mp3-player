import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function spherePositions(count, radius) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  return arr;
}

function torusPositions(count, R, r) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    arr[i * 3] = (R + r * Math.cos(phi)) * Math.cos(theta);
    arr[i * 3 + 1] = (R + r * Math.cos(phi)) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.sin(phi);
  }
  return arr;
}

function helixPositions(count) {
  const arr = new Float32Array(count * 3);
  const half = Math.floor(count / 2);
  for (let i = 0; i < half; i++) {
    const t = (i / half) * Math.PI * 6;
    const r = 1.2;
    arr[i * 3] = Math.cos(t) * r;
    arr[i * 3 + 1] = (i / half) * 4 - 2;
    arr[i * 3 + 2] = Math.sin(t) * r;
  }
  for (let i = half; i < count; i++) {
    const t = ((i - half) / (count - half)) * Math.PI * 6 + Math.PI;
    const r = 1.2;
    arr[i * 3] = Math.cos(t) * r;
    arr[i * 3 + 1] = ((i - half) / (count - half)) * 4 - 2;
    arr[i * 3 + 2] = Math.sin(t) * r;
  }
  return arr;
}

function vortexPositions(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 8;
    const r = 0.1 + (i / count) * 2.5;
    arr[i * 3] = Math.cos(t) * r;
    arr[i * 3 + 1] = Math.sin(t) * r;
    arr[i * 3 + 2] = (i / count) * 5 - 2.5;
  }
  return arr;
}

function wavePositions(count) {
  const arr = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const x = ((i % cols) / cols - 0.5) * 4;
    const z = (Math.floor(i / cols) / cols - 0.5) * 4;
    arr[i * 3] = x;
    arr[i * 3 + 1] = 0;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

function cubePositions(count) {
  const arr = new Float32Array(count * 3);
  const s = 1.5;
  for (let i = 0; i < count; i++) {
    const edge = Math.floor(Math.random() * 12);
    const t = Math.random() * 2 - 1;
    switch (edge) {
      case 0: arr[i * 3] = s; arr[i * 3 + 1] = s; arr[i * 3 + 2] = t * s; break;
      case 1: arr[i * 3] = -s; arr[i * 3 + 1] = s; arr[i * 3 + 2] = t * s; break;
      case 2: arr[i * 3] = s; arr[i * 3 + 1] = -s; arr[i * 3 + 2] = t * s; break;
      case 3: arr[i * 3] = -s; arr[i * 3 + 1] = -s; arr[i * 3 + 2] = t * s; break;
      case 4: arr[i * 3] = s; arr[i * 3 + 1] = t * s; arr[i * 3 + 2] = s; break;
      case 5: arr[i * 3] = -s; arr[i * 3 + 1] = t * s; arr[i * 3 + 2] = s; break;
      case 6: arr[i * 3] = s; arr[i * 3 + 1] = t * s; arr[i * 3 + 2] = -s; break;
      case 7: arr[i * 3] = -s; arr[i * 3 + 1] = t * s; arr[i * 3 + 2] = -s; break;
      case 8: arr[i * 3] = t * s; arr[i * 3 + 1] = s; arr[i * 3 + 2] = s; break;
      case 9: arr[i * 3] = t * s; arr[i * 3 + 1] = -s; arr[i * 3 + 2] = s; break;
      case 10: arr[i * 3] = t * s; arr[i * 3 + 1] = s; arr[i * 3 + 2] = -s; break;
      case 11: arr[i * 3] = t * s; arr[i * 3 + 1] = -s; arr[i * 3 + 2] = -s; break;
    }
  }
  return arr;
}

const ThreeBackground = ({ accentColor = '#ff2d95', size = 'large', shape = 0, onLoad }) => {
  const containerRef = useRef(null);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useEffect(() => {
    if (size === 'hidden') { onLoadRef.current?.(); return; }

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = size === 'small' ? 6 : 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pointCount = size === 'small' ? 1500 : 3000;
    let positions;

    switch (shape) {
      case 1: positions = torusPositions(pointCount, 1.8, 0.6); break;
      case 2: positions = helixPositions(pointCount); break;
      case 3: positions = vortexPositions(pointCount); break;
      case 4: positions = wavePositions(pointCount); break;
      case 5: positions = cubePositions(pointCount); break;
      default: positions = spherePositions(pointCount, 2.5); break;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const color = new THREE.Color(accentColor);
    const material = new THREE.PointsMaterial({
      size: size === 'small' ? 0.015 : 0.025,
      color,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    let animationId;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;

      switch (shape) {
        case 0: {
          mesh.scale.setScalar(1 + Math.sin(t * 1.2) * 0.15);
          mesh.rotation.y = t * 0.15;
          mesh.rotation.x = t * 0.06;
          break;
        }
        case 1: {
          mesh.rotation.y = t * 0.2;
          mesh.rotation.x = t * 0.12;
          mesh.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
          break;
        }
        case 2: {
          mesh.rotation.y = t * 0.2;
          mesh.position.y = Math.sin(t * 0.8) * 0.3;
          break;
        }
        case 3: {
          mesh.rotation.z = t * 0.5;
          mesh.scale.setScalar(1 + Math.sin(t * 0.6) * 0.1);
          break;
        }
        case 4: {
          mesh.rotation.y = t * 0.08;
          mesh.rotation.x = 0.4;
          const waveGeo = mesh.geometry;
          const posAttr = waveGeo.getAttribute('position');
          if (posAttr) {
            for (let i = 0; i < posAttr.count; i++) {
              const x = posAttr.getX(i);
              const z = posAttr.getZ(i);
              posAttr.setY(i, Math.sin(x * 1.5 + t * 2) * Math.cos(z * 1.5 + t * 1.5) * 0.6);
            }
            posAttr.needsUpdate = true;
          }
          break;
        }
        case 5: {
          mesh.rotation.y = t * 0.2;
          mesh.rotation.x = t * 0.12;
          mesh.rotation.z = t * 0.08;
          break;
        }
      }

      renderer.render(scene, camera);
    };
    animate();
    onLoadRef.current?.();

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
  }, [accentColor, size, shape]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500" />;
};

export default ThreeBackground;
