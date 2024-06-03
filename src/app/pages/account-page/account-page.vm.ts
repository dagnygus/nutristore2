import { AuthStateRef } from './../../state/auth/state';
import { Store, select } from '@ngrx/store';
import { Injectable, Signal } from "@angular/core";
import { ViewModelBase } from "../../models/object-models";
import { AppState, AuthData } from "../../models/abstract-models";
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { BrowserCache } from '../../common/services/browser-cache.service';
import { NzScheduler, Priority } from '../../noop-zone';

@Injectable()
export class AccountPageViewModel extends ViewModelBase {

  userData: Signal<AuthData>;

  constructor(store: Store<AppState>,
              authStateRef: AuthStateRef,
              router: Router,
              nzScheduler: NzScheduler) {
    super();
    if (authStateRef.state.data === null) {
      throw new Error('Unauthenticated user is not allowed to reach account page!');
    }

    this.userData = this.toSignal(
      authStateRef.state.data,
      store.pipe(
        select(({ auth }) => auth.data!),
        filter((data) => data !== null),
        nzScheduler.switchOn(Priority.low)
      )
    );

    store.pipe(
      select(({ auth }) => auth.data === null),
      filter((value) => value),
      this.takeUntilDestroy()
    ).subscribe(() => router.navigateByUrl('/login'));
  }
}
