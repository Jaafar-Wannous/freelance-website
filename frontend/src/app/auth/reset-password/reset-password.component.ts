import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
      validators: mustMatch('password', 'password_confirmation')
    };

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    }, formOptions);
  }


  resetPassword() {
    this.http.post('http://127.0.0.1:8000/api/reset-password', this.resetPasswordForm.value)
      .subscribe({
        next: (res: any) => this.message = res.message,
        error: (err) => this.message = err.error.error
      });
  }
}

// Validator for matching password and confirm password
export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const mainControl = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // If the confirm password control already has errors, don't override them
      return null;
    }

    // Set the mustMatch error if the password and confirm password don't match
    if (mainControl.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null; // because it is a synchronous validator
  };
}
