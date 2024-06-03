import { Params } from "@angular/router";
import { ProductCategory } from "./object-models";
import { RouterReducerState } from "@ngrx/router-store";
import { Action } from "@ngrx/store";
import { FormControl } from "@angular/forms";

export interface AppState {
  readonly router: RouterReducerState<RouterStateUrl> | undefined;
  readonly home: HomePageState;
  readonly products: ProductsState;
  readonly search: SearchState;
  readonly product: ProductState;
  readonly auth: AuthState
  readonly cart: CartState
}

export interface RouterStateUrl {
  readonly fragment: string | null;
  readonly url: string;
  readonly params: Params;
  readonly queryParams: Params;
  // readonly fullPath: string;
  readonly lastState: RouterStateUrl | null;
  readonly segemntsPaths: readonly string[];
}

export interface ProductsItem {
  readonly id: string;
  readonly name: string;
  readonly rating: number;
  readonly price: string;
  readonly imageUrl: string;
}

export interface ProductsState {
  readonly items: readonly ProductsItem[];
  readonly category: ProductCategory | '';
}

export interface HomePageState {
  readonly newest: readonly ProductsItem[];
  readonly mostPopular: readonly ProductsItem[];
  readonly recomended: readonly ProductsItem[];
}

export interface SearchItem {
  readonly id: string;
  readonly name: string;
}

export interface SearchState {
  readonly key: string;
  readonly results: readonly SearchItem[];
}

export interface ProductData {
  readonly id: string;
  readonly name: string;
  readonly rating: number;
  readonly price: string;
  readonly imageUrl: string;
  readonly description: string;
  readonly ingredients: readonly string[];
}

export interface ProductState {
  readonly productData: ProductData | null;
}

export interface AuthData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly city: string;
  readonly street: string;
  readonly state: string;
  readonly country: string;
  readonly zipCode: string;
}

export interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  street: string;
  state: string;
  country: string;
  password: string;
  confirmPassword: string;
  zipCode: string
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface NewPasswordModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserModel {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  street: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface AuthRegistrationBrowserCache {
  [email: string]: { password: string, data: AuthData }
}

export interface AuthState {
  readonly data: AuthData | null;
}

export interface UpdateStateProps<T> {
  oldState: T;
  newState: T;
  nextAction?: Action;
}

export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly price: string;
  readonly totalPrice: string
  readonly quantity: number;
}

export interface CartState {
  readonly items: readonly CartItem[];
  readonly totalPrice: string;
}

export const enum ProductCategoryUrl {
  AMINOACIDES = 'assets/products-data/aminoacides.json',
  FAT_BURNERS = 'assets/products-data/fatburners.json',
  PREWORKOUT = 'assets/products-data/pretraining.json',
  AFTERWORKOUT = 'assets/products-data/aftertrening.json',
  CREATINE = 'assets/products-data/creatine.json',
  SARMS = 'assets/products-data/sarm.json',
  LIVER_PROTECTION = 'assets/products-data/liverprotection.json',
  HEALTH_AND_VITAMINS = 'assets/products-data/vitamines.json',
  JOINT_PROTECTION = 'assets/products-data/jointprotection.json',
  MEMORY_AND_CONCETRATION = 'assets/products-data/memoryandconcetration.json',
  ENERGY_AND_AGITATION = 'assets/products-data/energy.json',
  STRESS_AND_NERVES = 'assets/products-data/stressandnerves.json',
  POTENCY_AND_TESTOSTERONE = 'assets/products-data/potencyandtestosterone.json',
  SLEEP_AND_RELAX = 'assets/products-data/sleepandrelax.json',
  LIBIDO_IN_WOMAN = 'assets/products-data/libidoinwoman.json',
}

export interface DataCache {
  setString(key: string, value: string): void;
  getString(key: string): string | null;
  setObject<T extends object = object>(key: string, value: T): void;
  getObject<T extends object = object>(key: string): T | null;
  hasKey(key: string): boolean;
  removeKey(key: string): void;
}

export const enum BrowserCacheKey {
  CURRENT_USER = 'CURRENT_USER',
  CART_STATE = 'CART_STATE',
  REGISTRATION_DATA = 'REGISTRATION_DATA',
  TARGET_ANONYMOUS_URL = 'TARGET_ANONYMOUS_URL',
  TARGET_AUTHORIZED_URL = 'TARGET_AUTHORIZED_URL',
  PREV_PAGE_URL = 'PREV_PAGE_URL',
  CURR_PAGE_URL = 'CURR_PAGE_URL',
}

export interface AddressModel {
  city: string;
  street: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PaymentModel {
  cardNumber: string;
  cvc: string;
  expirationDate: string;
}

export interface OrderItem {
  id: string,
  count: number
}

export interface OrderModel extends PaymentModel {
  items: OrderItem[]
}

export type RegisterFormContols = { [key in keyof RegisterModel]: FormControl<RegisterModel[key]> };
export type NewPasswordControls = { [key in keyof NewPasswordModel]: FormControl<NewPasswordModel[key]> };
export type UpdateFormControls = { [key in keyof UpdateUserModel]: FormControl<UpdateUserModel[key]>};
export type LoginFormControls = { [key in keyof LoginModel]: FormControl<LoginModel[key]> };
export type AddressFormControls = { [key in keyof AddressModel]: FormControl<AddressModel[key]> };
export type PaymentFormControls = { [key in keyof PaymentModel]: FormControl<PaymentModel[key]> };
