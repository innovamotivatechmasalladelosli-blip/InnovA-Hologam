import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Eye, EyeOff, Maximize, ChevronDown, RefreshCw, BookOpen, Zap } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ==========================================
// COMPONENTES TÉCNICOS COMPLETOS
// ==========================================

const COMPONENTS = {
  exterior: {
    title: "InnovA+ Hologram",
    subtitle: "Proyector Volumétrico Acústico Avanzado",
    desc: "Sistema de proyección holográfica de última generación basado en interferencia acústica y láser RGB. Dispositivo compacto y modular con arquitectura de ciclo cerrado.",
    features: [
      { id: 1, name: "Matriz Láser RGB", pos: [3.5, 4.8, -1.5], desc: "Emisores láser RGB de 200mW totales (50mW rojo, 100mW verde, 50mW azul). Ilumina partículas en puntos específicos del espacio 3D para crear las imágenes holográficas visibles." },
      { id: 2, name: "Emisores Ultrasónicos Superiores", pos: [2.8, 4.2, 1], desc: "Matriz de transductores a 40kHz. Genera ondas estacionarias para posicionar partículas (voxels) en el espacio 3D con precisión milimétrica." },
      { id: 3, name: "Cámara de Proyección", pos: [0, 3, 0], desc: "Volumen transparente donde se forman las imágenes holográficas. Zona de operación principal con paredes de vidrio óptico de precisión." },
      { id: 4, name: "Ventilación y Flujo de Aire", pos: [-3.5, 2.5, 0], desc: "Sistema de circulación controlada. Estabiliza partículas y mantiene uniformidad de la niebla para evitar desplazamientos no deseados." },
      { id: 5, name: "Sensores Ambientales", pos: [0, 1.8, -4], desc: "Monitorean temperatura, humedad relativa, presión atmosférica. Retroalimentación continua para ajuste automático del sistema." },
      { id: 6, name: "Zona de Formación de Niebla", pos: [-2.8, -1.5, 0], desc: "Cámara inferior donde se generan microgotas ultrasónicas de 1-10 micras. Base del ciclo cerrado de agua." }
    ]
  },
  interior: {
    title: "Arquitectura Interna",
    subtitle: "Sistema de 4 Bloques Funcionales",
    desc: "Ingeniería de precisión con ciclo cerrado de agua, manipulación acústica de partículas, control en tiempo real y distribución de energía regulada.",
    features: [
      { id: 7, name: "Depósito de Agua", pos: [-3.5, -3.8, 0], desc: "Tanque de gran capacidad con materiales anti-corrosión. Almacena agua destilada (importante para evitar residuos minerales)." },
      { id: 8, name: "Bomba de Agua Silenciosa", pos: [-2.2, -3.2, 0], desc: "Microbomba DC de presión controlada. Impulsa flujo constante hacia nebulizadores sin vibraciones." },
      { id: 9, name: "Filtro Multi-etapa", pos: [-1, -3, 0], desc: "Carbón activado + microfiltro + UV opcional. Purifica agua eliminando partículas dañinas." },
      { id: 10, name: "Nebulizadores Ultrasónicos", pos: [0.2, -2.8, 0], desc: "Transductores a 1.7MHz. Rompen agua en microgotas de 1-10 micras para la formación de niebla." },
      { id: 11, name: "Cámara de Mezcla", pos: [1.5, -2.2, 0], desc: "Uniformiza la niebla antes de ascender. Garantiza densidad homogénea de partículas en la zona de proyección." },
      { id: 12, name: "Retorno de Agua Condensada", pos: [2.5, -1.8, 0], desc: "Drenaje de vapor condensado en las paredes. Cierra el ciclo retornando al depósito." },
      { id: 13, name: "Detector de Nivel Mínimo", pos: [3.2, -1.2, 0], desc: "Sensor capacitivo. Alerta cuando el agua está por debajo del umbral de operación segura." },
      { id: 14, name: "Válvula Antirretorno", pos: [3.8, -0.2, 0], desc: "Impide reflujo de agua hacia la bomba. Mantiene presión y eficiencia del sistema." },
      { id: 15, name: "Placa Principal (MCU)", pos: [0.2, 0.8, 3.5], desc: "Controlador central ARM Cortex-A72. Ejecuta algoritmos de control en tiempo real con latencia <2ms." },
      { id: 16, name: "Controladores Específicos", pos: [1.5, 1.3, 3.5], desc: "Drivers para ultrasonido, láser, bomba y ventiladores. Sincronización precisa de fase y frecuencia." },
      { id: 17, name: "Módulo de Comunicación", pos: [2.8, 1.8, 3.5], desc: "Wi-Fi 6 / Bluetooth 5.0. Interfaz remota y monitoreo en tiempo real desde dispositivos externos." },
      { id: 18, name: "Sensores de Precisión", pos: [0.2, 2.3, 3.5], desc: "Detectores ópticos de partículas. Retroalimentación para ajuste dinámico de campos acústicos." },
      { id: 19, name: "Drivers Láser y Ultrasonido", pos: [1.5, 2.8, 3.5], desc: "Amplificadores de potencia de alta eficiencia. Generan voltajes específicos para cada componente." },
      { id: 20, name: "Sistema de Gestión (BMS)", pos: [-1.2, 1.3, 3.5], desc: "Protección de celdas, balanceo y regulación. Distribuye energía de forma segura y eficiente." },
      { id: 21, name: "Convertidor DC-DC", pos: [-2.2, 1.8, 3.5], desc: "Transforma 24V en 12V (bomba/ventiladores), 5V (lógica), 3.3V (sensores) y voltajes específicos." },
      { id: 22, name: "Batería de Alto Rendimiento", pos: [-3.2, 2.3, 3.5], desc: "Li-ion 24V con capacidad extendida. Proporciona 4-6 horas de operación continua a máxima potencia." },
      { id: 23, name: "Puerto USB-C PD", pos: [-3.8, 2.8, 3.5], desc: "Carga rápida Power Delivery 65W. Recarga completa en aproximadamente 90 minutos." },
      { id: 24, name: "Distribución de Energía", pos: [-2.8, 3.3, 3.5], desc: "Matriz de distribución regulada (Power Rail). Garantiza voltajes estables a todos los subsistemas." }
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

const ANNOTATION_POINTS = {
  exterior: [
    { id: 1, title: 'Matriz Láser RGB', pos: [0, 4.2, 0], color: '#ff0055' },
    { id: 2, title: 'Emisores Ultrasónicos Superiores', pos: [0, 4.5, 0.5], color: '#00ffcc' },
    { id: 3, title: 'Cámara de Proyección', pos: [0, 1, 0], color: '#0055ff' },
    { id: 4, title: 'Ventilación y Flujo de Aire', pos: [-2.5, 0, 0], color: '#ffaa00' },
    { id: 5, title: 'Sensores Ambientales', pos: [0, -3.5, 2.5], color: '#00ff88' },
    { id: 6, title: 'Zona de Formación de Niebla', pos: [0, -4, 0], color: '#ff88ff' }
  ],
  interior: [
    { id: 7, title: 'Depósito de Agua', pos: [-2.5, -4, 0], color: '#0088ff' },
    { id: 8, title: 'Bomba de Agua Silenciosa', pos: [-1.5, -3.5, 0], color: '#00ffaa' },
    { id: 9, title: 'Filtro Multi-etapa', pos: [0, -3.5, 0], color: '#ffff00' },
    { id: 10, title: 'Nebulizadores Ultrasónicos', pos: [1.5, -3.5, 0], color: '#ff00ff' },
    { id: 11, title: 'Cámara de Mezcla', pos: [2.5, -3, 0], color: '#00ffff' },
    { id: 12, title: 'Retorno de Agua Condensada', pos: [3, -2.5, 0], color: '#88ff00' },
    { id: 13, title: 'Detector de Nivel Mínimo', pos: [3.5, -2, 0], color: '#ff6600' },
    { id: 14, title: 'Válvula Antirretorno', pos: [3.8, -1.5, 0], color: '#00ff00' },
    { id: 15, title: 'Placa Principal (MCU)', pos: [0, 0.5, 1.5], color: '#ff0088' },
    { id: 16, title: 'Controladores Específicos', pos: [1, 1, 1.5], color: '#0055ff' },
    { id: 17, title: 'Módulo de Comunicación', pos: [2, 1.5, 1.5], color: '#00ffcc' },
    { id: 18, title: 'Sensores de Precisión', pos: [0, 2, 1.5], color: '#ffaa00' },
    { id: 19, title: 'Drivers Láser y Ultrasonido', pos: [1, 2.5, 1.5], color: '#ff00ff' },
    { id: 20, title: 'Sistema de Gestión (BMS)', pos: [-1, 1, 1.5], color: '#00ff88' },
    { id: 21, title: 'Convertidor DC-DC', pos: [-2, 1.5, 1.5], color: '#ff8800' },
    { id: 22, title: 'Batería de Alto Rendimiento', pos: [-3, 2, 1.5], color: '#88ff00' },
    { id: 23, title: 'Puerto USB-C PD', pos: [-3.8, 2.5, 1.5], color: '#ff0055' },
    { id: 24, title: 'Distribución de Energía', pos: [-2, 3, 1.5], color: '#00ffff' }
  ]
};

const createHologramProjection = (scene: THREE.Scene) => {
  const holoGroup = new THREE.Group();

  const ringLight = new THREE.PointLight(0x0055ff, 100);
  ringLight.position.set(0, 5.5, 0);
  holoGroup.add(ringLight);

  const cyanLight = new THREE.PointLight(0x00ffcc, 80);
  cyanLight.position.set(0, 6, 0);
  holoGroup.add(cyanLight);

  const volumeLight = new THREE.PointLight(0xff00ff, 40);
  volumeLight.position.set(2, 5.5, 2);
  holoGroup.add(volumeLight);

  scene.add(holoGroup);
  return holoGroup;
};

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'manual'>('overview');
  const [isMobile, setIsMobile] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const model1Ref = useRef<THREE.Group | null>(null);
  const model2Ref = useRef<THREE.Group | null>(null);
  const holoRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020408');
    scene.fog = new THREE.Fog('#020408', 100, 500);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight('#ffffff', 150);
    spotLight.position.set(20, 30, 20);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.far = 100;
    scene.add(spotLight);

    const pointLight1 = new THREE.PointLight('#00ffcc', 60);
    pointLight1.position.set(-15, 12, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#0055ff', 50);
    pointLight2.position.set(15, 12, -10);
    scene.add(pointLight2);

    const holo = createHologramProjection(scene);
    holoRef.current = holo;

    const loader = new GLTFLoader();

    loader.load('./machine_model.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.FrontSide;
          }
        }
      });
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
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.FrontSide;
          }
        }
      });
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

      if (holoRef.current) {
        holoRef.current.rotation.y += 0.003;
      }

      // Limpieza total de anotaciones antes de decidir cuáles mostrar
      const allPossibleIds = [...ANNOTATION_POINTS.exterior, ...ANNOTATION_POINTS.interior].map(a => a.id);
      allPossibleIds.forEach(id => {
        const dom = document.getElementById(`annotation-${id}`);
        if (dom) {
          dom.style.display = 'none';
          dom.style.opacity = '0';
        }
      });

      if (showAnnotations && cameraRef.current && rendererRef.current) {
        const currentAnnotations = currentModelIndex === 0 ? ANNOTATION_POINTS.exterior : ANNOTATION_POINTS.interior;
        
        currentAnnotations.forEach((el) => {
          const vec = new THREE.Vector3(el.pos[0], el.pos[1], el.pos[2]);
          
          // Importante: Los puntos deben estar en el mismo espacio que el modelo escalado
          vec.project(cameraRef.current!);
          
          const x = (vec.x * 0.5 + 0.5) * rendererRef.current!.domElement.clientWidth;
          const y = (vec.y * -0.5 + 0.5) * rendererRef.current!.domElement.clientHeight;
          
          const dom = document.getElementById(`annotation-${el.id}`);
          if (dom) {
            // Verificamos si el punto está frente a la cámara (vec.z entre 0 y 1 en clip space)
            if (vec.z >= -1 && vec.z <= 1) {
              dom.style.display = 'block';
              dom.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
              dom.style.opacity = '1';
              dom.style.zIndex = '100';
            } else {
              dom.style.display = 'none';
            }
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
      if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (model1Ref.current) model1Ref.current.visible = currentModelIndex === 0;
    if (model2Ref.current) model2Ref.current.visible = currentModelIndex === 1;
  }, [currentModelIndex]);

  const data = currentModelIndex === 0 ? COMPONENTS.exterior : COMPONENTS.interior;
  const manual = currentModelIndex === 0 ? MANUAL_TECNICO.exterior : MANUAL_TECNICO.interior;

  return (
    <div className="relative w-full h-screen bg-[#020408] overflow-hidden font-sans text-neutral-200 select-none flex flex-col lg:flex-row">
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/10 border-t-[#00ffcc] rounded-full animate-spin mb-4"></div>
          <p className="text-[#00ffcc] text-[10px] font-bold uppercase tracking-[0.3em]">Sincronizando InnovA+</p>
        </div>
      )}

      {/* Sidebar - Responsivo */}
      <div
        className={`
        fixed lg:relative top-0 right-0 lg:left-0 w-full lg:w-[520px] h-screen
        bg-[#05070a]/95 backdrop-blur-3xl border-l lg:border-l-0 lg:border-r border-white/10 
        z-30 flex flex-col shadow-2xl transition-all duration-500
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="p-4 sm:p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tighter mb-1">
              {data.title}<span className="text-[#0055ff]">+</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-[#00ffcc] font-bold uppercase tracking-widest">{data.subtitle}</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 px-4 sm:px-6 lg:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'overview' ? 'border-[#00ffcc] text-[#00ffcc]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Componentes
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-1 ${activeTab === 'manual' ? 'border-[#0055ff] text-[#0055ff]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            <BookOpen size={12} /> Manual
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {activeTab === 'overview' ? (
            <>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">{data.desc}</p>
              <div className="space-y-3 sm:space-y-4">
                {data.features.map((f) => (
                  <div key={f.id} className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 hover:border-white/20 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="text-[9px] sm:text-[10px] font-black text-[#00ffcc] bg-[#00ffcc]/10 px-2 py-1 rounded flex-shrink-0">{f.id}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white mb-1 break-words">{f.name}</h4>
                        <p className="text-[9px] sm:text-xs text-neutral-400 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-lg font-black text-white mb-4">{manual.title}</h2>
              {manual.sections.map((section, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-bold text-[#00ffcc] mb-2">{section.heading}</h3>
                  <p className="text-[9px] sm:text-xs text-neutral-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Controls - Desktop y Tablet */}
        {!isMobile && (
          <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-neutral-600 font-black">Modo de Vista</span>
                <span className="text-xs sm:text-sm font-bold text-white">{currentModelIndex === 0 ? "EXTERIOR" : "INTERIOR"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`flex-1 p-2 sm:p-3 rounded-lg border-2 transition-all font-bold text-[8px] sm:text-xs uppercase tracking-widest flex flex-col items-center justify-center ${showAnnotations ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'bg-white/5 border-white/10 text-neutral-400'}`}
              >
                {showAnnotations ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="hidden sm:inline">Anotaciones</span>
              </button>
              <button
                onClick={() => setCurrentModelIndex(currentModelIndex === 0 ? 1 : 0)}
                className={`flex-1 p-2 sm:p-3 rounded-lg border-2 transition-all font-bold text-[8px] sm:text-xs uppercase tracking-widest flex flex-col items-center justify-center ${currentModelIndex === 1 ? 'bg-[#0055ff] border-[#0055ff] text-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">{currentModelIndex === 0 ? "Interior" : "Exterior"}</span>
              </button>
              <button
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.reset();
                    cameraRef.current?.position.set(15, 10, 15);
                  }
                }}
                className="flex-1 p-2 sm:p-3 rounded-lg bg-white/5 border-2 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white transition-all font-bold text-[8px] sm:text-xs uppercase tracking-widest flex flex-col items-center justify-center"
              >
                <Maximize size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative bg-[#020408]">
        <div ref={mountRef} className="w-full h-full" />

        {showAnnotations &&
          (currentModelIndex === 0 ? ANNOTATION_POINTS.exterior : ANNOTATION_POINTS.interior).map((el) => (
            <div key={el.id} id={`annotation-${el.id}`} className="absolute top-0 left-0 pointer-events-none transition-all duration-300 z-50">
              <div className="relative">
                <div className="w-3 h-3 rounded-full border-2 animate-pulse absolute -inset-0" style={{ borderColor: el.color, boxShadow: `0 0 10px ${el.color}` }}></div>
                <div className="w-3 h-3 rounded-full border-2 relative z-10 bg-[#020408]" style={{ borderColor: el.color }}></div>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white uppercase tracking-tighter whitespace-nowrap z-20" style={{ pointerEvents: 'auto' }}>{el.title}</div>
              </div>
            </div>
          ))}

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden absolute top-4 left-4 z-20 p-2 bg-black/40 border border-white/10 rounded-lg text-white">
          <Menu size={24} />
        </button>

        {/* Controles Flotantes en Móvil */}
        {isMobile && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${showAnnotations ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'bg-white/5 border-white/10 text-neutral-400'}`}
            >
              {showAnnotations ? <Eye size={16} /> : <EyeOff size={16} />}
              Puntos
            </button>
            <button
              onClick={() => setCurrentModelIndex(currentModelIndex === 0 ? 1 : 0)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${currentModelIndex === 1 ? 'bg-[#0055ff] border-[#0055ff] text-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
            >
              <Zap size={16} />
              {currentModelIndex === 0 ? "Interior" : "Exterior"}
            </button>
            <button
              onClick={() => {
                if (controlsRef.current) {
                  controlsRef.current.reset();
                  cameraRef.current?.position.set(15, 10, 15);
                }
              }}
              className="p-3 rounded-lg bg-white/5 border-2 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center"
            >
              <Maximize size={16} />
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        @media (max-width: 768px) {
          .custom-scrollbar { scrollbar-width: thin; }
        }
      `
      }}
      />
    </div>
  );
}
