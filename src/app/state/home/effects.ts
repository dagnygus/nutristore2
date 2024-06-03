import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppHttpService } from "../../common/services/app-http.service";
import { NzScheduler, Priority } from "../../noop-zone";
import { HomeStateRef } from "./state";
import { cancelGerProductsForHomePage, clearHomeState, getProductsForHomePage, getProductsForHomePageStart, homeStateError, updateHomeState } from "./actions";
import { catchError, exhaustMap, filter, map, of, switchMap, takeUntil } from "rxjs";
import { initialHomePageState } from "../../utils/constacts";
import { HomePageState } from "../../models/abstract-models";

@Injectable()
export class HomeStateEffects {

  getProductsForHomePage$ = createEffect(() => this._actions.pipe(
    ofType(getProductsForHomePage),
    filter(() => this._homeStateRef.state === initialHomePageState),
    this._nzScheduler.switchOn(Priority.idle),
    map(() => getProductsForHomePageStart())
  ));

  getProductsForHomePageStart$ = createEffect(() => this._actions.pipe(
    ofType(getProductsForHomePageStart),
    exhaustMap(() => this._httpService.getProductsForHomePage().pipe(
      map(({ newest, mostPopular, recomended }) => {
        const newState: HomePageState = {
          newest,
          mostPopular,
          recomended
        };
        return updateHomeState(({ oldState: this._homeStateRef.state, newState }))
      }),
      catchError((error) => of(homeStateError({ error }))),
      takeUntil(this._actions.pipe(ofType(cancelGerProductsForHomePage)))
    ))
  ));

  clearHomeState$ = createEffect(() => this._actions.pipe(
    ofType(clearHomeState),
    filter(() => this._homeStateRef.state !== initialHomePageState),
    map(() => updateHomeState({ oldState: this._homeStateRef.state, newState: initialHomePageState }))
  ));

  constructor(
    private _actions: Actions,
    private _httpService: AppHttpService,
    private _nzScheduler: NzScheduler,
    private _homeStateRef: HomeStateRef,
  ) {}
}
