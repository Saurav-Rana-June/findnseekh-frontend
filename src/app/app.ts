import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocationService } from './core/services/location.service';
import { LocationPermissionModal } from './shared/components/location-permission-modal/location-permission-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LocationPermissionModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly locationService = inject(LocationService);

  constructor() {
    afterNextRender(() => {
      void this.locationService.evaluateFirstVisitPrompt();
    });
  }
}
