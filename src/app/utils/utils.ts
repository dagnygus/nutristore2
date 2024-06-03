import { BrowserCache } from "../common/services/browser-cache.service";
import { AppState, BrowserCacheKey, CartItem, ProductCategoryUrl } from "../models/abstract-models";
import { ProductCategory, ResponseError } from "../models/object-models";
import { CATEGORY_LIST } from "./constacts";

declare const ngDevMode: boolean | undefined;

export function getStateName(name: keyof AppState): string {
  return name;
}

export function getUrlForProductCategory(category: ProductCategory): ProductCategoryUrl {
  switch (category) {
    case ProductCategory.AFTERWORKOUT:
      return ProductCategoryUrl.AFTERWORKOUT;
    case ProductCategory.CREATINE:
      return ProductCategoryUrl.CREATINE;
    case ProductCategory.AMINOACIDS:
      return ProductCategoryUrl.AMINOACIDES;
    case ProductCategory.ENERGY_AND_AGITATION:
      return ProductCategoryUrl.ENERGY_AND_AGITATION;
    case ProductCategory.FAT_BURNERS:
      return ProductCategoryUrl.FAT_BURNERS;
    case ProductCategory.HEALTH_AND_VITAMINS:
      return ProductCategoryUrl.HEALTH_AND_VITAMINS;
    case ProductCategory.JOINT_PROTECTION:
      return ProductCategoryUrl.JOINT_PROTECTION;
    case ProductCategory.LIBIDO_IN_WOMAN:
      return ProductCategoryUrl.LIBIDO_IN_WOMAN;
    case ProductCategory.LIVER_PROTECTION:
      return ProductCategoryUrl.LIVER_PROTECTION;
    case ProductCategory.MEMORY_AND_CONCETRATION:
      return ProductCategoryUrl.MEMORY_AND_CONCETRATION;
    case ProductCategory.POTENCY_AND_TESTOSTERONE:
      return ProductCategoryUrl.POTENCY_AND_TESTOSTERONE;
    case ProductCategory.PREWORKOUT:
      return ProductCategoryUrl.PREWORKOUT;
    case ProductCategory.SARMS:
      return ProductCategoryUrl.SARMS;
    case ProductCategory.SLEEP_AND_RELAX:
      return ProductCategoryUrl.SLEEP_AND_RELAX;
    case ProductCategory.STRESS_AND_NERVES:
      return ProductCategoryUrl.STRESS_AND_NERVES
  }
}

export function createRangeArray(range: number) {
  if (typeof ngDevMode === 'undefined' || ngDevMode && range < 1) {
    throw new Error('[createRangeArray(range)] Invalid arg! Must be greater then 0!');
  }
  const result = new Array<number>(range);
  for (let i = 0; i < range; i++) {
    result[i] = i;
  }
  return result;
}

export function isProductCategory(value: any): value is ProductCategory {
  return typeof value === 'string' && CATEGORY_LIST.includes(value as any);
}

export function assertsProductCategory(value: string): asserts value is ProductCategory {
  if (typeof value === 'string' && CATEGORY_LIST.includes(value as any)) {
    return;
  }

  throw new Error('Product category assertion failed!');
}

export function hasErrorMessage(value: any): value is { message: string } {
  return value != null && typeof value === 'object' && typeof value.message === 'string';
}

export function getTargetUrt(browserCache: BrowserCache): string {
  return browserCache.getString(BrowserCacheKey.TARGET_AUTHORIZED_URL) ||
    browserCache.getString(BrowserCacheKey.TARGET_ANONYMOUS_URL) || '/';
}

export function getPriceAsNumber(item: CartItem): number {
  return +item.price.replace('$', '');
}

export function getTotalPriceAsNumber(item: CartItem): number {
  return +item.totalPrice.replace('$', '');
}

export function getTotalPriceFromItems(items: readonly CartItem[]): string {
  let totalPrice = 0;
  for (let i = 0; i < items.length; i++) {
    totalPrice += getTotalPriceAsNumber(items[i]);
  }
  return totalPrice + '$';
}
