import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { initializeComponent } from '../../noop-zone';
import { HomePageViewModel } from './home-page.vm';
import { ProductsListComponent } from '../../common/components/products-list/products-list.component';
import { CartItem } from '../../models/abstract-models';
import { MatDialog } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../../common/components/add-to-cart-dialog/add-to-cart-dialog.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [ProductsListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ HomePageViewModel ],
  host: { 'class': 'page' }
})
export class HomePageComponent {
  cdRef = initializeComponent(this);
  vm = inject(HomePageViewModel);
  dialog = inject(MatDialog);

  onAddItem(cartItem: CartItem): void {
    this.vm.addCartItem(cartItem);
    this.dialog.open(AddToCartDialogComponent, { data: cartItem.name });
  }
}
