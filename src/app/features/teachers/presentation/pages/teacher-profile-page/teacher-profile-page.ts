import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import {
  CustomTeacherCard,
  TeacherCardData,
  TeachingMode,
} from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { TeacherAvatarComponent } from '../../../../../shared/components/teacher-avatar/teacher-avatar';
import { Teacher } from '../../../domain/entities/teacher.entity';
import { TeachersRepository } from '../../../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';

@Component({
  selector: 'app-teacher-profile-page',
  imports: [
    RouterLink,
    CustomCloseOutlinedButton,
    CustomPrimaryButton,
    CustomStatusPill,
    TeacherAvatarComponent,
    CustomTeacherCard,
    CustomModal,
  ],
  templateUrl: './teacher-profile-page.html',
  styleUrl: './teacher-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getTeacherById = inject(GetTeacherByIdUseCase);
  private readonly teachersRepo = inject(TeachersRepository);

  protected readonly teacher = signal<Teacher | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly notFound = signal<boolean>(false);
  protected readonly similarTeachers = signal<readonly Teacher[]>([]);

  // Interactive booking state
  protected readonly isBookingOpen = signal<boolean>(false);
  protected readonly bookingSuccess = signal<boolean>(false);
  protected readonly selectedSessionType = signal<'enquiry' | 'trial' | 'regular'>('enquiry');
  protected readonly selectedBookingMode = signal<TeachingMode>('online');

  // Save & Share states
  protected readonly isSaved = signal<boolean>(false);

  // FAQ Accordion state
  protected readonly openFaqIndex = signal<number | null>(0);

  protected readonly teacherFirstName = computed(() => {
    const name = this.teacher()?.name;
    return name ? name.split(' ')[0] : 'Instructor';
  });

  protected readonly modeBadge = computed(() => {
    const t = this.teacher();
    if (!t) return null;
    switch (t.teachingMode) {
      case 'online':
        return { label: 'Online Only', icon: '💻' };
      case 'offline':
        return { label: 'In Person', icon: '👤' };
      case 'both':
        return { label: 'Online & In Person', icon: '👥' };
      default:
        return null;
    }
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (!id) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }

        this.loadTeacher(id);
      });
  }

  private loadTeacher(id: string): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.getTeacherById
      .execute(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.isLoading.set(false);
          if (!result) {
            this.notFound.set(true);
            return;
          }

          this.teacher.set(result);
          this.selectedBookingMode.set(result.teachingMode === 'offline' ? 'offline' : 'online');
          this.loadSimilarTeachers(result.categoryId, result.id);
        },
        error: () => {
          this.isLoading.set(false);
          this.notFound.set(true);
        },
      });
  }

  private loadSimilarTeachers(categoryId: string, currentId: string): void {
    this.teachersRepo
      .getTeachers({ category: categoryId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        const filtered = list.filter((t) => t.id !== currentId).slice(0, 3);
        this.similarTeachers.set(filtered);
      });
  }

  protected onBack(): void {
    this.router.navigate(['/teachers']);
  }

  protected onToggleSave(): void {
    this.isSaved.update((val) => !val);
  }

  protected onShare(): void {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: this.teacher()?.name,
        text: `Check out ${this.teacher()?.name}'s profile on FindnSeekh`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  protected onOpenBooking(type: 'enquiry' | 'trial' | 'regular' = 'enquiry'): void {
    this.selectedSessionType.set(type);
    this.bookingSuccess.set(false);
    this.isBookingOpen.set(true);
  }

  protected onCloseBooking(): void {
    this.isBookingOpen.set(false);
  }

  protected onConfirmBooking(): void {
    this.bookingSuccess.set(true);
    setTimeout(() => {
      this.isBookingOpen.set(false);
      this.bookingSuccess.set(false);
    }, 2400);
  }

  protected toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  protected onViewTeacher(t: TeacherCardData): void {
    this.router.navigate(['/teachers', t.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

