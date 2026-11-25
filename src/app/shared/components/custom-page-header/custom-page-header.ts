import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Title + subtitle row with an optional actions slot (projected content).
 */
@Component({
  selector: 'app-custom-page-header',
  templateUrl: './custom-page-header.html',
  styleUrl: './custom-page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly headingId = input<string>('');
}
