import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  readonly label: string;
  readonly route?: string | readonly unknown[];
}

/**
 * Shared trail used by listings, requests, teachers, and form pages.
 * The last item (or any item without `route`) is the current page.
 */
@Component({
  selector: 'app-custom-breadcrumb',
  imports: [RouterLink],
  templateUrl: './custom-breadcrumb.html',
  styleUrl: './custom-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBreadcrumb {
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly ariaLabel = input<string>('Breadcrumb');
  /** Drop the default bottom margin when the trail sits beside a back button. */
  readonly flush = input(false);
}
