import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzLetModule, initializeComponent } from '../../noop-zone';
import { ProductsListComponent } from '../../common/components/products-list/products-list.component';
import { Route, RouterModule } from '@angular/router';
import { ProductsPageViewModel } from './products-page.vm';
import { MatDialog } from '@angular/material/dialog';
import { CartItem } from '../../models/abstract-models';
import { AddToCartDialogComponent } from '../../common/components/add-to-cart-dialog/add-to-cart-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [
    ProductsListComponent,
    NzLetModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsPageViewModel],
  host: { 'class': 'page' }
})
export class ProductsPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(ProductsPageViewModel);
  dialog = inject(MatDialog);

  onAddItem(cartItem: CartItem): void {
    this.dialog.open(AddToCartDialogComponent, { data: cartItem.name });
    this.vm.addItemToCart(cartItem);
  }
}

export const PRODUCTS_PAGE_ROUTES: Route[] = [
  { path: '', component: ProductsPageComponent }
]
