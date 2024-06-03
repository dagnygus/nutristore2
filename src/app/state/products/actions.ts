import { createAction, props } from "@ngrx/store";
import { ProductsState, UpdateStateProps } from "../../models/abstract-models";
import { ProductCategory } from "../../models/object-models";

export const enum ProductsActionName {
  getProducts = '[Products] Get products.',
  getProductsStart = '[Products] Get producst start.',
  updateProductsState = '[Products] Update products state.',
  productsStateError = '[Products] Products state error.',
  cancelGetProducts = '[Products] Cancel get products.',
  clearProductsState = '[Products] clear products state'
}

export const getProducts = createAction(ProductsActionName.getProducts, props<{ category: ProductCategory }>());
export const getProductsStart = createAction(ProductsActionName.getProductsStart, props<{ category: ProductCategory }>());
export const updateProductsState = createAction(ProductsActionName.updateProductsState, props<UpdateStateProps<ProductsState>>());
export const productsStateError = createAction(ProductsActionName.productsStateError, props<{ error: any }>());
export const cancelGetProducts = createAction(ProductsActionName.cancelGetProducts);
export const clearProductsState = createAction(ProductsActionName.clearProductsState)
