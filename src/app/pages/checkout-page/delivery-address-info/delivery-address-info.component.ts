import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIfModule, NzLetModule, initializeComponent } from '../../../noop-zone';
import { CheckoutPageViewModel } from '../checkout-page.vm';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../common/components/form-input/form-input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'delivery-address-info',
  standalone: true,
  imports: [
    NzIfModule,
    ReactiveFormsModule,
    FormInputComponent,
    MatButtonModule,
    NzLetModule
  ],
  templateUrl: './delivery-address-info.component.html',
  styleUrl: './delivery-address-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryAddressInfoComponent {
  cdRef = initializeComponent(this);
  vm = inject(CheckoutPageViewModel)
}
