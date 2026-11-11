import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocationService } from '../../../core/services/location.service';
import { CustomModal } from '../custom-modal/custom.modal';
import { CustomPrimaryButton } from '../custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../custom-status-pill/custom.status.pill';

/**
 * First-visit location permission modal built on CustomModal and CustomPrimaryButton.
 */
@Component({
  selector: 'app-location-permission-modal',
  imports: [CustomModal, CustomPrimaryButton, CustomStatusPill],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-custom-modal
      [open]="locationService.shouldPrompt()"
      title="Find teachers near you"
      subtitle="Allow location access to discover local skill instructors and workshops in your neighbourhood."
      closeLabel="Close location prompt"
      size="sm"
      (closed)="onDismiss()"
    >
      <app-custom-status-pill
        modal-header-extra
        class="location-modal__badge"
        variant="soft"
        size="sm"
        icon="location"
        label="Location Permission"
      />

      <div class="location-modal__content">
        @if (locationService.errorMessage(); as errorMessage) {
          <div class="location-modal__alert" role="alert">
            {{ errorMessage }}
          </div>
        } @else {
          <p class="location-modal__note">
            Your browser will ask for permission. We only use your approximate location to surface
            nearby teachers.
          </p>
        }

        <div class="location-modal__actions">
          <app-custom-primary-button
            variant="outline"
            label="Not Now"
            [fullWidth]="true"
            [disabled]="isLoading()"
            (clicked)="onDismiss()"
          />
          <app-custom-primary-button
            variant="primary"
            [label]="isLoading() ? 'Locating...' : 'Allow Location'"
            [fullWidth]="true"
            [loading]="isLoading()"
            (clicked)="onAllow()"
          />
        </div>
      </div>
    </app-custom-modal>
  `,
  styles: `
    .location-modal__badge {
      margin-bottom: 12px;
    }

    .location-modal__content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .location-modal__note {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--color-muted, #6b7280);
    }

    .location-modal__alert {
      padding: 10px 14px;
      border-radius: var(--radius-sm, 10px);
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--color-danger, #dc2626);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .location-modal__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    @media (max-width: 420px) {
      .location-modal__actions {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class LocationPermissionModal {
  protected readonly locationService = inject(LocationService);
  protected readonly isLoading = computed(() => this.locationService.status() === 'loading');

  protected onAllow(): void {
    this.locationService.requestLocation();
  }

  protected onDismiss(): void {
    this.locationService.dismissPrompt();
  }
}

