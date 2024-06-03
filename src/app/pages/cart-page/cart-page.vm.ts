import { Injectable, Signal } from "@angular/core";
import { StateStatus, ViewModelBase } from "../../models/object-models";
import { AppState, CartItem } from "../../models/abstract-models";
import { Store, select } from "@ngrx/store";
import { CartStateRef } from "../../state/cart/state";
import { NzScheduler, Priority } from "../../noop-zone";
import { clearCart, decreaseCartItemCount, increaseCartItemCount, removeCartItem, updateCartState } from "../../state/cart/actions";
import { Actions, ofType } from "@ngrx/effects";
import { map } from "rxjs";

@Injectable()
export class CartPageViewModel extends ViewModelBase {

  cartItems: Signal<readonly CartItem[]>;
  totalPrice: Signal<string>;
  stateStatus: Signal<StateStatus>;

  constructor(
    private _store: Store<AppState>,
    private _cartRef: CartStateRef,
    actions$: Actions,
    nzScheduler: NzScheduler
  ) {
    super();

    this.cartItems = this.toSignal(
      _cartRef.state.items,
      _store.pipe(
        select(({ cart }) => cart.items),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.totalPrice = this.toSignal(
      _cartRef.state.totalPrice,
      _store.pipe(
        select(({ cart }) => cart.totalPrice),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.stateStatus = this.toSignal(
      _cartRef.state.items.length > 0 ? StateStatus.complete : StateStatus.empty,
      actions$.pipe(
        ofType(updateCartState),
        map(({ newState }) => newState.items.length > 0 ? StateStatus.complete : StateStatus.empty)
      )
    );
  }


  increaseCartItemCount(index: number): void {
    this._store.dispatch(increaseCartItemCount({ index }));
  }

  decreaseCartItemCount(index: number): void {
    if (this._cartRef.state.items[index].quantity === 1) { return; }
    this._store.dispatch(decreaseCartItemCount({ index }));
  }

  removeCartItem(index: number): void {
    this._store.dispatch(removeCartItem({ index }));
  }

  clearCart(): void {
    this._store.dispatch(clearCart());
  }
}
