import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RepaintBoundaryComponent } from '../../../../../shared/components/repaint-boundary/repaint-boundary';
import { HowItWorksStep } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-how-it-works-section',
  imports: [RepaintBoundaryComponent],
  templateUrl: './how-it-works-section.html',
  styleUrl: './how-it-works-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksSection {
  readonly steps = input.required<readonly HowItWorksStep[]>();
}

