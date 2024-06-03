import { Action, createReducer, on } from "@ngrx/store";
import { updateProductsState } from "./actions";
import { ProductsState } from "../../models/abstract-models";
import { initialProductsState } from "../../utils/constacts";

const _reducer = createReducer(
  initialProductsState,
  on(updateProductsState, (_, { newState }) => newState),
);

export const productsReducer = (state: ProductsState | undefined, action: Action) => _reducer(state, action);
