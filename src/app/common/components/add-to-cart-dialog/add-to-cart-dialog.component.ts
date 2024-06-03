import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { initializeComponent } from '../../../noop-zone';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'add-to-cart-dialog',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrl: './add-to-cart-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToCartDialogComponent {
  cdRef = initializeComponent(this);
  data: string = inject(MAT_DIALOG_DATA);
}
