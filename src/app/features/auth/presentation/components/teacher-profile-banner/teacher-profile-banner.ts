import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../../../core/constants/app.constants';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';

@Component({
  selector: 'app-teacher-profile-banner',
  imports: [CustomPrimaryButton],
  templateUrl: './teacher-profile-banner.html',
  styleUrl: './teacher-profile-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherProfileBannerComponent {
  private readonly router = inject(Router);

  protected navigateToProfile(): void {
    void this.router.navigate(['/', APP_ROUTE_PATHS.profile]);
  }
}

