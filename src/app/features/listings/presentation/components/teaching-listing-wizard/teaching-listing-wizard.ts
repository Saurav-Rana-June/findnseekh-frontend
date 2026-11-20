import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CustomDropdown,
  CustomDropdownOption,
} from '../../../../../shared/components/custom-dropdown/custom-dropdown';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { TeachingMode } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { TeachingLevel } from '../../../domain/entities/teaching-listing.entity';

@Component({
  selector: 'app-teaching-listing-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, CustomTextField, CustomDropdown],
  templateUrl: './teaching-listing-wizard.html',
  styleUrl: './teaching-listing-wizard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachingListingWizardComponent {
  readonly form = input.required<FormGroup>();
  readonly currentStep = input.required<1 | 2 | 3>();
  readonly categoryOptions = input.required<readonly CustomDropdownOption<number>[]>();
  readonly priceUnitOptions = input.required<readonly CustomDropdownOption<string>[]>();
  readonly levels = input.required<
    readonly { readonly value: TeachingLevel; readonly label: string }[]
  >();
  readonly teachingModes = input.required<
    readonly { readonly value: TeachingMode; readonly label: string; readonly icon: string }[]
  >();

  readonly stepSelected = output<1 | 2 | 3>();
  readonly levelSelected = output<TeachingLevel>();
  readonly modeSelected = output<TeachingMode>();
  readonly categorySelected = output<number>();
  readonly priceUnitSelected = output<string>();

  onSelectStep(step: 1 | 2 | 3): void {
    this.stepSelected.emit(step);
  }

  onSelectLevel(level: TeachingLevel): void {
    this.levelSelected.emit(level);
  }

  onSelectMode(mode: TeachingMode): void {
    this.modeSelected.emit(mode);
  }

  onSelectCategory(catId: number): void {
    this.categorySelected.emit(catId);
  }

  onSelectPriceUnit(unit: string): void {
    this.priceUnitSelected.emit(unit);
  }
}
