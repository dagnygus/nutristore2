import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppHttpService } from "../../common/services/app-http.service";
import { SearchStateRef } from "./search.state";
import { NzScheduler, Priority } from "../../noop-zone";
import { clearSearchState, searchProduct, searchProductStart, updateSearchState } from "./search.actions";
import { filter, map, of, switchMap } from "rxjs";
import { SearchState } from "../../models/abstract-models";
import { initialSearchState } from "../../utils/constacts";

@Injectable()
export class SearchStateEffects {

  searchProduct$ = createEffect(() => this._actions$.pipe(
    ofType(searchProduct),
    filter(({ searchKey }) => this._searchRef.state.key !== searchKey),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => searchProductStart(action))
  ));

  searchProductStart$ = createEffect(() => this._actions$.pipe(
    ofType(searchProductStart),
    switchMap(({ searchKey }) => {
      if (!searchKey) {
        return of(updateSearchState({ oldState: this._searchRef.state, newState: initialSearchState }))
      }

      return this._httpService.getSearchResult(searchKey, 20).pipe(
        map((results) => {
          const newState: SearchState = {
            key: searchKey,
            results
          };

          return updateSearchState({ oldState: this._searchRef.state, newState });
        })
      )
    })
  ));

  clearSearchState$ = createEffect(() => this._actions$.pipe(
    ofType(clearSearchState),
    filter(() => this._searchRef.state !== initialSearchState),
    map(() => updateSearchState({ oldState: this._searchRef.state, newState: initialSearchState }))
  ));

  constructor(
    private _actions$: Actions,
    private _httpService: AppHttpService,
    private _searchRef: SearchStateRef,
    private _nzScheduler: NzScheduler
  ) {}
}
