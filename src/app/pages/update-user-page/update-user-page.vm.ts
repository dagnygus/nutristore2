import { Injectable, Signal, signal } from "@angular/core";
import { ViewModelBase } from "../../models/object-models";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { AppState, BrowserCacheKey, UpdateFormControls } from "../../models/abstract-models";
import { Observable, Subject, Subscription, filter, map, take } from "rxjs";
import { FormSubmiter, isNewEmailInUseValidator, setTrimSanitizer, setTrimTitleSanitizer, validationWithMessage } from "../../helpers/form-helpers";
import { Actions, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { BrowserCache } from "../../common/services/browser-cache.service";
import { Store, select } from "@ngrx/store";
import { AuthStateRef } from "../../state/auth/state";
import { authStateError, updateUser, updateAuthState } from "../../state/auth/actions";
import { hasErrorMessage, returnFakeNever } from "../../utils/utils";
import { Platform } from "@angular/cdk/platform";

@Injectable()
export class UpdateUserPageViewModel extends ViewModelBase {
  private _subscription = new Subscription();
  private _sanitizationSampler = new Subject<void>();
  private _formSubmiter: FormSubmiter

  formGroup: FormGroup<UpdateFormControls>;
  checkTrigger: Observable<any>;
  submitDisabled: Signal<boolean>;
  errorMessage: Signal<string>;
  isServer = false;

  get previousUrl(): string {
    return this._browserCache.getString(BrowserCacheKey.PREV_PAGE_URL) || '/account';
  }

  constructor(
    formBuilder: NonNullableFormBuilder,
    actions$: Actions,
    router: Router,
    private _browserCache: BrowserCache,
    store: Store<AppState>,
    authStateRef: AuthStateRef,
    private _platform: Platform
  ) {
    super();

    if (!_platform.isBrowser) {
      this.isServer = true;
      this._formSubmiter = null!;
      this.checkTrigger = new Observable();
      this.submitDisabled = signal(false);
      this.errorMessage = signal('');
      this.formGroup = formBuilder.group({
        firstName: formBuilder.control(''),
        lastName: formBuilder.control(''),
        email: formBuilder.control(''),
        city: formBuilder.control(''),
        street: formBuilder.control(''),
        state: formBuilder.control(''),
        country: formBuilder.control(''),
        zipCode: formBuilder.control(''),
      })
      return;
    }

    const userData = authStateRef.state.data;

    if (userData === null) {
      throw new Error('Unauthenticated user is not allowed to reach account page!');
    }

    this.formGroup = formBuilder.group({
      firstName: formBuilder.control(userData.firstName, [
        validationWithMessage(Validators.required, 'First name is required!'),
        validationWithMessage(Validators.minLength(3), 'First name must contain minimum tree characters!'),
      ]),
      lastName: formBuilder.control(userData.lastName, [
        validationWithMessage(Validators.required, 'Last name is required!'),
        validationWithMessage(Validators.minLength(3), 'Last name must contain minimum tree characters!'),
      ]),
      email: formBuilder.control(userData.email, [
        validationWithMessage(Validators.required, 'Address E-mail is required!'),
        validationWithMessage(Validators.email, 'Incorect fromat of address e-mail!')
      ], [
        isNewEmailInUseValidator(userData.email, 'This address email is allready in use!')
      ]),
      city: formBuilder.control(userData.city, validationWithMessage(Validators.required, 'City is required!')),
      street: formBuilder.control(userData.street, validationWithMessage(Validators.required, 'Street is required!')),
      state: formBuilder.control(userData.state, validationWithMessage(Validators.required, 'State is required!')),
      country: formBuilder.control(userData.country, validationWithMessage(Validators.required, 'Country is required!')),
      zipCode: formBuilder.control(userData.zipCode, validationWithMessage(Validators.required, 'Zip-Code is required!')),
    });

    this._subscription.add(setTrimTitleSanitizer(this.formGroup.controls.lastName));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.email));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.city, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.street, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.state, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.country, this._sanitizationSampler));
    this._subscription.add(setTrimSanitizer(this.formGroup.controls.zipCode, this._sanitizationSampler));

    this._formSubmiter = new FormSubmiter(this.formGroup, () => {
      this._sanitizationSampler.next();
      store.dispatch(updateUser({ updateUserModel: { ...this.formGroup.getRawValue() } }));
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
            return error.message
          }
          return 'An error has occurred!';
        })
      )
    );

    store.pipe(
      select(({ auth }) => auth.data === null),
      filter((value) => value),
      this.takeUntilDestroy()
    ).subscribe(() => router.navigateByUrl('/login'));

    actions$.pipe(
      ofType(updateAuthState),
      filter(({ newState }) => newState.data !== null),
      this.takeUntilDestroy()
    ).subscribe(() => {
      router.navigateByUrl(_browserCache.getString(BrowserCacheKey.PREV_PAGE_URL) || '/account');
    })
  }

  trySubmit(): void {
    this._formSubmiter.trySubmit();
  }

  override ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._sanitizationSampler.complete();
    if (this._platform.isBrowser) {
      this._formSubmiter.dispose();
    }
  }
}
