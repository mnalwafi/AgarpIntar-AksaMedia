import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth-guard.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('./modules/sign-in/sign-in.routes'),
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routes'),
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'change-profile',
        loadChildren: () =>
          import('./modules/profile-form/profile-form.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
