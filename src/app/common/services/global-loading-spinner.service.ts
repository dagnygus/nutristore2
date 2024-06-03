import { Overlay, OverlayPositionBuilder, OverlayRef, ScrollStrategyOptions } from "@angular/cdk/overlay";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Priority, scheduleWork } from "../../noop-zone";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";

@Injectable({ providedIn: 'root' })
export class GlobalLoadingSpinner {
  private _overlayRef: OverlayRef;
  private _attached = false;
  private _attachScheduled = false
  private _detachScheduled = false
  private _abort$ = new Subject<void>()
  private _portal = new ComponentPortal(LoadingSpinnerComponent)

  constructor(
    overlay: Overlay,
    positionBuilder: OverlayPositionBuilder,
    scrollPositionOptions: ScrollStrategyOptions
  ) {
    this._overlayRef = overlay.create({
      hasBackdrop: true,
      positionStrategy: positionBuilder.global().centerHorizontally().centerVertically(),
      scrollStrategy: scrollPositionOptions.block()
    });
  }

  show(priority: Priority = Priority.normal): void {
    if (this._detachScheduled) {
      this._abort$.next();
      this._detachScheduled = false;
    }

    if (this._attached || this._attachScheduled) { return; }

    this._attachScheduled = true;
    scheduleWork(priority, this._abort$, () => {
      this._overlayRef.attach(this._portal);
      this._attached = true;
      this._attachScheduled = false;
    });
  }

  hide(priority: Priority = Priority.normal): void {
    if (this._attachScheduled) {
      this._abort$.next();
      this._attachScheduled = false;
    }

    if (!this._attached || this._detachScheduled) { return; }

    this._detachScheduled = true;
    scheduleWork(priority, this._abort$, () => {
      this._overlayRef.detach();
      this._attached = false;
      this._detachScheduled = false
    });
  }
}
