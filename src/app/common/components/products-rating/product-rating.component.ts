import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Priority, initializeComponent } from '../../../noop-zone';

@Component({
  selector: 'product-rating',
  standalone: true,
  imports: [],
  templateUrl: './product-rating.component.html',
  styleUrl: './product-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRatingComponent {
  @Input({ required: true }) rating!: number;
}
