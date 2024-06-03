import { Injectable, OnDestroy, Signal, ValueEqualityFn, WritableSignal, inject, signal } from "@angular/core";
import { State } from "@ngrx/store";
import { AppState, ProductsState } from "./abstract-models";
import { MonoTypeOperatorFunction, Observable, Subject, takeUntil } from "rxjs";
import { RESPONSE_ERROR } from "../utils/constacts";

export abstract class BaseStateRef<T extends object> {
  private _state = inject(State<AppState>);

  get state(): T {
    if (this._state.value[this._stateName] == null) {
      throw new Error(this._stateName + ': State not found');
    }
    return this._state.value[this._stateName]
  }

  constructor(private _stateName: keyof AppState) {}
}

@Injectable()
export abstract class ViewModelBase implements OnDestroy {
  private _destroySubject = new Subject<void>();

  protected takeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this._destroySubject);
  }

  protected toSignal<T>(initilaValue: T, source: Observable<T>, equal?: ValueEqualityFn<T>): Signal<T> {
    let value: WritableSignal<T>
    if (equal) {
      value = signal(initilaValue, { equal })
    } else {
      value = signal(initilaValue);
    }
    source.pipe(takeUntil(this._destroySubject)).subscribe((val) => value.set(val));
    return value.asReadonly();
  }

  ngOnDestroy(): void {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
}

export enum StateStatus {
  empty,
  complete,
  pending,
  error,
}

export enum ProductCategory {
  AMINOACIDS = 'aminoacids',
  FAT_BURNERS = 'fat-burners',
  PREWORKOUT = 'preworkout',
  AFTERWORKOUT = 'afterworkout',
  CREATINE = 'creatine',
  SARMS = 'sarms',
  LIVER_PROTECTION = 'liver-protection',
  HEALTH_AND_VITAMINS = 'health-and-vitamins',
  JOINT_PROTECTION = 'joint-protection',
  MEMORY_AND_CONCETRATION = 'memory-and-concetration',
  ENERGY_AND_AGITATION = 'energy-and-agitation',
  STRESS_AND_NERVES = 'stress-and-nerves',
  POTENCY_AND_TESTOSTERONE = 'potency-and-testosterone',
  SLEEP_AND_RELAX = 'sleep-and-relax',
  LIBIDO_IN_WOMAN = 'libido-in-woman',
}

export class ResponseError extends Error {
  constructor(public code: number, message: string) { super(message); }
}
