import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MonoTypeOperatorFunction, Observable, Subject, Subscription, merge, of, pipe } from "rxjs";
import { first, map, sample, startWith, take, takeUntil } from "rxjs/operators";
import { AppHttpService } from "../common/services/app-http.service";

const _titleOperator = map((value: string) => value.replace(/\w\S*/, txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
const _trimOperator = map((value: string) => value.trim());
const _ltrimOperator = map((value: string) => value.trimLeft());
const _rtrimOperator = map((value: string) => value.trimRight());
const _trimTitleOperator = pipe(_trimOperator, _titleOperator);
const _ltrimTitleOperator = pipe(_ltrimOperator, _titleOperator);
const _rtrimTitleOperator = pipe(_rtrimOperator, _titleOperator);
const _toUpperOperator = map((value: string) => value.toUpperCase());
const _toLowerOperator = map((value: string) => value.toLowerCase());

const _SPECIAL_CHARACTERS_AND_NUMBERS_REGEX = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
const _NOT_FOR_STREET_REGEX = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?~]/;
const _SPECIAL_CHARACTERS_REGEX = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

const _createSubcriberFn = (control: FormControl<string>) => (value: string) => {
  if (value !== control.value) {
    control.setValue(value)
  }
}

const _getPipe = (operator: MonoTypeOperatorFunction<string> ,sampler?: Observable<unknown | void>) => {
  if (sampler) {
    return pipe(
      operator,
      sample(sampler)
    ) as MonoTypeOperatorFunction<string>;
  }

  return operator as MonoTypeOperatorFunction<string>;
}

export const setTitleSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_titleOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setTrimSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return  control.valueChanges.pipe(_getPipe(_trimOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setLTrimSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_ltrimOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setRTrimSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_rtrimOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setTrimTitleSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_trimTitleOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setLTrimTitleSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_ltrimTitleOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setRTrimTitleSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_rtrimTitleOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setToUpperSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_toUpperOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const setToLowerSanitizer = (control: FormControl<string>, sanitizeTrigger?: Observable<unknown | void>) => {
  return control.valueChanges.pipe(_getPipe(_toLowerOperator, sanitizeTrigger)).subscribe(_createSubcriberFn(control));
};

export const validationWithMessage: (validator: ValidatorFn, message: string) => ValidatorFn = (validator, message) => {
  return (control) => {
    const validationResult = validator(control);
    if (validationResult == null) { return null; }
    const validationErrors: ValidationErrors = {};
    validationErrors[Object.keys(validationResult)[0]] = message;
    return validationErrors;
  }
};

export const compareValidator: (pathToControl: string, message: string) => ValidatorFn = (pathToControl, message) => {
  return (control) => {
    const root = control.root;
    if (root !== control && root instanceof FormGroup) {
      const abstractControl = root.get(pathToControl)
      if (abstractControl instanceof FormControl) {
        if (abstractControl.value !== control.value) {
          return { compare: message };
        }
      }
    }
    return null;
  }
};

export const distinctValidator: (pathToControl: string, message: string) => ValidatorFn = (pathToControl, message) => {
  return (control) => {
    const root = control.root;
    if (root !== control && root instanceof FormGroup) {
      const abstractControl = root.get(pathToControl)
      if (abstractControl instanceof FormControl) {
        if (abstractControl.value === control.value) {
          return { distinct: message };
        }
      }
    }
    return null;
  }
};

export const noNumbersAndSpecialCharactersValidator: (message: string, allowWhiteSpace?: boolean) => ValidatorFn = (message, allowWhiteSpace) => {
  return (control) => {
    const value = control.value;
    if (value == null || typeof value !== 'string') {
      return null;
    }

    const testResult = _SPECIAL_CHARACTERS_AND_NUMBERS_REGEX.test(value);

    if (testResult) {
      return {
        noNumbersAndSpecialCharactersValdator: message
      };
    }

    if (!allowWhiteSpace && value.includes(' ')) {
      return {
        noNumbersAndSpecialCharactersValdator: message
      };
    }

    return null;
  }
};

export const isEmailInUseValidator: (message: string) => AsyncValidatorFn = (message) => {
  const httpService = inject(AppHttpService);
  return (control) => {
    if (typeof control.value !== 'string') {
      throw new Error('[isEmailInUseValidator] Incorect value type! Control value must be string!')
    }

    return httpService.isEmailInUse(control.value).pipe(map((result) => {
      if (result) {
        return { isEmailInUse: message };
      }
      return null;
    }))
  }
}

export const isNewEmailInUseValidator: (currentEmail: string, message: string) => AsyncValidatorFn = (currentEmail, message) => {
  const httpService = inject(AppHttpService);
  return (control) => {
    if (typeof control.value !== 'string') {
      throw new Error('[isNewEmailInUseValidator] Incorect value type! Control value must be string!')
    }

    if (control.value === currentEmail) {
      return of(null);
    }

    return httpService.isEmailInUse(control.value).pipe(map((result) => {
      if (result) {
        return { isNewEmailInUse: message };
      }
      return null;
    }))
  }
}

export const isEmailNotInUseValidator: (message: string) => AsyncValidatorFn = (message) => {
  const httpService = inject(AppHttpService);
  return (control) => {
    if (typeof control.value !== 'string') {
      throw new Error('[isEmailNotInUseValidator] Incorect value type! Control value must be string!')
    }

    return httpService.isEmailNotInUse(control.value).pipe(map((result) => {
      if (result) {
        return { isEmailNotInUse: message };
      }
      return null;
    }))
  }
}

export const noSpecialCharactersValidator: (message: string, allowWhiteSpace?: boolean) => ValidatorFn = (message, allowWhiteSpace) => (control) => {
  const value = control.value;
    if (value == null || typeof value !== 'string') {
      return null;
    }

    const testResult = _SPECIAL_CHARACTERS_REGEX.test(value);

    if (testResult) {
      return {
        noSpecialCharactersValdator: message
      };
    }

    if (!allowWhiteSpace && value.includes(' ')) {
      return {
        noSpecialCharactersValdator: message
      };
    }
  return null;
}

export const markAllAsTouchedAndDirty = (formGroupOrControl: AbstractControl) => {

  formGroupOrControl.markAsTouched();
  formGroupOrControl.markAsDirty();

  if (formGroupOrControl instanceof FormGroup) {
    const group = formGroupOrControl;
    Object.keys(group.controls).forEach((key) => {
      const control = group.controls[key];
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
      } else {
        markAllAsTouchedAndDirty(control)
      }
    });
    return;
  }

  if (formGroupOrControl instanceof FormArray) {
    const formArray = formGroupOrControl;
    for (let i = 0; i <= formArray.length; i++) {
      const control = formArray.at(i);
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
      } else {
        markAllAsTouchedAndDirty(control)
      }
      return;
    }
  }
}

export class FormSubmiter {
  private _onceSubmited = false;
  private _submitSuccessSubject = new Subject<void>();
  private _submitFailedSubject = new Subject<void>();
  private _subscription: Subscription | null = null;

  readonly submitSuccess = this._submitSuccessSubject.asObservable();
  readonly submitFailed = this._submitFailedSubject.asObservable();

  get submitDisabled(): boolean {
    return this._onceSubmited && (this._formGroup.invalid || this._formGroup.pending);
  }

  readonly submitDisabled$ = merge(
    this._formGroup.statusChanges,
    this._submitFailedSubject
  ).pipe(
    startWith(this.submitDisabled),
    map(() => this.submitDisabled),
  );

  constructor(private _formGroup: FormGroup, private _onSubmitSuccess: () => void) {}

  dispose(): void {
    if (this._subscription) { this._subscription.unsubscribe(); }
  }

  trySubmit(): void {
    this._onceSubmited = true;
    markAllAsTouchedAndDirty(this._formGroup);
    setTimeout(() => {
      if (this._formGroup.status !== 'PENDING') {
        this._trySubmit();
      } else {
        this._subscription = this._formGroup.statusChanges.pipe(take(1)).subscribe(() => {
          this._subscription!.unsubscribe();
          this._subscription = null;
          this._trySubmit();
        });
      }
    });
  }

  private _trySubmit(): void {
    if (this._formGroup.invalid || this._formGroup.pending) {
      this._submitFailedSubject.next();
      return;
    }
    this._onSubmitSuccess();
    this._submitSuccessSubject.next();
  }
}
