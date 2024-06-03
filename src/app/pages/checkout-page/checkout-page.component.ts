import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckoutPageViewModel } from './checkout-page.vm';
import { NzIfModule, Priority, detectChanges, initializeComponent } from '../../noop-zone';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DeliveryAddressInfoComponent } from './delivery-address-info/delivery-address-info.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalLoadingSpinner } from '../../common/services/global-loading-spinner.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'checkout-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    CheckoutCartComponent,
    RouterModule,
    MatIconModule,
    DeliveryAddressInfoComponent,
    CheckoutSummaryComponent,
    CheckoutPaymentComponent,
    NzIfModule
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CheckoutPageViewModel],
  host: { 'class': 'page' }
})
export class CheckoutPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(CheckoutPageViewModel);
  Priority = Priority;
  loadingSpinner = inject(GlobalLoadingSpinner);
  scrollable = inject(CdkScrollable);
  document = inject(DOCUMENT);

  constructor() {
    this.vm.onOrderPlacing.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.loadingSpinner.show();
    });

    this.vm.onOrderPlaced.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.loadingSpinner.hide();
    })
  }

  detectChanges(priority: Priority): void {
    detectChanges(this.cdRef, priority);
  }

  onClick(): void {
    detectChanges(this.cdRef);

    setTimeout(() => {
      const targetEl = this.document.getElementById('checkout-stepper')!
      const targetRectTop = targetEl.getBoundingClientRect().top;
      const scrollTop = this.scrollable.getElementRef().nativeElement.scrollTop
      this.scrollable.scrollTo({
        top: targetRectTop + scrollTop,
        behavior: 'smooth'
      })
    }, 0);
  }
}

export const CHECKOUT_PAGE_ROUTES: Route[] = [
  { path: '', component: CheckoutPageComponent }
]
