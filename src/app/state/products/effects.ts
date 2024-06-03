import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppHttpService } from "../../common/services/app-http.service";
import { cancelGetProducts, clearProductsState, getProducts, getProductsStart, productsStateError, updateProductsState } from "./actions";
import { ProductsStateRef } from "./state";
import { catchError, filter, map, of, switchMap, takeUntil } from "rxjs";
import { ProductsState } from "../../models/abstract-models";
import { NzScheduler, Priority } from "../../noop-zone";
import { initialProductsState } from "../../utils/constacts";

@Injectable()
export class ProductsEffects {

  getListedProducts$ = createEffect(() => this._actions$.pipe(
    ofType(getProducts),
    filter(({ category }) => this._productsRef.state.category !== category),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => getProductsStart(action))
  ));

  getListedProductsStart$ = createEffect(() => this._actions$.pipe(
    ofType(getProductsStart),
    switchMap(({ category }) => this._httpService.getProductsByCategory(category).pipe(
      map((items) => {
        const newState: ProductsState = {
          category,
          items
        };
        return updateProductsState({ oldState: this._productsRef.state, newState });
      }),
      catchError((error) => of(productsStateError({ error }))),
      takeUntil(this._actions$.pipe(ofType(cancelGetProducts)))
    ))
  ));

  clearProductsState$ = createEffect(() => this._actions$.pipe(
    ofType(clearProductsState),
    filter(() => this._productsRef.state !== initialProductsState),
    map(() => updateProductsState({ oldState: this._productsRef.state, newState: initialProductsState }))
  ));

  constructor(
    private _actions$: Actions,
    private _httpService: AppHttpService,
    private _productsRef: ProductsStateRef,
    private _nzScheduler: NzScheduler
  ) {}
}
