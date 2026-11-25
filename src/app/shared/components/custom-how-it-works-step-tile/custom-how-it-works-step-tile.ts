import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RepaintBoundaryComponent } from '../repaint-boundary/repaint-boundary';

export type HowItWorksStepIcon = 'discover' | 'explore' | 'connect';

export interface HowItWorksStepTileData {
  readonly stepNumber: number;
  readonly icon: HowItWorksStepIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * Single step tile for process / how-it-works flows: icon, number badge, title, and copy.
 */
@Component({
  selector: 'app-custom-how-it-works-step-tile',
  imports: [RepaintBoundaryComponent],
  templateUrl: './custom-how-it-works-step-tile.html',
  styleUrl: './custom-how-it-works-step-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'how-step-tile',
  },
})
export class CustomHowItWorksStepTile {
  readonly step = input.required<HowItWorksStepTileData>();
  readonly showConnector = input<boolean>(false);
}