import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
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
import { Teacher, TeacherListing } from '../../../domain/entities/teacher.entity';
import { TeachersRepository } from '../../../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';

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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly getTeacherById = inject(GetTeacherByIdUseCase);
  private readonly sendTeacherEnquiry = inject(SendTeacherEnquiryUseCase);
  private readonly teachersRepo = inject(TeachersRepository);

  protected readonly teacher = signal<Teacher | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly notFound = signal<boolean>(false);
  protected readonly similarTeachers = signal<readonly Teacher[]>([]);

  // Interactive booking state
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

  protected readonly selectedListing = computed(() => {
    const t = this.teacher();
    const id = this.selectedListingId();
    if (!t?.listings || id === null) return null;
    return t.listings.find((l) => l.id === id) ?? null;
  });

  // Save & Share states
  protected readonly isSaved = signal<boolean>(false);
  protected readonly isCopiedToast = signal<boolean>(false);

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
        return { label: `In-Person (${t.city || 'Local'})`, icon: '👤' };
      case 'both':
        return { label: 'Online & in person', icon: '👥' };
      default:
        return null;
    }
  });

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
          if (result.listings && result.listings.length > 0) {
            this.selectedListingId.set(result.listings[0].id);
          }

          if (isPlatformBrowser(this.platformId)) {
            try {
              const raw = localStorage.getItem('findnseekh_saved_teachers');
              const saved: string[] = raw ? JSON.parse(raw) : [];
              this.isSaved.set(saved.includes(result.id));
            } catch {}
          }

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
    const t = this.teacher();
    if (!t) return;
    this.isSaved.update((val) => {
      const next = !val;
      if (isPlatformBrowser(this.platformId)) {
        try {
          const raw = localStorage.getItem('findnseekh_saved_teachers');
          const saved: string[] = raw ? JSON.parse(raw) : [];
          const updated = next
            ? Array.from(new Set([...saved, t.id]))
            : saved.filter((id) => id !== t.id);
          localStorage.setItem('findnseekh_saved_teachers', JSON.stringify(updated));
        } catch {}
      }
      return next;
    });
  }

  protected onShare(): void {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: this.teacher()?.name,
        text: `Check out ${this.teacher()?.name}'s profile on FindnSeekh`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.isCopiedToast.set(true);
        setTimeout(() => this.isCopiedToast.set(false), 3000);
      }).catch(() => {});
    }
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

  protected onEnquireForListing(listing: TeacherListing): void {
    this.selectedListingId.set(listing.id);
    if (listing.teachingMode === 'online' || listing.teachingMode === 'offline') {
      this.selectedBookingMode.set(listing.teachingMode);
    }
    this.onOpenBooking('enquiry');
  }

  protected onSelectListing(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const val = select.value ? Number(select.value) : null;
    this.selectedListingId.set(val);
    if (val !== null) {
      const listing = this.teacher()?.listings?.find((l) => l.id === val);
      if (listing && (listing.teachingMode === 'online' || listing.teachingMode === 'offline')) {
        this.selectedBookingMode.set(listing.teachingMode);
      }
    }
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

  protected onConfirmBooking(): void {
    const t = this.teacher();
    if (!t) return;

    this.isSubmittingBooking.set(true);
    this.bookingError.set(null);

    this.sendTeacherEnquiry
      .execute(t.id, {
        teachingMode: this.selectedBookingMode(),
        preferredDate: this.preferredDate(),
        message: this.bookingMessage(),
        skillListingId: this.selectedListingId() ?? undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingBooking.set(false);
          this.bookingSuccess.set(true);
          this.bookingMessage.set('');
          setTimeout(() => {
            this.isBookingOpen.set(false);
            this.bookingSuccess.set(false);
          }, 2400);
        },
        error: (err) => {
          this.isSubmittingBooking.set(false);
          this.bookingError.set(
            err?.error?.message || err?.message || 'Failed to send enquiry. Please try again.',
          );
        },
      });
  }

  protected toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  protected getStarCount(rating?: number): number {
    return Math.min(5, Math.max(1, Math.round(rating || 5)));
  }

  protected onViewTeacher(t: TeacherCardData): void {
    this.router.navigate(['/teachers', t.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

