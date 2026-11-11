import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-become-teacher-cta',
  imports: [RouterLink],
  templateUrl: './become-teacher-cta.html',
  styleUrl: './become-teacher-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeTeacherCta {}

