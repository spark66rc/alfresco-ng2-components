import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

const ROUTE_DEFAULT = '/';

@Component({
  template: '',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationConfirmationComponent {
  constructor(private auth: AuthService, private _router: Router) {
    const routeStored$ = from(this.auth.loginCallback()).pipe(
      tap((val) => console.log(val)),
      map((route) => route || ROUTE_DEFAULT),
      catchError(() => of(ROUTE_DEFAULT))
    );

    routeStored$.pipe(first()).subscribe((route) => {
      this._router.navigateByUrl(route, { replaceUrl: true });
    });
  }
}