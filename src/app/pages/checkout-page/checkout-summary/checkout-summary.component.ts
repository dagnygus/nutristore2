import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzForModule, NzLetModule, initializeComponent } from '../../../noop-zone';
import { CheckoutPageViewModel } from '../checkout-page.vm';

@Component({
  selector: 'checkout-summary',
  standalone: true,
  imports: [
    NzLetModule,
    NzForModule
  ],
  templateUrl: './checkout-summary.component.html',
  styleUrl: './checkout-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutSummaryComponent {
  cdRef = initializeComponent(this);
  vm = inject(CheckoutPageViewModel);
}
