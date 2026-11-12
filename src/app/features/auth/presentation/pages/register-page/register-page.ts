import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRole } from '../../../domain/entities/auth.entity';
import { RegisterFlowComponent } from '../../components/register-flow/register-flow';

@Component({
  selector: 'app-register-page',
  imports: [RegisterFlowComponent],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly route = inject(ActivatedRoute);
  private readonly initialRoleParam = this.route.snapshot.queryParamMap.get('role');

  protected readonly hasExplicitRole =
    this.initialRoleParam === 'teacher' || this.initialRoleParam === 'student';
  protected readonly initialRole: UserRole =
    this.initialRoleParam === 'teacher' ? 'teacher' : 'student';
}
