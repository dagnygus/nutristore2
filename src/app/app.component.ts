import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation, inject } from '@angular/core';
import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling'
import { InPipeModule, initializeComponent, patchNgNoopZoneForAngularCdk } from './noop-zone';
import { AppViewModel } from './app.vm';
import { GlobalLoadingSpinner } from './common/services/global-loading-spinner.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { MainContentComponent } from './common/components/main-content/main-content.component';
import { NutristoreFooterComponent } from './common/components/nutristore-footer/nutristore-footer.component';
import { NutristoreHeaderComponent } from './common/components/nutristore-header/nutristore-header.component';
import { SidenavMenuComponent } from './common/components/sidenav-menu/sidenav-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  hostDirectives: [CdkScrollable],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppViewModel],
  standalone: true,
  imports: [
    NutristoreHeaderComponent,
    MainContentComponent,
    SidenavMenuComponent,
    NutristoreFooterComponent,
    InPipeModule,
    ScrollingModule
  ]
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
    patchNgNoopZoneForAngularCdk();

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
