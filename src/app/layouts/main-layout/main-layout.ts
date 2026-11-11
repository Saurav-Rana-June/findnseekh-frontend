import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginModalComponent } from '../../features/auth/presentation/components/login-modal/login-modal';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SiteHeader, SiteFooter, LoginModalComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly isLoginModalOpen = signal(false);
}
