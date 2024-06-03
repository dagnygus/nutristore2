import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIfModule, NzLetModule, initializeComponent } from '../../noop-zone';
import { UpdateUserPageViewModel } from './update-user-page.vm';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormInputComponent } from '../../common/components/form-input/form-input.component';

@Component({
  selector: 'app-update-user-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    NzLetModule,
    NzIfModule,
    MatButtonModule,
    FormInputComponent
  ],
  templateUrl: './update-user-page.component.html',
  styleUrl: './update-user-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UpdateUserPageViewModel]
})
export class UpdateUserPageComponent {
  cdRef = initializeComponent(this);
  vm = inject(UpdateUserPageViewModel);
}

export const UPDATE_USER_PAGE_ROUTES: Route[] = [
  { path: '', component: UpdateUserPageComponent }
]
