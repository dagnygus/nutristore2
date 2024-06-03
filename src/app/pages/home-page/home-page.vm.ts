import { Injectable, OnDestroy, Signal, signal } from "@angular/core";
import { StateStatus, ViewModelBase } from "../../models/object-models";
import { Store, select } from "@ngrx/store";
import { AppState, CartItem, ProductsItem } from "../../models/abstract-models";
import { Actions, ofType } from "@ngrx/effects";
import { NzScheduler, Priority } from "../../noop-zone";
import { HomeStateRef } from "../../state/home/state";
import { cancelGerProductsForHomePage, clearHomeState, getProductsForHomePage, getProductsForHomePageStart, homeStateError, updateHomeState } from "../../state/home/actions";
import { distinctUntilChanged, map, merge, share } from "rxjs";
import { addCartItem } from "../../state/cart/actions";

@Injectable()
export class HomePageViewModel extends ViewModelBase implements OnDestroy {

  newestProducts: Signal<readonly ProductsItem[]>;
  recomendedProducts: Signal<readonly ProductsItem[]>;
  mostPopularProducts: Signal<readonly ProductsItem[]>;

  newestStatus: Signal<StateStatus>;
  recomendedStatus: Signal<StateStatus>;
  mostPopularStatus: Signal<StateStatus>;

  newestCategory = signal('newest').asReadonly();
  recomendedCategory = signal('recomended').asReadonly();
  mostPopularCategory = signal('most populat').asReadonly();

  constructor(
    private _store: Store<AppState>,
    homeStateRef: HomeStateRef,
    nzScheduler: NzScheduler,
    actions$: Actions
  ) {
    super();

    const newestSource = _store.pipe(
      select(({ home }) => home.newest),
      nzScheduler.switchOn(Priority.low)
    );

    const recomendedSource = _store.pipe(
      select(({ home }) => home.recomended),
      nzScheduler.switchOn(Priority.low)
    );

    const mostPopularSource = _store.pipe(
      select(({ home }) => home.mostPopular),
      nzScheduler.switchOn(Priority.low)
    );

    this.newestProducts = this.toSignal(homeStateRef.state.newest, newestSource);
    this.recomendedProducts = this.toSignal(homeStateRef.state.recomended, recomendedSource);
    this.mostPopularProducts = this.toSignal(homeStateRef.state.mostPopular, mostPopularSource);

    const pendingStatusSource = actions$.pipe(ofType(getProductsForHomePageStart), map(() => StateStatus.pending), share());
    const errorStatusSource = actions$.pipe(ofType(homeStateError), map(() => StateStatus.error), share());

    const newestStatusSource = merge(
      pendingStatusSource,
      errorStatusSource,
      actions$.pipe(
        ofType(updateHomeState),
        map(({ newState }) => newState.newest.length ? StateStatus.complete : StateStatus.empty)
      ),
    ).pipe(
      distinctUntilChanged(),
      nzScheduler.switchOn(Priority.low)
    );

    this.newestStatus = this.toSignal(
      homeStateRef.state.newest.length ? StateStatus.complete : StateStatus.empty,
      newestStatusSource
    );

    const recomendedStatusSource = merge(
      pendingStatusSource,
      errorStatusSource,
      actions$.pipe(
        ofType(updateHomeState),
        map(({ newState }) => newState.recomended.length ? StateStatus.complete : StateStatus.empty)
      )
    ).pipe(
      distinctUntilChanged(),
      nzScheduler.switchOn(Priority.low)
    );

    this.recomendedStatus = this.toSignal(
      homeStateRef.state.recomended.length ? StateStatus.complete : StateStatus.empty,
      recomendedStatusSource
    );

    const mostPopularStatusSource = merge(
      pendingStatusSource,
      errorStatusSource,
      actions$.pipe(
        ofType(updateHomeState),
        map(({ newState }) => newState.mostPopular.length ? StateStatus.complete : StateStatus.empty)
      )
    ).pipe(
      distinctUntilChanged(),
      nzScheduler.switchOn(Priority.low)
    );

    this.mostPopularStatus = this.toSignal(
      homeStateRef.state.mostPopular.length ? StateStatus.complete : StateStatus.empty,
      mostPopularStatusSource
    )

    _store.dispatch(getProductsForHomePage());
  }

  addCartItem(item: CartItem): void {
    this._store.dispatch(addCartItem({ item }));
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._store.dispatch(cancelGerProductsForHomePage());
    this._store.dispatch(clearHomeState());
  }
}
