import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RegisterPageViewModel } from './register-page.vm';
import { NzIfModule, NzLetModule, initializeComponent } from '../../noop-zone';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { FormInputComponent } from '../../common/components/form-input/form-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    FormInputComponent,
    MatFormFieldModule,
    MatButtonModule,
    NzLetModule,
    NzIfModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RegisterPageViewModel,
  ],
  host: { 'class': 'page' }
})
export class RegisterPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(RegisterPageViewModel);
}

export const REGISTER_PAGE_ROUTES: Route[] = [
  { path: '', component: RegisterPageComponent }
]
