import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CustomHowItWorksStepTile } from '../../../../../shared/components/custom-how-it-works-step-tile/custom-how-it-works-step-tile';
import { HowItWorksStep } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-how-it-works-section',
  imports: [CustomHowItWorksStepTile],
  templateUrl: './how-it-works-section.html',
  styleUrl: './how-it-works-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksSection {
  readonly steps = input.required<readonly HowItWorksStep[]>();
}

