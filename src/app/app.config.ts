import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { Priority, inPipeDefaultPriority, provideNoopZoneEnviroment, provideNzWatchConfiguration } from './noop-zone';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { AppState } from './models/abstract-models';
import { AuthStateEffects } from './state/auth/effects';
import { authReducer } from './state/auth/reducer';
import { CartStateEffects } from './state/cart/effects';
import { cartReducer } from './state/cart/reducer';
import { HomeStateEffects } from './state/home/effects';
import { homeReducer } from './state/home/reducer';
import { ProductStateEffects } from './state/product/effects';
import { productReducer } from './state/product/reducer';
import { ProductsEffects } from './state/products/effects';
import { productsReducer } from './state/products/reducer';
import { CustomRouterSerializer } from './state/router/router-serializer';
import { SearchStateEffects } from './state/search/search.effects';
import { searchReducer } from './state/search/search.reducer';
import { IMAGE_CONFIG } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNoopZoneEnviroment(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideRouterStore({ serializer: CustomRouterSerializer }),
    provideStore<AppState>({
      router: routerReducer,
      home: homeReducer,
      products: productsReducer,
      search: searchReducer,
      product: productReducer,
      auth: authReducer,
      cart: cartReducer
    }),
    provideEffects([
      ProductsEffects,
      HomeStateEffects,
      SearchStateEffects,
      ProductStateEffects,
      AuthStateEffects,
      CartStateEffects
    ]),
    provideNzWatchConfiguration({ defaultPriority: Priority.immediate }),
    inPipeDefaultPriority(Priority.immediate),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    provideClientHydration(),
  ]
};
