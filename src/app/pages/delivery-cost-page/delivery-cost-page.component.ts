import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../noop-zone';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-cost-page',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './delivery-cost-page.component.html',
  styleUrl: './delivery-cost-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryCostPageComponent {
  cdRef = initializeComponent(this);
}
