import { Injectable } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn({ username, password }: SignInPayload ): void {
    const user = {
      username: username,
      password: password
    }

    // Encode user data to make sure user credential is safe
    const encodedUser = window.btoa(JSON.stringify(user));

    // Add user credential to local storage
    this._userService.addLocalStorageUser(encodedUser);

    // Set authenticated to be true
    this._authenticated = true;

  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    this._userService.removeLocalStorageUser();

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the userCredential is already in the browser's local storage
    const userCredential = localStorage.getItem('user');
    const decodedUserCredential = userCredential? JSON.parse(window.atob(userCredential)) : '';
    if (
      decodedUserCredential?.username !== 'AksaMedia' || decodedUserCredential?.password !== 'admin1234'
    ) {
      return of(false);
    }

    // If token is available and not expired, then sign in
    this.signIn(decodedUserCredential);
    return of(true);
  }
}

interface SignInPayload {
  username: string | null;
  password: string  | null;
}
