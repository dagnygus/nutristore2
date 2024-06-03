import { createAction, props } from "@ngrx/store";
import { SearchState, UpdateStateProps } from "../../models/abstract-models";

export const enum SearchStateActionName {
  searchProducts = '[Search] search products.',
  searchProductsStart = '[Search] search products start.',
  updateSearchState = '[Search] update search state.',
  clearSearchState = '[Search] clear search state.'
}

export const searchProduct = createAction(SearchStateActionName.searchProducts, props<{ searchKey: string }>());
export const searchProductStart = createAction(SearchStateActionName.searchProductsStart, props<{ searchKey: string }>());
export const updateSearchState = createAction(SearchStateActionName.updateSearchState, props<UpdateStateProps<SearchState>>());
export const clearSearchState = createAction(SearchStateActionName.clearSearchState);
