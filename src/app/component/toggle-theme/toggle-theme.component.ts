import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme-service/theme.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-toggle-theme',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-theme.component.html',
  styles: `
    #toggle:checked + svg #container {
      fill: #2b4360;
    }

    #toggle:checked + svg #button {
      transform: translate(28px, 2.333px);
    }

    #toggle:checked + svg #sun {
      opacity: 0;
    }

    #toggle:checked + svg #moon {
      opacity: 1;
    }

    #toggle:checked + svg #cloud {
      opacity: 0;
    }

    #toggle:checked + svg #stars {
      opacity: 1;
    }
  `,
})
export class ToggleThemeComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  isDarkMode: boolean = false;

  constructor(private _themeService: ThemeService, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._subs.sink = this._themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      this._cdr?.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this._subs.sink?.unsubscribe()
  }

  toggleDarkMode() {
    this._themeService?.toggleDarkMode();
  }
}
