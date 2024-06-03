import { AfterContentChecked, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CartPageViewModel } from '../cart-page.vm';
import { CartItem } from '../../../models/abstract-models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cart-item',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent implements OnChanges, AfterViewChecked {

  @Input({ required: true }) cartItem!: CartItem;
  @Input({ required: true }) index!: number;

  vm = inject(CartPageViewModel);
  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('cartItem' in changes) {
      this._cdRef.reattach();
    }
  }

  ngAfterViewChecked(): void {
    this._cdRef.detach();
  }
}
