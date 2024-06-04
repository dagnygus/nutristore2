import { Injectable, Signal, computed, signal } from "@angular/core";
import { StateStatus, ViewModelBase } from "../../models/object-models";
import { AppState, CartItem, ProductData } from "../../models/abstract-models";
import { ProductStateRef } from "../../state/product/state";
import { Store, select } from "@ngrx/store";
import { NavigationEnd, Router } from "@angular/router";
import { RouterStateRef } from "../../state/router/state";
import { NzScheduler, Priority } from "../../noop-zone";
import { distinctUntilChanged, filter, map, merge, tap } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { getProduct, getProductStart, productStateError, updateProductState } from "../../state/product/actions";
import { addCartItem } from "../../state/cart/actions";

@Injectable()
export class ProductPageViewModel extends ViewModelBase {

  private _productCount = signal(1);

  productData: Signal<ProductData | null>;
  stateStatus: Signal<StateStatus>;
  productCount = this._productCount.asReadonly()
  productQuantity = computed(() => `Quantity: ${this._productCount()}`);
  totalPrice = computed(() => {
    const data = this.productData();
    if (data) {
      return `Total price: ${+data.price.replace('$', '') * this._productCount()}$`
    }
    return '$';
  })

  constructor(
    private _store: Store<AppState>,
    productRef: ProductStateRef,
    router: Router,
    routerStareRef: RouterStateRef,
    nzSchdeuler: NzScheduler,
    actions$: Actions
  ) {
    super();

    this.productData = this.toSignal(
      productRef.state.productData,
      _store.pipe(
        select(({ product }) => product.productData),
        nzSchdeuler.switchOn(Priority.low)
      )
    );

    const statusSource = merge(
      actions$.pipe(
        ofType(getProductStart),
        map(() => StateStatus.pending)
      ),
      actions$.pipe(
        ofType(productStateError),
        map(() => StateStatus.error)
      ),
      actions$.pipe(
        ofType(updateProductState),
        map(({ newState }) => newState.productData ? StateStatus.complete : StateStatus.error)
      )
    ).pipe(
      distinctUntilChanged(),
      nzSchdeuler.switchOn(Priority.low)
    );

    this.stateStatus = this.toSignal(
      productRef.state.productData ? StateStatus.complete : StateStatus.empty,
      statusSource
    );
    
    _store.pipe(
      select(({ router }) => router?.state.params['productId']),
      filter((id) => id != null),
    ).subscribe((id) => _store.dispatch(getProduct({ id })))
  }

  incraseCount(): void {
    this._productCount.update((value) => ++value);
  }

  decreaseCount(): void {
    this._productCount.update((value) => Math.max(1, --value));
  }

  addItemToCart(): void {
    const productData = this.productData();
    if (productData === null) { return; }
    const count = this._productCount();
    const item: CartItem = {
      id: productData.id,
      imageUrl: productData.imageUrl,
      name: productData.name,
      price: productData.price,
      quantity: count,
      totalPrice: (count * (+productData.price.replace('$', ''))) + '$'
    };
    this._store.dispatch(addCartItem({ item }));
  }
}
