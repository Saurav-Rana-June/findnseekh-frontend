import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type InlineAlertVariant = 'success' | 'error';

@Component({
  selector: 'app-custom-inline-alert',
  templateUrl: './custom-inline-alert.html',
  styleUrl: './custom-inline-alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInlineAlert {
  readonly message = input.required<string>();
  readonly variant = input<InlineAlertVariant>('success');
}
