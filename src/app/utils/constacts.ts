import { AuthState, CartState, HomePageState, ProductState, ProductsState, SearchState } from "../models/abstract-models";
import { ProductCategory } from "../models/object-models";
import { createRangeArray } from "./utils";

export const emptyArray = Object.freeze([]) as readonly any[];

export const initialProductsState: ProductsState = {
  items: emptyArray,
  category: ''
};

export const initialHomePageState: HomePageState = {
  newest: emptyArray,
  mostPopular: emptyArray,
  recomended: emptyArray
};

export const initialSearchState: SearchState = {
  key: '',
  results: emptyArray
}

export const initialProductState: ProductState = {
  productData: null
}

export const initialAuthState: AuthState = {
  data: null
}

export const initialCartState: CartState = {
  totalPrice: '0$',
  items: emptyArray
}

export const RANGE_8 = Object.freeze(createRangeArray(8));
export const CATEGORY_LIST = Object.values(ProductCategory);

export const RESPONSE_ERROR = Symbol();
