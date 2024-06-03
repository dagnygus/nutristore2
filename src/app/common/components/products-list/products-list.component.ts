import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { CartItem, ProductsItem } from '../../../models/abstract-models';
import { StateStatus } from '../../../models/object-models';
import { NzForModule, NzSwitchModule, initializeComponent } from '../../../noop-zone';
import { ProductsListItemComponent } from './products-list-item/products-list-item.component';
import { RANGE_8 } from '../../../utils/constacts';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'products-list',
  standalone: true,
  imports: [
    NzForModule,
    NzSwitchModule,
    ProductsListItemComponent,
    MatIconModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {
  cdRef = initializeComponent(this);
  RANGE_8 = RANGE_8;
  StateStatus = StateStatus

  @Input({ required: true }) data!: Signal<readonly ProductsItem[]>
  @Input({ required: true }) stateStatus!: Signal<StateStatus>;
  @Input() category!: Signal<string>;

  @Output() addItem = new EventEmitter<CartItem>()

  ngOnInit(): void {
    if (!this.category) {
      this.category = signal('');
    }
  }
}
