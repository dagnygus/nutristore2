import { AddressFormControls, AddressModel, OrderItem, OrderModel, PaymentFormControls } from './../../models/abstract-models';
import { Injectable, Signal, WritableSignal, signal } from "@angular/core";
import { ViewModelBase } from "../../models/object-models";
import { Store, select } from "@ngrx/store";
import { AppState, CartItem } from "../../models/abstract-models";
import { CartStateRef } from "../../state/cart/state";
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { AuthStateRef } from '../../state/auth/state';
import { FormSubmiter, setTrimSanitizer, validationWithMessage } from '../../helpers/form-helpers';
import { Observable, Subject, Subscription, filter, map, take } from 'rxjs';
import { NzScheduler, Priority } from '../../noop-zone';
import { Router } from '@angular/router';
import { AppHttpService } from '../../common/services/app-http.service';
import { clearCart } from '../../state/cart/actions';
import { Platform } from '@angular/cdk/platform';
import { returnFakeNever } from '../../utils/utils';

@Injectable()
export class CheckoutPageViewModel extends ViewModelBase {

  private _subscription = new Subscription
  private _sanitizationSampler = new Subject<void>();
  private _addressFormSubmiter: FormSubmiter;
  private _addressData: WritableSignal<AddressModel>;
  private _paymentFormSubmiter: FormSubmiter;
  private _orderPlaced = signal(false);
  private _onOrderPlacing = new Subject<void>();
  private _onOrderPlaced = new Subject<void>();

  itemsPressent: Signal<boolean>;
  orderPlaced = this._orderPlaced.asReadonly();
  cartItems: Signal<readonly CartItem[]>;
  totalPrice: Signal<string>;
  addressFormGroup: FormGroup<AddressFormControls>;
  editAddress = signal(false);
  addressData: Signal<AddressModel>;
  addressFormCheckTrigger: Observable<any>;
  addressFormSubmitDissabled: Signal<boolean>;
  userData: Signal<{ firstName: string, lastName: string }>
  paymentFormGroup: FormGroup<PaymentFormControls>
  paymentFormSubmitDissabled: Signal<boolean>;
  paymentFormCheckTrigger: Observable<any>;
  onOrderPlacing = this._onOrderPlacing.asObservable();
  onOrderPlaced = this._onOrderPlaced.asObservable();
  isServer = false;

  constructor(
    store: Store<AppState>,
    cartRef: CartStateRef,
    formBuilder: NonNullableFormBuilder,
    authStateRef: AuthStateRef,
    router: Router,
    httpService: AppHttpService,
    nzScheduler: NzScheduler,
    private _platform: Platform
  ) {
    super();

    if (!_platform.isBrowser) {
      this.isServer = true;
      this.itemsPressent = signal(false);
      this.cartItems = signal([]);
      this.totalPrice = signal('');
      this.userData = signal({ firstName: '', lastName: '' });
      this.addressFormSubmitDissabled = signal(false);
      this.paymentFormSubmitDissabled = signal(false);
      this.addressFormCheckTrigger = new Observable();
      this.paymentFormCheckTrigger = new Observable();
      this.addressData = signal({
        city: '',
        street: '',
        state: '',
        country: '',
        zipCode: ''
      })

      this.addressFormGroup = formBuilder.group({
        city: formBuilder.control(''),
        street: formBuilder.control(''),
        state: formBuilder.control(''),
        country: formBuilder.control(''),
        zipCode: formBuilder.control('')
      });
      this.paymentFormGroup = formBuilder.group({
        cardNumber: '',
        cvc: '',
        expirationDate: ''
      });
      this._addressFormSubmiter = null!;
      this._addressData = null!;
      this._paymentFormSubmiter = null!;
      return;
    }

    if (authStateRef.state.data === null) {
      throw new Error('Chekout page: this page can not be reached by anonymous user!');
    }

    this.cartItems = this.toSignal(
      cartRef.state.items,
      store.pipe(
        select(({ cart }) => cart.items),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.itemsPressent = this.toSignal(
      cartRef.state.items.length > 0,
      store.pipe(
        select(({ cart }) => cart.items.length > 0),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.totalPrice = this.toSignal(
      cartRef.state.totalPrice,
      store.pipe(
        select(({ cart }) => cart.totalPrice),
        nzScheduler.switchOn(Priority.low)
      )
    );

    this.userData = this.toSignal(
      { firstName: authStateRef.state.data.firstName, lastName: authStateRef.state.data.lastName },
      store.pipe(
        select(({ auth }) => auth.data!),
        filter((data) => data !== null),
        map(({ firstName, lastName }) => ({ firstName, lastName })),
        nzScheduler.switchOn(Priority.low)
      ),
      (prev, curr) => prev.firstName === curr.firstName && prev.lastName === curr.lastName
    )

    this.addressFormGroup = formBuilder.group({
      city: formBuilder.control(
        authStateRef.state.data.city,
        validationWithMessage(Validators.required, 'City is required!')
      ),
      street: formBuilder.control(
        authStateRef.state.data.street,
        validationWithMessage(Validators.required, 'Street is required!')
      ),
      state: formBuilder.control(
        authStateRef.state.data.state,
        validationWithMessage(Validators.required, 'State is required!')
      ),
      country: formBuilder.control(
        authStateRef.state.data.country,
        validationWithMessage(Validators.required, 'Country is required!')
      ),
      zipCode: formBuilder.control(
        authStateRef.state.data.zipCode,
        validationWithMessage(Validators.required, 'Zip-code is required!')
      )
    });

    this._subscription.add(setTrimSanitizer(this.addressFormGroup.controls.city));
    this._subscription.add(setTrimSanitizer(this.addressFormGroup.controls.street));
    this._subscription.add(setTrimSanitizer(this.addressFormGroup.controls.street));
    this._subscription.add(setTrimSanitizer(this.addressFormGroup.controls.state));

    this._addressFormSubmiter = new FormSubmiter(this.addressFormGroup, () => {
      this._sanitizationSampler.next();
      this._addressData.set(this.addressFormGroup.getRawValue());
      this.editAddress.set(false);
    });

    this.addressFormCheckTrigger = this._addressFormSubmiter.submitFailed.pipe(take(1));

    this.addressFormSubmitDissabled = this.toSignal(
      this._addressFormSubmiter.submitDisabled,
      this._addressFormSubmiter.submitDisabled$
    );

    this._addressData = signal({
      city: authStateRef.state.data.city,
      street: authStateRef.state.data.street,
      state: authStateRef.state.data.state,
      country: authStateRef.state.data.country,
      zipCode: authStateRef.state.data.zipCode
    });

    this.addressData = this._addressData.asReadonly();

    this.paymentFormGroup = formBuilder.group({
      cardNumber: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Cart number is required!'),
        _cartNumberValidator
      ]),
      cvc: formBuilder.control('',[
        validationWithMessage(Validators.required, 'CVC code is required!'),
        _cvcValidator
      ]),
      expirationDate: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Expiration date code is required!'),
        _dateValidator
      ])
    });

    this._subscription.add(_cartNumberSanitizer(this.paymentFormGroup.controls.cardNumber));
    this._subscription.add(_cvcSanitizer(this.paymentFormGroup.controls.cvc));
    this._subscription.add(_dateSanitizer(this.paymentFormGroup.controls.expirationDate));

    this._paymentFormSubmiter = new FormSubmiter(this.paymentFormGroup, () => {
      const orderItems: OrderItem[] = this.cartItems().map((item) => ({ id: item.id, count: item.quantity }));
      const orderModel: OrderModel = {
        ...this.paymentFormGroup.getRawValue(),
        items: orderItems
      };
      this._onOrderPlacing.next();
      httpService.placeOrder(orderModel).subscribe(() => {
        this._onOrderPlaced.next();
        this._orderPlaced.set(true);
        store.dispatch(clearCart());
      })
    });

    this.paymentFormSubmitDissabled = this.toSignal(
      this._paymentFormSubmiter.submitDisabled,
      this._paymentFormSubmiter.submitDisabled$
    );

    this.paymentFormCheckTrigger = this._paymentFormSubmiter.submitFailed.pipe(take(1));

    store.pipe(
      select(({ auth }) => auth.data === null),
      filter((value) => value),
      this.takeUntilDestroy()
    ).subscribe(() => router.navigateByUrl('/login'));
  }

  trySubmitAddressForm(): void {
    this._addressFormSubmiter.trySubmit();
  }

  trySubmitPaymentForm(): void {
    this._paymentFormSubmiter.trySubmit();
  }

  startEditingAddressInfo(): void {
    this.editAddress.set(true);
  }

  cancelEditingAddress(): void {
    this.editAddress.set(false);
    this.addressFormGroup.setValue(this._addressData());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._subscription.unsubscribe();
    if (this._platform.isBrowser) {
      this._addressFormSubmiter.dispose();
      this._paymentFormSubmiter.dispose();
    }
  }
}


const NUMBER_REGEX = /^[0-9]*$/g;
const IVERTED_NUMBER_REGEX = /[^0-9]/g;

function _cartNumberValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.replaceAll(' ', '');

  if (!NUMBER_REGEX.test(value)) {
    return { cartNumber: 'Incorect format!' };
  }

  if (value.length !== 16) {
    return { cartNumber: 'Cart number must contain 16 digits!' };
  }

  return null;
}

function _cvcValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.trim();
  if (!NUMBER_REGEX.test(value)) {
    return { cvc: 'Invalid cvc!' }
  }

  if (value.length !== 3) {
    return { cvc: 'CVC must contain 3 digits!' }
  }

  return null
}

function _dateValidator(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value.replaceAll('/', '');

    if (!NUMBER_REGEX.test(value)) {
      return { date: 'Invalid date format!' };
    }

    return null;
}

function _cartNumberSanitizer(control: FormControl<string>): Subscription {

  let lastValue = '';

  return control.valueChanges.pipe(map((value) => {

    if (value.length === lastValue.length - 1 &&
        lastValue.startsWith(value)) {
        if (value.endsWith(' '))
        value = value.substring(0, value.length - 1);
      return value
    }

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    value = value.split('').reduce((acc, next, index) => {
      if (index !== 0 && !(index % 4)) { next = ' ' + next; };
      return acc + next
    }, '');

    if (value.length > 19) {
      value = value.substring(0, 19);
    }

    return value
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
      lastValue = value;
    }
  })
}

function _cvcSanitizer(control: AbstractControl<string>): Subscription {
  return control.valueChanges.pipe(map((value) => {
    value = value.trim();

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    if (value.length > 3) {
      value = value.substring(0, 3);
    }

    return value
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
    }
  })
}

function _dateSanitizer(control: AbstractControl<string>) {
  let lastValue = ''

  return control.valueChanges.pipe(map((value) => {

    if (value.length === lastValue.length - 1 && lastValue.startsWith(value)) {
      if (value.endsWith('/')) { value = value.substring(0, value.length - 1); }
      return value;
    }

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    value = value.split('').reduce((acc, next, index) => {
      if (index !== 0 && index <= 4 && !(index % 2)) { next = '/' + next; }
      return acc + next;
    }, '');

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    return value;
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
      lastValue = value
    }
  })
}
