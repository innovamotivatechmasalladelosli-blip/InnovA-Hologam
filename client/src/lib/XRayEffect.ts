import * as THREE from 'three';

/**
 * Clase XRayEffect
 * Implementa un efecto tipo rayos X que permite alternar entre la visualización
 * del modelo externo e interno con transiciones suaves y efectos visuales.
 */
export class XRayEffect {
  private scene: THREE.Scene;
  private externalModel: THREE.Group | THREE.Object3D | null = null;
  private internalModel: THREE.Group | THREE.Object3D | null = null;
  private isXRayMode: boolean = false;
  private transitionProgress: number = 0;
  private transitionSpeed: number = 0.05; // Velocidad de transición (0-1 por frame)
  private xrayMaterial: THREE.ShaderMaterial;
  private normalMaterial: THREE.MeshStandardMaterial;
  private isTransitioning: boolean = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    
    // Material para efecto rayos X
    this.xrayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ffcc) },
        intensity: { value: 1.0 },
        wireframe: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float intensity;
        uniform float wireframe;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Efecto de borde basado en la normal
          float edge = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
          edge = 1.0 - edge;
          
          // Combinar color con efecto de borde
          vec3 finalColor = mix(color * 0.3, color, edge * intensity);
          
          // Añadir brillo adicional
          gl_FragColor = vec4(finalColor, 0.8 + edge * 0.2);
        }
      `,
      transparent: true,
      wireframe: false,
      side: THREE.DoubleSide
    });

    // Material normal estándar
    this.normalMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.5
    });
  }

  /**
   * Establece el modelo externo
   */
  public setExternalModel(model: THREE.Group | THREE.Object3D): void {
    this.externalModel = model;
    this.applyMaterialToModel(model, this.normalMaterial);
  }

  /**
   * Establece el modelo interno
   */
  public setInternalModel(model: THREE.Group | THREE.Object3D): void {
    this.internalModel = model;
    this.applyMaterialToModel(model, this.xrayMaterial);
    model.visible = false; // Inicialmente oculto
  }

  /**
   * Alterna entre modo rayos X y modo normal
   */
  public toggleXRayMode(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.isXRayMode = !this.isXRayMode;
    }
  }

  /**
   * Obtiene el estado actual del modo rayos X
   */
  public getXRayMode(): boolean {
    return this.isXRayMode;
  }

  /**
   * Actualiza la transición entre modelos (debe llamarse en el loop de animación)
   */
  public update(): void {
    if (!this.isTransitioning) return;

    // Actualizar progreso de transición
    if (this.isXRayMode) {
      this.transitionProgress = Math.min(this.transitionProgress + this.transitionSpeed, 1);
    } else {
      this.transitionProgress = Math.max(this.transitionProgress - this.transitionSpeed, 0);
    }

    // Aplicar transición a los modelos
    if (this.externalModel) {
      this.externalModel.visible = this.transitionProgress < 0.5;
      this.externalModel.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              m.opacity = 1 - this.transitionProgress;
            });
          } else {
            child.material.opacity = 1 - this.transitionProgress;
          }
        }
      });
    }

    if (this.internalModel) {
      this.internalModel.visible = this.transitionProgress > 0.5;
      this.internalModel.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              m.opacity = this.transitionProgress;
            });
          } else {
            child.material.opacity = this.transitionProgress;
          }
        }
      });
    }

    // Finalizar transición
    if (this.transitionProgress === 0 || this.transitionProgress === 1) {
      this.isTransitioning = false;
    }
  }

  /**
   * Aplica un material a todos los meshes de un modelo
   */
  private applyMaterialToModel(model: THREE.Object3D, material: THREE.Material): void {
    model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        // Clonar el material para cada mesh para evitar conflictos
        const clonedMaterial = material.clone();
        child.material = clonedMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /**
   * Establece la velocidad de transición
   */
  public setTransitionSpeed(speed: number): void {
    this.transitionSpeed = Math.max(0.01, Math.min(speed, 0.2));
  }

  /**
   * Obtiene la velocidad de transición actual
   */
  public getTransitionSpeed(): number {
    return this.transitionSpeed;
  }

  /**
   * Reinicia el efecto
   */
  public reset(): void {
    this.isXRayMode = false;
    this.transitionProgress = 0;
    this.isTransitioning = false;

    if (this.externalModel) {
      this.externalModel.visible = true;
      this.externalModel.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              m.opacity = 1;
            });
          } else {
            child.material.opacity = 1;
          }
        }
      });
    }

    if (this.internalModel) {
      this.internalModel.visible = false;
      this.internalModel.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              m.opacity = 0;
            });
          } else {
            child.material.opacity = 0;
          }
        }
      });
    }
  }

  /**
   * Destruye el efecto y libera recursos
   */
  public dispose(): void {
    this.xrayMaterial.dispose();
    this.normalMaterial.dispose();
  }
}
