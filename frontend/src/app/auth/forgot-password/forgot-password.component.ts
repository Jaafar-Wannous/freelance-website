import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetCode() {
    this.http.post('http://127.0.0.1:8000/api/forgot-password', this.forgotPasswordForm.value)
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.router.navigate(['/reset-password']); // Corrected path
        },
        error: (err) => this.message = err.error.error
      });
  }
}
