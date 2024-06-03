import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../noop-zone';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-methods-page',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './payment-methods-page.component.html',
  styleUrl: './payment-methods-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodsPageComponent {
  cdRef = initializeComponent(this);
}
