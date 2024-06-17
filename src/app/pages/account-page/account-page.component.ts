import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { Priority, detectChanges, initializeComponent } from '../../noop-zone';
import { AccountPageViewModel } from './account-page.vm';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../common/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'account-page',
  standalone: true,
  imports: [RouterModule, MatButtonModule, LoadingSpinnerComponent, CommonModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountPageViewModel],
  host: { 'class': 'page' }
})
export class AccountPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(AccountPageViewModel);

  constructor() {
    effect(() => {
      this.vm.userData();
      detectChanges(this.cdRef, Priority.userBlocking)
    });
  }
}

export const ACCOUNT_PAGE_ROUTES: Route[] = [
  { path: '', component: AccountPageComponent }
]
