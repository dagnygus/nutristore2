import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzForModule, NzLetModule, initializeComponent } from '../../../noop-zone';
import { CheckoutCartItemComponent } from './checkout-cart-item/checkout-cart-item.component';
import { CheckoutPageViewModel } from '../checkout-page.vm';

@Component({
  selector: 'checkout-cart',
  standalone: true,
  imports: [CheckoutCartItemComponent, NzForModule, NzLetModule],
  templateUrl: './checkout-cart.component.html',
  styleUrl: './checkout-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutCartComponent {
  cdRef = initializeComponent(this);
  vm = inject(CheckoutPageViewModel);
}
