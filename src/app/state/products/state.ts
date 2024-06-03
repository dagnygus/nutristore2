import { Injectable } from "@angular/core";
import { ProductsState } from "../../models/abstract-models";
import { BaseStateRef } from "../../models/object-models";

@Injectable({ providedIn: 'root' })
export class ProductsStateRef extends BaseStateRef<ProductsState> {
  constructor() { super('products'); }
}
