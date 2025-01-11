import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private prefersColorQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private darkModeSubject: BehaviorSubject<boolean>;
  private userPreferenceKey = 'user-dark-mode-preference';

  constructor() {
    const savedPreference = localStorage.getItem(this.userPreferenceKey);
    const isDarkMode =
      savedPreference !== null
        ? savedPreference === 'dark'
        : this.prefersColorQuery.matches;

    this.darkModeSubject = new BehaviorSubject<boolean>(isDarkMode);
    this.applyDarkMode(isDarkMode);

    this.prefersColorQuery.addEventListener('change', (event) => {
      this.applyDarkMode(event.matches);
    });
  }

  get darkMode$(): Observable<boolean> {
    return this.darkModeSubject.asObservable();
  }

  toggleDarkMode(): void {
    const isCurrentlyDark = this.darkModeSubject.value;
    const newPreference = !isCurrentlyDark;

    this.saveUserPreference(newPreference);
    this.applyDarkMode(newPreference);
  }

  private saveUserPreference(isDark: boolean): void {
    localStorage.setItem(this.userPreferenceKey, isDark ? 'dark' : 'light');
  }

  private applyDarkMode(isDark: boolean): void {
    document.body.classList[isDark ? 'add' : 'remove']('dark');
    console.log(isDark);

    this.darkModeSubject.next(isDark);
  }
}
