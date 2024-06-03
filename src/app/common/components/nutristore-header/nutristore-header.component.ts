import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InPipeModule, NzLetModule, NzLocalViewModule, Priority, detectChanges, initializeComponent, provideNzLocalViewConfiguration } from '../../../noop-zone';
import { NutristoreSearchboxComponent } from './nutristore-searchbox/nutristore-searchbox.component';
import { AppViewModel } from '../../../app.vm';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'header[nutristore]',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NutristoreSearchboxComponent,
    RouterModule,
    MatMenuModule,
    NzLocalViewModule,
    InPipeModule,
    NzLetModule
  ],
  templateUrl: './nutristore-header.component.html',
  styleUrl: './nutristore-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [provideNzLocalViewConfiguration({ syncCreation: true })]
})
export class NutristoreHeaderComponent {
  cdRef = initializeComponent(this);
  vm = inject(AppViewModel);
  Priority = Priority

  detectChanges(cdRef: ChangeDetectorRef, priority: Priority = Priority.normal) {
    detectChanges(cdRef, priority)
  }
}
