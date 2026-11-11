import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

const LOGO_ASPECT_RATIO = 2884 / 618;

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="logo" routerLink="/" aria-label="FindnSeekh – home">
      <img
        [src]="src()"
        alt="FindnSeekh"
        [attr.height]="height()"
        [attr.width]="width()"
        [style.height.px]="height()"
      />
    </a>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    .logo img {
      width: auto;
    }
  `,
})
export class LogoComponent {
  readonly variant = input<'green' | 'white'>('green');
  readonly height = input<number>(36);

  protected readonly src = computed(() =>
    this.variant() === 'green'
      ? 'assets/logos/findnseekh-logo-green.svg'
      : 'assets/logos/findnseekh-logo-white.svg',
  );

  protected readonly width = computed(() => Math.round(this.height() * LOGO_ASPECT_RATIO));
}

