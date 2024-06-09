import { NgModule, inject } from '@angular/core';
import { CanMatchFn, PreloadAllModules, Route, Router, RouterModule, Routes, UrlSegment } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { isProductCategory } from './utils/utils';
import { AuthStateRef } from './state/auth/state';
import { BrowserCache } from './common/services/browser-cache.service';
import { BrowserCacheKey } from './models/abstract-models';

const onlyAnnonymousCanMach: CanMatchFn = () => {
  const authStateRef = inject(AuthStateRef);
  const browserCache = inject(BrowserCache);
  const router = inject(Router);
  if (authStateRef.state.data) {
    if (browserCache.getString(BrowserCacheKey.CURR_PAGE_URL) === browserCache.getString(BrowserCacheKey.TARGET_AUTHORIZED_URL)) {
      return router.parseUrl(browserCache.getString(BrowserCacheKey.TARGET_ANONYMOUS_URL)!)
    } else {
      return false;
    }
  }
  return true;
};

const onlyAuthenticatedCanMatch: CanMatchFn = (_, segmants) => {
  const authStateRef = inject(AuthStateRef);
  if (authStateRef.state.data) {
    return true;
  }
  const browserCache = inject(BrowserCache);
  const router = inject(Router);
  browserCache.setString(BrowserCacheKey.TARGET_AUTHORIZED_URL, '/' + segmants.map((s) => s.path).join('/'));
  return router.parseUrl('/login');
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  {
    path: 'products/:product-category',
    loadChildren: () => import('./pages/products-page/products-page.component').then((m) => m.PRODUCTS_PAGE_ROUTES),
    canMatch: [
      (_: Route, segments: UrlSegment[]) => {
        return isProductCategory(segments[1].path);
      }
    ]
  },
  {
    path: 'product/:productId',
    loadChildren: () => import('./pages/product-page/product-page.component').then((m) => m.PRODUCT_PAGE_ROUTES)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register-page/register-page.component').then((m) => m.REGISTER_PAGE_ROUTES),
    canMatch: [onlyAnnonymousCanMach]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.component').then((m) => m.LOGIN_PAGE_ROUTES),
    canMatch: [onlyAnnonymousCanMach]
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account-page/account-page.component').then((m) => m.ACCOUNT_PAGE_ROUTES),
    canMatch: [
      onlyAuthenticatedCanMatch
    ]
  },
  {
    path: 'password',
    loadChildren: () => import('./pages/new-password-page/new-password-page.component').then((m) => m.NEW_PASSWORD_PAGE_ROUTES),
    canMatch: [
      onlyAuthenticatedCanMatch
    ]
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update-user-page/update-user-page.component').then((m) => m.UPDATE_USER_PAGE_ROUTES),
    canMatch: [
      onlyAuthenticatedCanMatch
    ]
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart-page/cart-page.component').then((m) => m.CART_PAGE_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout-page/checkout-page.component').then((m) => m.CHECKOUT_PAGE_ROUTES),
    canMatch: [
      onlyAuthenticatedCanMatch
    ]
  },
  {
    path: 'wholesale',
    loadComponent: () => import('./pages/wholesale-page/wholesale-page.component').then((m) => m.WholesalePageComponent)
  },
  {
    path: 'payment-methods',
    loadComponent: () => import('./pages/payment-methods-page/payment-methods-page.component').then((m) => m.PaymentMethodsPageComponent)
  },
  {
    path: 'delivery-cost',
    loadComponent: () => import('./pages/delivery-cost-page/delivery-cost-page.component').then((m) => m.DeliveryCostPageComponent)
  },
  {
    path: 'regulations',
    loadComponent: () => import('./pages/regulations-page/regulations-page.component').then((m) => m.RegulationsPageComponent)
  }
];
