import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CartItem } from '../../../../models/abstract-models';

@Component({
  selector: 'checkout-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './checkout-cart-item.component.html',
  styleUrl: './checkout-cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'mat-elevation-z3' }
})
export class CheckoutCartItemComponent implements OnChanges, AfterViewChecked {
  private _cdRef = inject(ChangeDetectorRef);

  @Input({ required: true }) item!: CartItem;

  ngOnChanges(changes: SimpleChanges): void {
    this._cdRef.reattach();
  }

  ngAfterViewChecked(): void {
    this._cdRef.detach();
  }
}
