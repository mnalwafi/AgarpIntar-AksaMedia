import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  transitionAnimation = new BehaviorSubject<boolean>(false);
  transitionAnimation$ = this.transitionAnimation.asObservable();

  private prefersColorQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private darkModeSubject: BehaviorSubject<boolean>;
  private userPreferenceKey = 'user-dark-mode-preference';

  constructor() {
    // Check for user preference in localStorage
    const savedPreference = localStorage.getItem(this.userPreferenceKey);
    const isDarkMode =
      savedPreference !== null
        ? savedPreference === 'dark'
        : this.prefersColorQuery.matches;

    // Initialize the BehaviorSubject with the initial mode
    this.darkModeSubject = new BehaviorSubject<boolean>(isDarkMode);
    this.applyDarkMode(isDarkMode);

    // Listen for OS changes only if no user preference exists
    this.prefersColorQuery.addEventListener('change', (event) => {
      this.applyDarkMode(event.matches);
    });
  }

  // Observable for components to subscribe to dark mode changes
  get darkMode$(): Observable<boolean> {
    return this.darkModeSubject.asObservable();
  }

  // Manually toggle dark mode
  toggleDarkMode(): void {
    const isCurrentlyDark = this.darkModeSubject.value;
    const newPreference = !isCurrentlyDark;

    // Save the user preference
    this.saveUserPreference(newPreference);
    this.applyDarkMode(newPreference);
  }

  // Save user preference to localStorage
  private saveUserPreference(isDark: boolean): void {
    localStorage.setItem(this.userPreferenceKey, isDark ? 'dark' : 'light');
  }

  // Apply dark mode and notify subscribers
  private applyDarkMode(isDark: boolean): void {
    document.body.classList[isDark ? 'add' : 'remove']('dark');
    this.darkModeSubject.next(isDark);
  }
}
