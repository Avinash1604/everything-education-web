import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private prefix = 'ee_';
  private fallback = new Map<string, string>();
  private sessionAvailable: boolean;

  constructor() {
    this.sessionAvailable = this.checkSessionStorage();
  }

  private checkSessionStorage(): boolean {
    try {
      return (
        typeof window !== 'undefined' &&
        typeof window.sessionStorage !== 'undefined' &&
        window.sessionStorage !== null
      );
    } catch (e) {
      return false;
    }
  }

  set(key: string, value: string) {
    const k = this.prefix + key;
    if (this.sessionAvailable) {
      try {
        sessionStorage.setItem(k, value);
        return;
      } catch (e) {
        // fall through to fallback on any storage error
      }
    }
    this.fallback.set(k, value);
  }

  get(key: string): string | null {
    const k = this.prefix + key;
    if (this.sessionAvailable) {
      try {
        return sessionStorage.getItem(k);
      } catch (e) {
        // fall back to in-memory store
      }
    }
    return this.fallback.has(k) ? (this.fallback.get(k) as string) : null;
  }

  remove(key: string) {
    const k = this.prefix + key;
    if (this.sessionAvailable) {
      try {
        sessionStorage.removeItem(k);
        return;
      } catch (e) {
        // fall through to fallback
      }
    }
    this.fallback.delete(k);
  }

  clearAll() {
    if (this.sessionAvailable) {
      try {
        // only clear keys with our prefix to avoid wiping unrelated session data
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            sessionStorage.removeItem(key);
          }
        }
        return;
      } catch (e) {
        // fall through to fallback
      }
    }
    this.fallback.clear();
  }
}
