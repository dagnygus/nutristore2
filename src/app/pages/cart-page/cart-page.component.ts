import { StateStatus } from './../../models/object-models';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzForModule, NzLetModule, NzSwitchModule, initializeComponent } from '../../noop-zone';
import { CartPageViewModel } from './cart-page.vm';
import { Route, RouterModule } from '@angular/router';
import { CartItemComponent } from './cart-item/cart-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cart-page',
  standalone: true,
  imports: [
    NzForModule,
    CartItemComponent,
    MatButtonModule,
    NzLetModule,
    RouterModule,
    NzSwitchModule,
    MatIconModule
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartPageViewModel],
  host: { 'class': 'page' }
})
export class CartPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(CartPageViewModel);
  StateStatus = StateStatus
}

export const CART_PAGE_ROUTES: Route[] = [
  { path: '', component: CartPageComponent }
]
