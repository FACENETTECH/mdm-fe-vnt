import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private keyCloak: KeycloakService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const lstRoles: string[] = this.keyCloak.getUserRoles();

    console.log('lstrole', lstRoles);

    if (lstRoles && lstRoles.length > 0) {
      const requiredRole = route.data['requiredRole'];
      console.log('reqiuerole', requiredRole);

      // console.log('role-acc,', lstRoles, 'require-role', requiredRole);

      if (this.checkRoles(requiredRole, lstRoles)) {
        // console.log('Có role được phép trong tài khoản này.');
        console.log('guard true');

        return true;
      } else {
        console.log('guard false');
        // console.log('Không có role được phép trong tài khoản này.');
        this.router.navigate(['exception/403']);
        return false;
      }
    } else {
      console.log('guard false');
      this.router.navigate(['exception/403']);
      return false;
    }
  }
  checkRoles(rolesToCheck: string[], roles: string[]): boolean {
    return rolesToCheck.some((role) => roles.includes(role));
  }
}
