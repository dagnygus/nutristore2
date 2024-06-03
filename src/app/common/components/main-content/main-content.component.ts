import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutledExtensionDirective } from '../../directives/router-outled-extension.directive';
import { initializeComponent } from '../../../noop-zone';

@Component({
  selector: 'main[nutristore]',
  standalone: true,
  imports: [RouterModule, RouterOutledExtensionDirective],
  template: "<router-outlet/>",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MainContentComponent {
  cdRef = initializeComponent(this);
}
