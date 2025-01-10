import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth-service/auth-service.service';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
  route,
  state,
) => {
  const router: Router = inject(Router);

  // Check the authentication status
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        // If the user is authenticated prevent user from accessing login page
        if (authenticated) {
          return of(router.parseUrl('home'));
        }

        // Allow the access
        return of(true);
      }),
    );
};
