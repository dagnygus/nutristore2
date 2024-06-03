import { Action, createReducer, on } from "@ngrx/store";
import { initialProductState } from "../../utils/constacts";
import { updateProductState } from "./actions";
import { ProductState } from "../../models/abstract-models";

const _reducer = createReducer(
  initialProductState,
  on(updateProductState, (_, { newState }) => newState)
)

export const productReducer = (state: ProductState | undefined, action: Action) => _reducer(state, action)
