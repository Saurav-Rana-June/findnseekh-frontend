import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TeacherHairStyle = 'short' | 'long' | 'bun' | 'curly';

export interface TeacherAvatarSpec {
  readonly skin: string;
  readonly hair: string;
  readonly hairStyle: TeacherHairStyle;
  readonly outfit: string;
  readonly background: string;
}

/**
 * Shared SVG teacher avatar generator component.
 * Renders stylized illustrated avatars with customizable hair styles, outfits, skin tones, and backgrounds.
 */
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

