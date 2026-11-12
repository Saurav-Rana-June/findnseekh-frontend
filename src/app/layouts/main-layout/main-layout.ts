import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginModalComponent } from '../../features/auth/presentation/components/login-modal/login-modal';
import { RegisterModalComponent } from '../../features/auth/presentation/components/register-modal/register-modal';
import { AuthModalService } from '../../features/auth/presentation/state/auth-modal.service';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SiteHeader, SiteFooter, LoginModalComponent, RegisterModalComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly authModal = inject(AuthModalService);
}
