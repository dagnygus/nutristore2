import { Injectable } from "@angular/core";
import { BaseStateRef } from "../../models/object-models";
import { RouterStateUrl } from "../../models/abstract-models";
import { RouterReducerState } from "@ngrx/router-store";

@Injectable({ providedIn: 'root' })
export class RouterStateRef extends BaseStateRef<RouterReducerState<RouterStateUrl>> {
  constructor() { super('router'); }
}
