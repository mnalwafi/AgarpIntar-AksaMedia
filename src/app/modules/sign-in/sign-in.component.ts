import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme-service/theme.service';
import { SubSink } from 'subsink';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { ToggleThemeComponent } from '../../component/toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ToggleThemeComponent],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements AfterViewInit, OnDestroy {
  private _subs = new SubSink();

  isDarkMode: boolean = false;
  transitionState: boolean = false;

  loginForm: FormGroup<LoginForm>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _themeService: ThemeService,
    private _authService: AuthService
  ) {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this._subs.sink = this._themeService.transitionAnimation$?.subscribe({
      next: (state) => {
        this.transitionState = state;
      },
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  signIn(even: Event) {
    if (event) {
      event.preventDefault();
    }

    if (
      this.loginForm?.getRawValue()?.username !== 'AksaMedia' ||
      this.loginForm?.getRawValue()?.password !== 'admin1234'
    ) {
      const textMasukYuk = document.getElementById('masuk-yuk');
      const textSalahCredential = document.getElementById('salah-credential');

      textMasukYuk?.classList?.add('-translate-y-10');
      textSalahCredential?.classList?.remove('translate-y-10');

      setTimeout(() => {
        textMasukYuk?.classList?.remove('-translate-y-10');
        textSalahCredential?.classList?.add('translate-y-10');
      }, 1500);
    } else {
      const eclipse = document?.getElementById('big-eclipse');
      eclipse?.classList?.add('-translate-y-[32rem]');

      this._themeService?.transitionAnimation?.next(true);

      setTimeout(() => {
        this._authService?.signIn(this.loginForm?.getRawValue());
        this._router.navigate(['/home']);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}

interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
