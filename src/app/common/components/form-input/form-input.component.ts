import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Injector, Input, OnInit, Optional, Output, Signal, SkipSelf, effect, inject, isSignal, untracked } from '@angular/core';
import { AsyncValidatorFn, ControlContainer, FormGroup, FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { Priority, detectChanges, initializeComponent } from '../../../noop-zone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

type FormInputType = 'text' | 'password' | 'submit' | 'button' | 'reset'

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }]
})
export class FormInputComponent implements OnInit {
  private _withIcon: boolean = false
  private _asyncValidator: AsyncValidatorFn | null = null;

  cdRef = initializeComponent(this);
  errorMessage = ''

  @Input({ required: true }) name!: string;
  @Input({ required: true }) labelText!: string;
  @Input({ required: true }) color!: 'primary' | 'accent'
  @Input() placeholder = ''
  @Input() type: FormInputType | Signal<FormInputType> = 'text';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() checkTrigger: Observable<void> | null = null;
  @Input() set withIcon(value: boolean | '') {
    this._withIcon = coerceBooleanProperty(value);
  }

  @Output() iconClick = new EventEmitter<void>()

  constructor(
    private _formGroupDir: FormGroupDirective,
    private _destroyRef: DestroyRef,
    private _injector: Injector
  ) { }

  ngOnInit(): void {

    this._formGroupDir.control.controls[this.name].statusChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => detectChanges(this.cdRef));

    this.removeAyncValidators();

    if (this.checkTrigger) {
      this.checkTrigger.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this.checkErrors())
    }

    if(isSignal(this.type)) {
      const type = this.type;
      let isInit = false

      effect(() => {
        type();
        detectChanges(this.cdRef, Priority.userBlocking)
      }, { injector: this._injector });
    }
  }

  detectChanges(): void {
    detectChanges(this.cdRef);
  }

  checkErrors(): void {
    const errors = this._formGroupDir.control.controls[this.name].errors;
    if (!errors) {
      if (this.errorMessage !== '') {
        this.errorMessage = '';
        detectChanges(this.cdRef);
      }
      return;
    }

    const errorsValues = Object.values(errors);

    if (errorsValues.length === 0) {
      if (this.errorMessage !== '') {
        this.errorMessage = '';
        detectChanges(this.cdRef);
      }
      return;
    }

    if (typeof errorsValues[0] !== 'string') {
      throw new Error('Incorect form validator!')
    }

    if (this.errorMessage !== errorsValues[0]) {
      this.errorMessage = errorsValues[0];
      detectChanges(this.cdRef);
    }
  }

  removeAyncValidators(): void {
    const control = this._formGroupDir.control.controls[this.name];
    this._asyncValidator = control.asyncValidator;
    control.clearAsyncValidators();
  }

  restoreAsyncValidators(): void {
    if (this._asyncValidator) {
      const control = this._formGroupDir.control.controls[this.name];
      control.setAsyncValidators(this._asyncValidator);
      control.updateValueAndValidity();
    }

  }

  _getType(): FormInputType {
    if (typeof this.type === 'string') {
      return this.type;
    }
    return this.type();
  }

  _isWithIcon() {
    const type = this._getType();
    if (type === 'password' || type === 'text') {
      return this._withIcon
    }
    return false
  }

  _getIconType(): string {
    return this._getType() === 'password' ? 'visibility' : 'visibility_off'
  }
}
