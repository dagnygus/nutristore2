import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIfModule, NzLetModule, initializeComponent } from '../../noop-zone';
import { LoginPageViewModel } from './login-page.vm';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, RouterModule } from '@angular/router';
import { FormInputComponent } from '../../common/components/form-input/form-input.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    FormInputComponent,
    // MatFormFieldModule,
    MatButtonModule,
    NzLetModule,
    NzIfModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginPageViewModel]
})
export class LoginPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(LoginPageViewModel);
}

export const LOGIN_PAGE_ROUTES: Route[] = [
  { path: '', component: LoginPageComponent }
]
