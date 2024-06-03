import { Action, createReducer, on } from "@ngrx/store";
import { initialAuthState } from "../../utils/constacts";
import { restoreAuthState, updateAuthState } from "./actions";
import { AuthState } from "../../models/abstract-models";

const _reducer = createReducer(
  initialAuthState,
  on(updateAuthState, (_, { newState }) => newState),
  on(restoreAuthState, (_, { state }) => state)
)

export const authReducer = (state: AuthState | undefined, action: Action) => _reducer(state, action);
