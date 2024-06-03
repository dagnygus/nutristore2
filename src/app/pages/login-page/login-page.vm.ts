import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { ViewModelBase } from "../../models/object-models";
import { AppState, BrowserCacheKey, LoginFormControls } from "../../models/abstract-models";
import { FormSubmiter, isEmailNotInUseValidator, setTrimSanitizer, validationWithMessage } from "../../helpers/form-helpers";
import { Observable, Subscription, filter, map, take } from "rxjs";
import { Injectable, Signal, computed, signal } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { authStateError, signin } from "../../state/auth/actions";
import { getTargetUrt, hasErrorMessage } from "../../utils/utils";
import { Store, select } from "@ngrx/store";
import { BrowserCache } from "../../common/services/browser-cache.service";
import { Router } from "@angular/router";
import { AuthStateRef } from "../../state/auth/state";
import { NzScheduler, Priority } from "../../noop-zone";

@Injectable()
export class LoginPageViewModel extends ViewModelBase {
  private _formSubmiter: FormSubmiter
  private _subscription = new Subscription;
  private _passwordVisible = signal(false)

  formGroup: FormGroup<LoginFormControls>;
  checkTrigger: Observable<void>;
  passwordType = computed(() => this._passwordVisible() ? 'text' : 'password');
  submitDisabled: Signal<boolean>;
  errorMessage: Signal<string>;

  get proviusUrl(): string {
    return this._browserCache.getString(BrowserCacheKey.TARGET_ANONYMOUS_URL)!;
  }

  constructor(
    formBuilder: NonNullableFormBuilder,
    actions$: Actions,
    store: Store<AppState>,
    private _browserCache: BrowserCache,
    router: Router,
    private _authStateRef: AuthStateRef,
    nzScheduler: NzScheduler
  ) {
    super();
    this.formGroup = formBuilder.group({
      email: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Address E-Mail is required!'),
        validationWithMessage(Validators.email, 'Incorect format of address e-mail')
      ], [
        isEmailNotInUseValidator('This address e-mail is not registered')
      ]),
      password: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password is required!'),
        validationWithMessage(Validators.minLength(5), 'Password must contain minimum 5 characters!')
      ])
    });

    this._subscription.add(setTrimSanitizer(this.formGroup.controls.email));

    this._formSubmiter = new FormSubmiter(this.formGroup, () => {
      store.dispatch(signin({ loginModel: { ...this.formGroup.getRawValue() } }));
    });

    this.checkTrigger = this._formSubmiter.submitFailed.pipe(take(1));

    this.submitDisabled = this.toSignal(
      this._formSubmiter.submitDisabled,
      this._formSubmiter.submitDisabled$
    );

    this.errorMessage = this.toSignal(
      '',
      actions$.pipe(
        ofType(authStateError),
        map(({ error }) => {
          if (hasErrorMessage(error)) {
            return error.message;
          }
          return 'An error has occurred!';
        }),
        nzScheduler.switchOn(Priority.low)
      )
    );

    store.pipe(
      select(({ auth }) => auth.data !== null),
      this.takeUntilDestroy()
    ).subscribe((value) => {
      if (value) {
        const url = getTargetUrt(_browserCache);
        router.navigateByUrl(url);
      }
    });
  }

  trySubmit(): void {
    this._formSubmiter.trySubmit()
  }

  tooglePasswordVisibility(): void {
    this._passwordVisible.update((value) => !value);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._formSubmiter.dispose();

    if (this._authStateRef.state.data === null) {
      this._browserCache.removeKey(BrowserCacheKey.TARGET_AUTHORIZED_URL);
    }
  }

}
