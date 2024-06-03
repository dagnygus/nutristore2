import { initialCartState } from './../../utils/constacts';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addCartItem, changeCartItemQuantity, clearCart, decreaseCartItemCount, increaseCartItemCount, removeCartItem, restoreCartState, updateCartState } from "./actions";
import { filter, map, of, tap } from "rxjs";
import { CartStateRef } from "./state";
import { getPriceAsNumber, getTotalPriceAsNumber, getTotalPriceFromItems } from "../../utils/utils";
import { BrowserCacheKey, CartState } from "../../models/abstract-models";
import { BrowserCache } from '../../common/services/browser-cache.service';


function _validateIndex(index: number, lenght: number): void {
  if (!Number.isInteger(index)) {
    throw new Error('Invalid index!')
  }

  if (index < 0 || index >= lenght) {
    throw new Error('Index out of the range!')
  }
}

@Injectable()
export class CartStateEffects {

  addCartItem$ = createEffect(() => this._actions.pipe(
    ofType(addCartItem),
    map(({ item }) => {
      const items = this._cartRef.state.items.slice();
      const index = items.findIndex((it) => it.id === item.id);

      if (index > -1) {
        items[index] = {
          ...items[index],
          quantity: items[index].quantity + item.quantity,
          totalPrice: (getTotalPriceAsNumber(items[index]) + getTotalPriceAsNumber(item)) + '$'
        }
      } else {
        items.push(item);
      }

      const newState: CartState = {
        items,
        totalPrice: getTotalPriceFromItems(items)
      }

      return updateCartState({ oldState: this._cartRef.state, newState })
    })
  ));

  changeCartItemCount$ = createEffect(() => this._actions.pipe(
    ofType(changeCartItemQuantity),
    map(({ index, newCount }) => {
      if (newCount < 0 || !Number.isInteger(newCount)) {
        throw new Error('Invalid new item count!');
      }

      _validateIndex(index, this._cartRef.state.items.length);

      const items = this._cartRef.state.items.slice();
      items[index] =  {
        ...items[index],
        quantity: newCount
      }

      const newState: CartState = {
        items,
        totalPrice: getTotalPriceFromItems(items)
      }

      return updateCartState({ oldState: this._cartRef.state, newState });
    })
  ));

  increaseCartItemCount$ = createEffect(() => this._actions.pipe(
    ofType(increaseCartItemCount),
    map(({ index }) => {
      _validateIndex(index, this._cartRef.state.items.length);
      const items = this._cartRef.state.items.slice();
      const priceAsNumber = getPriceAsNumber(items[index]);
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + 1,
        totalPrice: ((items[index].quantity + 1) * priceAsNumber) + '$'
      }

      const newState: CartState = {
        items,
        totalPrice: getTotalPriceFromItems(items)
      }

      return updateCartState({ oldState: this._cartRef.state, newState });
    })
  ));

  decreaseCartItemCount$ = createEffect(() => this._actions.pipe(
    ofType(decreaseCartItemCount),
    filter(({ index }) => {
      _validateIndex(index, this._cartRef.state.items.length)
      return this._cartRef.state.items[index].quantity > 1
    }),
    map(({ index }) => {
      const items = this._cartRef.state.items.slice();
      const priceAsNumber = getPriceAsNumber(items[index]);
      items[index] = {
        ...items[index],
        quantity: items[index].quantity - 1,
        totalPrice: ((items[index].quantity - 1) * priceAsNumber) + '$'
      }

      const newState: CartState = {
        items,
        totalPrice: getTotalPriceFromItems(items)
      }

      return updateCartState({ oldState: this._cartRef.state, newState });
    })
  ));

  removeCartItem$ = createEffect(() => this._actions.pipe(
    ofType(removeCartItem),
    map(({ index }) => {
      _validateIndex(index, this._cartRef.state.items.length);

      if (index === 0 && this._cartRef.state.items.length === 1) {
        return updateCartState({ oldState: this._cartRef.state, newState: initialCartState });
      }

      const items = this._cartRef.state.items.slice();
      items.splice(index, 1);
      const newState: CartState = {
        items,
        totalPrice: getTotalPriceFromItems(items)
      }

      return updateCartState({ oldState: this._cartRef.state, newState });
    })
  ));

  clearCartState$ = createEffect(() => this._actions.pipe(
    ofType(clearCart),
    filter(() => this._cartRef.state !== initialCartState),
    map(() => updateCartState({ oldState: this._cartRef.state, newState: initialCartState }))
  ));

  onStateUpdate$ = createEffect(() => this._actions.pipe(
    ofType(updateCartState),
    tap(({ newState }) => {
      if (newState === initialCartState) {
        this._browserCache.removeKey(BrowserCacheKey.CART_STATE)
      } else {
        this._browserCache.setObject(BrowserCacheKey.CART_STATE, newState)
      }
    })
  ), { dispatch: false });

  restoreState$ = createEffect(() => of(this._browserCache.getObject<CartState>(BrowserCacheKey.CART_STATE)!).pipe(
    filter((state) => state != null),
    map((state) => restoreCartState({ state }))
  ))

  constructor(
    private _actions: Actions,
    private _cartRef: CartStateRef,
    private _browserCache: BrowserCache
  ){}
}
