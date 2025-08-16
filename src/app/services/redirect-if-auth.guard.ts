import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfAuthGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const auth = this.session.get('authResponse');
    if (auth) {
      return this.router.parseUrl('/home');
    }
    return true;
  }
}
