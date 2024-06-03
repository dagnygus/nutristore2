import { Injectable, Signal, computed, signal } from "@angular/core";
import { ViewModelBase } from "../../models/object-models";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { AppState, BrowserCacheKey, NewPasswordControls } from "../../models/abstract-models";
import { FormSubmiter, compareValidator, distinctValidator, validationWithMessage } from "../../helpers/form-helpers";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { BrowserCache } from "../../common/services/browser-cache.service";
import { authStateError, updatePassword, updatePasswordSuccess } from "../../state/auth/actions";
import { Observable, Subscription, filter, map, merge, take, takeUntil } from "rxjs";
import { NzScheduler, Priority } from "../../noop-zone";
import { hasErrorMessage } from "../../utils/utils";
import { AuthStateRef } from "../../state/auth/state";

@Injectable()
export class NewPasswordPageViewModel extends ViewModelBase {
  private _formSubmiter: FormSubmiter

  private _oldPasswordVisible = signal(false);
  private _newPasswordVisible = signal(false);
  private _subscription: Subscription | null = null;

  formGroup: FormGroup<NewPasswordControls>;
  oldPasswordVisible = this._oldPasswordVisible.asReadonly();
  newPasswordVisible = this._newPasswordVisible.asReadonly();
  oldPasswordType = computed(() => this._oldPasswordVisible() ? 'text' : 'password');
  newPasswordType = computed(() => this._newPasswordVisible() ? 'text' : 'password');
  submitDisabled: Signal<boolean>;
  errorMessage: Signal<string>;
  checkTrigger: Observable<any>;

  get previusUrl(): string {
    return this._browserCache.getString(BrowserCacheKey.PREV_PAGE_URL) || '/account';
  }

  constructor(
    formBuilder: NonNullableFormBuilder,
    store: Store<AppState>,
    actions$: Actions,
    router: Router,
    private _browserCache: BrowserCache,
    nzScheduler: NzScheduler,
  ) {
    super();
    this.formGroup = formBuilder.group({
      oldPassword: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Old password is required!'),
        validationWithMessage(Validators.minLength(5), 'Old password must contain minimum 5 characters!')
      ]),
      newPassword: formBuilder.control('', [
        validationWithMessage(Validators.required, 'New password is required!'),
        validationWithMessage(Validators.minLength(5), 'New password must contain minimum 5 characters!'),
        distinctValidator('oldPassword', 'New password can not be the same!')
      ]),
      confirmPassword: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password confirmation is required!'),
        compareValidator('newPassword', 'Password mismatch!')
      ])
    });

    this._formSubmiter = new FormSubmiter(this.formGroup, () => {
      store.dispatch(updatePassword({ newPasswordModel: { ...this.formGroup.getRawValue() } }));
    });

    this.submitDisabled = this.toSignal(
      this._formSubmiter.submitDisabled,
      this._formSubmiter.submitDisabled$
    );

    this.checkTrigger = this._formSubmiter.submitFailed.pipe(take(1));

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

    actions$.pipe(
      ofType(updatePasswordSuccess),
      this.takeUntilDestroy()
    ).subscribe(() => {
      router.navigateByUrl(_browserCache.getString(BrowserCacheKey.PREV_PAGE_URL) || '/account');
    });

    store.pipe(
      select(({ auth }) => auth.data === null),
      filter((value) => value),
      this.takeUntilDestroy()
    ).subscribe(() => router.navigateByUrl('/login'))
  }

  toogleOldPasswordVisibility(): void {
    this._oldPasswordVisible.update((value) => !value);
  }

  toogleNewPasswordVisibility(): void {
    this._newPasswordVisible.update((value) => !value);
  }

  trySubmit(): void {
    this._formSubmiter.trySubmit();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._subscription) { this._subscription.unsubscribe(); }
  }
}
