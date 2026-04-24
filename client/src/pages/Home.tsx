import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers, ChevronDown, RefreshCw, Battery, Wind, Activity, BookOpen, Wifi } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ==========================================
// COMPONENTES DETALLADOS (24 PUNTOS TÉCNICOS)
// ==========================================

const COMPONENTS = {
  exterior: {
    title: "InnovA+ Hologram",
    subtitle: "Proyector Volumétrico Acústico Avanzado",
    desc: "Sistema de proyección holográfica de última generación basado en interferencia acústica y láser RGB. Dispositivo compacto y modular con arquitectura de ciclo cerrado.",
    features: [
      { id: 1, name: "Matriz Láser RGB", pos: [3, 4.5, -2], desc: "Emisores láser RGB de 200mW totales. Ilumina partículas en puntos específicos del espacio 3D." },
      { id: 2, name: "Emisores Ultrasónicos Superiores", pos: [2.5, 3.8, 0], desc: "Matriz de transductores a 40kHz. Genera ondas estacionarias para posicionar partículas (voxels)." },
      { id: 3, name: "Cámara de Proyección", pos: [0, 2.5, 0], desc: "Volumen transparente donde se forman las imágenes holográficas. Zona de operación principal." },
      { id: 4, name: "Ventilación y Flujo de Aire", pos: [-3, 2, 0], desc: "Sistema de circulación controlada. Estabiliza partículas y mantiene uniformidad de la niebla." },
      { id: 5, name: "Sensores Ambientales", pos: [0, 1.5, -3.5], desc: "Temperatura, humedad, presión. Monitoreo continuo del ambiente para ajuste automático." },
      { id: 6, name: "Zona de Formación de Niebla", pos: [-2.5, -1, 0], desc: "Cámara inferior donde se generan microgotas ultrasónicas (1-10 micras)." }
    ]
  },
  interior: {
    title: "Arquitectura Interna",
    subtitle: "Sistema de 4 Bloques Funcionales",
    desc: "Ingeniería de precisión con ciclo cerrado de agua, manipulación acústica de partículas, control en tiempo real y distribución de energía regulada.",
    features: [
      { id: 7, name: "Depósito de Agua", pos: [-3, -3.5, 0], desc: "Tanque de gran capacidad con materiales anti-corrosión. Almacena agua destilada para evitar residuos." },
      { id: 8, name: "Bomba de Agua Silenciosa", pos: [-2, -3, 0], desc: "Microbomba DC de presión controlada. Impulsa flujo constante hacia nebulizadores." },
      { id: 9, name: "Filtro Multi-etapa", pos: [-1, -2.8, 0], desc: "Carbón activado + microfiltro + UV opcional. Purifica agua antes de nebulización." },
      { id: 10, name: "Nebulizadores Ultrasónicos Inferiores", pos: [0, -2.5, 0], desc: "Transductores a 1.7MHz. Rompen agua en microgotas de 1-10 micras." },
      { id: 11, name: "Cámara de Mezcla y Estabilización", pos: [1, -2, 0], desc: "Uniformiza la niebla antes de ascender. Garantiza densidad homogénea de partículas." },
      { id: 12, name: "Retorno de Agua Condensada", pos: [2, -1.5, 0], desc: "Drenaje de vapor condensado. Cierra el ciclo retornando al depósito." },
      { id: 13, name: "Detector de Nivel Mínimo", pos: [2.5, -1, 0], desc: "Sensor capacitivo. Alerta cuando el agua está por debajo del umbral de operación." },
      { id: 14, name: "Válvula Antirretorno", pos: [3, -0.5, 0], desc: "Impide reflujo de agua hacia la bomba. Mantiene presión y eficiencia del sistema." },
      { id: 15, name: "Placa Principal (MCU)", pos: [0, 0.5, 3], desc: "Controlador central ARM Cortex-A72. Ejecuta algoritmos de control en tiempo real (<2ms)." },
      { id: 16, name: "Controladores Específicos", pos: [1, 1, 3], desc: "Drivers para ultrasonido, láser, bomba y ventiladores. Sincronización de fase y frecuencia." },
      { id: 17, name: "Módulo de Comunicación", pos: [2, 1.5, 3], desc: "Wi-Fi / Bluetooth. Interfaz remota y monitoreo desde dispositivos externos." },
      { id: 18, name: "Sensores de Precisión y Posición", pos: [0, 2, 3], desc: "Detectores ópticos de partículas. Retroalimentación para ajuste dinámico de campos acústicos." },
      { id: 19, name: "Drivers Láser y Ultrasonido", pos: [1, 2.5, 3], desc: "Amplificadores de potencia. Generan voltajes específicos para cada componente." },
      { id: 20, name: "Sistema de Gestión de Energía (BMS)", pos: [-1, 1, 3], desc: "Protección, balanceo de celdas y regulación. Distribuye energía de forma segura." },
      { id: 21, name: "Convertidor DC-DC", pos: [-2, 1.5, 3], desc: "Transforma 24V en 12V, 5V y 3.3V. Alimenta subsistemas específicos." },
      { id: 22, name: "Batería de Alto Rendimiento", pos: [-3, 2, 3], desc: "Li-ion 24V con capacidad extendida. Proporciona ~4-6 horas de operación continua." },
      { id: 23, name: "Puerto USB-C PD", pos: [-3.5, 2.5, 3], desc: "Carga rápida Power Delivery. Recarga completa en ~90 minutos." },
      { id: 24, name: "Distribución de Energía (Power Rail)", pos: [-2.5, 3, 3], desc: "Matriz de distribución regulada. Garantiza voltajes estables a todos los subsistemas." }
    ]
  }
};

const MANUAL_TECNICO = {
  exterior: {
    title: "Manual Técnico - Vista Exterior",
    sections: [
      {
        heading: "Descripción General",
        content: "El InnovA+ es un proyector holográfico volumétrico de última generación que utiliza interferencia acústica para posicionar partículas en el espacio 3D. La estructura externa alberga la cámara de proyección transparente donde se forman las imágenes, mientras que la base contiene todos los sistemas de generación y control."
      },
      {
        heading: "Componentes Visibles",
        content: "En la parte frontal se encuentra la pantalla de control táctil que permite interactuar con el sistema de forma intuitiva. En el lateral hay una entrada de agua para recargar el depósito sin afectar la estética. En la parte superior se integran los emisores ultrasónicos y láseres RGB, organizados de forma precisa para mantener un diseño limpio y eficiente. El logo de InnovA+ está centrado para reforzar la identidad del dispositivo."
      },
      {
        heading: "Especificaciones de Rendimiento",
        content: "Resolución: Limitada por densidad de partículas (típicamente sub-milimétrica). Brillo: Depende del láser (200mW) y densidad de aerosol. Precisión de posicionamiento: Milimétrica en los tres ejes. Latencia total del sistema: 80-200ms, suficiente para animaciones fluidas simples."
      }
    ]
  },
  interior: {
    title: "Manual Técnico - Arquitectura Interna",
    sections: [
      {
        heading: "Bloque 1: Sistema de Agua (Ciclo Cerrado)",
        content: "El depósito inferior almacena agua destilada (importante para evitar residuos minerales). Una microbomba DC impulsa el agua a través de un filtro multi-etapa (carbón + microfiltro + UV opcional) que elimina partículas dañinas. El agua llega a los nebulizadores ultrasónicos a 1.7MHz que la rompen en microgotas de 1-10 micras. Estas microgotas pasan por una cámara de mezcla que uniformiza la niebla antes de ascender hacia la zona de proyección. El exceso de humedad se condensa en las paredes y regresa al depósito, formando un ciclo cerrado eficiente."
      },
      {
        heading: "Bloque 2: Sistema de Manipulación (Acústica + Láser)",
        content: "Los emisores ultrasónicos inferiores a 1.7MHz generan las microgotas. Los emisores superiores a 40kHz crean ondas estacionarias que posicionan estas partículas en puntos específicos del espacio (voxels físicos). Los láseres RGB (200mW totales: 50mW rojo, 100mW verde, 50mW azul) iluminan estas partículas en tiempo real, haciendo visibles las formas creadas. La sincronización entre ultrasonido y láser es crítica: el ultrasonido posiciona, el agua proporciona materia, el láser proporciona visibilidad."
      },
      {
        heading: "Bloque 3: Sistema de Control (Cerebro DSP)",
        content: "El controlador central (MCU ARM Cortex-A72) ejecuta algoritmos de control en tiempo real con latencia <2ms. Recibe datos de sensores (temperatura, humedad, nivel de agua, flujo, calidad del aire, vibración) y ajusta continuamente: intensidad del ultrasonido, potencia del láser, flujo de agua, velocidad de ventiladores. Este loop de control se repite muchas veces por segundo, permitiendo compensar perturbaciones como corrientes de aire o cambios de temperatura. El módulo de comunicación (Wi-Fi/Bluetooth) permite monitoreo remoto e interfaz intuitiva."
      },
      {
        heading: "Bloque 4: Sistema de Energía (Distribución Regulada)",
        content: "Una batería Li-ion de 24V proporciona la energía principal. El BMS (Battery Management System) protege las celdas, balancea voltajes y monitorea salud. Convertidores DC-DC transforman 24V en 12V (bomba/ventiladores), 5V (lógica), 3.3V (sensores) y voltajes específicos para ultrasonido y láser. Un puerto USB-C con Power Delivery permite carga rápida. La distribución de energía (Power Rail) garantiza voltajes estables a todos los subsistemas, evitando fluctuaciones que afecten la precisión."
      },
      {
        heading: "Análisis de Latencia",
        content: "Control electrónico (MCU + sensores): ~10-30ms. Física (formación de niebla + movimiento de partículas): ~50-150ms. Latencia total estimada: 80-200ms. Esto significa que puedes animar objetos y reaccionar a eventos, pero no es instantáneo como una pantalla tradicional. Aún así, es suficiente para animaciones fluidas simples y visualización de datos estáticos o lentamente variables."
      },
      {
        heading: "Estabilidad y Factores Críticos",
        content: "Flujo de aire interno: Debe ser uniforme para evitar desplazamientos de partículas. Temperatura: Cambios afectan la viscosidad del aire y la eficiencia de nebulización. Vibraciones: Pueden desestabilizar las ondas acústicas. Densidad de partículas: Determina brillo y resolución. Por eso el sistema incluye ventilación controlada, sensores ambientales y algoritmos adaptativos."
      }
    ]
  }
};

const KEY_ELEMENTS = [
  { id: 'laser', title: 'Matriz Láser', pos: [3, 4.5, -2], color: '#ff0055' },
  { id: 'ultrasonic', title: 'Ultrasonido', pos: [2.5, 3.8, 0], color: '#00ffcc' },
  { id: 'chamber', title: 'Cámara', pos: [0, 2.5, 0], color: '#0055ff' },
  { id: 'ventilation', title: 'Ventilación', pos: [-3, 2, 0], color: '#ffaa00' }
];

const ExpandableSection = ({ title, items, color }: { title: string, items: any, color: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left group py-2 border-b border-white/5 hover:border-white/10 transition">
        <h3 className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] group-hover:text-neutral-300">{title}</h3>
        <ChevronDown size={14} className={`text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {Object.entries(items).map(([key, value]: [string, any]) => (
            <div key={key} className="flex flex-col">
              <span className="text-[8px] text-neutral-600 uppercase font-bold mb-0.5">{key}</span>
              <span className="text-xs text-neutral-300 leading-snug">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'manual'>('overview');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const model1Ref = useRef<THREE.Group | null>(null);
  const model2Ref = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020408');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 10, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight('#ffffff', 1.2));
    const spotLight = new THREE.SpotLight('#ffffff', 100);
    spotLight.position.set(10, 20, 10);
    scene.add(spotLight);

    const loader = new GLTFLoader();
    
    loader.load('./machine_model.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 9 / Math.max(size.x, size.y, size.z);
      model.scale.set(scale, scale, scale);
      model.position.sub(center.multiplyScalar(scale));
      model1Ref.current = model;
      scene.add(model);
      setIsLoaded(true);
    });

    loader.load('./new_interior_model.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 9 / Math.max(size.x, size.y, size.z);
      model.scale.set(scale, scale, scale);
      model.position.sub(center.multiplyScalar(scale));
      model.visible = false;
      model2Ref.current = model;
      scene.add(model);
    });

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();

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

  useEffect(() => {
    if (model1Ref.current) model1Ref.current.visible = (currentModelIndex === 0);
    if (model2Ref.current) model2Ref.current.visible = (currentModelIndex === 1);
  }, [currentModelIndex]);

  const data = currentModelIndex === 0 ? COMPONENTS.exterior : COMPONENTS.interior;
  const manual = currentModelIndex === 0 ? MANUAL_TECNICO.exterior : MANUAL_TECNICO.interior;

  return (
    <div className="relative w-full h-screen bg-[#020408] overflow-hidden font-sans text-neutral-200 select-none flex flex-col md:flex-row">
      
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/10 border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <p className="text-[#00ffcc] text-[10px] font-bold uppercase tracking-[0.3em]">Sincronizando InnovA+</p>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 right-0 md:left-0 w-full md:w-[520px] h-screen md:h-full
        bg-[#05070a]/95 backdrop-blur-3xl border-l md:border-l-0 md:border-r border-white/10 
        z-30 flex flex-col shadow-2xl transition-all duration-500
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1">
              {data.title}<span className="text-[#0055ff]">+</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-[#00ffcc] font-bold uppercase tracking-widest">{data.subtitle}</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 px-4 md:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'overview' ? 'border-[#00ffcc] text-[#00ffcc]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Componentes
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-1 ${activeTab === 'manual' ? 'border-[#0055ff] text-[#0055ff]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            <BookOpen size={12} /> Manual
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {activeTab === 'overview' ? (
            <>
              <p className="text-xs md:text-sm text-neutral-400 leading-relaxed mb-6">{data.desc}</p>
              <div className="space-y-4">
                {data.features.map((f) => (
                  <div key={f.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="text-[10px] font-black text-[#00ffcc] bg-[#00ffcc]/10 px-2 py-1 rounded">{f.id}</div>
                      <div className="flex-1">
                        <h4 className="text-xs md:text-sm font-bold text-white mb-1">{f.name}</h4>
                        <p className="text-[10px] md:text-xs text-neutral-400 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-white mb-4">{manual.title}</h2>
              {manual.sections.map((section, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-[#00ffcc] mb-2">{section.heading}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">Modo de Vista</span>
              <span className="text-xs font-bold text-white">{currentModelIndex === 0 ? "EXTERIOR" : "INTERIOR"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-bold text-xs uppercase tracking-widest ${showAnnotations ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'bg-white/5 border-white/10 text-neutral-400'}`}
              title="Anotaciones"
            >
              {showAnnotations ? <Eye size={16} className="mx-auto mb-1" /> : <EyeOff size={16} className="mx-auto mb-1" />}
              Anotaciones
            </button>
            <button 
              onClick={() => setCurrentModelIndex(currentModelIndex === 0 ? 1 : 0)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-bold text-xs uppercase tracking-widest ${currentModelIndex === 1 ? 'bg-[#0055ff] border-[#0055ff] text-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
              title="Cambiar Modelo"
            >
              <RefreshCw size={16} className="mx-auto mb-1" />
              {currentModelIndex === 0 ? "Ver Interior" : "Ver Exterior"}
            </button>
            <button 
              onClick={() => {
                if (controlsRef.current) {
                  controlsRef.current.reset();
                  cameraRef.current?.position.set(15, 10, 15);
                }
              }}
              className="flex-1 p-3 rounded-lg bg-white/5 border-2 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              title="Reset Cámara"
            >
              <Maximize size={16} className="mx-auto mb-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative bg-[#020408]">
        <div ref={mountRef} className="w-full h-full" />
        
        {showAnnotations && KEY_ELEMENTS.map((el) => (
          <div key={el.id} id={`annotation-${el.id}`} className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }}>
            <div className="relative">
              <div className="w-3 h-3 rounded-full border-2 animate-ping absolute -inset-0" style={{ borderColor: el.color }}></div>
              <div className="w-3 h-3 rounded-full border-2 relative z-10 bg-[#020408]" style={{ borderColor: el.color }}></div>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white uppercase tracking-tighter whitespace-nowrap">{el.title}</div>
            </div>
          </div>
        ))}

        <div className="absolute top-8 right-8 flex flex-col gap-4 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Estado</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-neutral-600 uppercase font-bold">Batería</span>
                <div className="flex items-center gap-1 text-[10px] text-white font-mono">
                  <Battery size={10} className="text-[#00ffcc]" /> 84%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-neutral-600 uppercase font-bold">Flujo</span>
                <div className="flex items-center gap-1 text-[10px] text-white font-mono">
                  <Wind size={10} className="text-[#0055ff]" /> 1.2m/s
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden absolute top-4 left-4 z-20 p-2 bg-black/40 border border-white/10 rounded-lg text-white">
          <Menu size={24} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}} />
    </div>
  );
}
