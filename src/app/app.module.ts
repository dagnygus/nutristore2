import { ProductsEffects } from './state/products/effects';
import { productsReducer } from './state/products/reducer';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InPipeModule, NoopZoneEnviromentModule, Priority, inPipeDefaultPriority, patchNgNoopZoneForAngularCdk, provideNzWatchConfiguration } from './noop-zone';
import { NutristoreHeaderComponent } from './common/components/nutristore-header/nutristore-header.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { getStateName } from './utils/utils';
import { AppState } from './models/abstract-models';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { CustomRouterSerializer } from './state/router/router-serializer';
import { MainContentComponent } from './common/components/main-content/main-content.component';
import { provideEffects } from '@ngrx/effects';
import { homeReducer } from './state/home/reducer';
import { HomeStateEffects } from './state/home/effects';
import { SidenavMenuComponent } from './common/components/sidenav-menu/sidenav-menu.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NutristoreFooterComponent } from './common/components/nutristore-footer/nutristore-footer.component';
import { searchReducer } from './state/search/search.reducer';
import { SearchStateEffects } from './state/search/search.effects';
import { productReducer } from './state/product/reducer';
import { ProductStateEffects } from './state/product/effects';
import { authReducer } from './state/auth/reducer';
import { AuthStateEffects } from './state/auth/effects';
import { cartReducer } from './state/cart/reducer';
import { CartStateEffects } from './state/cart/effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopZoneEnviromentModule,
    NutristoreHeaderComponent,
    MainContentComponent,
    SidenavMenuComponent,
    NutristoreFooterComponent,
    InPipeModule,
    ScrollingModule
  ],
  providers: [
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
    inPipeDefaultPriority(Priority.immediate)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    patchNgNoopZoneForAngularCdk();
  }
}
