import { Injectable } from "@angular/core";
import { DataCache } from "../../models/abstract-models";

@Injectable({ providedIn: 'root' })
export class BrowserCache implements DataCache {

  setString(key: string, value: string): void {
    if (localStorage) {
      localStorage.setItem(key, value)
    }
  }

  getString(key: string): string | null {
    if (localStorage) {
      return localStorage.getItem(key)
    }
    return null;
  }

  setObject<T extends object = object>(key: string, value: T): void {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  getObject<T extends object = object>(key: string): T | null {
    if (localStorage) {
      const result = localStorage.getItem(key);
      if (result) {
        return JSON.parse(result);
      }
    }

    return null;
  }

  hasKey(key: string): boolean {
    if (localStorage) {
      return localStorage.getItem(key) != null;
    }
    return false
  }

  removeKey(key: string): void {
    localStorage.removeItem(key);
  }

}
