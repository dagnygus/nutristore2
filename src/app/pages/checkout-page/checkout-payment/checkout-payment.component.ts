import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { initializeComponent } from '../../../noop-zone';
import { CheckoutPageViewModel } from '../checkout-page.vm';
import { FormInputComponent } from '../../../common/components/form-input/form-input.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'checkout-payment',
  standalone: true,
  imports: [
    FormInputComponent,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutPaymentComponent {
  cdRef = initializeComponent(this);
  vm = inject(CheckoutPageViewModel);
}
