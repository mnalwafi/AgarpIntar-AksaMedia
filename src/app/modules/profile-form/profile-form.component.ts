import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './profile-form.component.html',
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup<ProfileForm>;
  currentUser!: {
    username: string;
    password: string;
    full_name?: string;
    photo?: string;
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    const encodedUserData: string = localStorage.getItem('user') ?? '';
    const decodedUserData: {
      username: string;
      password: string;
      full_name?: string;
      photo?: string;
    } = JSON.parse(window.atob(encodedUserData));

    this.currentUser = decodedUserData;


    this.profileForm = this._formBuilder.group({
      full_name: [
        decodedUserData?.full_name ?? decodedUserData?.username,
        Validators.required,
      ],
      photo: [''],
    });
  }

  changeProfile(event: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.profileForm?.getRawValue()?.full_name)
      this.currentUser.full_name = this.profileForm?.getRawValue()?.full_name;
    if (this.profileForm.getRawValue()?.photo)
      this.currentUser.photo = this.profileForm.getRawValue()?.photo;

    const encodedUserData = window.btoa(JSON.stringify(this.currentUser));


    if (this.profileForm?.valid) {
      this._userService?.addLocalStorageUser(encodedUserData);

      this._router?.navigate(['/home']);
    }
  }

  back(): void {
    this._router?.navigate(['/home']);
  }
}

interface ProfileForm {
  full_name: FormControl<any>;
  photo: FormControl<any>;
}
