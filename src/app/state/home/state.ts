import { Injectable } from "@angular/core";
import { HomePageState } from "../../models/abstract-models";
import { BaseStateRef } from "../../models/object-models";

@Injectable({ providedIn: 'root' })
export class HomeStateRef extends BaseStateRef<HomePageState> {
  constructor() { super('home'); }
}
