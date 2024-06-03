import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../../noop-zone';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  cdRef = initializeComponent(this);
}
