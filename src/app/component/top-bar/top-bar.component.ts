import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToggleThemeComponent } from "../toggle-theme/toggle-theme.component";
import { AuthService } from '../../services/auth-service/auth-service.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [ToggleThemeComponent],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent implements OnInit, OnDestroy {
  private _subs: SubSink = new SubSink();

  currentRoute: string = '';
  userData!: {username: string, password: string, full_name?:string, photo?: string};

  constructor (private _authService: AuthService, private _router: Router,) {}

  ngOnInit(): void {
    const userDecoded = localStorage.getItem('user') ?? '';
    const encodedUser = window.atob(userDecoded);


    this.userData = JSON.parse(encodedUser);
  }

  changeProfile(): void {
    this._router.navigate(['/change-profile'])
  }

  signOut(): void {
    this._authService?.signOut();
    this._router?.navigate(['/sign-in']);
  }

  ngOnDestroy(): void {
    this._subs.sink?.unsubscribe()
  }
}
