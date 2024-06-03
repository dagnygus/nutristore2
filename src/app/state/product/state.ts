import { Injectable } from "@angular/core";
import { ProductState } from "../../models/abstract-models";
import { BaseStateRef } from "../../models/object-models";

@Injectable({ providedIn: 'root' })
export class ProductStateRef extends BaseStateRef<ProductState> {
  constructor() { super('product'); }
}
