import { createAction, props } from "@ngrx/store";
import { ProductState, UpdateStateProps } from "../../models/abstract-models";

export const enum ProductStateActionName {
  getProduct = '[Product] Get single product by id.',
  getProductStart = '[Product] Get signle product by id start.',
  updateProductState = '[Product] Update product state.',
  productStateError = '[Product] Product state error.',
  cancelGetProduct = '[Product] Cancel get product.',
  clearProductState = '[Product] Clear product state.'
}

export const getProduct = createAction(ProductStateActionName.getProduct, props<{ id: string }>());
export const getProductStart = createAction(ProductStateActionName.getProductStart, props<{ id: string }>());
export const updateProductState = createAction(ProductStateActionName.updateProductState, props<UpdateStateProps<ProductState>>());
export const cancelGetProduct = createAction(ProductStateActionName.cancelGetProduct);
export const clearProductState = createAction(ProductStateActionName.clearProductState);
export const productStateError = createAction(ProductStateActionName.productStateError, props<{ error: any }>())
