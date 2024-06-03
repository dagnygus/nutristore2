import { Injectable, Signal } from "@angular/core";
import { ViewModelBase } from "./models/object-models";
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, filter, map, merge, tap } from "rxjs";
import { BreakpointObserver } from '@angular/cdk/layout'
import { NavigationEnd, Router } from "@angular/router";
import { AppState, AuthData, BrowserCacheKey, SearchItem } from "./models/abstract-models";
import { Store, select } from "@ngrx/store";
import { SearchStateRef } from "./state/search/search.state";
import { NzScheduler, Priority } from "./noop-zone";
import { clearSearchState, searchProduct } from "./state/search/search.actions";
import { AuthStateRef } from "./state/auth/state";
import { BrowserCache } from "./common/services/browser-cache.service";
import { Actions, ofType } from "@ngrx/effects";
import { authStateError, logout, signinStart, signupStart, updateAuthState, updatePasswordStart, updatePasswordSuccess, updateUserStart } from "./state/auth/actions";

const _ANONYMOUS_SEGMENTS: string[] = ['product', 'products', 'cart', 'wholesale', 'payment-methods', 'delivery-cost', 'regulations'];
const _AUTHORIZED_SEGMENTS: string[] = ['account', 'password', 'update', 'checkout'];
const _AUTH_FORMS_SEGMENTS: string[] = ['register', 'login'];

@Injectable()
export class AppViewModel extends ViewModelBase {
  private _sidenavVisible$ = new BehaviorSubject(false);
  private _searchKey$ = new Subject<string>();

  sidenavVisible: Signal<boolean>;
  searchItems: Signal<readonly SearchItem[]>;
  authData: Signal<AuthData | null>;
  cartItemsCount: Signal<number>;
  onBeginSigninOrSignup: Observable<unknown>;
  onAuthUpdateOrError: Observable<unknown>;
  onChangePasswordStart: Observable<unknown>;
  onChangePasswordDone: Observable<unknown>;
  onUpdateUserStart: Observable<unknown>;

  constructor(
    breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _authStateRef: AuthStateRef,
    private _store: Store<AppState>,
    private _searchRef: SearchStateRef,
    nzScheduler: NzScheduler,
    private _browserCache: BrowserCache,
    actions$: Actions
  ) {
    super();
    this.sidenavVisible = this.toSignal(
      false,
      merge(
        this._sidenavVisible$.pipe(
          map((value) => {
            if (breakpointObserver.isMatched('(min-width: 1024px)')) {
              return false;
            }
            return value;
          })
        ),
        breakpointObserver.observe('(min-width: 1024px)').pipe(
          map(() => false)
        ),
        _router.events.pipe(
          filter((e) => e instanceof NavigationEnd),
          map(() => false)
        )
      ).pipe(
        distinctUntilChanged(),
        tap((value) => {
          if (this._sidenavVisible$.getValue() !== value) {
            this._sidenavVisible$.next(value);
          }
        })
      )
    );

    this.searchItems = this.toSignal(
      _searchRef.state.results,
      _store.pipe(
        select(({ search }) => search.results),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this._searchKey$.pipe(
      debounceTime(400),
      this.takeUntilDestroy()
    ).subscribe((searchKey) => {
      _store.dispatch(searchProduct({ searchKey }));
    });

    this.authData = this.toSignal(
      _authStateRef.state.data,
      _store.pipe(
        select(({ auth }) => auth.data),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.cartItemsCount = this.toSignal(
      0,
      _store.pipe(
        select(({ cart }) => cart.items.length),
        nzScheduler.switchOn(Priority.low)
      )
    )

    this.onBeginSigninOrSignup = merge(
      actions$.pipe(ofType(signinStart)),
      actions$.pipe(ofType(signupStart))
    );

    this.onAuthUpdateOrError = merge(
      actions$.pipe(ofType(updateAuthState)),
      actions$.pipe(ofType(authStateError))
    );

    this.onChangePasswordStart = actions$.pipe(
      ofType(updatePasswordStart)
    )

    this.onChangePasswordDone = actions$.pipe(
      ofType(updatePasswordSuccess)
    )

    this.onUpdateUserStart = actions$.pipe(
      ofType(updateUserStart)
    )

    _store.pipe(
      select(({ router }) => router!),
      filter((router) => router != null),
      map(({state}) => state.segemntsPaths),
      distinctUntilChanged((prev, curr) => {
        if (prev.length !== curr.length) {
          return false;
        }
        for (let i = 0; i < prev.length; i++) {
          if (prev[i] !== curr[i]) {
            return false;
          }
        }
        return true;
      }),
      this.takeUntilDestroy()
    ).subscribe((segemntsPaths) => {
      if (segemntsPaths.length) {
        if (!_AUTH_FORMS_SEGMENTS.includes(segemntsPaths[0])) {
          const prevUrl = _browserCache.getString(BrowserCacheKey.CURR_PAGE_URL);
          _browserCache.setString(BrowserCacheKey.CURR_PAGE_URL, '/' + segemntsPaths.join('/'))
          if (prevUrl) {
            _browserCache.setString(BrowserCacheKey.PREV_PAGE_URL, prevUrl);
          } else {
            _browserCache.setString(BrowserCacheKey.PREV_PAGE_URL, '/');
          }
        }

        if (_ANONYMOUS_SEGMENTS.includes(segemntsPaths[0])) {
          const url = '/' + segemntsPaths.join('/');
          _browserCache.setString(BrowserCacheKey.TARGET_ANONYMOUS_URL, url);
          _browserCache.removeKey(BrowserCacheKey.TARGET_AUTHORIZED_URL);
        } else if (_AUTHORIZED_SEGMENTS.includes(segemntsPaths[0])) {
          const url = '/' + segemntsPaths.join('/');
          _browserCache.setString(BrowserCacheKey.TARGET_AUTHORIZED_URL, url)
        }
        return;
      }

      _browserCache.setString(BrowserCacheKey.TARGET_ANONYMOUS_URL, '/');
      _browserCache.setString(BrowserCacheKey.CURR_PAGE_URL, '/');
      _browserCache.setString(BrowserCacheKey.PREV_PAGE_URL, '/');
      _browserCache.removeKey(BrowserCacheKey.TARGET_AUTHORIZED_URL);
    });
  }

  showSidenav(): void {
    this._sidenavVisible$.next(true);
  }

  hideSidenav(): void {
    this._sidenavVisible$.next(false);
  }

  searchFor(key: string) {
    if (key !== this._searchRef.state.key) {
      this._searchKey$.next(key);
    }
  }

  clearSearchResult(): void {
    if (this._searchRef.isEmpty) { return; }
    this._store.dispatch(clearSearchState());
  }

  optionSelected(item: SearchItem): void {
    this._router.navigateByUrl(`/product/${item.id}`);
  }

  disposeBrowserCache(): void {
    this._browserCache.removeKey(BrowserCacheKey.TARGET_AUTHORIZED_URL);
  }

  logout(): void {
    this._store.dispatch(logout());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
