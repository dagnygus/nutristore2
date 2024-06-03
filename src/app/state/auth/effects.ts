import { Injectable } from "@angular/core";
import { AppHttpService } from "../../common/services/app-http.service";
import { AuthStateRef } from "./state";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { NzScheduler, Priority } from "../../noop-zone";
import { authStateError, logout, signin, signinStart, signup, signupStart, updatePasswordSuccess, updateUser, updateUserStart, updateAuthState, updatePassword, updatePasswordStart, restoreAuthState } from "./actions";
import { catchError, exhaustMap, filter, map, of, tap } from "rxjs";
import { createAction } from "@ngrx/store";
import { initialAuthState } from "../../utils/constacts";
import { BrowserCache } from "../../common/services/browser-cache.service";
import { AuthData, BrowserCacheKey } from "../../models/abstract-models";

@Injectable()
export class AuthStateEffects {

  signin$ = createEffect(() => this._actions$.pipe(
    ofType(signin),
    filter(() => this._authStateRef.state.data === null),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => signinStart(action))
  ));

  signinStart = createEffect(() => this._actions$.pipe(
    ofType(signinStart),
    exhaustMap(({ loginModel }) => this._httpService.login(loginModel).pipe(
      map((data) => updateAuthState({ oldState: this._authStateRef.state, newState: { data } })),
      catchError((error) => of(authStateError({ error })))
    ))
  ));

  signup$ = createEffect(() => this._actions$.pipe(
    ofType(signup),
    filter(() => this._authStateRef.state.data === null),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => signupStart(action))
  ));

  signupStart$ = createEffect(() => this._actions$.pipe(
    ofType(signupStart),
    exhaustMap(({ registerModel }) => this._httpService.registerUser(registerModel).pipe(
      map((data) => updateAuthState({ oldState: this._authStateRef.state, newState: { data } })),
      catchError((error) => of(authStateError({ error })))
    ))
  ));

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(logout),
    filter(() => this._authStateRef.state.data !== null),
    map(() => updateAuthState({ oldState: this._authStateRef.state, newState: initialAuthState }))
  ));

  updatePassword$ = createEffect(() => this._actions$.pipe(
    ofType(updatePassword),
    filter(() => this._authStateRef.state.data !== null),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => updatePasswordStart(action))
  ));

  updatePasswordStart$ = createEffect(() => this._actions$.pipe(
    ofType(updatePasswordStart),
    exhaustMap(({ newPasswordModel }) => this._httpService.updatePassword(newPasswordModel).pipe(
      map(() => updatePasswordSuccess()),
      catchError((error) => of(authStateError({ error })))
    ))
  ));

  updateUser$ = createEffect(() => this._actions$.pipe(
    ofType(updateUser),
    filter(() => this._authStateRef.state.data !== null),
    this._nzScheduler.switchOn(Priority.idle),
    map((action) => updateUserStart(action))
  ));

  updateUserStart$ = createEffect(() => this._actions$.pipe(
    ofType(updateUserStart),
    exhaustMap(({ updateUserModel }) => this._httpService.updateUser(updateUserModel, this._authStateRef.state.data!).pipe(
      map((data) => updateAuthState({ oldState: this._authStateRef.state, newState: { data } })),
      catchError((error) => of(authStateError({ error })))
    ))
  ));

  onStateUpdate$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    tap(({ newState }) => {
      if (newState.data) {
        this._browserCache.setObject(BrowserCacheKey.CURRENT_USER, newState.data);
      } else {
        this._browserCache.removeKey(BrowserCacheKey.CURRENT_USER);
      }
    })
  ), { dispatch: false });

  restoreState$ = createEffect(() => of(this._browserCache.getObject<AuthData>(BrowserCacheKey.CURRENT_USER)!).pipe(
    filter((data) => data !== null),
    map((data) => restoreAuthState({ state: { data } }))
  ))

  constructor(
    private _httpService: AppHttpService,
    private _authStateRef: AuthStateRef,
    private _actions$: Actions,
    private _nzScheduler: NzScheduler,
    private _browserCache: BrowserCache
  ) {}
}
