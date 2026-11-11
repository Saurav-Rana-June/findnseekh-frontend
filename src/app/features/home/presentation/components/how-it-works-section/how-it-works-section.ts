import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HowItWorksStep } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-how-it-works-section',
  templateUrl: './how-it-works-section.html',
  styleUrl: './how-it-works-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksSection {
  readonly steps = input.required<readonly HowItWorksStep[]>();
}

