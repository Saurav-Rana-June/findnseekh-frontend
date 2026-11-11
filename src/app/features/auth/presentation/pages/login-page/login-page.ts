import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '../../state/auth.store';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly authStore = inject(AuthStore);
}

