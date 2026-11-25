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
import {
  CourseCardData,
  CustomCourseCard,
} from '../../../../../shared/components/custom-course-card/custom-course-card';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { TeachingMode } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { TeacherAvatarComponent } from '../../../../../shared/components/teacher-avatar/teacher-avatar';
import { Teacher, TeacherListing } from '../../../domain/entities/teacher.entity';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';

@Component({
  selector: 'app-teacher-courses-page',
  standalone: true,
  imports: [
    RouterLink,
    CustomBreadcrumb,
    CustomCloseOutlinedButton,
    CustomPrimaryButton,
    CustomCourseCard,
    CustomModal,
    TeacherAvatarComponent,
  ],
  templateUrl: './teacher-courses-page.html',
  styleUrl: './teacher-courses-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCoursesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getTeacherById = inject(GetTeacherByIdUseCase);
  private readonly sendTeacherEnquiry = inject(SendTeacherEnquiryUseCase);

  protected readonly teacher = signal<Teacher | null>(null);

  protected readonly courseCrumbs = computed((): readonly BreadcrumbItem[] => {
    const teacher = this.teacher();
    return [
      { label: 'Home', route: '/' },
      { label: 'Teachers', route: '/teachers' },
      ...(teacher ? [{ label: teacher.name, route: ['/teachers', teacher.id] as const }] : []),
      { label: 'Courses & Classes' },
    ];
  });
  protected readonly isLoading = signal<boolean>(true);
  protected readonly notFound = signal<boolean>(false);

  // Booking / Enquiry Modal State
  protected readonly isBookingOpen = signal<boolean>(false);
  protected readonly bookingSuccess = signal<boolean>(false);
  protected readonly isSubmittingBooking = signal<boolean>(false);
  protected readonly bookingError = signal<string | null>(null);

  protected readonly minDate = signal<string>(this.formatDate(new Date()));
  protected readonly preferredDate = signal<string>(this.getTomorrowDate());
  protected readonly bookingMessage = signal<string>('');
  protected readonly selectedSessionType = signal<'enquiry' | 'trial' | 'regular'>('enquiry');
  protected readonly selectedBookingMode = signal<TeachingMode>('online');
  protected readonly selectedListingId = signal<number | null>(null);

  readonly courses = computed<readonly TeacherListing[]>(() => {
    return this.teacher()?.listings || [];
  });

  protected readonly selectedListing = computed(() => {
    const t = this.teacher();
    const id = this.selectedListingId();
    if (!t?.listings || id === null) return null;
    return t.listings.find((l) => l.id === id) ?? null;
  });

  protected readonly teacherFirstName = computed(() => {
    const name = this.teacher()?.name;
    return name ? name.split(' ')[0] : 'Instructor';
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
          if (result.listings && result.listings.length > 0) {
            this.selectedListingId.set(result.listings[0].id);
          }
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

  protected onEnquireForListing(course: CourseCardData): void {
    this.selectedListingId.set(course.id);
    if (course.teachingMode === 'online' || course.teachingMode === 'offline') {
      this.selectedBookingMode.set(course.teachingMode);
    }
    this.onOpenBooking('enquiry');
  }

  protected onOpenBooking(type: 'enquiry' | 'trial' | 'regular' = 'enquiry'): void {
    this.selectedSessionType.set(type);
    this.bookingSuccess.set(false);
    this.bookingError.set(null);
    this.isSubmittingBooking.set(false);
    this.isBookingOpen.set(true);
  }

  protected onCloseBooking(): void {
    this.isBookingOpen.set(false);
    this.bookingError.set(null);
    this.isSubmittingBooking.set(false);
  }

  protected onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.preferredDate.set(input.value);
    }
  }

  protected onMessageChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea) {
      this.bookingMessage.set(textarea.value);
    }
  }

  protected onSelectBookingMode(mode: TeachingMode): void {
    this.selectedBookingMode.set(mode);
  }

  protected onSubmitBooking(): void {
    const t = this.teacher();
    if (!t) return;

    this.isSubmittingBooking.set(true);
    this.bookingError.set(null);

    const payload = {
      teachingMode: this.selectedBookingMode(),
      preferredDate: this.preferredDate() || undefined,
      message: this.bookingMessage().trim() || undefined,
      skillListingId: this.selectedListingId() ?? undefined,
    };

    this.sendTeacherEnquiry
      .execute(t.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingBooking.set(false);
          this.bookingSuccess.set(true);
        },
        error: (err) => {
          this.isSubmittingBooking.set(false);
          const msg =
            err?.error?.message ||
            err?.message ||
            'Failed to send enquiry. Please try again.';
          this.bookingError.set(msg);
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
