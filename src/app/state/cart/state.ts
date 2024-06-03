import { Injectable } from "@angular/core";
import { CartState } from "../../models/abstract-models";
import { BaseStateRef } from "../../models/object-models";

@Injectable({ providedIn: 'root' })
export class CartStateRef extends BaseStateRef<CartState> {
  constructor() { super('cart'); }
}
