import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { initializeComponent } from '../../../noop-zone';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppViewModel } from '../../../app.vm';
import { ProductCategory } from '../../../models/object-models';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'sidenav-menu',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatRippleModule
  ],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavMenuComponent {
  cdRef = initializeComponent(this);
  vm = inject(AppViewModel);
  ProductCategory = ProductCategory;
}
