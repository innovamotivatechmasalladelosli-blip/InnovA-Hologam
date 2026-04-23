import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers, ChevronDown } from 'lucide-react';

// ==========================================
// DATOS TÉCNICOS COMPLETOS Y DETALLADOS - INNOVA+
// ==========================================
const KEY_ELEMENTS = [
  { 
    id: 'holograma', 
    title: 'Holograma Volumétrico', 
    icon: Radio, 
    color: '#00ffcc',
    pos: [0, 2.5, 0], // Centro superior - núcleo de proyección
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
    pos: [0, 4.2, 0], // Superior - sistema de iluminación
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
    pos: [-2.5, -1.5, 0], // Lateral izquierdo - generador de partículas
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
    pos: [0, -2.5, 0], // Centro inferior - cerebro del sistema
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
      'Interfaz de usuario avanzada',
      'Integración con sistemas IoT'
    ]
  },
  {
    id: 'agua',
    title: 'Sistema de Agua - Ciclo Cerrado',
    icon: Droplets,
    color: '#00bbff',
    pos: [-2.5, 0, 0], // Lateral izquierdo - circulación de agua
    desc: 'Sistema de circulación cerrada que recicla el agua, filtra impurezas y mantiene condiciones óptimas de temperatura y pureza para la nebulización continua.',
    stats: { 'Depósito': '500 ml', 'Filtración': 'Multi-etapa' },
    fullSpecs: {
      'Depósito Principal': '500 ml con tapa anticontaminación',
      'Bomba de Agua': 'Bomba silenciosa de 12V DC (sin escobillas)',
      'Sistema de Filtración': 'Carbón activado + Filtro de 0.22 μm',
      'Caudal de Circulación': '50-100 ml/min',
      'Sensor de Nivel Mínimo': 'Detiene operación si nivel < 50 ml',
      'Retorno de Agua Condensada': 'Sistema de drenaje automático',
      'Depósito de Agua Condensada': '200 ml (se recicla al depósito principal)',
      'Filtración Multi-Etapa': 'Carbón activado + Membrana de 0.22 μm + Filtro de sedimentos',
      'Válvula Antirretorno': 'Previene reflujo de agua',
      'Material de Tuberías': 'Silicona de grado médico (no tóxica)'
    },
    materiales: {
      'Depósito': 'Polipropileno (PP) transparente',
      'Bomba': 'Cuerpo de aluminio, impulsor de cerámica',
      'Filtro de Carbón': 'Carbón activado de cáscara de coco',
      'Membrana': 'Polifluoruro de vinilideno (PVDF) 0.22 μm',
      'Tuberías': 'Silicona de grado médico (dureza Shore A 40-60)',
      'Conectores': 'Acero inoxidable 304'
    },
    latencias: {
      'Latencia de Inicio de Bomba': '< 500 ms',
      'Latencia de Flujo Estable': '< 2 segundos',
      'Latencia de Parada': '< 1 segundo',
      'Tiempo de Filtración': '< 5 minutos (para 500 ml)',
      'Tiempo de Reciclaje': '< 3 minutos'
    },
    consumoEnergetico: {
      'Potencia Nominal': '8W',
      'Potencia Pico': '12W',
      'Voltaje de Operación': '12V DC',
      'Corriente Nominal': '0.67A',
      'Corriente Pico': '1A'
    },
    sensores: [
      'Sensor de nivel de agua (capacitivo)',
      'Sensor de temperatura del depósito',
      'Detector de flujo de agua',
      'Sensor de presión de bomba',
      'Detector de obstrucción de filtro',
      'Sensor de conductividad del agua'
    ],
    aplicaciones: [
      'Reciclaje de agua 100% automático',
      'Mantenimiento de pureza del fluido',
      'Operación continua sin recargas frecuentes',
      'Reducción de costos de consumibles',
      'Sostenibilidad ambiental'
    ]
  },
  {
    id: 'electronica',
    title: 'Control y Electrónica',
    icon: Cpu,
    color: '#aa00ff',
    pos: [2.5, 0, 0], // Lateral derecho - distribución de energía
    desc: 'Módulos de control y distribución de energía que coordinan todos los componentes del sistema con precisión milisegundo.',
    stats: { 'Voltajes': '29V, 12V, 5V, 3.3V', 'Protección': 'Completa' },
    fullSpecs: {
      'Placa Principal (MCU)': 'Microcontrolador ARM Cortex-M4 @ 168 MHz',
      'Drivers de Láser': 'Drivers PWM de 1 kHz para cada color RGB',
      'Convertidores DC-DC': 'Múltiples convertidores para 29V → 12V, 5V, 3.3V',
      'Batería': 'Litio-Polímero 29V, 10Ah (290Wh)',
      'BMS (Battery Management System)': 'Protección de sobrecarga, descarga, temperatura',
      'Cargador': 'Cargador rápido 20V, 10A (carga completa en 2-3 horas)',
      'Puerto USB-C': 'Carga rápida y transferencia de datos',
      'Distribución de Energía': 'Riel de potencia con fusibles inteligentes',
      'Protección Térmica': 'Disipadores de cobre, ventiladores controlados',
      'Aislamiento Galvánico': 'Protección contra ruido electromagnético'
    },
    materiales: {
      'Batería': 'Celdas LiPo de grado industrial (3.7V nominal)',
      'PCB Principal': 'FR-4 de 8 capas (impedancia controlada)',
      'Disipadores': 'Cobre puro con revestimiento de níquel',
      'Capacitores': 'Electrolíticos de aluminio (105°C)',
      'Inductores': 'Núcleo de ferrita (permeabilidad μ = 2000)'
    },
    latencias: {
      'Latencia de Distribución': '< 100 μs',
      'Latencia de Protección Térmica': '< 10 ms',
      'Latencia de Detección de Falla': '< 5 ms',
      'Tiempo de Conmutación': '< 1 μs',
      'Tiempo de Respuesta BMS': '< 50 ms'
    },
    consumoEnergetico: {
      'Consumo Total del Sistema': '73W (nominal)',
      'Consumo Pico': '120W',
      'Autonomía': '4 horas (operación continua)',
      'Tiempo de Carga': '2-3 horas (cargador 20V 10A)',
      'Eficiencia de Conversión': '> 92%'
    },
    sensores: [
      'Monitor de voltaje de batería',
      'Sensor de temperatura de batería',
      'Detector de carga de batería',
      'Monitor de corriente total del sistema',
      'Sensor de voltaje de cada rail de potencia',
      'Detector de sobrecorriente'
    ],
    aplicaciones: [
      'Distribución eficiente de energía',
      'Protección de componentes sensibles',
      'Operación autónoma con batería',
      'Carga rápida y segura',
      'Monitoreo de salud del sistema'
    ]
  }
];

// Componente para expandir/contraer secciones
const ExpandableSection = ({ title, items, color }: any) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/10 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {title}
        </span>
        <ChevronDown 
          size={16} 
          style={{ color, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        />
      </button>
      
      {expanded && (
        <div className="p-3 border-t border-white/10 bg-black/30 space-y-2 max-h-64 overflow-y-auto">
          {Array.isArray(items) ? (
            items.map((item, idx) => (
              <div key={idx} className="text-xs text-neutral-400">
                {typeof item === 'string' ? (
                  <span>• {item}</span>
                ) : (
                  <div>
                    <span className="text-neutral-300 font-semibold">{item.label}:</span>
                    <span className="text-neutral-400"> {item.value}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            Object.entries(items).map(([key, value], idx) => (
              <div key={idx} className="text-xs text-neutral-400">
                <span className="text-neutral-300 font-semibold">{key}:</span>
                <span> {String(value)}</span>
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
  const engineRef = useRef<any>({ scene: null, camera: null, controls: null, renderer: null, gltfModel: null, points: [] });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeElement, setActiveElement] = useState(KEY_ELEMENTS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const showAnnotationsRef = useRef(showAnnotations);
  useEffect(() => {
    showAnnotationsRef.current = showAnnotations;
  }, [showAnnotations]);

  useEffect(() => {
    const loadScript = (src: string, checkFn?: () => boolean) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => {
          if (checkFn && !checkFn()) {
            reject(new Error(`Script cargado pero falló la validación: ${src}`));
          } else {
            resolve();
          }
        };
        script.onerror = () => reject(new Error(`Error de red al cargar: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initScripts = async () => {
      try {
        const w = window as any;
        if (!w.THREE) {
          await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js', () => w.THREE);
        }
        if (!w.THREE.OrbitControls) {
          await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', () => w.THREE.OrbitControls);
        }
        if (!w.THREE.GLTFLoader) {
          await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', () => w.THREE.GLTFLoader);
        }
        setScriptsReady(true);
      } catch (err) {
        console.error("Error cargando Three.js:", err);
        setLoadingError(true);
      }
    };
    initScripts();
  }, []);

  useEffect(() => {
    if (!scriptsReady || !mountRef.current) return;

    const w = window as any;
    const { THREE } = w;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070a');
    scene.fog = new THREE.FogExp2('#05070a', 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new w.THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight('#0055ff', 2, 20);
    blueLight.position.set(-5, 5, -5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight('#00ffcc', 1.5, 20);
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

    const loader = new w.THREE.GLTFLoader();
    const modelUrl = '/manus-storage/machine_model_05319382.glb';
    
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

    loader.load(
        modelUrl,
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
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.envMapIntensity = 1.5;
                    }
                }
            });

            scene.add(model);
            engineRef.current.gltfModel = model;
            setIsLoaded(true);
        },
        undefined,
        (error: any) => {
            console.warn("No se pudo cargar el GLB externo, generando modelo avanzado procedimental...", error);
            createFallbackModel();
        }
    );

    engineRef.current = { scene, camera, controls, renderer };

    let animationFrameId: number;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        controls.update();

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
        const w = mountRef.current?.clientWidth || width;
        const h = mountRef.current?.clientHeight || height;
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
  }, [scriptsReady]);

  const ActiveIcon = activeElement.icon;

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans text-neutral-200 select-none flex flex-col md:flex-row">
      
      {(!isLoaded || !scriptsReady) && (
        <div className="absolute inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1a2535] border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-widest text-white">INICIALIZANDO MOTOR 3D</h2>
          <p className="text-[#00bbff] text-sm mt-2 font-mono uppercase">Cargando Modelo y Shaders...</p>
          {loadingError && <p className="text-red-400 mt-4 text-xs max-w-sm text-center">Aviso: Modo Offline activo. Generando modelo de respaldo interno.</p>}
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
        
        <div className="p-8 border-b border-white/5 hidden md:block">
          <h1 className="text-4xl font-black text-white tracking-wider mb-1">InnovA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055ff] to-[#00ffcc]">+</span></h1>
          <p className="text-[11px] text-neutral-400 uppercase tracking-[0.15em] font-semibold mt-2">Sistema Holográfico Acústico Avanzado</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="h-2 w-2 rounded-full bg-[#00ffcc] animate-pulse"></span>
            <p className="text-[10px] text-[#00ffcc] uppercase tracking-[0.2em] font-bold">Diagnóstico Activo</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col gap-6">
          
          <div className="bg-[#111827]/60 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activeElement.color }}></div>
            <div className="absolute -right-10 -top-10 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
               <ActiveIcon size={120} />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/5" style={{ color: activeElement.color }}>
                <ActiveIcon size={28} />
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">{activeElement.title}</h2>
            </div>
            
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-light">
              {activeElement.desc}
            </p>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
               {Object.entries(activeElement.stats).map(([key, value]) => (
                 <div key={key}>
                   <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">{key}</p>
                   <p className="text-sm font-semibold text-white">{value}</p>
                 </div>
               ))}
            </div>
          </div>

          <ExpandableSection 
            title="📋 Especificaciones Técnicas"
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
                      w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border text-left
                      ${activeElement.id === el.id 
                        ? 'bg-white/10 border-white/20 shadow-lg' 
                        : 'bg-transparent border-transparent hover:bg-white/5 text-neutral-400'}
                    `}
                  >
                    <div style={{ color: activeElement.id === el.id ? el.color : '#666' }}>
                      <ElementIcon size={20} />
                    </div>
                    <span className={`text-sm font-semibold ${activeElement.id === el.id ? 'text-white' : ''}`}>
                      {el.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#05070a]/50">
          <button 
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`
              w-full py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex justify-center gap-3 items-center
              ${showAnnotations 
                ? 'bg-[#00ffcc]/10 border-[#00ffcc]/30 text-[#00ffcc] shadow-[0_0_20px_rgba(0,255,204,0.15)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}
            `}
          >
            {showAnnotations ? <EyeOff size={18} /> : <Eye size={18} />}
            {showAnnotations ? 'Ocultar Etiquetas 3D' : 'Mostrar Etiquetas 3D'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-black cursor-grab active:cursor-grabbing overflow-hidden">
        
        <div ref={mountRef} className="absolute inset-0 outline-none" />

        {showAnnotations && KEY_ELEMENTS.map((el) => {
          const OverlayIcon = el.icon;
          return (
            <div 
              key={`anno-${el.id}`}
              id={`annotation-${el.id}`}
              onClick={() => setActiveElement(el)}
              className={`
                absolute top-0 left-0 transition-opacity duration-200 cursor-pointer group z-20
                ${activeElement.id === el.id ? 'z-30' : 'opacity-70 hover:opacity-100'}
              `}
              style={{ 
                willChange: 'transform', 
                transform: 'translate(-50%, -50%) translate(-9999px, -9999px)' 
              }}
            >
              <div className="relative flex items-center justify-center">
                <div 
                  className={`w-4 h-4 rounded-full border-2 transition-transform duration-300 ${activeElement.id === el.id ? 'scale-125' : ''}`}
                  style={{ backgroundColor: '#05070a', borderColor: el.color, boxShadow: `0 0 10px ${el.color}` }}
                />
                {activeElement.id === el.id && (
                  <div className="absolute w-8 h-8 rounded-full animate-ping opacity-40" style={{ backgroundColor: el.color }} />
                )}
                
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#05070a]/90 backdrop-blur-md border border-white/20 p-2 pr-4 rounded-lg flex items-center gap-3 whitespace-nowrap pointer-events-none transform origin-left transition-all duration-300 group-hover:scale-105">
                  <div style={{ color: el.color }}><OverlayIcon size={16} /></div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${activeElement.id === el.id ? 'text-white' : 'text-neutral-300'}`}>
                    {el.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute top-6 right-6 md:right-8 text-right pointer-events-none z-10 hidden md:block">
          <div className="flex items-center gap-3 text-[#00ffcc] bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10">
             <Maximize size={16} />
             <span className="text-[10px] uppercase tracking-widest font-bold">Interactúa con el Modelo</span>
          </div>
          <div className="mt-4 text-[10px] text-neutral-500 uppercase tracking-widest flex flex-col gap-1">
            <span>Click Izq + Arrastrar: <strong className="text-white">Orbitar</strong></span>
            <span>Rueda Ratón: <strong className="text-white">Zoom</strong></span>
            <span>Click Der + Arrastrar: <strong className="text-white">Panorámica</strong></span>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-10" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}} />
    </div>
  );
}
