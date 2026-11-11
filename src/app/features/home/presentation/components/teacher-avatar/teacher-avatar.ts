import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TeacherAvatarSpec } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-teacher-avatar',
  templateUrl: './teacher-avatar.html',
  styleUrl: './teacher-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherAvatarComponent {
  readonly spec = input.required<TeacherAvatarSpec>();
  readonly label = input<string>();
}

