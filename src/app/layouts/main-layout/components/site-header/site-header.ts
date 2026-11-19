import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomPrimaryButton } from '../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomAvatarComponent } from '../../../../shared/components/custom-avatar/custom-avatar';
import { LogoComponent } from '../../../../shared/components/logo/logo';
import { AuthStore } from '../../../../features/auth/presentation/state/auth.store';

interface NavItem {
  readonly label: string;
  readonly fragment?: string;
  readonly route?: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home' },
  { label: 'Explore Skills', fragment: 'skills' },
  { label: 'How It Works', fragment: 'how-it-works' },
  { label: 'Become a Teacher', fragment: 'become-a-teacher' },
];

const OBSERVED_SECTIONS = ['skills', 'teachers', 'how-it-works', 'become-a-teacher'] as const;

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, LogoComponent, CustomPrimaryButton, CustomAvatarComponent],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly authStore = inject(AuthStore);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly navItems = computed<readonly NavItem[]>(() => {
    const isTeacher = this.authStore.isTeacher();
    const user = this.authStore.user();

    const items: NavItem[] = [
      { label: 'Home' },
      { label: 'Explore Skills', fragment: 'skills' },
      { label: 'How It Works', fragment: 'how-it-works' },
    ];

    if (!isTeacher) {
      items.push({ label: 'Become a Teacher', fragment: 'become-a-teacher' });
    }

    if (user) {
      items.push({
        label: isTeacher ? 'Student Inquiries' : 'My Enquiries',
        route: '/requests',
      });
    }

    return items;
  });
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);
  protected readonly activeSection = signal<string | null>(null);
  readonly loginRequested = output<void>();
  readonly registerRequested = output<void>();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.isMobileMenuOpen.set(false);
      });

    afterNextRender(() => {
      if (!this.isBrowser) {
        return;
      }

      const onScroll = () => this.isScrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.isMobileMenuOpen()) {
          this.isMobileMenuOpen.set(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);

      let observer: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== 'undefined') {
        const visible = new Set<string>();
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                visible.add(entry.target.id);
              } else {
                visible.delete(entry.target.id);
              }
            }
            const next = OBSERVED_SECTIONS.find((id) => visible.has(id)) ?? null;
            this.activeSection.set(next);
          },
          { rootMargin: '-35% 0px -60% 0px' },
        );

        for (const id of OBSERVED_SECTIONS) {
          const el = document.getElementById(id);
          if (el) {
            observer.observe(el);
          }
        }
      }

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKeyDown);
        observer?.disconnect();
      });
    });
  }

  protected isItemActive(item: NavItem): boolean {
    if (item.route) {
      return this.router.url.startsWith(item.route);
    }
    const section = this.activeSection();
    if (!item.fragment) {
      return section === null && (this.router.url === '/' || this.router.url.startsWith('/#'));
    }
    return item.fragment === section;
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected onLoginClick(): void {
    this.isMobileMenuOpen.set(false);
    this.loginRequested.emit();
  }

  protected onRegisterClick(): void {
    this.isMobileMenuOpen.set(false);
    this.registerRequested.emit();
  }

  protected onLogoutClick(): void {
    this.isMobileMenuOpen.set(false);
    this.authStore.logout(() => {
      void this.router.navigate(['/']);
    });
  }
}
