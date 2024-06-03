import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../noop-zone';

@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [],
  templateUrl: './regulations-page.component.html',
  styleUrl: './regulations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationsPageComponent {
  cdRef = initializeComponent(this);
}
