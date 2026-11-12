import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Globally reusable user avatar component.
 * Displays initials derived from name (or custom initials) inside a styled circular badge.
 * Supports configurable sizes, colors, font sizes, and borders.
 */
@Component({
  selector: 'app-custom-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.cp-avatar]': 'true',
    '[attr.data-size]': 'size()',
    '[style.--cp-avatar-size]': 'customSize()',
    '[style.--cp-avatar-bg]': 'bgColor()',
    '[style.--cp-avatar-color]': 'textColor()',
    '[style.--cp-avatar-border]': 'borderColor()',
    '[style.--cp-avatar-font-size]': 'fontSize()',
    '[attr.aria-label]': 'name() || label() || "User avatar"',
    'role': 'img',
  },
  template: `
    @if (imageUrl()) {
      <img
        class="cp-avatar__img"
        [src]="imageUrl()"
        [attr.alt]="name() || label() || 'User avatar'"
      />
    } @else {
      <span class="cp-avatar__initials" aria-hidden="true">{{ initials() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      user-select: none;
      line-height: 1;

      /* Defaults */
      --_size: var(--cp-avatar-size, 36px);
      --_bg: var(--cp-avatar-bg, var(--color-primary-50, #eef4f0));
      --_color: var(--cp-avatar-color, var(--color-primary, #174e38));
      --_border: var(--cp-avatar-border, 1.5px solid var(--color-primary-200, #bcd3c6));
      --_fs: var(--cp-avatar-font-size, 0.875rem);

      width: var(--_size);
      height: var(--_size);
      background: var(--_bg);
      color: var(--_color);
      border: var(--_border);
      font-family: var(--font-display, inherit);
      font-weight: 700;
      font-size: var(--_fs);
    }

    :host([data-size='xs']) {
      --_size: var(--cp-avatar-size, 24px);
      --_fs: var(--cp-avatar-font-size, 0.675rem);
      --_border: var(--cp-avatar-border, 1px solid var(--color-primary-200, #bcd3c6));
    }

    :host([data-size='sm']) {
      --_size: var(--cp-avatar-size, 28px);
      --_fs: var(--cp-avatar-font-size, 0.75rem);
      --_border: var(--cp-avatar-border, 1.5px solid var(--color-primary-200, #bcd3c6));
    }

    :host([data-size='md']) {
      --_size: var(--cp-avatar-size, 38px);
      --_fs: var(--cp-avatar-font-size, 0.95rem);
    }

    :host([data-size='lg']) {
      --_size: var(--cp-avatar-size, 48px);
      --_fs: var(--cp-avatar-font-size, 1.15rem);
      --_border: var(--cp-avatar-border, 2px solid var(--color-primary-200, #bcd3c6));
    }

    :host([data-size='xl']) {
      --_size: var(--cp-avatar-size, 60px);
      --_fs: var(--cp-avatar-font-size, 1.35rem);
      --_border: var(--cp-avatar-border, 2.5px solid var(--color-primary-200, #bcd3c6));
    }

    .cp-avatar__initials {
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .cp-avatar__img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
  `,
})
export class CustomAvatarComponent {
  readonly name = input<string>('');
  readonly imageUrl = input<string | null>(null);
  readonly customInitials = input<string>('');
  readonly label = input<string>('');
  readonly size = input<UserAvatarSize>('md');
  readonly customSize = input<string | null>(null);
  readonly bgColor = input<string | null>(null);
  readonly textColor = input<string | null>(null);
  readonly borderColor = input<string | null>(null);
  readonly fontSize = input<string | null>(null);

  protected readonly initials = computed(() => {
    if (this.customInitials()) {
      return this.customInitials().slice(0, 2).toUpperCase();
    }
    const clean = this.name().trim();
    if (!clean) {
      return 'U';
    }
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
}

