import { Injectable } from "@angular/core";
import { BaseStateRef } from "../../models/object-models";
import { SearchState } from "../../models/abstract-models";
import { initialSearchState } from "../../utils/constacts";

@Injectable({ providedIn: 'root' })
export class SearchStateRef extends BaseStateRef<SearchState> {
  constructor() { super('search'); }

  get isEmpty(): boolean {
    return this.state === initialSearchState
  }
}
