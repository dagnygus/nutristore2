import { ChangeDetectionStrategy, Component } from '@angular/core';
import { initializeComponent } from '../../noop-zone';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'wholesale-page',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './wholesale-page.component.html',
  styleUrl: './wholesale-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WholesalePageComponent {
  cdRef = initializeComponent(this);
}
