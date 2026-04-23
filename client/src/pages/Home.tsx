import React, { useEffect, useRef, useState } from 'react';
import { Info, Cpu, Droplets, Radio, Zap, Menu, X, Eye, EyeOff, Maximize, Layers } from 'lucide-react';

// ==========================================
// DATOS DE EXPLICACIÓN Y ELEMENTOS CLAVE
// ==========================================
const KEY_ELEMENTS = [
  { 
    id: 'holograma', 
    title: 'Holograma Volumétrico', 
    icon: Radio, 
    color: '#00ffcc',
    pos: [0, 2, 0], // Coordenada 3D relativa
    desc: 'Núcleo del sistema. Utiliza una red de interferencia acústica para atrapar partículas ligeras en el aire, creando formas 3D tangibles a simple vista sin necesidad de gafas especiales.',
    stats: { 'Frecuencia': '40 kHz', 'Resolución': 'Sub-milimétrica' }
  },
  { 
    id: 'laser', 
    title: 'Matriz Láser RGB', 
    icon: Zap, 
    color: '#ff0055',
    pos: [0, 4.5, 0], 
    desc: 'Sistema de iluminación de alta velocidad. Proyecta haces de luz láser sobre las partículas atrapadas acústicamente, dotándolas de color y textura a una velocidad superior a la persistencia retiniana.',
    stats: { 'Tasa de Refresco': '120 Hz', 'Espectro': '16.7M Colores' }
  },
  { 
    id: 'aerosol', 
    title: 'Nebulizador Ultrasónico', 
    icon: Droplets, 
    color: '#00bbff',
    pos: [0, -1.5, 2], 
    desc: 'Generador de micropartículas. Utiliza vibraciones de alta frecuencia para crear una bruma o aerosol casi invisible que sirve como lienzo físico para la proyección holográfica.',
    stats: { 'Tamaño Partícula': '2-5 μm', 'Capacidad': '150 ml/h' }
  },
  { 
    id: 'procesador', 
    title: 'Procesador DSP (IA)', 
    icon: Cpu, 
    color: '#aa00ff',
    pos: [0, -3.5, 0], 
    desc: 'El cerebro del dispositivo. Un Procesador Digital de Señales que calcula millones de ecuaciones de onda por segundo para ajustar los campos acústicos en tiempo real compensando corrientes de aire.',
    stats: { 'Poder de Cómputo': '4.5 TFLOPS', 'Latencia': '< 2ms' }
  }
];

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>({ scene: null, camera: null, controls: null, renderer: null, gltfModel: null, points: [] });
  
  // Estados de la Interfaz
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeElement, setActiveElement] = useState(KEY_ELEMENTS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Ref para mutaciones en el render loop sin recrear el useEffect
  const showAnnotationsRef = useRef(showAnnotations);
  useEffect(() => {
    showAnnotationsRef.current = showAnnotations;
  }, [showAnnotations]);

  // 1. CARGA DINÁMICA DEL MOTOR 3D (Three.js) con validación estricta
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

  // 2. INICIALIZACIÓN DEL ESCENARIO 3D Y RENDERIZADO
  useEffect(() => {
    if (!scriptsReady || !mountRef.current) return;

    const w = window as any;
    const { THREE } = w;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // --- ESCENA, CÁMARA Y RENDERIZADOR ---
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

    // --- CONTROLES DE ÓRBITA ---
    const controls = new w.THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // --- ILUMINACIÓN PROFESIONAL ---
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

    // --- PARTÍCULAS HOLOGRÁFICAS (EFECTO VISUAL) ---
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

    // --- CARGADOR DEL MODELO 3D (.glb) ---
    const loader = new w.THREE.GLTFLoader();
    const modelUrl = '/manus-storage/machine_model_05319382.glb';
    
    // Función de respaldo visual (Fallback) si falla la carga del archivo
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

    // --- BUCLE DE RENDERIZADO Y ANOTACIONES 2D ---
    let animationFrameId: number;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        controls.update();

        // Calcular proyecciones 2D para las anotaciones HTML basado en el Ref actual
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

  // Prevenir Errores de React instanciando el componente de icono activamente
  const ActiveIcon = activeElement.icon;

  // ==========================================
  // RENDERIZADO DE LA INTERFAZ DE USUARIO
  // ==========================================
  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans text-neutral-200 select-none flex flex-col md:flex-row">
      
      {/* PANTALLA DE CARGA */}
      {(!isLoaded || !scriptsReady) && (
        <div className="absolute inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1a2535] border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-widest text-white">INICIALIZANDO MOTOR 3D</h2>
          <p className="text-[#00bbff] text-sm mt-2 font-mono uppercase">Cargando Modelo y Shaders...</p>
          {loadingError && <p className="text-red-400 mt-4 text-xs max-w-sm text-center">Aviso: Modo Offline activo. Generando modelo de respaldo interno.</p>}
        </div>
      )}

      {/* CABECERA MÓVIL */}
      <div className="md:hidden absolute top-0 left-0 w-full p-5 flex justify-between items-center z-40 pointer-events-none">
        <h1 className="text-2xl font-black text-white tracking-widest drop-shadow-lg">InnovA<span className="text-[#0055ff]">+</span></h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="pointer-events-auto p-2 bg-[#0a101a]/80 backdrop-blur border border-white/10 rounded-lg text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* PANEL LATERAL DE EXPLICACIONES */}
      <div className={`
        fixed md:relative top-0 right-0 md:left-0 w-full md:w-[400px] h-[75vh] md:h-full mt-[25vh] md:mt-0
        bg-gradient-to-b from-[#0a101a]/95 to-[#020305]/95 backdrop-blur-2xl border-l md:border-l-0 md:border-r border-[#1a2535] 
        z-30 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        
        {/* Cabecera del Panel */}
        <div className="p-8 border-b border-white/5 hidden md:block">
          <h1 className="text-4xl font-black text-white tracking-wider mb-1">InnovA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055ff] to-[#00ffcc]">+</span></h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-[#00ffcc] animate-pulse"></span>
            <p className="text-[10px] text-[#00ffcc] uppercase tracking-[0.2em] font-bold">Diagnóstico Activo</p>
          </div>
        </div>

        {/* Contenido Desplazable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col gap-8">
          
          {/* Tarjeta del Elemento Activo */}
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

            {/* Estadísticas / Specs */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
               {Object.entries(activeElement.stats).map(([key, value]) => (
                 <div key={key}>
                   <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">{key}</p>
                   <p className="text-sm font-semibold text-white">{value}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Menú de Elementos */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} /> Componentes Clave
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

        {/* Controles de Vista */}
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

      {/* ÁREA DEL LIENZO 3D (Three.js Render Target) */}
      <div className="flex-1 relative bg-black cursor-grab active:cursor-grabbing overflow-hidden">
        
        {/* Contenedor del Canvas */}
        <div ref={mountRef} className="absolute inset-0 outline-none" />

        {/* ANOTACIONES HTML SUPERPUESTAS */}
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

        {/* UI Flotante Superior Derecha */}
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

        {/* Viñeta para suavizar bordes del 3D */}
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
