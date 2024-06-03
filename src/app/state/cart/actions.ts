import { createAction, props } from "@ngrx/store";
import { CartItem, CartState, UpdateStateProps } from "../../models/abstract-models";

export const enum CartActionName {
  addCartItem = '[Cart] add cart item.',
  changeQuantity = '[Cart] change quantity.',
  increaseCount = '[Cart] increase count.',
  decreaseCount = '[Cart] decrease count.',
  removeItem = '[Cart] remove item.',
  clearCart = '[Cart] clear cart.',
  updateCartState = '[Cart] update cart state',
  restoreCartState = '[Cart] restore cart state'
}

export const addCartItem = createAction(CartActionName.addCartItem, props<{ item: CartItem }>());
export const changeCartItemQuantity = createAction(CartActionName.changeQuantity, props<{ index: number, newCount: number }>());
export const increaseCartItemCount = createAction(CartActionName.increaseCount, props<{ index: number }>());
export const decreaseCartItemCount = createAction(CartActionName.decreaseCount, props<{ index: number }>());
export const removeCartItem = createAction(CartActionName.removeItem, props<{ index: number }>());
export const clearCart = createAction(CartActionName.clearCart);
export const updateCartState = createAction(CartActionName.updateCartState, props<UpdateStateProps<CartState>>());
export const restoreCartState = createAction(CartActionName.restoreCartState, props<{ state: CartState }>())
