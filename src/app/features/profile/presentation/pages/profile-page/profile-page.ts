import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../../../core/constants/app.constants';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { CustomAvatarComponent } from '../../../../../shared/components/custom-avatar/custom-avatar';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import { CustomImageCropperModalComponent } from '../../../../../shared/components/custom-image-cropper-modal/custom-image-cropper-modal';
import {
  TeacherProfileUpdatePayload,
  TeachingMode,
} from '../../../../auth/domain/entities/auth.entity';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';

interface TeachingModeOption {
  readonly value: TeachingMode;
  readonly label: string;
  readonly hint: string;
}

const TEACHING_MODES: readonly TeachingModeOption[] = [
  {
    value: 'both',
    label: 'Both Modes',
    hint: 'Offer both online and local in-person lessons',
  },
  {
    value: 'online',
    label: 'Online Only',
    hint: 'Teach remotely via video conferencing',
  },
  {
    value: 'offline',
    label: 'In-person Only',
    hint: 'Teach face-to-face at your location or student place',
  },
];

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    CustomTextField,
    CustomPrimaryButton,
    CustomStatusPill,
    CustomAvatarComponent,
    CustomCloseOutlinedButton,
    CustomImageCropperModalComponent,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly teachingModes = TEACHING_MODES;
  protected readonly isSavedRecently = signal(false);

  protected onBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  // Avatar Upload & 1:1 Cropper State
  protected readonly profileImageUrl = signal<string | null>(null);
  protected readonly selectedRawImage = signal<string | null>(null);
  protected readonly isCropperOpen = signal(false);

  // Skills state
  protected readonly skills = signal<string[]>(['Guitar', 'Music Theory']);
  protected readonly skillInputValue = signal('');
  protected readonly showAllSuggestions = signal(false);
  protected readonly popularSuggestions: readonly string[] = [
    'Guitar',
    'Yoga',
    'Python Programming',
    'Mathematics',
    'Spoken English',
    'Drawing & Painting',
    'Piano & Keyboard',
    'Vocal & Singing',
    'Physics',
    'Dance',
    'Baking & Cooking',
    'Web Development',
  ];

  protected readonly unaddedSuggestions = computed(() => {
    return this.popularSuggestions.filter((s) => !this.hasSkill(s));
  });

  protected readonly visibleSuggestions = computed(() => {
    const list = this.unaddedSuggestions();
    return this.showAllSuggestions() ? list : list.slice(0, 6);
  });

  protected readonly remainingSuggestionsCount = computed(() => {
    const list = this.unaddedSuggestions();
    return Math.max(0, list.length - 6);
  });

  protected readonly user = this.authStore.user;
  protected readonly isTeacher = computed(
    () => this.user()?.roles.includes('teacher') ?? false,
  );
  protected readonly teacherProfile = this.authStore.teacherProfile;

  protected readonly form = this.fb.nonNullable.group({
    bio: ['', [Validators.maxLength(1000)]],
    qualification: ['', [Validators.maxLength(150)]],
    experienceYears: [0, [Validators.min(0), Validators.max(80)]],
    teachingMode: ['both' as TeachingMode, [Validators.required]],
    phone: ['', [Validators.maxLength(20)]],
    city: ['', [Validators.maxLength(100)]],
    state: ['', [Validators.maxLength(100)]],
  });

  constructor() {
    effect(() => {
      const profile = this.teacherProfile();
      if (profile) {
        this.form.patchValue({
          bio: profile.bio ?? '',
          qualification: profile.qualification ?? '',
          experienceYears: profile.experienceYears ?? 0,
          teachingMode: profile.teachingMode ?? 'both',
          city: profile.city ?? '',
          state: profile.state ?? '',
        });
        if (profile.skills && profile.skills.length > 0) {
          this.skills.set([...profile.skills]);
        }
      }
      const user = this.user();
      if (user?.phone) {
        this.form.patchValue({ phone: user.phone });
      }
    });
  }

  protected triggerFileInput(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedRawImage.set(reader.result as string);
      this.isCropperOpen.set(true);
      // Reset input value so same file can be picked again if desired
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  protected onImageCropped(croppedDataUrl: string): void {
    this.profileImageUrl.set(croppedDataUrl);
    this.isCropperOpen.set(false);
    this.selectedRawImage.set(null);
  }

  protected onCropperClosed(): void {
    this.isCropperOpen.set(false);
    this.selectedRawImage.set(null);
  }

  protected setTeachingMode(mode: TeachingMode): void {
    this.form.controls.teachingMode.setValue(mode);
  }

  protected onSkillInputChange(value: string): void {
    this.skillInputValue.set(value);
  }

  protected addSkillsFromInput(): void {
    const raw = this.skillInputValue().trim();
    if (!raw) return;

    // Split by comma, semicolon, newline, or pipe to allow adding multiple skills at a time
    const newItems = raw
      .split(/[,;\n|]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (newItems.length === 0) return;

    const current = this.skills();
    const currentLower = new Set(current.map((s) => s.toLowerCase()));
    const toAdd: string[] = [];

    for (const item of newItems) {
      if (!currentLower.has(item.toLowerCase())) {
        currentLower.add(item.toLowerCase());
        toAdd.push(item);
      }
    }

    if (toAdd.length > 0) {
      this.skills.set([...current, ...toAdd]);
    }
    this.skillInputValue.set('');
  }

  protected onSkillInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addSkillsFromInput();
    }
  }

  protected addSuggestedSkill(skill: string): void {
    const current = this.skills();
    const exists = current.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (!exists) {
      this.skills.set([...current, skill]);
    }
  }

  protected removeSkill(skillToRemove: string): void {
    this.skills.set(this.skills().filter((s) => s !== skillToRemove));
  }

  protected clearAllSkills(): void {
    this.skills.set([]);
  }

  protected toggleShowAllSuggestions(): void {
    this.showAllSuggestions.update((prev) => !prev);
  }

  protected hasSkill(skill: string): boolean {
    const target = skill.trim().toLowerCase();
    return this.skills().some((s) => s.toLowerCase() === target);
  }

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: TeacherProfileUpdatePayload = {
      bio: raw.bio.trim() || null,
      qualification: raw.qualification.trim() || null,
      skills: this.skills(),
      experienceYears: Number(raw.experienceYears) || 0,
      teachingMode: raw.teachingMode,
      phone: raw.phone.trim() || null,
      city: raw.city.trim() || null,
      state: raw.state.trim() || null,
    };

    this.authStore.updateTeacherProfile(payload, () => {
      this.isSavedRecently.set(true);
      setTimeout(() => this.isSavedRecently.set(false), 3500);
    });
  }

  protected navigateToExplore(): void {
    void this.router.navigate(['/', APP_ROUTE_PATHS.root]);
  }
}


