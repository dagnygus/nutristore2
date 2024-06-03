import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem, ProductsItem } from '../../../../models/abstract-models';
import { ProductRatingComponent } from '../../products-rating/product-rating.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'products-list-item',
  standalone: true,
  imports: [
    ProductRatingComponent,
    MatIconModule,
    MatRippleModule
  ],
  templateUrl: './products-list-item.component.html',
  styleUrl: './products-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'mat-elevation-z3' }
})
export class ProductsListItemComponent implements OnChanges, AfterViewChecked {

  @Input({ required: true }) item!: ProductsItem;
  @Output() addItem = new EventEmitter<CartItem>();

  constructor(private _router: Router, private _changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('click')
  itemClick(): void {
    this._router.navigateByUrl(`/product/${this.item.id}`);
  }

  onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    const cartItem: CartItem = {
      id: this.item.id,
      imageUrl: this.item.imageUrl,
      name: this.item.name,
      quantity: 1,
      price: this.item.price,
      totalPrice: this.item.price
    }
    this.addItem.emit(cartItem);
  }

  ngOnChanges(_: SimpleChanges): void {
    this._changeDetectorRef.reattach();
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detach();
  }
}
