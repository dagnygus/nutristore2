import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InPipeModule, Priority, detectChanges, inPipeDefaultPriority, initializeComponent } from '../../../../noop-zone';
import { AppViewModel } from '../../../../app.vm';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchItem } from '../../../../models/abstract-models';

const interactionKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

@Component({
  selector: 'nutristore-searchbox',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatAutocompleteModule,
    InPipeModule
  ],
  templateUrl: './nutristore-searchbox.component.html',
  styleUrl: './nutristore-searchbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [inPipeDefaultPriority(Priority.normal)]
})
export class NutristoreSearchboxComponent {
  cdRef = initializeComponent(this);
  Priority = Priority;
  vm = inject(AppViewModel);

  detectChanges(priority: Priority) {
    detectChanges(this.cdRef, priority);
  }

  onKeyDown(key: string, priority: Priority) {
    if (interactionKeys.includes(key)) {
      detectChanges(this.cdRef, priority);
    }
  }

  displayFn(searchItem: SearchItem): string {
    return searchItem.name
  }


}
