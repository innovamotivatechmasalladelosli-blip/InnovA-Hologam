import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers, ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    <div className="mb-6">
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
  const [activeElement, setActiveElement] = useState(KEY_ELEMENTS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentModelIndex, setCurrentModelIndex] = useState(0); // 0: Exterior, 1: Interior

  // Referencias de Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const model1Ref = useRef<THREE.Group | null>(null);
  const model2Ref = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. ESCENA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070a');
    scene.fog = new THREE.FogExp2('#05070a', 0.05);
    sceneRef.current = scene;

    // 2. CÁMARA
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(12, 8, 12);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. CONTROLES
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // 5. LUCES
    scene.add(new THREE.AmbientLight('#ffffff', 1.0));
    const dirLight = new THREE.DirectionalLight('#ffffff', 2.0);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 6. PARTÍCULAS
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(1500 * 3);
    for(let i = 0; i < 1500 * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMesh = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ size: 0.05, color: '#00ffcc', transparent: true, opacity: 0.6 }));
    scene.add(particlesMesh);
    particlesRef.current = particlesMesh;

    // 7. CARGA DE MODELOS
    const loader = new GLTFLoader();
    
    // Modelo 1: Exterior
    loader.load('./machine_model.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 8 / Math.max(size.x, size.y, size.z);
      model.scale.set(scale, scale, scale);
      model.position.sub(center.multiplyScalar(scale));
      
      model1Ref.current = model;
      scene.add(model);
      setIsLoaded(true);
    });

    // Modelo 2: Interior (El nuevo que pasaste)
    loader.load('./new_interior_model.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 8 / Math.max(size.x, size.y, size.z);
      model.scale.set(scale, scale, scale);
      model.position.sub(center.multiplyScalar(scale));
      
      model.visible = false; // Oculto al inicio
      model2Ref.current = model;
      scene.add(model);
    });

    // 8. ANIMACIÓN
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (particlesRef.current) particlesRef.current.rotation.y += 0.001;
      if (controlsRef.current) controlsRef.current.update();

      // Actualizar anotaciones
      if (showAnnotations && cameraRef.current && rendererRef.current) {
        KEY_ELEMENTS.forEach((el) => {
          const vec = new THREE.Vector3(el.pos[0], el.pos[1], el.pos[2]);
          vec.project(cameraRef.current!);
          const x = (vec.x * 0.5 + 0.5) * rendererRef.current!.domElement.clientWidth;
          const y = (vec.y * -0.5 + 0.5) * rendererRef.current!.domElement.clientHeight;
          const dom = document.getElementById(`annotation-${el.id}`);
          if (dom) {
            dom.style.display = vec.z > 1 ? 'none' : 'block';
            dom.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            dom.style.opacity = '1';
          }
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 9. RESIZE
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Efecto para cambiar visibilidad de modelos
  useEffect(() => {
    if (model1Ref.current) model1Ref.current.visible = (currentModelIndex === 0);
    if (model2Ref.current) model2Ref.current.visible = (currentModelIndex === 1);
  }, [currentModelIndex]);

  const ActiveIcon = activeElement.icon;

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans text-neutral-200 select-none flex flex-col md:flex-row">
      
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1a2535] border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-widest text-white">CARGANDO SISTEMA</h2>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 right-0 md:left-0 w-full md:w-[520px] h-[75vh] md:h-full mt-[25vh] md:mt-0
        bg-gradient-to-b from-[#0a101a]/95 to-[#020305]/95 backdrop-blur-2xl border-l md:border-l-0 md:border-r border-[#1a2535] 
        z-30 flex flex-col shadow-2xl transition-transform duration-500
        ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="hidden md:flex p-8 items-center justify-between border-b border-white/5">
          <h1 className="text-3xl font-black text-white tracking-tighter">InnovA<span className="text-[#0055ff]">+</span></h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <ActiveIcon size={24} style={{ color: activeElement.color }} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{activeElement.title}</h2>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">{activeElement.desc}</p>
          </div>

          <ExpandableSection title="📊 Especificaciones" items={activeElement.fullSpecs} color={activeElement.color} />
          <ExpandableSection title="🎯 Aplicaciones" items={activeElement.aplicaciones} color={activeElement.color} />

          <div className="mt-8">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Componentes</h3>
            <div className="flex flex-col gap-2">
              {KEY_ELEMENTS.map((el) => (
                <button
                  key={el.id}
                  onClick={() => setActiveElement(el)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${activeElement.id === el.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <el.icon size={18} style={{ color: activeElement.id === el.id ? el.color : 'inherit' }} />
                  <span className="text-sm font-medium">{el.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Visualización</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`p-2 rounded-lg border transition-all ${showAnnotations ? 'bg-[#00ffcc]/10 border-[#00ffcc]/30 text-[#00ffcc]' : 'bg-white/5 border-white/10 text-neutral-500'}`}
                title="Anotaciones"
              >
                {showAnnotations ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button 
                onClick={() => setCurrentModelIndex(currentModelIndex === 0 ? 1 : 0)}
                className={`p-2 rounded-lg border transition-all ${currentModelIndex === 1 ? 'bg-[#0055ff]/20 border-[#0055ff]/50 text-[#0055ff]' : 'bg-white/5 border-white/10 text-neutral-500'}`}
                title={currentModelIndex === 0 ? "Ver Interior" : "Ver Exterior"}
              >
                <Radio size={16} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-500 hover:text-white">
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas Area */}
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
              <div className="w-4 h-4 rounded-full border-2 animate-ping absolute -inset-0" style={{ borderColor: el.color }}></div>
              <div className="w-4 h-4 rounded-full border-2 relative z-10 bg-[#05070a]" style={{ borderColor: el.color }}></div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#0a101a]/90 backdrop-blur-md border border-white/10 p-2 rounded-lg whitespace-nowrap shadow-2xl">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{el.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}
