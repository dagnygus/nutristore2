import { Action, createReducer, on } from "@ngrx/store";
import { initialSearchState } from "../../utils/constacts";
import { updateSearchState } from "./search.actions";
import { SearchState } from "../../models/abstract-models";

const _reducer = createReducer(
  initialSearchState,
  on(updateSearchState, (_, { newState }) => newState)
)

export const searchReducer = (state: SearchState | undefined, action: Action) => _reducer(state, action);
