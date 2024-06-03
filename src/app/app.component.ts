import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Renderer2, ViewEncapsulation, effect, inject } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling'
import { initializeComponent } from './noop-zone';
import { AppViewModel } from './app.vm';
import { GlobalLoadingSpinner } from './common/services/global-loading-spinner.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  hostDirectives: [CdkScrollable],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppViewModel]
})
export class AppComponent {
  cdRef = initializeComponent(this);
  vm = inject(AppViewModel);
  globalLoadingSpinner = inject(GlobalLoadingSpinner);
  router = inject(Router);
  scrollable = inject(CdkScrollable);
  platform = inject(Platform);
  document = inject(DOCUMENT)

  constructor() {
    this.vm.onBeginSigninOrSignup.pipe(takeUntilDestroyed()).subscribe(() => {
      this.globalLoadingSpinner.show();
    });
    this.vm.onAuthUpdateOrError.pipe(takeUntilDestroyed()).subscribe(() => {
      this.globalLoadingSpinner.hide();
    });
    this.vm.onChangePasswordStart.pipe(takeUntilDestroyed()).subscribe(() => {
      this.globalLoadingSpinner.show();
    });
    this.vm.onChangePasswordDone.pipe(takeUntilDestroyed()).subscribe(() => {
      this.globalLoadingSpinner.hide();
    });
    this.vm.onUpdateUserStart.pipe(takeUntilDestroyed()).subscribe(() => {
      this.globalLoadingSpinner.show();
    });

    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd && this.platform.isBrowser),
      skip(1),
      takeUntilDestroyed()
    ).subscribe(() => {
      const targetEl = this.document.getElementById('header-last-divider')!;
      const elementRectTop = targetEl.getBoundingClientRect().top;
      const scrollTop = this.scrollable.getElementRef().nativeElement.scrollTop;
      this.scrollable.scrollTo({
        top: elementRectTop + scrollTop,
        behavior: 'smooth'
      });
    })
  }

  @HostListener('window:beforeunload')
  onUnload(): void {
    this.vm.disposeBrowserCache();
  }
}
