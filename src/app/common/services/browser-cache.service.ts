import { Injectable } from "@angular/core";
import { DataCache } from "../../models/abstract-models";

declare const localStorage: any

@Injectable({ providedIn: 'root' })
export class BrowserCache implements DataCache {

  setString(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }

  getString(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null;
  }

  setObject<T extends object = object>(key: string, value: T): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  getObject<T extends object = object>(key: string): T | null {
    if (typeof localStorage !== 'undefined') {
      const result = localStorage.getItem(key);
      if (result) {
        return JSON.parse(result);
      }
    }

    return null;
  }

  hasKey(key: string): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) != null;
    }
    return false
  }

  removeKey(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

}
