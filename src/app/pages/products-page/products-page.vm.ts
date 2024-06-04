import { Store, select } from "@ngrx/store";
import { StateStatus, ViewModelBase } from "../../models/object-models";
import { AppState, CartItem, ProductsItem } from "../../models/abstract-models";
import { Injectable, OnDestroy, Signal, signal } from "@angular/core";
import { ProductsStateRef } from "../../state/products/state";
import { RouterStateRef } from "../../state/router/state";
import { NavigationEnd, Router } from "@angular/router";
import { distinctUntilChanged, filter, map, merge, switchMap, take, tap } from "rxjs";
import { cancelGetProducts, clearProductsState, getProducts, getProductsStart, productsStateError, updateProductsState } from "../../state/products/actions";
import { NzScheduler, Priority } from "../../noop-zone";
import { Actions, ofType } from "@ngrx/effects";
import { addCartItem } from "../../state/cart/actions";

@Injectable()
export class ProductsPageViewModel extends ViewModelBase implements OnDestroy {

  items: Signal<readonly ProductsItem[]>;
  category: Signal<string>;
  stateStatus: Signal<StateStatus>;

  constructor(
    private _store: Store<AppState>,
    productsRef: ProductsStateRef,
    routerStateRef: RouterStateRef,
    router: Router,
    nzScheduler: NzScheduler,
    actions$: Actions
  ) {
    super();

    this.items = this.toSignal(
      productsRef.state.items,
      _store.pipe(select(({ products }) => products.items), nzScheduler.switchOn(Priority.low))
    );

    this.category = this.toSignal('', _store.pipe(
      select(({ products }) => products.category.replaceAll('-', ' ').toUpperCase()),
      nzScheduler.switchOn(Priority.low)
    ));

    const statusSource = merge(
      actions$.pipe(
        ofType(getProductsStart),
        map(() => StateStatus.pending)
      ),
      actions$.pipe(
        ofType(updateProductsState),
        map(({ newState }) => newState.items.length ? StateStatus.complete : StateStatus.empty)
      ),
      actions$.pipe(
        ofType(productsStateError),
        map(() => StateStatus.error)
      )
    ).pipe(
      distinctUntilChanged(),
      nzScheduler.switchOn(Priority.low)
    );

    this.stateStatus = this.toSignal(
      productsRef.state.items.length ? StateStatus.complete : StateStatus.empty,
      statusSource
    );

    _store.pipe(
      select(({ router }) => router?.state.params['product-category']),
      filter((category) => category != null),
    ).subscribe((category) => _store.dispatch(getProducts({ category })));
  }

  addItemToCart(item: CartItem): void {
    this._store.dispatch(addCartItem({ item }));
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._store.dispatch(cancelGetProducts());
    this._store.dispatch(clearProductsState());
  }
}
