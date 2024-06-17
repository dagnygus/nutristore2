import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIfModule, NzLetModule, initializeComponent } from '../../noop-zone';
import { NewPasswordPageViewModel } from './new-password-page.vm';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../common/components/form-input/form-input.component';
import { MatButtonModule } from '@angular/material/button';
import { Route, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../common/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-new-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    NzIfModule,
    NzLetModule,
    MatButtonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './new-password-page.component.html',
  styleUrl: './new-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewPasswordPageViewModel],
  host: { 'class': 'page' }
})
export class NewPasswordPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(NewPasswordPageViewModel);
}

export const NEW_PASSWORD_PAGE_ROUTES: Route[] = [
  { path: '', component: NewPasswordPageComponent }
]
