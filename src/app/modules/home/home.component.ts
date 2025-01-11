import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme-service/theme.service';
import { SubSink } from 'subsink';
import { ScoreTableComponent } from "../../component/score-table/score-table.component";
import { TopBarComponent } from "../../component/top-bar/top-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreTableComponent, TopBarComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private _subs = new SubSink();

  isDarkMode: boolean = false;
  transitionState: boolean = false;

  constructor(private _themeService: ThemeService) {}

  ngAfterViewInit(): void {
    this._subs.sink = this._themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy(): void {
    this._subs?.unsubscribe();
  }
}
