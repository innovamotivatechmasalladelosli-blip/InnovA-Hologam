# InnovA+ - Sistema Holográfico Acústico Avanzado

Visualizador interactivo 3D del sistema holográfico volumétrico InnovA+. Una aplicación web moderna que permite explorar en detalle cada componente del sistema de proyección holográfica acústica, con especificaciones técnicas completas, materiales de construcción, latencias y consumo energético.

## 🌐 Ver en Vivo

**👉 [Visualizador 3D InnovA+ - Acceso Directo](https://innovamotivatechmasalladelosli-blip.github.io/InnovA-Hologam/)**

Abre este enlace para ver el modelo 3D interactivo completamente funcional en tu navegador.

## 🎯 Características Principales

- **Visualización 3D Interactiva**: Modelo 3D del dispositivo InnovA+ con rotación, zoom y panorámica
- **6 Componentes Detallados**:
  - Holograma Volumétrico (40 kHz, resolución < 1mm)
  - Matriz Láser RGB (200 mW, 120 kHz)
  - Nebulizador Ultrasónico (1.7 MHz, 150 ml/h)
  - Procesador DSP (ARM Cortex-A72 @ 2.4 GHz, 4.5 TFLOPS)
  - Sistema de Agua - Ciclo Cerrado
  - Control y Electrónica (Batería 29V 10Ah)

- **Información Técnica Completa**:
  - Especificaciones técnicas detalladas
  - Materiales de construcción
  - Latencias y tiempos de respuesta
  - Consumo energético por componente
  - Sensores integrados
  - Aplicaciones reales

- **Interfaz Responsiva**: Funciona en desktop, tablet y móvil
- **Anotaciones Interactivas**: Etiquetas 3D que se posicionan automáticamente

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- pnpm 10+

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/innovamotivatechmasalladelosli-blip/InnovA-Hologam.git
cd InnovA-Hologam

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

### Construcción para Producción

```bash
# Compilar
pnpm build

# Previsualizar
pnpm preview
```

## 📁 Estructura del Proyecto

```
InnovA-Hologam/
├── docs/                        # Archivos compilados para GitHub Pages
│   ├── index.html              # Página principal compilada
│   ├── machine_model.glb       # Modelo 3D
│   └── assets/                 # CSS y JavaScript compilados
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx        # Componente principal con visualizador
│   │   ├── components/         # Componentes reutilizables
│   │   ├── App.tsx            # Enrutamiento principal
│   │   ├── main.tsx           # Punto de entrada
│   │   └── index.css          # Estilos globales
│   ├── index.html             # Template HTML
│   └── public/                # Archivos estáticos
│       └── machine_model.glb  # Modelo 3D del dispositivo
├── server/
│   └── index.ts               # Servidor Express (producción)
├── package.json               # Dependencias del proyecto
├── tsconfig.json             # Configuración TypeScript
└── README.md                 # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Visualización 3D**: Three.js 0.128
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: shadcn/ui
- **Iconos**: Lucide React
- **Build**: Vite
- **Servidor**: Express.js (producción)
- **Hosting**: GitHub Pages

## 📊 Especificaciones Técnicas del Sistema

### Holograma Volumétrico
- **Frecuencia**: 40 kHz ± 2 kHz
- **Resolución**: < 1 mm
- **Tasa de Refresco**: 120 Hz
- **Tamaño Máximo**: 30 cm³
- **Transductores**: 64 elementos piezoeléctricos PZT-8
- **Latencia**: < 2 ms

### Matriz Láser RGB
- **Potencia Roja**: 50 mW @ 650 nm
- **Potencia Verde**: 100 mW @ 532 nm
- **Potencia Azul**: 50 mW @ 405 nm
- **Velocidad de Barrido**: 120 kHz
- **Precisión**: ± 0.1 mm
- **Colores**: 16.7 millones (RGB 8-bit)
- **Latencia de Cambio**: < 1 μs

### Nebulizador Ultrasónico
- **Frecuencia**: 1.7 MHz
- **Tamaño de Partícula**: 2-5 μm
- **Tasa de Generación**: 150 ml/h
- **Depósito**: 500 ml
- **Autonomía**: 3-4 horas
- **Eficiencia**: > 90%

### Procesador DSP
- **CPU**: ARM Cortex-A72 @ 2.4 GHz
- **Poder de Cómputo**: 4.5 TFLOPS
- **RAM**: 8 GB LPDDR4
- **Almacenamiento**: 64 GB eMMC
- **Latencia**: < 2 ms
- **Sistema Operativo**: Linux RT (tiempo real)

### Sistema de Energía
- **Batería**: Litio-Polímero 29V, 10Ah (290Wh)
- **Consumo Total**: 73W (nominal)
- **Consumo Pico**: 120W
- **Autonomía**: 4 horas
- **Tiempo de Carga**: 2-3 horas
- **Eficiencia**: > 92%

## 🎮 Controles de Interacción

- **Click Izquierdo + Arrastrar**: Orbitar alrededor del modelo
- **Rueda del Ratón**: Zoom in/out
- **Click Derecho + Arrastrar**: Panorámica
- **Botón "Mostrar/Ocultar Etiquetas 3D"**: Alterna visibilidad de anotaciones
- **Click en Componentes**: Selecciona y muestra información detallada

## 📱 Componentes Principales

### Home.tsx
Componente principal que contiene:
- Visualización 3D con Three.js
- Panel lateral con información técnica
- Secciones expandibles para especificaciones
- Anotaciones interactivas 3D
- Responsividad para móvil

### ExpandableSection
Componente reutilizable para mostrar información técnica:
- Encabezado colapsable
- Scroll automático para contenido largo
- Codificación de colores por componente

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot reload
pnpm dev

# Compilar para producción
pnpm build

# Verificar tipos TypeScript
pnpm check

# Formatear código
pnpm format

# Vista previa de producción
pnpm preview
```

### Agregar Nuevos Componentes

Para agregar un nuevo componente al sistema:

1. Agregar entrada en `KEY_ELEMENTS` en `Home.tsx`
2. Incluir propiedades requeridas:
   - `id`: Identificador único
   - `title`: Nombre del componente
   - `icon`: Icono de Lucide React
   - `color`: Color hexadecimal para identificación
   - `pos`: Posición 3D [x, y, z]
   - `desc`: Descripción general
   - `stats`: Estadísticas principales
   - `fullSpecs`: Especificaciones técnicas
   - `materiales`: Materiales de construcción
   - `latencias`: Tiempos de respuesta
   - `consumoEnergetico`: Consumo de energía
   - `sensores`: Lista de sensores
   - `aplicaciones`: Casos de uso

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "three": "^0.128.0",
  "tailwindcss": "^4.1.14",
  "typescript": "5.6.3",
  "lucide-react": "^0.453.0"
}
```

## 🌐 Despliegue

### GitHub Pages (Actualmente Activo)
El proyecto está desplegado automáticamente en GitHub Pages:
- **URL**: https://innovamotivatechmasalladelosli-blip.github.io/InnovA-Hologam/
- **Archivos**: Carpeta `docs/` en el repositorio
- **Actualización**: Automática con cada push a `main`

### Despliegue Manual en Otros Servidores

```bash
# Compilar
pnpm build

# Los archivos compilados están en dist/public/
# Copiar a tu servidor web
```

## 📄 Licencia

MIT - Libre para uso personal y comercial

## 👥 Autor

**InnovA Hologram System**
- Visualizador desarrollado para demostración y educación
- Especificaciones técnicas basadas en el sistema InnovA+

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.

## 🔍 Especificaciones Adicionales

### Materiales de Construcción

**Holograma Volumétrico**
- Transductores: Cerámica piezoeléctrica PZT-8
- Carcasa: Aluminio anodizado 6061-T6
- Aislamiento: Espuma de poliuretano

**Matriz Láser**
- Diodos: Semiconductores GaAs
- Lentes: Vidrio óptico BK7
- Disipador: Cobre con níquel

**Nebulizador**
- Transductor: Cerámica PZT-5H
- Cámara: Polipropileno médico
- Boquilla: Acero inoxidable 316L

**Procesador**
- CPU: Silicio grado industrial (28nm)
- Disipador: Cobre puro
- PCB: FR-4 de 10 capas

### Latencias Críticas

- Latencia de Procesamiento: < 2 ms
- Latencia de Cambio de Color: < 1 μs
- Latencia de Respuesta Acústica: < 1 ms
- Latencia de I/O: < 1 ms

### Consumo Energético Detallado

| Componente | Nominal | Pico | Voltaje |
|-----------|---------|------|---------|
| Holograma | 25W | 40W | 12V |
| Láser RGB | 20W | 30W | 12V |
| Nebulizador | 10W | 15W | 5V |
| Procesador | 15W | 25W | 3.3V |
| Sistema de Agua | 8W | 12W | 12V |
| **Total** | **73W** | **120W** | - |

---

**Última actualización**: Abril 2026
**Versión**: 1.0.0
**Estado**: ✅ En vivo en GitHub Pages
