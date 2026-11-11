import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TeacherAvatarSpec } from '../../../domain/entities/home.entity';
import { TeacherAvatarComponent } from '../teacher-avatar/teacher-avatar';

@Component({
  selector: 'app-hero-map-visual',
  imports: [TeacherAvatarComponent],
  templateUrl: './hero-map-visual.html',
  styleUrl: './hero-map-visual.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroMapVisual {
  readonly vocalAvatar = input<TeacherAvatarSpec | null>(null);
  readonly dancerAvatar = input<TeacherAvatarSpec | null>(null);
  readonly yogiAvatar = input<TeacherAvatarSpec | null>(null);
}
