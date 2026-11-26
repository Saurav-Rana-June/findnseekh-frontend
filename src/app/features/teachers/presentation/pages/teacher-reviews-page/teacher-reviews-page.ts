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
import { BreadcrumbItem, CustomBreadcrumb } from '../../../../../shared/components/custom-breadcrumb/custom-breadcrumb';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { TeachingMode } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { TeacherAvatarComponent } from '../../../../../shared/components/teacher-avatar/teacher-avatar';
import { Teacher, TeacherReview } from '../../../domain/entities/teacher.entity';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';

export type ReviewFilter = 'all' | '5' | '4' | '3';

@Component({
  selector: 'app-teacher-reviews-page',
  standalone: true,
  imports: [
    RouterLink,
    CustomBreadcrumb,
    CustomCloseOutlinedButton,
    CustomPrimaryButton,
    CustomModal,
    TeacherAvatarComponent,
  ],
  templateUrl: './teacher-reviews-page.html',
  styleUrl: './teacher-reviews-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherReviewsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getTeacherById = inject(GetTeacherByIdUseCase);
  private readonly sendTeacherEnquiry = inject(SendTeacherEnquiryUseCase);

  protected readonly teacher = signal<Teacher | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly notFound = signal<boolean>(false);
  protected readonly selectedFilter = signal<ReviewFilter>('all');

  // Breadcrumbs
  protected readonly reviewCrumbs = computed((): readonly BreadcrumbItem[] => {
    const teacher = this.teacher();
    return [
      { label: 'Home', route: '/' },
      { label: 'Teachers', route: '/teachers' },
      ...(teacher ? [{ label: teacher.name, route: ['/teachers', teacher.id] as const }] : []),
      { label: 'Student Reviews' },
    ];
  });

  // Reviews & Filtering
  readonly allReviews = computed<readonly TeacherReview[]>(() => {
    return this.teacher()?.reviews || [];
  });

  protected readonly filteredReviews = computed<readonly TeacherReview[]>(() => {
    const list = this.allReviews();
    const filter = this.selectedFilter();
    if (filter === 'all') return list;

    const targetRating = Number(filter);
    return list.filter((r) => Math.floor(r.rating) === targetRating);
  });

  protected readonly teacherFirstName = computed(() => {
    const name = this.teacher()?.name;
    return name ? name.split(' ')[0] : 'Instructor';
  });

  // Rating breakdowns
  protected readonly ratingStats = computed(() => {
    const reviews = this.allReviews();
    const total = reviews.length;
    const count5 = reviews.filter((r) => r.rating >= 4.8).length;
    const count4 = reviews.filter((r) => r.rating >= 3.8 && r.rating < 4.8).length;
    const count3 = reviews.filter((r) => r.rating < 3.8).length;

    return {
      total,
      count5,
      count4,
      count3,
      pct5: total ? Math.round((count5 / total) * 100) : 0,
      pct4: total ? Math.round((count4 / total) * 100) : 0,
      pct3: total ? Math.round((count3 / total) * 100) : 0,
    };
  });

  // Booking / Enquiry Modal State
  protected readonly isBookingOpen = signal<boolean>(false);
  protected readonly bookingSuccess = signal<boolean>(false);
  protected readonly isSubmittingBooking = signal<boolean>(false);
  protected readonly bookingError = signal<string | null>(null);

  protected readonly minDate = signal<string>(this.formatDate(new Date()));
  protected readonly preferredDate = signal<string>(this.getTomorrowDate());
  protected readonly bookingMessage = signal<string>('');
  protected readonly selectedBookingMode = signal<TeachingMode>('online');

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
        },
        error: () => {
          this.isLoading.set(false);
          this.notFound.set(true);
        },
      });
  }

  protected onBackToProfile(): void {
    const t = this.teacher();
    if (t) {
      this.router.navigate(['/teachers', t.id]);
    } else {
      this.router.navigate(['/teachers']);
    }
  }

  protected setFilter(filter: ReviewFilter): void {
    this.selectedFilter.set(filter);
  }

  protected getStarCount(rating?: number): number {
    return Math.min(5, Math.max(1, Math.round(rating || 5)));
  }

  protected onOpenBooking(): void {
    this.bookingSuccess.set(false);
    this.bookingError.set(null);
    this.isSubmittingBooking.set(false);
    this.isBookingOpen.set(true);
  }

  protected onCloseBooking(): void {
    this.isBookingOpen.set(false);
    this.bookingError.set(null);
  }

  protected setBookingMode(mode: TeachingMode): void {
    this.selectedBookingMode.set(mode);
  }

  protected onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.preferredDate.set(input.value);
    }
  }

  protected onMessageChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    if (input) {
      this.bookingMessage.set(input.value);
    }
  }

  protected onSubmitBooking(): void {
    const t = this.teacher();
    if (!t) return;

    this.isSubmittingBooking.set(true);
    this.bookingError.set(null);

    this.sendTeacherEnquiry
      .execute(t.id, {
        teachingMode: this.selectedBookingMode(),
        preferredDate: this.preferredDate(),
        message: this.bookingMessage(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingBooking.set(false);
          this.bookingSuccess.set(true);
          this.bookingMessage.set('');
        },
        error: (err) => {
          this.isSubmittingBooking.set(false);
          this.bookingError.set(
            err?.error?.message || err?.message || 'Failed to send enquiry. Please try again.',
          );
        },
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(tomorrow);
  }
}
