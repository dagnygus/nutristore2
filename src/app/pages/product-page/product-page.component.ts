import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIfModule, NzLetModule, NzSwitchModule, initializeComponent } from '../../noop-zone';
import { ProductPageViewModel } from './product-page.vm';
import { Route, RouterModule } from '@angular/router';
import { ProductRatingComponent } from '../../common/components/products-rating/product-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { StateStatus } from '../../models/object-models';
import { LoadingSpinnerComponent } from '../../common/components/loading-spinner/loading-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../../common/components/add-to-cart-dialog/add-to-cart-dialog.component';

@Component({
  selector: 'product-page',
  standalone: true,
  imports: [
    ProductRatingComponent,
    NzIfModule,
    NzSwitchModule,
    MatIconModule,
    MatRippleModule,
    NzLetModule,
    MatButtonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductPageViewModel],
  host: { 'class': 'page' }
})
export class ProductPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(ProductPageViewModel);
  StateStatus = StateStatus
  dialog = inject(MatDialog)

  onAddButtonClick(): void {
    this.vm.addItemToCart();
    this.dialog.open(AddToCartDialogComponent, {
      data: this.vm.productData()!.name
    })
  }
}

export const PRODUCT_PAGE_ROUTES: Route[] = [
  { path: '', component: ProductPageComponent }
]
