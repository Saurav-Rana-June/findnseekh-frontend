import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-map-visual',
  templateUrl: './hero-map-visual.html',
  styleUrl: './hero-map-visual.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroMapVisual {}

