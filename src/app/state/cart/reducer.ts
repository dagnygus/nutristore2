import { Action, createReducer, on } from "@ngrx/store";
import { initialCartState } from "../../utils/constacts";
import { restoreCartState, updateCartState } from "./actions";
import { CartState } from "../../models/abstract-models";

const _reducer = createReducer(
  initialCartState,
  on(updateCartState, (_, { newState }) => newState),
  on(restoreCartState, (_, { state }) => state)
);


export const cartReducer = (state: CartState | undefined, action: Action) => _reducer(state, action);
