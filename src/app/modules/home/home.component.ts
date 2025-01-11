import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme-service/theme.service';
import { SubSink } from 'subsink';
import { NgClass } from '@angular/common';
import { ToggleThemeComponent } from '../../component/toggle-theme/toggle-theme.component';
import { ScoreTableComponent } from "../../component/score-table/score-table.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToggleThemeComponent, ScoreTableComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private _subs = new SubSink();
  userData: {username: string, password: string} = { username: '', password: '' };

  isDarkMode: boolean = false;
  transitionState: boolean = false;

  constructor(private _themeService: ThemeService) {}

  ngOnInit(): void {
    const userDecoded = localStorage.getItem('user') ?? '';
    const encodedUser = window.atob(userDecoded);

    this.userData = JSON.parse(encodedUser);
  }

  ngAfterViewInit(): void {
    this._subs.sink = this._themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this._subs.sink = this._themeService.transitionAnimation$?.subscribe({
      next: (state) => {
        this.transitionState = state;

        const eclipse = document?.getElementById('big-eclipse');
        if (state) {
          eclipse?.classList?.add('-translate-y-[37rem]', 'ease-out');
          setTimeout(() => {
            eclipse?.classList?.remove('-translate-y-[37rem]', 'ease-out');
            eclipse?.classList?.add('translate-y-[60rem]', 'ease-in');
          }, 1500);
        } else {
          eclipse?.classList?.add('translate-y-[60rem]', 'ease-in');
        }
      },
    });
  }

  ngOnDestroy(): void {
    this._subs?.unsubscribe();
  }
}
