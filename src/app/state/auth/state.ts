import { Injectable } from "@angular/core";
import { AuthState } from "../../models/abstract-models";
import { BaseStateRef } from "../../models/object-models";

@Injectable({ providedIn: 'root' })
export class AuthStateRef extends BaseStateRef<AuthState> {
  constructor() { super('auth'); }
}
