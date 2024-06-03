import { ChangeDetectorRef, Directive, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription, distinctUntilChanged, filter, map } from "rxjs";
import { detectChanges } from "../../noop-zone";

@Directive({ selector: 'router-outled', standalone: true })
export class RouterOutledExtensionDirective implements OnDestroy {
  private _subscription: Subscription;

  constructor(router: Router, changeDetectorRef: ChangeDetectorRef) {
    this._subscription = router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => router.routerState.root.firstChild?.component),
      distinctUntilChanged()
    ).subscribe(() => detectChanges(changeDetectorRef));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
