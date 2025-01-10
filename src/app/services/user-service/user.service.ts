import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  addLocalStorageUser(userCredential: string) {
    localStorage?.setItem('user', userCredential);
  }

  removeLocalStorageUser() {
    localStorage?.removeItem('user');
  }
}
