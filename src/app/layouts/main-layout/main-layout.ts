import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginModalComponent } from '../../features/auth/presentation/components/login-modal/login-modal';
import { RegisterModalComponent } from '../../features/auth/presentation/components/register-modal/register-modal';
import { TeacherProfileBannerComponent } from '../../features/auth/presentation/components/teacher-profile-banner/teacher-profile-banner';
import { AuthModalService } from '../../features/auth/presentation/state/auth-modal.service';
import { AuthStore } from '../../features/auth/presentation/state/auth.store';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SiteHeader,
    SiteFooter,
    LoginModalComponent,
    RegisterModalComponent,
    TeacherProfileBannerComponent,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly authModal = inject(AuthModalService);
  protected readonly authStore = inject(AuthStore);
}
