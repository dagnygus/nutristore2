import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppHttpService } from "../../common/services/app-http.service";
import { ProductStateRef } from "./state";
import { NzScheduler, Priority } from "../../noop-zone";
import { cancelGetProduct, clearProductState, getProduct, getProductStart, productStateError, updateProductState } from "./actions";
import { catchError, filter, map, of, switchMap, takeUntil, tap } from "rxjs";
import { initialProductState } from "../../utils/constacts";

@Injectable()
export class ProductStateEffects {

  getProduct$ = createEffect(() => this._actions$.pipe(
    ofType(getProduct),
    filter(({ id }) => this._productRef.state.productData?.id !== id),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => getProductStart(action))
  ));

  getProductStart$ = createEffect(() => this._actions$.pipe(
    ofType(getProductStart),
    switchMap(({ id }) => this._httpService.getProductById(id).pipe(
      map((productData) => updateProductState({ oldState: this._productRef.state, newState: { productData } })),
      catchError((error) => of(productStateError({ error }))),
      takeUntil(this._actions$.pipe(ofType(cancelGetProduct)))
    ))
  ));

  clearProductState$ = createEffect(() => this._actions$.pipe(
    ofType(clearProductState),
    filter(() => this._productRef.state !== initialProductState),
    map(() => updateProductState({ oldState: this._productRef.state, newState: initialProductState }))
  ))

  constructor(
    private _actions$: Actions,
    private _httpService: AppHttpService,
    private _productRef: ProductStateRef,
    private _nzScheduler: NzScheduler
  ) {}
}
