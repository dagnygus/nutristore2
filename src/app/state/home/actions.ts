import { createAction, props } from "@ngrx/store";
import { HomePageState } from "../../models/abstract-models";

export const enum HomeStateActionName {
  getProducts = '[Home] Get products for home page.',
  getProductsStart = '[Home] Get products for home page start.',
  updateHomeState = '[Home] update home state.',
  homeStateError = '[Home] home state error.',
  cancelGetProdcuts = '[Home] cancel get products for home page.',
  clearHomeState = '[Home] clear home state.'
}

export const getProductsForHomePage = createAction(HomeStateActionName.getProducts);
export const getProductsForHomePageStart = createAction(HomeStateActionName.getProductsStart);
export const updateHomeState = createAction(HomeStateActionName.updateHomeState, props<{ oldState: HomePageState, newState: HomePageState }>());
export const homeStateError = createAction(HomeStateActionName.homeStateError, props<{ error: any }>());
export const clearHomeState = createAction(HomeStateActionName.clearHomeState);
export const cancelGerProductsForHomePage = createAction(HomeStateActionName.cancelGetProdcuts)
