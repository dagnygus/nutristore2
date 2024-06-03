import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData, AuthRegistrationBrowserCache, BrowserCacheKey, LoginModel, NewPasswordModel, OrderModel, ProductData, ProductsItem, RegisterModel, SearchItem, UpdateUserModel } from "../../models/abstract-models";
import { Observable, delay, map, of, throwError, timer, zip } from "rxjs";
import { getUrlForProductCategory } from "../../utils/utils";
import { ProductCategory } from "../../models/object-models";
import { BrowserCache } from "./browser-cache.service";

class ResponseError extends Error {
  constructor(public code: number, message: string) { super(message); }
}

@Injectable({ providedIn: 'root' })
export class AppHttpService {
  constructor(private _httpClient: HttpClient, private _browserCache: BrowserCache) {}

  getProductsForHomePage(): Observable<{ newest: ProductsItem[], mostPopular: ProductsItem[], recomended: ProductsItem[] }> {
    const newest$ = this._httpClient.get<ProductsItem[]>('assets/products-data/newest.json');
    const mostPopular$ = this._httpClient.get<ProductsItem[]>('assets/products-data/most_popular.json');
    const recomended$ = this._httpClient.get<ProductsItem[]>('assets/products-data/recomended.json');

    return zip(newest$, mostPopular$, recomended$).pipe(
      map(([ newest, mostPopular, recomended ]) => ({ newest, mostPopular, recomended }))
    );
  }

  getProductsByCategory(category: ProductCategory): Observable<ProductsItem[]> {
    return this._httpClient.get<ProductsItem[]>(getUrlForProductCategory(category));
  }

  getSearchResult(key: string, maxCount: number): Observable<{ id: string, name: string }[]> {
    const url = 'assets/products-data/individual-products/prod_list.json'
    return this._httpClient.get<{ id: string, name: string }[]>(url).pipe(map((results) => {
      results.sort((prev, curr) => {
        if (prev.name < curr.name) { return -1; }
        if (prev.name > curr.name) { return +1; }
        return 0;
      });

      results = results.filter((result) => result.name.toLowerCase().includes(key.toLowerCase()));

      if (results.length > maxCount) {
        results.splice(maxCount);
      }

      return results;
    }))
  }

  getProductById(id: string): Observable<ProductData> {
    return this._httpClient.get<ProductData>(`assets/products-data/individual-products/${id}.json`)
  }

  registerUser(registerModel: RegisterModel): Observable<AuthData> {

    const registationData = this._getRegistrationData()

    if (registerModel.password !== registerModel.confirmPassword) {
      return throwError(() => new ResponseError(404, 'Password mismatch!'));
    }

    if (registationData[registerModel.email]) {
      return throwError(() => new ResponseError(409, 'Email already in use!'))
    }

    const authData: AuthData = {
      firstName: registerModel.firstName,
      lastName: registerModel.lastName,
      email: registerModel.email,
      city: registerModel.city,
      street: registerModel.street,
      state: registerModel.state,
      country: registerModel.country,
      zipCode: registerModel.zipCode
    }

    if (registationData) {
      registationData[registerModel.email] = { password: registerModel.password, data: authData }
    }

    this._updateRegistrationData(registationData);

    return of(authData).pipe(delay(2000 * Math.random()))
  }

  login(loginModel: LoginModel): Observable<AuthData> {
    const registationData = this._getRegistrationData();

    if (registationData[loginModel.email] == null) {
      throwError(() => new ResponseError(404, 'User not found!'));
    }

    if (registationData[loginModel.email].password !== loginModel.password) {
      return throwError(() => new ResponseError(401, 'Wrong password!'));
    }

    const authData = registationData[loginModel.email].data;

    return of(authData).pipe(delay(2000 * Math.random()));
  }

  updateUser(updateUserModel: UpdateUserModel, currentAuthData: AuthData): Observable<AuthData> {
    if (!this._isAuthenticated()) {
      return throwError(() => new ResponseError(401, 'Unauthenticated!'));
    }

    const registrationData = this._getRegistrationData();

    if (currentAuthData.email !== updateUserModel.email && registrationData[updateUserModel.email]) {
      return throwError(() => new ResponseError(409, 'Email already in use!'));
    }

    const newAuthData: AuthData = { ...currentAuthData, ...updateUserModel };

    if (currentAuthData.email !== newAuthData.email) {
      const password = registrationData[currentAuthData.email].password;
      delete registrationData[currentAuthData.email];
      registrationData[newAuthData.email] = { password, data: newAuthData };
    } else {
      registrationData[newAuthData.email] = {
        password: registrationData[newAuthData.email].password,
        data: newAuthData
      }
    }

    this._updateRegistrationData(registrationData);

    return of(newAuthData).pipe(delay(2000 * Math.random()));
  }

  updatePassword(newPasswordModel: NewPasswordModel): Observable<unknown> {
    const currentUser = this._getCurrentUser();
    if (currentUser === null) {
      return throwError(() => new ResponseError(404, 'Unauthenticated!'));
    }

    if (newPasswordModel.newPassword !== newPasswordModel.confirmPassword) {
      return throwError(() => new ResponseError(404, 'Password mismatch!'));
    }

    const registrationData = this._getRegistrationData();

    if (registrationData[currentUser.email].password !== newPasswordModel.oldPassword) {
      return throwError(() => new ResponseError(404, 'Incorrect old password!'));
    }

    registrationData[currentUser.email].password = newPasswordModel.newPassword;

    this._updateRegistrationData(registrationData);

    return timer(2000 * Math.random());
  }

  placeOrder(order: OrderModel): Observable<void> {
    return new Observable<void>((observer) => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 2000 * Math.random());
    });
  }


  isEmailInUse(email: string): Observable<boolean> {
    return of(this._getRegistrationData()[email] != null).pipe(delay(2000 * Math.random()));
  }

  private _getRegistrationData(): AuthRegistrationBrowserCache {
    return this._browserCache.getObject<AuthRegistrationBrowserCache>(BrowserCacheKey.REGISTRATION_DATA) || {};
  }

  private _updateRegistrationData(data: AuthRegistrationBrowserCache) {
    this._browserCache.setObject(BrowserCacheKey.REGISTRATION_DATA, data);
  }

  private _isAuthenticated(): boolean {
    return this._browserCache.hasKey(BrowserCacheKey.CURRENT_USER);
  }

  private _getCurrentUser(): AuthData | null {
    return this._browserCache.getObject(BrowserCacheKey.CURRENT_USER);
  }

  isEmailNotInUse(email: string): Observable<boolean> {
    return of(!!(this._getRegistrationData()[email])).pipe(delay(2000 * Math.random()))
  }
}
