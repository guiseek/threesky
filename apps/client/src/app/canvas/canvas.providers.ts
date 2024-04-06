import { Control, Cloud, FighterJet } from '@threesky/models-three';
import { InjectionToken, type Provider } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import {
  Ocean,
  Horizon,
  createHorizon,
  createOcean,
  createLight,
} from '@threesky/util-three';
import {
  Scene,
  Clock,
  WebGLRenderer,
  PCFSoftShadowMap,
  PerspectiveCamera,
  DirectionalLight,
} from 'three';

export const FAR_TOKEN = new InjectionToken<number>('far.token');

export const canvasProviders: Provider[] = [
  {
    provide: Scene,
  },
  {
    provide: Clock,
  },
  {
    provide: FAR_TOKEN,
    useValue: 100000,
  },
  {
    provide: WebGLRenderer,
    useFactory() {
      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(innerWidth, innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      return renderer;
    },
  },
  {
    provide: PerspectiveCamera,
    useFactory(far: number) {
      const aspect = innerWidth / innerHeight;
      return new PerspectiveCamera(75, aspect, 0.1, far);
    },
    deps: [FAR_TOKEN],
  },
  {
    provide: OrbitControls,
    useFactory(camera: PerspectiveCamera, renderer: WebGLRenderer) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 32;
      controls.maxDistance = 128;
      return controls;
    },
    deps: [PerspectiveCamera, WebGLRenderer],
  },
  {
    provide: Ocean,
    useFactory(scene: Scene, far: number) {
      return createOcean(!!scene.fog, far);
    },
    deps: [Scene, FAR_TOKEN],
  },
  {
    provide: Horizon,
    useFactory(ocean: Ocean, far: number) {
      return createHorizon(ocean.water, far);
    },
    deps: [Ocean, FAR_TOKEN],
  },
  {
    provide: DirectionalLight,
    useFactory: createLight,
  },
  {
    provide: Control,
  },
  {
    provide: Cloud,
  },
  {
    provide: FighterJet,
    deps: [Control, Scene],
  },
];
