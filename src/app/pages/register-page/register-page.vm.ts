import { Injectable, Signal, computed, signal } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { AppState, BrowserCacheKey, RegisterFormContols } from "../../models/abstract-models";
import { ViewModelBase } from "../../models/object-models";
import { Observable, Subject, Subscription, map, take } from "rxjs";
import { validationWithMessage, compareValidator, setTrimTitleSanitizer, setTrimSanitizer, FormSubmiter, isEmailInUseValidator } from "../../helpers/form-helpers";
import { Actions, ofType } from "@ngrx/effects";
import { authStateError, signup } from "../../state/auth/actions";
import { getTargetUrt, hasErrorMessage } from "../../utils/utils";
import { Router } from "@angular/router";
import { BrowserCache } from "../../common/services/browser-cache.service";
import { Store, select } from "@ngrx/store";
import { AuthStateRef } from "../../state/auth/state";
import { NzScheduler, Priority } from "../../noop-zone";

@Injectable()
export class RegisterPageViewModel extends ViewModelBase {

  private _subscription = new Subscription();
  private _sanitizationSampler = new Subject<void>()
  private _formSubmiter: FormSubmiter;
  private _passwordVisible = signal(false);

  formGroup: FormGroup<RegisterFormContols>;
  passwordVisible = this._passwordVisible.asReadonly();
  passwordType = computed(() => this._passwordVisible() ? 'text' : 'password');
  checkTrigger: Observable<any>;
  submitDisabled: Signal<boolean>;
  errorMessage: Signal<string>;

  get prevoisUrl(): string {
    return this._browserCache.getString(BrowserCacheKey.TARGET_ANONYMOUS_URL)!;
  }

  constructor(
    formBuilder: NonNullableFormBuilder,
    actions$: Actions,
    router: Router,
    private _browserCache: BrowserCache,
    store: Store<AppState>,
    private _authStateRef: AuthStateRef,
    nzScheduler: NzScheduler,
  ) {
    super();

    this.formGroup = formBuilder.group<RegisterFormContols>({
      firstName: formBuilder.control('', [
        validationWithMessage(Validators.required, 'First name is required!'),
        validationWithMessage(Validators.minLength(3), 'First name must contain minimum tree characters!'),
      ]),
      lastName: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Last name is required!'),
        validationWithMessage(Validators.minLength(3), 'Last name must contain minimum tree characters!'),
      ]),
      email: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Address E-mail is required!'),
        validationWithMessage(Validators.email, 'Incorect fromat of address e-mail!')
      ], [
        isEmailInUseValidator('This address e-mail is already in use!')
      ]),
      city: formBuilder.control('', validationWithMessage(Validators.required, 'City is required!')),
      street: formBuilder.control('', validationWithMessage(Validators.required, 'Street is required!')),
      state: formBuilder.control('', validationWithMessage(Validators.required, 'State is required!')),
      country: formBuilder.control('', validationWithMessage(Validators.required, 'Country is required!')),
      zipCode: formBuilder.control('', validationWithMessage(Validators.required, 'Zip-Code is required!')),
      password: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password is required!'),
        validationWithMessage(Validators.minLength(5), 'Password must contain minimum 5 characters!')
      ]),
      confirmPassword: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password confirmation is required!'),
        compareValidator('password', 'Password mismatch!')
      ]),
    });

    this._subscription.add(setTrimTitleSanitizer(this.formGroup.controls.firstName))
    this._subscription.add(setTrimTitleSanitizer(this.formGroup.controls.lastName));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.email));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.city, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.street, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.state, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.country, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.zipCode, this._sanitizationSampler));

    this._formSubmiter = new FormSubmiter(this.formGroup, () => {
      this._sanitizationSampler.next();
      //TODO: Regiter user in storage and navigate to last page or target page
      store.dispatch(signup({ registerModel: { ...this.formGroup.getRawValue() } }));
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

    // this.errorMessage = signal('This address e-mail is already in use!');

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
    this._formSubmiter.trySubmit();
  }

  tooglePasswordVisibility(): void {
    this._passwordVisible.update((value) => !value)
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._sanitizationSampler.complete();
    this._subscription.unsubscribe();
    this._formSubmiter.dispose();

    if (this._authStateRef.state.data === null) {
      this._browserCache.removeKey(BrowserCacheKey.TARGET_AUTHORIZED_URL);
    }
  }
}
