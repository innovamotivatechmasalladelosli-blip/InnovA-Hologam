import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers, ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

// ==========================================
// DATOS TÉCNICOS COMPLETOS Y DETALLADOS - INNOVA+
// ==========================================
const KEY_ELEMENTS = [
  { 
    id: 'holograma', 
    title: 'Holograma Volumétrico', 
    icon: Radio, 
    color: '#00ffcc',
    pos: [0, 2.5, 0],
    desc: 'Núcleo del sistema que utiliza interferencia acústica para atrapar y proyectar partículas de aerosol en el espacio 3D, creando imágenes holográficas tangibles sin necesidad de gafas especiales.',
    stats: { 'Frecuencia': '40 kHz', 'Resolución': '< 1 mm' },
    fullSpecs: {
      'Tecnología Base': 'Red de interferencia acústica volumétrica',
      'Frecuencia Ultrasónica': '40 kHz ± 2 kHz',
      'Resolución Espacial': 'Sub-milimétrica (< 1 mm)',
      'Tamaño Máximo de Proyección': '30 cm³',
      'Tasa de Refresco': '120 Hz (> 60 fps para visión fluida)',
      'Matriz de Transductores': 'Arreglo acústico de precisión (64 transductores)',
      'Persistencia Retiniana': 'Sincronizada con láser RGB para fusión visual',
      'Campo de Visión': '360° en plano horizontal, 180° vertical'
    },
    materiales: {
      'Transductores': 'Cerámica piezoeléctrica PZT-8 (piezo-cerámica de alta potencia)',
      'Carcasa Acústica': 'Aluminio anodizado 6061-T6 (aislamiento acústico)',
      'Aislamiento': 'Espuma de poliuretano de celda abierta (absorción acústica)',
      'Conectores': 'Cobre bañado en oro (conductividad óptima)',
      'Cables': 'Cobre multifilar apantallado (impedancia 50Ω)'
    },
    latencias: {
      'Latencia de Procesamiento': '< 2 ms',
      'Latencia de Actualización': '< 8.33 ms (120 Hz)',
      'Latencia de Respuesta Acústica': '< 1 ms',
      'Tiempo de Sincronización Láser': '< 0.5 ms'
    },
    consumoEnergetico: {
      'Potencia Nominal': '25W',
      'Potencia Pico': '40W',
      'Voltaje de Operación': '12V DC',
      'Corriente Nominal': '2.1A',
      'Corriente Pico': '3.3A'
    },
    sensores: [
      'Sensor de posición de partículas (triangulación acústica)',
      'Detector de interferencia acústica en tiempo real',
      'Sensor de intensidad de proyección láser',
      'Micrófono de retroalimentación acústica',
      'Sensor de presión acústica'
    ],
    aplicaciones: [
      'Educación y museos (visualización de modelos 3D)',
      'Presentaciones corporativas interactivas',
      'Entretenimiento y arte digital',
      'Investigación científica y visualización de datos',
      'Diagnóstico médico (visualización de imágenes)',
      'Interfaces futuristas'
    ]
  },
  { 
    id: 'laser', 
    title: 'Matriz Láser RGB', 
    icon: Zap, 
    color: '#ff0055',
    pos: [0, 4.2, 0],
    desc: 'Sistema de iluminación de precisión con tres diodos láser independientes que proyectan luz sobre las partículas acústicamente atrapadas, generando colores a velocidad superior a la persistencia retiniana.',
    stats: { 'Potencia Total': '200 mW', 'Velocidad de Barrido': '120 kHz' },
    fullSpecs: {
      'Diodo Láser Rojo': '50 mW @ 650 nm (espectro rojo visible)',
      'Diodo Láser Verde': '100 mW @ 532 nm (espectro verde visible)',
      'Diodo Láser Azul': '50 mW @ 405 nm (espectro azul visible)',
      'Potencia Total Combinada': '200 mW',
      'Velocidad de Barrido': '120 kHz (120,000 puntos/segundo)',
      'Precisión de Posicionamiento': '± 0.1 mm',
      'Colores Disponibles': '16.7 millones (RGB 8-bit)',
      'Tiempo de Respuesta': '< 1 μs por cambio de color',
      'Consumo de Energía': '12V, 5A máximo',
      'Óptica de Enfoque': 'Lentes asféricas de precisión',
      'Estabilidad Térmica': '± 0.5°C para mantener alineación'
    },
    materiales: {
      'Diodos Láser': 'Semiconductores GaAs (Arseniuro de Galio)',
      'Lentes': 'Vidrio óptico BK7 (transmisión > 99%)',
      'Espejos Dicroicos': 'Recubrimiento multicapa de dieléctrico',
      'Disipador Térmico': 'Cobre con revestimiento de níquel',
      'Carcasa': 'Aluminio de grado aeronáutico'
    },
    latencias: {
      'Latencia de Encendido': '< 50 ns',
      'Latencia de Apagado': '< 50 ns',
      'Latencia de Cambio de Color': '< 1 μs',
      'Latencia de Posicionamiento': '< 10 μs',
      'Estabilidad de Frecuencia': '±1 ppm'
    },
    consumoEnergetico: {
      'Potencia Rojo': '50W (máximo)',
      'Potencia Verde': '100W (máximo)',
      'Potencia Azul': '50W (máximo)',
      'Potencia Total': '200W (máximo)',
      'Voltaje de Operación': '12V DC',
      'Corriente Nominal': '5A'
    },
    sensores: [
      'Sensor de intensidad láser (fotodiodo)',
      'Fotodiodo de retroalimentación para cada color',
      'Detector de alineación láser',
      'Sensor de temperatura de diodos',
      'Monitor de corriente de cada láser',
      'Detector de potencia óptica'
    ],
    aplicaciones: [
      'Proyecciones de alta definición y color',
      'Arte interactivo e instalaciones',
      'Visualización médica de alta precisión',
      'Diseño industrial y prototipado',
      'Entretenimiento y eventos',
      'Publicidad y marketing interactivo'
    ]
  },
  { 
    id: 'aerosol', 
    title: 'Nebulizador Ultrasónico', 
    icon: Droplets, 
    color: '#00bbff',
    pos: [-2.5, -1.5, 0],
    desc: 'Genera micropartículas de aerosol mediante vibración ultrasónica a 1.7 MHz, creando una bruma casi invisible que actúa como lienzo físico para la proyección holográfica.',
    stats: { 'Frecuencia': '1.7 MHz', 'Tasa de Generación': '150 ml/h' },
    fullSpecs: {
      'Frecuencia Ultrasónica': '1.7 MHz ± 50 kHz',
      'Tamaño de Partícula Generada': '2-5 μm (óptimo para visibilidad)',
      'Tasa de Generación': '150 ml/h',
      'Tipo de Fluido': 'Agua destilada o solución salina estéril',
      'Capacidad del Depósito': '500 ml',
      'Tiempo de Operación Continua': '3-4 horas',
      'Consumo de Energía': '5V, 2A',
      'Material del Transductor': 'Cerámica piezoeléctrica de precisión',
      'Eficiencia de Nebulización': '> 90%',
      'Temperatura de Operación': '15-35°C',
      'Presión Acústica': '1-2 bar en la cámara de nebulización'
    },
    materiales: {
      'Transductor': 'Cerámica piezoeléctrica PZT-5H',
      'Cámara de Nebulización': 'Polipropileno médico (PP)',
      'Boquilla': 'Acero inoxidable 316L (resistencia a corrosión)',
      'Depósito': 'Polimetilmetacrilato (PMMA) transparente',
      'Sellos': 'Silicona de grado médico (biocompatible)'
    },
    latencias: {
      'Latencia de Inicio': '< 500 ms',
      'Latencia de Estabilización': '< 2 segundos',
      'Latencia de Parada': '< 1 segundo',
      'Tiempo de Respuesta a Cambios': '< 100 ms',
      'Estabilidad de Frecuencia': '±0.1%'
    },
    consumoEnergetico: {
      'Potencia Nominal': '10W',
      'Potencia Pico': '15W',
      'Voltaje de Operación': '5V DC',
      'Corriente Nominal': '2A',
      'Corriente Pico': '3A'
    },
    sensores: [
      'Sensor de nivel de agua (capacitivo)',
      'Sensor de temperatura del depósito',
      'Detector de flujo de aerosol',
      'Sensor de presión en cámara de nebulización',
      'Detector de obstrucción de boquilla',
      'Sensor de humedad relativa'
    ],
    aplicaciones: [
      'Sistemas de visualización holográfica',
      'Investigación atmosférica y meteorológica',
      'Efectos especiales en cine y televisión',
      'Diagnóstico médico (inhalación de medicinas)',
      'Humidificación de ambientes controlados',
      'Investigación de propagación de partículas'
    ]
  },
  { 
    id: 'procesador', 
    title: 'Procesador DSP (IA)', 
    icon: Cpu, 
    color: '#aa00ff',
    pos: [0, -2.5, 0],
    desc: 'Cerebro del sistema que ejecuta millones de ecuaciones de onda por segundo, controlando campos acústicos en tiempo real y compensando corrientes de aire mediante algoritmos de IA.',
    stats: { 'Poder de Cómputo': '4.5 TFLOPS', 'Latencia': '< 2 ms' },
    fullSpecs: {
      'Procesador Principal': 'ARM Cortex-A72 @ 2.4 GHz',
      'Poder de Cómputo': '4.5 TFLOPS (operaciones de punto flotante/segundo)',
      'Memoria RAM': '8 GB LPDDR4 (ancho de banda 51.2 GB/s)',
      'Almacenamiento': '64 GB eMMC (velocidad 200 MB/s)',
      'Latencia de Procesamiento': '< 2 ms (tiempo real)',
      'Coprocessador DSP': 'Unidad especializada para procesamiento de señales',
      'Acelerador de IA': 'TPU integrada para machine learning',
      'Algoritmos': 'Predicción de flujo de aire, compensación acústica, control adaptativo',
      'Interfaz de Red': 'Ethernet Gigabit, USB 3.0 Type-C, SPI, I2C, UART',
      'Sistema Operativo': 'Linux embebido con kernel en tiempo real (PREEMPT_RT)',
      'Consumo de Energía': '15W en operación normal, 5W en standby'
    },
    materiales: {
      'Procesador': 'Silicio de grado industrial (proceso 28nm)',
      'Disipador Térmico': 'Cobre puro (conductividad térmica 400 W/mK)',
      'Pasta Térmica': 'Compuesto de óxido de zinc (conductividad 3-5 W/mK)',
      'PCB': 'FR-4 de 10 capas (impedancia controlada)',
      'Capacitores': 'Cerámica de alto voltaje (X7R, 100V)'
    },
    latencias: {
      'Latencia de Inicio': '< 5 segundos',
      'Latencia de Procesamiento': '< 2 ms',
      'Latencia de I/O': '< 1 ms',
      'Latencia de Interrupción': '< 100 μs',
      'Tiempo de Contexto': '< 50 μs'
    },
    consumoEnergetico: {
      'Potencia Nominal': '15W',
      'Potencia Pico': '25W',
      'Voltaje de Operación': '3.3V DC',
      'Corriente Nominal': '4.5A',
      'Corriente Pico': '7.5A'
    },
    sensores: [
      'Sensor de temperatura del procesador',
      'Monitor de voltaje de alimentación',
      'Detector de carga térmica',
      'Sensor de frecuencia de reloj',
      'Monitor de consumo de energía en tiempo real',
      'Detector de errores de memoria'
    ],
    aplicaciones: [
      'Procesamiento en tiempo real de señales acústicas',
      'Análisis de datos y machine learning',
      'Control inteligente y adaptativo del sistema',
      'Predicción y compensación de perturbaciones',
      'Interfaz de usuario avanzada'
    ]
  }
];

const ExpandableSection = ({ title, items, color }: { title: string, items: any, color: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4 border-b border-white/5 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] group-hover:text-neutral-300 transition-colors">
          {title}
        </h3>
        <ChevronDown size={14} className={`text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-4 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {Array.isArray(items) ? (
            <ul className="space-y-2">
              {items.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-neutral-400">
                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }}></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            Object.entries(items).map(([key, value]: [string, any]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[9px] text-neutral-600 uppercase font-bold mb-1">{key}</span>
                <span className="text-xs text-neutral-300 font-medium">{value}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>({});
  const [activeElement, setActiveElement] = useState(KEY_ELEMENTS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const showAnnotationsRef = useRef(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const model2Ref = useRef<THREE.Group | null>(null);
  const transitionStartTimeRef = useRef(0);

  useEffect(() => {
    showAnnotationsRef.current = showAnnotations;
  }, [showAnnotations]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070a');
    scene.fog = new THREE.FogExp2('#05070a', 0.05);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(12, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 30;

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

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
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

    const loader = new GLTFLoader();
    const modelUrl = './machine_model.glb';
    
    const createFallbackModel = () => {
        const group = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(3, 3, 1, 32);
        const baseMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.2, metalness: 0.8 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -3;
        base.receiveShadow = true;
        group.add(base);

        const glassGeo = new THREE.CylinderGeometry(2.8, 2.8, 7, 32);
        const glassMat = new THREE.MeshPhysicalMaterial({ 
            color: '#ffffff', transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.y = 1;
        group.add(glass);

        const topGeo = new THREE.TorusGeometry(2.8, 0.2, 16, 100);
        const topMat = new THREE.MeshStandardMaterial({ color: '#0055ff', emissive: '#001144', metalness: 1 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 4.5;
        top.rotation.x = Math.PI / 2;
        group.add(top);

        scene.add(group);
        engineRef.current.gltfModel = group;
        setIsLoaded(true);
    };

    // Función para cargar y preparar un modelo
    const loadAndPrepareModel = (url: string, callback: (model: THREE.Group) => void) => {
        loader.load(
            url,
            (gltf: any) => {
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
                            if (child.material.map) child.material.map.needsUpdate = true;
                        }
                    }
                });

                callback(model);
            },
            undefined,
            (error: any) => {
                console.warn("Error cargando modelo:", error);
            }
        );
    };

    // Cargar modelo 1 (exterior completo)
    loadAndPrepareModel(modelUrl, (model) => {
        scene.add(model);
        engineRef.current.gltfModel = model;
        setIsLoaded(true);
    });

    // Cargar modelo 2 (interior con rayos X)
    loadAndPrepareModel('./interior_model.glb', (model) => {
        model.visible = false;
        scene.add(model);
        model2Ref.current = model;
    });

    engineRef.current = { scene, camera, controls, renderer };

    // Función para aplicar efecto de rayos X
    const applyXrayEffect = (model: THREE.Group, intensity: number) => {
        model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                const material = child.material as any;
                
                // Crear o actualizar material con efecto de rayos X
                if (!child.userData.originalMaterial) {
                    child.userData.originalMaterial = material.clone();
                }
                
                const xrayMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        uTransition: { value: intensity }
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

    let animationFrameId: number;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        controls.update();
        
        // Manejar transición de modelos
        if (isTransitioning && engineRef.current.gltfModel && model2Ref.current) {
            const elapsed = Date.now() - transitionStartTimeRef.current;
            const transitionDuration = 2000; // 2 segundos
            const progress = Math.min(elapsed / transitionDuration, 1);
            setTransitionProgress(progress);

            // Fade out modelo 1, fade in modelo 2
            engineRef.current.gltfModel.traverse((child: any) => {
                if (child instanceof THREE.Mesh && child.material.opacity !== undefined) {
                    child.material.opacity = 1 - progress;
                }
            });

            model2Ref.current.visible = true;
            applyXrayEffect(model2Ref.current, progress);

            if (progress === 1) {
                setIsTransitioning(false);
                engineRef.current.gltfModel.visible = false;
            }
        }
        
        if (showAnnotationsRef.current) {
            KEY_ELEMENTS.forEach((element) => {
                const vec = new THREE.Vector3(element.pos[0], element.pos[1], element.pos[2]);
                vec.project(camera);
                const x = (vec.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
                const y = (vec.y * -0.5 + 0.5) * renderer.domElement.clientHeight;
                const domElement = document.getElementById(`annotation-${element.id}`);
                if (domElement) {
                    if (vec.z > 1) {
                        domElement.style.opacity = '0';
                        domElement.style.pointerEvents = 'none';
                    } else {
                        domElement.style.opacity = '1';
                        domElement.style.pointerEvents = 'auto';
                        domElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    }
                }
            });
        } else {
            KEY_ELEMENTS.forEach((element) => {
                const domElement = document.getElementById(`annotation-${element.id}`);
                if (domElement) {
                    domElement.style.opacity = '0';
                    domElement.style.pointerEvents = 'none';
                }
            });
        }
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

  const ActiveIcon = activeElement.icon;

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans text-neutral-200 select-none flex flex-col md:flex-row">
      
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1a2535] border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-widest text-white">INICIALIZANDO MOTOR 3D</h2>
          <p className="text-[#00bbff] text-sm mt-2 font-mono uppercase">Cargando Modelo y Shaders...</p>
          {loadingError && <p className="text-red-400 mt-4 text-xs max-w-sm text-center">Aviso: Error al cargar el modelo. Usando respaldo procedimental.</p>}
        </div>
      )}

      <div className="md:hidden absolute top-0 left-0 w-full p-5 flex justify-between items-center z-40 pointer-events-none">
        <h1 className="text-2xl font-black text-white tracking-widest drop-shadow-lg">InnovA<span className="text-[#0055ff]">+</span></h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="pointer-events-auto p-2 bg-[#0a101a]/80 backdrop-blur border border-white/10 rounded-lg text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`
        fixed md:relative top-0 right-0 md:left-0 w-full md:w-[520px] h-[75vh] md:h-full mt-[25vh] md:mt-0
        bg-gradient-to-b from-[#0a101a]/95 to-[#020305]/95 backdrop-blur-2xl border-l md:border-l-0 md:border-r border-[#1a2535] 
        z-30 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="hidden md:flex p-8 items-center justify-between border-b border-white/5">
          <h1 className="text-3xl font-black text-white tracking-tighter">InnovA<span className="text-[#0055ff]">+</span></h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse"></div>
            <span className="text-[10px] font-bold text-[#00ffcc] uppercase tracking-widest">Sistema Activo</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <ActiveIcon size={24} style={{ color: activeElement.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{activeElement.title}</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Componente Crítico</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              {activeElement.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(activeElement.stats).map(([key, value]) => (
                <div key={key} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                  <span className="block text-[9px] text-neutral-500 uppercase font-bold mb-1">{key}</span>
                  <span className="text-sm font-mono text-white font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <ExpandableSection 
            title="📊 Especificaciones Técnicas"
            items={activeElement.fullSpecs}
            color={activeElement.color}
          />

          <ExpandableSection 
            title="🔧 Materiales de Construcción"
            items={activeElement.materiales}
            color={activeElement.color}
          />

          <ExpandableSection 
            title="⚡ Latencias y Tiempos de Respuesta"
            items={activeElement.latencias}
            color={activeElement.color}
          />

          <ExpandableSection 
            title="🔋 Consumo Energético"
            items={activeElement.consumoEnergetico}
            color={activeElement.color}
          />

          <ExpandableSection 
            title="🔍 Sensores Integrados"
            items={activeElement.sensores}
            color={activeElement.color}
          />

          <ExpandableSection 
            title="🎯 Aplicaciones"
            items={activeElement.aplicaciones}
            color={activeElement.color}
          />

          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} /> Componentes del Sistema
            </h3>
            <div className="flex flex-col gap-2">
              {KEY_ELEMENTS.map((el) => {
                const ElementIcon = el.icon;
                return (
                  <button
                    key={el.id}
                    onClick={() => { setActiveElement(el); setIsMobileMenuOpen(false); }}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                      ${activeElement.id === el.id 
                        ? 'bg-white/10 border-white/20 shadow-lg translate-x-1' 
                        : 'bg-transparent border-transparent hover:bg-white/5 text-neutral-500 hover:text-neutral-300'}
                    `}
                  >
                    <div className="p-2 rounded-lg bg-black/20" style={{ color: activeElement.id === el.id ? el.color : 'inherit' }}>
                      <ElementIcon size={18} />
                    </div>
                    <span className="text-sm font-medium">{el.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Visualización</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`p-2 rounded-lg border transition-all ${showAnnotations ? 'bg-[#00ffcc]/10 border-[#00ffcc]/30 text-[#00ffcc]' : 'bg-white/5 border-white/10 text-neutral-500'}`}
                title="Alternar Anotaciones"
              >
                {showAnnotations ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button 
                onClick={() => {
                  setIsTransitioning(true);
                  transitionStartTimeRef.current = Date.now();
                }}
                disabled={isTransitioning}
                className={`p-2 rounded-lg border transition-all ${
                  isTransitioning 
                    ? 'bg-[#0055ff]/20 border-[#0055ff]/50 text-[#0055ff] opacity-50 cursor-not-allowed' 
                    : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:bg-[#0055ff]/10 hover:border-[#0055ff]/30'
                }`}
                title="Activar Rayos X"
              >
                <Radio size={16} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-500 hover:text-white transition-all">
                <Maximize size={16} />
              </button>
            </div>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-white/5">
            <div className="flex justify-between text-[9px] uppercase tracking-tighter text-neutral-600 mb-1">
              <span>Carga de GPU</span>
              <span>34%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0055ff] to-[#00ffcc] w-[34%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-[#05070a]">
        <div ref={mountRef} className="w-full h-full" />
        
        {showAnnotations && KEY_ELEMENTS.map((el) => (
          <div
            key={el.id}
            id={`annotation-${el.id}`}
            className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300"
            style={{ opacity: 0 }}
          >
            <div className="relative">
              <div 
                className="w-4 h-4 rounded-full border-2 animate-ping absolute -inset-0"
                style={{ borderColor: el.color }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border-2 relative z-10 bg-[#05070a]"
                style={{ borderColor: el.color }}
              ></div>
              
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#0a101a]/90 backdrop-blur-md border border-white/10 p-2 rounded-lg whitespace-nowrap shadow-2xl">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{el.title}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Stream</span>
            </div>
            <p className="text-[9px] text-neutral-400 font-mono">COORD: 19.4326° N, 99.1332° W</p>
            <p className="text-[9px] text-neutral-400 font-mono">TEMP: 24.5°C | HUM: 42%</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
