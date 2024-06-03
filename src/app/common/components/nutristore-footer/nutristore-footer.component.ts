import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../../noop-zone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'footer[nutristore]',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './nutristore-footer.component.html',
  styleUrl: './nutristore-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutristoreFooterComponent {
  cdRef = initializeComponent(this);
}
