import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelTransitionProps {
  onTransitionComplete?: () => void;
  autoTransition?: boolean;
  transitionDelay?: number;
}

export const ModelTransition: React.FC<ModelTransitionProps> = ({
  onTransitionComplete,
  autoTransition = true,
  transitionDelay = 5000
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const model1Ref = useRef<THREE.Group | null>(null);
  const model2Ref = useRef<THREE.Group | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Shader para efecto de rayos X
  const xrayShader = {
    vertex: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTransition;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Efecto de rayos X: mostrar wireframe y brillo interno
        float edge = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float wireframe = step(0.95, edge);
        
        // Gradiente de transición
        vec3 xrayColor = mix(
          vec3(0.1, 0.5, 1.0),  // Azul para rayos X
          vec3(1.0, 1.0, 1.0),  // Blanco brillante
          uTransition
        );
        
        // Combinar wireframe con color de transición
        vec3 finalColor = mix(xrayColor * 0.3, xrayColor, wireframe);
        
        // Aumentar brillo durante la transición
        float brightness = 0.5 + uTransition * 0.5;
        finalColor *= brightness;
        
        gl_FragColor = vec4(finalColor, 0.8 + uTransition * 0.2);
      }
    `
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070a');
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 8, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luces
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 2.0);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight('#0055ff', 3, 20);
    blueLight.position.set(-5, 5, -5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight('#00ffcc', 2.5, 20);
    cyanLight.position.set(5, -5, 5);
    scene.add(cyanLight);

    // Partículas
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: '#00ffcc',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Cargar modelos
    const loader = new GLTFLoader();
    let modelsLoaded = 0;

    const loadModel = (url: string, callback: (model: THREE.Group) => void) => {
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 8 / maxDim;

          model.scale.set(scale, scale, scale);
          model.position.sub(center.multiplyScalar(scale));

          model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.needsUpdate = true;
              }
            }
          });

          callback(model);
          modelsLoaded++;
        },
        undefined,
        (error) => {
          console.warn('Error loading model:', error);
        }
      );
    };

    // Cargar modelo 1 (exterior completo)
    loadModel('./machine_model.glb', (model) => {
      model1Ref.current = model;
      scene.add(model);
    });

    // Cargar modelo 2 (interior con rayos X)
    loadModel('./interior_model.glb', (model) => {
      model2Ref.current = model;
      model.visible = false;
      scene.add(model);
    });

    // Función para aplicar efecto de rayos X
    const applyXrayEffect = (model: THREE.Group, intensity: number) => {
      model.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as any;
          
          // Crear material con efecto de rayos X
          const xrayMaterial = new THREE.ShaderMaterial({
            uniforms: {
              uTransition: { value: intensity },
              uOriginalColor: { value: new THREE.Color(material.color || '#ffffff') }
            },
            vertexShader: xrayShader.vertex,
            fragmentShader: xrayShader.fragment,
            transparent: true,
            wireframe: intensity > 0.3
          });

          child.material = xrayMaterial;
        }
      });
    };

    // Animación
    let animationFrameId: number;
    let transitionStartTime = 0;
    const transitionDuration = 2000; // 2 segundos

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      if (isTransitioning && model1Ref.current && model2Ref.current) {
        const elapsed = Date.now() - transitionStartTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        setTransitionProgress(progress);

        // Fade out modelo 1, fade in modelo 2
        model1Ref.current.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 1 - progress;
          }
        });

        model2Ref.current.visible = true;
        applyXrayEffect(model2Ref.current, progress);

        if (progress === 1) {
          setIsTransitioning(false);
          model1Ref.current.visible = false;
          if (onTransitionComplete) onTransitionComplete();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Auto-transición
    if (autoTransition) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        transitionStartTime = Date.now();
      }, transitionDelay);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(animationFrameId);
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoTransition, transitionDelay, onTransitionComplete, isTransitioning]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default ModelTransition;
