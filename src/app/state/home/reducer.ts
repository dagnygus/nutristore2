import { Action, createReducer, on } from "@ngrx/store";
import { initialHomePageState } from "../../utils/constacts";
import { updateHomeState } from "./actions";
import { HomePageState } from "../../models/abstract-models";

const _reducer = createReducer(
  initialHomePageState,
  on(updateHomeState, (_, { newState }) => newState)
);

export const homeReducer = (state: HomePageState | undefined, action: Action) => _reducer(state, action);
