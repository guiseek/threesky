import {
  Scene,
  Clock,
  WebGLRenderer,
  PerspectiveCamera,
  DirectionalLight,
  PMREMGenerator,
} from 'three';
import { CommonModule } from '@angular/common';
import {
  inject,
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  type OnInit,
} from '@angular/core';
import { canvasProviders } from './canvas.providers';
import { Horizon, Ocean } from '@threesky/util-three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Cloud, Control, FighterJet } from '@threesky/models-three';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  providers: canvasProviders,
  template: ``,
  styleUrl: './canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
  scene = inject(Scene);
  clock = inject(Clock);
  ocean = inject(Ocean);
  horizon = inject(Horizon);
  renderer = inject(WebGLRenderer);
  camera = inject(PerspectiveCamera);
  light = inject(DirectionalLight);
  controls = inject(OrbitControls);
  control = inject(Control);
  cloud = inject(Cloud);
  fighterJet = inject(FighterJet);

  element = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnInit() {
    const element = this.element.nativeElement;
    element.append(this.renderer.domElement);

    this.scene.add(this.ocean.water);
    this.scene.add(this.fighterJet);
    this.scene.add(this.light);

    this.control.initialize();

    const sceneEnv = new Scene();
    const pmremGenerator = new PMREMGenerator(this.renderer);
    const renderTarget = pmremGenerator.fromScene(sceneEnv);

    sceneEnv.add(this.horizon.sky);

    this.horizon.updateSun(renderTarget);

    for (let i = 0; i < 100; i++) {
      this.scene.add(new Cloud());
    }

    this.scene.add(sceneEnv);

    const audio = new Audio();
    audio.src = 'assets/sounds/boom.mp3';

    this.control.onTouched = () => {
      if (audio.paused) audio.play();
    };

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.ocean.water.material.uniforms['time'].value += 1.0 / 60.0;

    if (this.control.touched) this.fighterJet.update();

    this.controls.target = this.fighterJet.position;
    this.controls.update(delta);

    this.renderer.render(this.scene, this.camera);
  };
}
