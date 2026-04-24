import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers, ChevronDown, RefreshCw, Battery, Wind, Activity } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ==========================================
// DATOS TÉCNICOS EXTRAÍDOS DEL DOCUMENTO
// ==========================================

const EXTERIOR_INFO = {
  title: "InnovA+ Hologram",
  subtitle: "Proyector Volumétrico Avanzado",
  desc: "Dispositivo de proyección holográfica basado en física real. La base sólida contiene los sistemas principales, mientras que la parte superior es una cámara transparente donde ocurre la magia de la proyección.",
  features: [
    { icon: Radio, title: "Cámara de Proyección", desc: "Zona transparente superior donde se forman las imágenes 3D." },
    { icon: Activity, title: "Pantalla de Control", desc: "Interfaz frontal intuitiva para monitoreo y configuración." },
    { icon: Droplets, title: "Entrada de Agua", desc: "Acceso lateral para recarga sencilla del sistema de niebla." },
    { icon: Zap, title: "Sistema de Proyección", desc: "Integración de emisores ultrasónicos y láseres RGB." }
  ],
  specs: {
    "Identidad": "Logo InnovA+ Centrado",
    "Diseño": "Moderno y Limpio",
    "Interfaz": "Panel Táctil Frontal",
    "Recarga": "Lateral Estética"
  }
};

const INTERIOR_INFO = {
  title: "Arquitectura Interna",
  subtitle: "Ingeniería de Precisión",
  desc: "Sistema organizado por capas funcionales para optimizar el rendimiento. Incluye ciclos cerrados de agua, manipulación acústica y control por IA en tiempo real.",
  features: [
    { icon: Droplets, title: "Ciclo de Agua", desc: "Depósito, microbomba y filtrado multi-etapa (Carbón + UV)." },
    { icon: Radio, title: "Manipulación Acústica", desc: "Ondas estacionarias de 40kHz para posicionar voxels físicos." },
    { icon: Zap, title: "Iluminación RGB", desc: "Escaneo láser sincronizado con la posición de las partículas." },
    { icon: Cpu, title: "Cerebro DSP", desc: "Controlador central con latencia ultra-baja (~80-200ms)." }
  ],
  specs: {
    "Nebulización": "1.7 MHz (1-10 micras)",
    "Procesamiento": "MCU Tiempo Real",
    "Energía": "Batería Li-ion 24V",
    "Latencia": "80ms - 200ms"
  }
};

const KEY_ELEMENTS = [
  { id: 'holograma', title: 'Holograma', pos: [0, 2.5, 0], color: '#00ffcc' },
  { id: 'laser', title: 'Matriz Láser', pos: [0, 4.2, 0], color: '#ff0055' },
  { id: 'aerosol', title: 'Nebulizador', pos: [-2.5, -1.5, 0], color: '#00bbff' },
  { id: 'procesador', title: 'Cerebro DSP', pos: [0, -2.5, 0], color: '#aa00ff' }
];

const ExpandableSection = ({ title, items, color }: { title: string, items: any, color: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left group py-2 border-b border-white/5">
        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] group-hover:text-neutral-300 transition-colors">{title}</h3>
        <ChevronDown size={14} className={`text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {Object.entries(items).map(([key, value]: [string, any]) => (
            <div key={key} className="flex flex-col">
              <span className="text-[8px] text-neutral-600 uppercase font-bold">{key}</span>
              <span className="text-xs text-neutral-300 font-medium">{value}</span>
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
    
    // Cargar Exterior
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

    // Cargar Interior
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

  const info = currentModelIndex === 0 ? EXTERIOR_INFO : INTERIOR_INFO;

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
        fixed md:relative top-0 right-0 md:left-0 w-full md:w-[480px] h-[80vh] md:h-full mt-[20vh] md:mt-0
        bg-[#05070a]/90 backdrop-blur-3xl border-l md:border-l-0 md:border-r border-white/10 
        z-30 flex flex-col shadow-2xl transition-transform duration-500
        ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black text-white tracking-tighter mb-1">
            {info.title}<span className="text-[#0055ff]">+</span>
          </h1>
          <p className="text-[10px] text-[#00ffcc] font-bold uppercase tracking-widest">{info.subtitle}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">{info.desc}</p>

          <div className="space-y-6 mb-8">
            {info.features.map((f, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#00ffcc] group-hover:bg-[#00ffcc]/10 transition-colors">
                  <f.icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{f.title}</h4>
                  <p className="text-[11px] text-neutral-500 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <ExpandableSection title="📋 Ficha Técnica" items={info.specs} color="#00ffcc" />
          
          {currentModelIndex === 1 && (
            <div className="mt-6 p-4 rounded-xl bg-[#0055ff]/5 border border-[#0055ff]/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-[#0055ff]" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Estado del Loop</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>Latencia de Control</span>
                  <span className="text-white">~15ms</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0055ff] w-[15%]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls - HIGHER VISIBILITY */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-black mb-1">Modo de Vista</span>
              <span className="text-xs font-bold text-white">{currentModelIndex === 0 ? "Exterior" : "Interior"}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`p-3 rounded-xl border-2 transition-all shadow-lg ${showAnnotations ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/30'}`}
                title="Anotaciones"
              >
                {showAnnotations ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button 
                onClick={() => setCurrentModelIndex(currentModelIndex === 0 ? 1 : 0)}
                className={`p-3 rounded-xl border-2 transition-all shadow-lg ${currentModelIndex === 1 ? 'bg-[#0055ff] border-[#0055ff] text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/30'}`}
                title="Cambiar Modelo"
              >
                <RefreshCw size={20} className={currentModelIndex === 1 ? "animate-spin-slow" : ""} />
              </button>
              <button 
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.reset();
                    cameraRef.current?.position.set(15, 10, 15);
                  }
                }}
                className="p-3 rounded-xl bg-white/5 border-2 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white transition-all shadow-lg"
                title="Reset Cámara"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-[#020408]">
        <div ref={mountRef} className="w-full h-full" />
        
        {showAnnotations && KEY_ELEMENTS.map((el) => (
          <div
            key={el.id}
            id={`annotation-${el.id}`}
            className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300"
            style={{ opacity: 0 }}
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full border-2 animate-ping absolute -inset-0" style={{ borderColor: el.color }}></div>
              <div className="w-3 h-3 rounded-full border-2 relative z-10 bg-[#020408]" style={{ borderColor: el.color }}></div>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-tighter whitespace-nowrap">
                {el.title}
              </div>
            </div>
          </div>
        ))}

        {/* Floating HUD */}
        <div className="absolute top-8 right-8 flex flex-col gap-4 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Estado del Sistema</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-neutral-600 uppercase font-bold">Batería</span>
                <div className="flex items-center gap-1 text-[10px] text-white font-mono">
                  <Battery size={10} className="text-[#00ffcc]" /> 84%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-neutral-600 uppercase font-bold">Flujo Aire</span>
                <div className="flex items-center gap-1 text-[10px] text-white font-mono">
                  <Wind size={10} className="text-[#0055ff]" /> 1.2m/s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}} />
    </div>
  );
}
